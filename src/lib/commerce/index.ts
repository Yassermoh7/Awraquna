import 'server-only';
import { odooProvider } from './odoo';
import { sampleProvider } from './sample';
import type { CommerceProvider } from './types';

/**
 * COMMERCE_SOURCE=odoo uses the live Odoo instance; anything else uses the
 * bundled sample catalogue. Pages only ever import `commerce`.
 */
export const commerce: CommerceProvider =
  process.env.COMMERCE_SOURCE === 'odoo' ? odooProvider : sampleProvider;

export * from './types';
export { specValue } from './filter';
