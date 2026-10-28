import 'server-only';
import { appendFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import catalog from '@/data/catalog.json';
import { filterProducts } from './filter';
import type { Category, CommerceProvider, Industry, Lead, OrderRequest, Product, SubmitResult } from './types';

/**
 * Local provider: the catalogue captured from awraquna.com, and submissions
 * written to ./data/*.jsonl. Used until Odoo credentials are configured.
 */
const products = catalog.products as Product[];
// Serverless hosts (Vercel) only allow writing to the temp folder, and it doesn't persist
// between requests: there, submissions are also logged so they show in the runtime logs.
// Connect Odoo (COMMERCE_SOURCE=odoo) before launch so requests land in the CRM.
const READ_ONLY_FS = !!process.env.VERCEL;
const DATA_DIR = READ_ONLY_FS ? path.join(tmpdir(), 'awraquna-data') : path.join(process.cwd(), 'data');

const reference = (prefix: string) =>
  `${prefix}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

async function record(file: string, payload: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(path.join(DATA_DIR, file), JSON.stringify(payload) + '\n', 'utf8');
  if (READ_ONLY_FS) console.log(`[submission] ${file}`, JSON.stringify(payload));
}

export const sampleProvider: CommerceProvider = {
  async listCategories() {
    return catalog.categories as Category[];
  },
  async listIndustries() {
    return catalog.industries as Industry[];
  },
  async listProducts(query) {
    return filterProducts(products, query);
  },
  async getProduct(slug) {
    return products.find((p) => p.slug === slug) ?? null;
  },
  async getProductsByIds(ids) {
    return products.filter((p) => ids.includes(p.id));
  },
  async createOrderRequest(order: OrderRequest): Promise<SubmitResult> {
    const ref = reference('SO');
    await record('order-requests.jsonl', { reference: ref, createdAt: new Date().toISOString(), ...order });
    return { ok: true, reference: ref };
  },
  async createLead(lead: Lead): Promise<SubmitResult> {
    const ref = reference(lead.source.startsWith('legal') ? 'LG' : 'LD');
    await record('leads.jsonl', { reference: ref, createdAt: new Date().toISOString(), ...lead });
    return { ok: true, reference: ref };
  },
};
