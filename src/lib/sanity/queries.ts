export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;

export const NAVIGATION_QUERY = `*[_type == "navigation"][0]`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]`;

export const DONATION_SETTINGS_QUERY = `*[_type == "donationSettings"][0]`;

export const SHOP_SETTINGS_QUERY = `*[_type == "shopSettings"][0]`;

export const PRODUCTS_QUERY = `*[_type == "product" && inStock == true] | order(_createdAt desc)`;

export const PRODUCT_BY_SLUG_QUERY =
  `*[_type == "product" && slug.current == $slug][0]`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]`;
