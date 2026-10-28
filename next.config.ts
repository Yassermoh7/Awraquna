import type { NextConfig } from 'next';

// Product images come from Odoo when COMMERCE_SOURCE=odoo.
const odoo = process.env.ODOO_URL ? new URL(process.env.ODOO_URL) : null;
const portal = process.env.NEXT_PUBLIC_ODOO_PORTAL_URL ?? 'https://erp.awraquna.com/web/login';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: odoo
      ? [{ protocol: odoo.protocol.replace(':', '') as 'http' | 'https', hostname: odoo.hostname, pathname: '/web/image/**' }]
      : [],
  },

  /**
   * Old Odoo URLs that have no direct equivalent. Product, category, /shop,
   * /about-us, /contactus, /blog and /jobs keep their exact URLs, so they need
   * no redirect.
   */
  async redirects() {
    return [
      { source: '/web/login', destination: portal, permanent: false },
      // Industries are filters on the product list, not separate pages.
      ...['restaurants-26', 'retail-27', 'logistics-30', 'healthcare-31'].flatMap((slug) => [
        { source: `/shop/category/${slug}`, destination: `/shop?industry=${slug}`, permanent: true },
        { source: `/ar/shop/category/${slug}`, destination: `/ar/shop?industry=${slug}`, permanent: true },
      ]),
      // Old Odoo category pages → the product list with that category filter applied
      { source: '/shop/category/:slug', destination: '/shop?category=:slug', permanent: true },
      { source: '/ar/shop/category/:slug', destination: '/ar/shop?category=:slug', permanent: true },
      { source: '/my/:path*', destination: portal, permanent: false },
      { source: '/shop/page/:n', destination: '/shop', permanent: true },
      { source: '/ar/shop/page/:n', destination: '/ar/shop', permanent: true },
      { source: '/shop/change_pricelist/:id', destination: '/shop', permanent: true },
      { source: '/ar/shop/change_pricelist/:id', destination: '/ar/shop', permanent: true },
      { source: '/blog/:path+', destination: '/blog', permanent: true },
      { source: '/ar/blog/:path+', destination: '/ar/blog', permanent: true },
      { source: '/aboutus', destination: '/about-us', permanent: true },
      { source: '/ar/aboutus', destination: '/ar/about-us', permanent: true },
      { source: '/contact', destination: '/contactus', permanent: true },
      { source: '/ar/contact', destination: '/ar/contactus', permanent: true },
    ];
  },
};

export default nextConfig;
