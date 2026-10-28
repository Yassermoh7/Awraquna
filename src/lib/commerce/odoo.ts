import 'server-only';
import { filterProducts } from './filter';
import type { Category, CommerceProvider, Industry, Lead, OrderRequest, Product, Spec, SubmitResult } from './types';

/**
 * Odoo 15 provider over the external JSON-RPC API (/jsonrpc).
 *
 * Reads: published product.template records, website (public) categories.
 * Writes: order requests become draft quotations (sale.order) so the sales
 * team confirms stock and payment exactly as today; contact/legal forms
 * become CRM leads.
 *
 * Env: ODOO_URL, ODOO_DB, ODOO_USER, ODOO_API_KEY (an API key from the
 * user's Preferences → Account Security), ODOO_INDUSTRY_CATEGORY_IDS,
 * optional ODOO_SALES_TEAM_ID / ODOO_LEGAL_TEAM_ID.
 */
const env = {
  url: process.env.ODOO_URL?.replace(/\/$/, '') ?? '',
  db: process.env.ODOO_DB ?? '',
  user: process.env.ODOO_USER ?? '',
  key: process.env.ODOO_API_KEY ?? '',
  industryIds: (process.env.ODOO_INDUSTRY_CATEGORY_IDS ?? '26,27,30,31').split(',').map(Number),
  salesTeam: process.env.ODOO_SALES_TEAM_ID ? Number(process.env.ODOO_SALES_TEAM_ID) : undefined,
  legalTeam: process.env.ODOO_LEGAL_TEAM_ID ? Number(process.env.ODOO_LEGAL_TEAM_ID) : undefined,
  arLang: process.env.ODOO_ARABIC_LANG ?? 'ar_001',
};

let uid: number | null = null;

