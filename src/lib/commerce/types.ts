export type Spec = { key: string; label: string; labelAr: string; value: string };

export type Product = {
  id: number;            // Odoo product.template id
  slug: string;          // Odoo website slug, e.g. "tr8060-thermal-cashier-roll-80x60mm-47"
  sku: string;           // Odoo default_code
  name: string;
  nameAr: string;
  category: string | null;      // top-level category slug
  subcategory: string | null;   // child category slug
  industries: string[];         // industry category slugs
  specs: Spec[];
  images: string[];
};

export type Category = { slug: string; name: string; nameAr: string; parent: string | null };
export type Industry = { slug: string; name: string; nameAr: string };

export type ProductQuery = {
  q?: string;
  category?: string;   // matches category or subcategory
  industry?: string;
  width?: string;      // e.g. "80" — first dimension of the size
};

export type OrderLine = { productId: number; sku: string; name: string; quantity: number; unit: 'carton' | 'unit' };

export type OrderRequest = {
  lang: 'en' | 'ar';
  company?: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  paymentPreference?: string;
  note?: string;
  lines: OrderLine[];
};

export type Lead = {
  source: 'plus-contact' | 'plus-bulk-quote' | 'legal-consultation' | 'legal-trademark-check' | 'legal-contact';
  lang: 'en' | 'ar';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  subject: string;
  message?: string;
  details?: Record<string, string>;
};

export type SubmitResult = { ok: true; reference: string } | { ok: false; error: string };

export interface CommerceProvider {
  listCategories(): Promise<Category[]>;
  listIndustries(): Promise<Industry[]>;
  listProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getProductsByIds(ids: number[]): Promise<Product[]>;
  createOrderRequest(order: OrderRequest): Promise<SubmitResult>;
  createLead(lead: Lead): Promise<SubmitResult>;
}
