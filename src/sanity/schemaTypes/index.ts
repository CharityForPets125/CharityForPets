import { donationSettingsType } from "@/sanity/schemaTypes/donationSettings";
import { homePageType } from "@/sanity/schemaTypes/homePage";
import { impactSettingsType } from "@/sanity/schemaTypes/impactSettings";
import { navigationType } from "@/sanity/schemaTypes/navigation";
import { linkType } from "@/sanity/schemaTypes/objects/link";
import { localizedStringType } from "@/sanity/schemaTypes/objects/localizedString";
import { localizedTextType } from "@/sanity/schemaTypes/objects/localizedText";
import { pageType } from "@/sanity/schemaTypes/page";
import { productType } from "@/sanity/schemaTypes/product";
import { shopSettingsType } from "@/sanity/schemaTypes/shopSettings";
import { siteSettingsType } from "@/sanity/schemaTypes/siteSettings";

export const schemaTypes = [
  linkType,
  localizedStringType,
  localizedTextType,
  siteSettingsType,
  navigationType,
  homePageType,
  donationSettingsType,
  shopSettingsType,
  impactSettingsType,
  productType,
  pageType,
];