async function rpc<T>(service: string, method: string, args: unknown[]): Promise<T> {
  const res = await fetch(`${env.url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { service, method, args }, id: Date.now() }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.data?.message ?? json.error.message ?? 'Odoo error');
  return json.result as T;
}

async function call<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
  if (uid === null) {
    uid = await rpc<number>('common', 'login', [env.db, env.user, env.key]);
    if (!uid) throw new Error('Odoo login failed: check ODOO_DB, ODOO_USER and ODOO_API_KEY');
  }
  return rpc<T>('object', 'execute_kw', [env.db, uid, env.key, model, method, args, kwargs]);
}

// ---------- small in-memory cache so pages don't hit Odoo on every request ----------
const TTL = 5 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}

// Odoo's slug(): lowercase, non-alphanumerics to "-", then "-<id>"
const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-');

type OdooCategory = { id: number; name: string; display_name: string; parent_id: [number, string] | false };

async function loadCategories() {
  return cached('categories', async () => {
    const fields = ['id', 'name', 'display_name', 'parent_id'];
    const [en, ar] = await Promise.all([
      call<OdooCategory[]>('product.public.category', 'search_read', [[]], { fields }),
      call<OdooCategory[]>('product.public.category', 'search_read', [[]], { fields, context: { lang: env.arLang } }),
    ]);
    const arName = new Map(ar.map((c) => [c.id, c.name]));
    const slugById = new Map(en.map((c) => [c.id, `${slugify(c.display_name.replace(/\//g, ' '))}-${c.id}`]));
    const categories: Category[] = [];
    const industries: Industry[] = [];
    for (const c of en) {
      const slug = slugById.get(c.id)!;
      if (env.industryIds.includes(c.id)) industries.push({ slug, name: c.name, nameAr: arName.get(c.id) ?? c.name });
      else categories.push({ slug, name: c.name, nameAr: arName.get(c.id) ?? c.name, parent: c.parent_id ? slugById.get(c.parent_id[0]) ?? null : null });
    }
    return { categories, industries, slugById, raw: en };
  });
}

type OdooProduct = {
  id: number; name: string; default_code: string | false; website_url: string;
  public_categ_ids: number[]; description_sale: string | false;
  product_variant_id: [number, string] | false; product_template_image_ids: number[];
};

const SPEC_KEYS: Record<string, [string, string]> = {
  'size': ['size', 'المقاس'], 'core': ['core', 'قطر اللب'], 'quantity per carton': ['perCarton', 'الكمية في الكرتون'],
  'labels per roll': ['perRoll', 'عدد الملصقات في الرول'], 'weight': ['weight', 'الوزن'], 'ink face': ['inkFace', 'وجه الحبر'],
  'type': ['type', 'النوع'], 'color': ['color', 'اللون'], 'material': ['material', 'الخامة'],
};

/** The shop shows specs as "Key: Value" lines in the sales description. */
function parseSpecs(text: string | false): Spec[] {
  if (!text) return [];
  return text.split(/\n|<br\s*\/?>/).flatMap((line) => {
    const m = line.replace(/<[^>]+>/g, '').match(/^\s*([A-Za-z][A-Za-z /]{1,28}?)\s*:\s*(.+)$/);
    if (!m) return [];
    const known = SPEC_KEYS[m[1].trim().toLowerCase()];
    return [{ key: known?.[0] ?? slugify(m[1]), label: m[1].trim(), labelAr: known?.[1] ?? m[1].trim(), value: m[2].trim() }];
  });
}

async function loadProducts(): Promise<{ products: Product[]; variantByTemplate: Map<number, number> }> {
  return cached('products', async () => {
    const { slugById, raw } = await loadCategories();
    const parentOf = new Map(raw.map((c) => [c.id, c.parent_id ? c.parent_id[0] : null]));
    const domain = [['is_published', '=', true], ['sale_ok', '=', true]];
    const fields = ['id', 'name', 'default_code', 'website_url', 'public_categ_ids', 'description_sale', 'product_variant_id', 'product_template_image_ids'];
    const [en, ar] = await Promise.all([
      call<OdooProduct[]>('product.template', 'search_read', [domain], { fields }),
      call<{ id: number; name: string }[]>('product.template', 'search_read', [domain], { fields: ['id', 'name'], context: { lang: env.arLang } }),
    ]);
    const arName = new Map(ar.map((p) => [p.id, p.name]));
    const variantByTemplate = new Map<number, number>();
    const products = en.map((p): Product => {
      if (p.product_variant_id) variantByTemplate.set(p.id, p.product_variant_id[0]);
      const cats = p.public_categ_ids.filter((id) => !env.industryIds.includes(id));
      const top = cats.find((id) => parentOf.get(id) === null) ?? cats.map((id) => parentOf.get(id)).find(Boolean) ?? null;
      const child = cats.find((id) => parentOf.get(id) !== null) ?? null;
      return {
        id: p.id,
        slug: p.website_url.replace(/^\/shop\//, ''),
        sku: p.default_code || String(p.id),
        name: p.name.replace(/^\[[^\]]+\]\s*/, ''),
        nameAr: (arName.get(p.id) ?? p.name).replace(/^\[[^\]]+\]\s*/, ''),
        category: top ? slugById.get(top) ?? null : null,
        subcategory: child ? slugById.get(child) ?? null : null,
        industries: p.public_categ_ids.filter((id) => env.industryIds.includes(id)).map((id) => slugById.get(id)!),
        specs: parseSpecs(p.description_sale),
        images: [
          `${env.url}/web/image/product.template/${p.id}/image_1024`,
          ...p.product_template_image_ids.slice(0, 3).map((id) => `${env.url}/web/image/product.image/${id}/image_1024`),
        ],
      };
    });
    return { products, variantByTemplate };
  });
}

async function findOrCreatePartner(o: { name: string; phone?: string; email?: string; company?: string; city?: string; address?: string; lang: string }) {
  const domain = o.email ? ['|', ['email', '=ilike', o.email], ['phone', '=', o.phone ?? '']] : [['phone', '=', o.phone ?? '']];
  const found = await call<number[]>('res.partner', 'search', [domain], { limit: 1 });
  if (found.length) return found[0];
  return call<number>('res.partner', 'create', [{
    name: o.company ? `${o.company}, ${o.name}` : o.name,
    phone: o.phone, email: o.email, city: o.city, street: o.address,
    lang: o.lang === 'ar' ? env.arLang : 'en_US',
  }]);
}

export const odooProvider: CommerceProvider = {
  async listCategories() {
    return (await loadCategories()).categories;
  },
  async listIndustries() {
    return (await loadCategories()).industries;
  },
  async listProducts(query) {
    return filterProducts((await loadProducts()).products, query);
  },
  async getProduct(slug) {
    return (await loadProducts()).products.find((p) => p.slug === slug) ?? null;
  },
  async getProductsByIds(ids) {
    return (await loadProducts()).products.filter((p) => ids.includes(p.id));
  },

  async createOrderRequest(order: OrderRequest): Promise<SubmitResult> {
    try {
      const { products, variantByTemplate } = await loadProducts();
      const partnerId = await findOrCreatePartner(order);
      const lines = order.lines.flatMap((l) => {
        const variant = variantByTemplate.get(l.productId);
        if (!variant) return [];
        const product = products.find((p) => p.id === l.productId);
        const perCarton = parseInt(product?.specs.find((s) => s.key === 'perCarton')?.value ?? '', 10);
        const qty = l.unit === 'carton' && perCarton ? l.quantity * perCarton : l.quantity;
        const label = l.unit === 'carton' ? ` (${l.quantity} carton${l.quantity > 1 ? 's' : ''})` : '';
        return [[0, 0, { product_id: variant, product_uom_qty: qty, name: `[${l.sku}] ${l.name}${label}` }]];
      });
      const note = [
        'Order request from the website.',
        `Contact: ${order.name} · ${order.phone}${order.email ? ` · ${order.email}` : ''}`,
        `Delivery: ${order.city}${order.address ? `, ${order.address}` : ''}`,
        order.paymentPreference ? `Payment preference: ${order.paymentPreference}` : '',
        order.note ? `Customer note: ${order.note}` : '',
      ].filter(Boolean).join('\n');
      const id = await call<number>('sale.order', 'create', [{
        partner_id: partnerId, order_line: lines, note, origin: 'Website order request',
        ...(env.salesTeam ? { team_id: env.salesTeam } : {}),
      }]);
      const [so] = await call<{ name: string }[]>('sale.order', 'read', [[id]], { fields: ['name'] });
      return { ok: true, reference: so.name };
    } catch (e) {
      console.error('[odoo] order request failed', e);
      return { ok: false, error: 'order_failed' };
    }
  },

  async createLead(lead: Lead): Promise<SubmitResult> {
    try {
      const details = Object.entries(lead.details ?? {}).map(([k, v]) => `${k}: ${v}`).join('\n');
      const team = lead.source.startsWith('legal') ? env.legalTeam : env.salesTeam;
      const id = await call<number>('crm.lead', 'create', [{
        name: lead.subject, contact_name: lead.name, partner_name: lead.company, email_from: lead.email, phone: lead.phone,
        description: [lead.message, details, `Source: ${lead.source} (${lead.lang})`].filter(Boolean).join('\n\n'),
        ...(team ? { team_id: team } : {}),
      }]);
      return { ok: true, reference: `LD-${id}` };
    } catch (e) {
      console.error('[odoo] lead failed', e);
      return { ok: false, error: 'lead_failed' };
    }
  },
};
