import { donationSettingsType } from "@/sanity/schemaTypes/donationSettings";
import { homePageType } from "@/sanity/schemaTypes/homePage";
import { navigationType } from "@/sanity/schemaTypes/navigation";
import { linkType } from "@/sanity/schemaTypes/objects/link";
import { pageType } from "@/sanity/schemaTypes/page";
import { productType } from "@/sanity/schemaTypes/product";
import { shopSettingsType } from "@/sanity/schemaTypes/shopSettings";
import { siteSettingsType } from "@/sanity/schemaTypes/siteSettings";

export const schemaTypes = [
  linkType,
  siteSettingsType,
  navigationType,
  homePageType,
  donationSettingsType,
  shopSettingsType,
  productType,
  pageType,
];
