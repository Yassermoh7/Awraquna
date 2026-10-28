import 'server-only';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import catalog from '@/data/catalog.json';
import { filterProducts } from './filter';
import type { Category, CommerceProvider, Industry, Lead, OrderRequest, Product, SubmitResult } from './types';

/**
 * Local provider: the catalogue captured from awraquna.com, and submissions
 * written to ./data/*.jsonl. Used until Odoo credentials are configured.
 */
const products = catalog.products as Product[];
const DATA_DIR = path.join(process.cwd(), 'data');

const reference = (prefix: string) =>
  `${prefix}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

async function record(file: string, payload: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(path.join(DATA_DIR, file), JSON.stringify(payload) + '\n', 'utf8');
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
