export function localizeField(field: string, locale = "en"): string {
  return `${field}.${locale}`;
}

export function localizeFieldOptional(field: string, locale = "en"): string {
  return `"${field}": ${field}.${locale}`;
}

const SITE_SETTINGS_QUERY = (locale = "en") => `*[_type == "siteSettings"][0]{
  "siteName": siteName.${locale},
  logo,
  brandDisplayMode,
  "footerText": footerText.${locale},
  contactEmail,
  socialLinks,
  pageBannerStartColor,
  pageBannerMidColor,
  pageBannerEndColor
}`;

const NAVIGATION_QUERY = (locale = "en") => `*[_type == "navigation"][0]{
  "headerLinks": headerLinks[]{
    "label": coalesce(labelI18n.${locale}, labelI18n.en, label),
    href
  },
  "footerLinks": footerLinks[]{
    "label": coalesce(labelI18n.${locale}, labelI18n.en, label),
    href
  }
}`;

const HOME_PAGE_QUERY = (locale = "en") => `*[_type == "homePage"][0]{
  "heroTitle": coalesce(heroTitle.${locale}, heroTitle.en, heroTitle),
  "heroSubtitle": coalesce(heroSubtitle.${locale}, heroSubtitle.en, heroSubtitle),
  heroImage,
  heroImageMobile,
  howItWorksImages,
  impactSectionImage,
  ctaSectionImage,
  impactCounters[]{
    "label": coalesce(label.${locale}, label.en, label),
    value
  },
  "aboutTitle": coalesce(aboutTitle.${locale}, aboutTitle.en, aboutTitle),
  "aboutText": coalesce(aboutText.${locale}, aboutText.en, aboutText),
  "ctaTitle": coalesce(ctaTitle.${locale}, ctaTitle.en, ctaTitle),
  "ctaText": coalesce(ctaText.${locale}, ctaText.en, ctaText),
  testimonials[]{
    "quote": coalesce(quote.${locale}, quote.en, quote),
    "author": coalesce(author.${locale}, author.en, author)
  },
  showHeroSection,
  showImpactCounters,
  showAboutSection,
  showCTASection,
  showTestimonials,
  showFeaturedProducts,
  showHowItWorks,
  heroTitleColor,
  heroSubtitleColor,
  sectionHeadingColor,
  heroOverlayColor,
  heroOverlayOpacity,
  heroTextAlign,
  heroContentWidth,
  heroHeightMobile,
  heroHeightDesktop
}`;

const DONATION_SETTINGS_QUERY = `*[_type == "donationSettings"][0]`;

const SHOP_SETTINGS_QUERY = `*[_type == "shopSettings"][0]`;

const IMPACT_SETTINGS_QUERY = `*[_type == "impactSettings"][0]`;

const PRODUCTS_QUERY = (locale = "en") => `*[_type == "product" && inStock == true] | order(_createdAt desc){
  _id,
  "name": name.${locale},
  slug,
  price,
  "description": description.${locale},
  category,
  stripePriceId,
  inStock,
  images
}`;

const PRODUCT_BY_SLUG_QUERY = (locale = "en") =>
  `*[_type == "product" && slug.current == $slug][0]{
    _id,
    "name": name.${locale},
    "description": description.${locale},
    price,
    stripePriceId,
    body,
    images
  }`;

const PAGE_BY_SLUG_QUERY = (locale = "en") => `*[_type == "page" && slug.current == $slug][0]{
  "title": title.${locale},
  slug,
  body,
  heroImage,
  showHeroImage,
  showBody
}`;

export {
  SITE_SETTINGS_QUERY,
  NAVIGATION_QUERY,
  HOME_PAGE_QUERY,
  DONATION_SETTINGS_QUERY,
  SHOP_SETTINGS_QUERY,
  IMPACT_SETTINGS_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PAGE_BY_SLUG_QUERY,
};
