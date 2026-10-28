'use server';

import { commerce, type Lead, type OrderLine } from '@/lib/commerce';

/**
 * Server actions shared by both sites. Each returns a FormState that the
 * client form renders (useActionState). Errors are keys, translated in the UI.
 */
export type FormState =
  | { status: 'idle' }
  | { status: 'success'; reference: string }
  | { status: 'error'; error: 'invalid' | 'empty_order' | 'failed'; fields?: string[] };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => v.replace(/[^\d+]/g, '').length >= 8;
const lang = (fd: FormData) => (str(fd, 'lang') === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

/** Honeypot: real users never fill the hidden "website" field. */
const isBot = (fd: FormData) => str(fd, 'website') !== '';

/** Plus: send the order list as a request; becomes a draft quotation in Odoo. */
export async function submitOrderRequest(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: 'success', reference: '—' };
  const missing = ['name', 'phone', 'city'].filter((k) => !str(fd, k));
  if (str(fd, 'phone') && !isPhone(str(fd, 'phone'))) missing.push('phone');
  if (str(fd, 'email') && !isEmail(str(fd, 'email'))) missing.push('email');
  if (missing.length) return { status: 'error', error: 'invalid', fields: missing };

  let lines: OrderLine[] = [];
  try {
    lines = (JSON.parse(str(fd, 'lines') || '[]') as OrderLine[]).filter((l) => l.quantity > 0).slice(0, 100);
  } catch {}
  if (!lines.length) return { status: 'error', error: 'empty_order' };

  // Trust ids and quantities from the client, but names/SKUs from the catalogue.
  const known = await commerce.getProductsByIds(lines.map((l) => l.productId));
  const safeLines = lines.flatMap((l) => {
    const p = known.find((k) => k.id === l.productId);
    return p ? [{ productId: p.id, sku: p.sku, name: p.name, quantity: Math.min(Math.round(l.quantity), 10000), unit: l.unit === 'carton' ? 'carton' as const : 'unit' as const }] : [];
  });
  if (!safeLines.length) return { status: 'error', error: 'empty_order' };

  const result = await commerce.createOrderRequest({
    lang: lang(fd), name: str(fd, 'name'), phone: str(fd, 'phone'), email: str(fd, 'email') || undefined,
    company: str(fd, 'company') || undefined, city: str(fd, 'city'), address: str(fd, 'address') || undefined,
    paymentPreference: str(fd, 'payment') || undefined, note: str(fd, 'note') || undefined, lines: safeLines,
  });
  return result.ok ? { status: 'success', reference: result.reference } : { status: 'error', error: 'failed' };
}

/**
 * Generic enquiry (contact, bulk quote, legal consultation, trademark check).
 * Required: source, name, and at least one of email/phone. Any extra fields
 * prefixed "detail_" are stored with the lead.
 */
export async function submitLead(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: 'success', reference: '—' };
  const source = str(fd, 'source') as Lead['source'];
  const allowed: Lead['source'][] = ['plus-contact', 'plus-bulk-quote', 'legal-consultation', 'legal-trademark-check', 'legal-contact'];
  const email = str(fd, 'email'), phone = str(fd, 'phone');
  const invalid: string[] = [];
  if (!allowed.includes(source)) invalid.push('source');
  if (!str(fd, 'name')) invalid.push('name');
  if (!email && !phone) invalid.push('email', 'phone');
  if (email && !isEmail(email)) invalid.push('email');
  if (phone && !isPhone(phone)) invalid.push('phone');
  for (const k of str(fd, 'required').split(',').filter(Boolean)) if (!str(fd, k)) invalid.push(k);
  if (invalid.length) return { status: 'error', error: 'invalid', fields: invalid };

  const details: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (k.startsWith('detail_') && String(v).trim()) details[k.slice(7)] = String(v).trim().slice(0, 2000);

  const result = await commerce.createLead({
    source, lang: lang(fd), name: str(fd, 'name'), email: email || undefined, phone: phone || undefined,
    company: str(fd, 'company') || undefined, subject: str(fd, 'subject') || source,
    message: str(fd, 'message').slice(0, 5000) || undefined, details,
  });
  return result.ok ? { status: 'success', reference: result.reference } : { status: 'error', error: 'failed' };
}
