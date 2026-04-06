#!/usr/bin/env node
/**
 * Sanity Content Seeder - Creates all content with English + Czech translations
 * 
 * Run: node src/sanity/seed.js
 */

const { readFileSync } = require("fs");
const { resolve } = require("path");
const { createClient } = require("@sanity/client");

// Parse .env.local
const envContent = readFileSync(resolve(".env.local"), "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  line = line.trim();
  if (!line || line.startsWith("#")) return;
  const eqIdx = line.indexOf("=");
  if (eqIdx === -1) return;
  const key = line.substring(0, eqIdx).trim();
  let value = line.substring(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  token: env.SANITY_API_TOKEN,
  apiVersion: "2026-03-29",
  useCdn: false,
});

console.log("🚀 Seeding Sanity with bilingual content...\n");

async function seed() {
  let created = 0;

  // ─── 1. Site Settings ───
  console.log("📝 Creating Site Settings...");
  await client.createOrReplace({
    _type: "siteSettings",
    _id: "siteSettings",
    siteName: {
      _type: "localizedString",
      en: "Pet Charity",
      cs: "Zvířecí charita",
    },
    footerText: {
      _type: "localizedText",
      en: "© 2024 Pet Charity. All rights reserved. Helping stray animals find loving homes.",
      cs: "© 2024 Zvířecí charita. Všechna práva vyhrazena. Pomáháme toulavým zvířatům najít milující domovy.",
    },
    contactEmail: "hello@petcharity.com",
    socialLinks: [],
  });
  created++;
  console.log("   ✅ Site Settings created\n");

  // ─── 2. Navigation ───
  console.log("📝 Creating Navigation...");
  await client.createOrReplace({
    _type: "navigation",
    _id: "navigation",
    headerLinks: [
      { _type: "link", _key: "donate", label: "Donate", href: "/donate" },
      { _type: "link", _key: "shop", label: "Shop", href: "/shop" },
      { _type: "link", _key: "about", label: "About", href: "/about" },
      { _type: "link", _key: "contact", label: "Contact", href: "/contact" },
    ],
    footerLinks: [
      { _type: "link", _key: "privacy", label: "Privacy Policy", href: "/privacy" },
      { _type: "link", _key: "terms", label: "Terms of Service", href: "/terms" },
      { _type: "link", _key: "faq", label: "FAQ", href: "/faq" },
    ],
  });
  created++;
  console.log("   ✅ Navigation created\n");

  // ─── 3. Home Page ───
  console.log("📝 Creating Home Page...");
  await client.createOrReplace({
    _type: "homePage",
    _id: "homePage",
    heroTitle: {
      _type: "localizedString",
      en: "Help Stray Animals Today",
      cs: "Pomozte dnes toulavým zvířatům",
    },
    heroSubtitle: {
      _type: "localizedString",
      en: "Every donation and purchase makes a difference in the lives of animals in need.",
      cs: "Každý dar a nákup mění život zvířat v nouzi.",
    },
    impactCounters: [
      {
        _key: "counter1",
        label: { _type: "localizedString", en: "Pets Helped", cs: "Pomoc zvířatům" },
        value: 1250,
      },
      {
        _key: "counter2",
        label: { _type: "localizedString", en: "Animals Rescued", cs: "Zachráněná zvířata" },
        value: 890,
      },
      {
        _key: "counter3",
        label: { _type: "localizedString", en: "Families Adopted", cs: "Adoptované rodiny" },
        value: 520,
      },
    ],
    aboutTitle: {
      _type: "localizedString",
      en: "About Our Mission",
      cs: "O naší misi",
    },
    aboutText: {
      _type: "localizedText",
      en: "We are dedicated to helping stray animals find safe homes and providing care for those in need. Our team of volunteers works tirelessly to rescue, rehabilitate, and rehome abandoned pets across the city.",
      cs: "Jsme odděni pomoci toulavým zvířatům najít bezpečné domovy a poskytování péče těm, kteří to potřebují. Náš tým dobrovolníků pracuje neúnavně na záchraně, rehabilitaci a umísťování opuštěných mazlíčků po celém městě.",
    },
    ctaTitle: {
      _type: "localizedString",
      en: "Ready to Make a Difference?",
      cs: "Připraveni udělat rozdíl?",
    },
    ctaText: {
      _type: "localizedText",
      en: "Your support helps us care for stray animals and find them loving homes. Whether through a donation or a purchase, every bit counts.",
      cs: "Vaše podpora nám pomáhá pečovat o toulavá zvířata a najít jim milující domovy. Ať už prostřednictvím daru nebo nákupu, každý příspěvek se počítá.",
    },
    testimonials: [
      {
        _key: "test1",
        quote: {
          _type: "localizedText",
          en: "This charity changed my life and my pet's life. I adopted my best friend through them and couldn't be happier.",
          cs: "Tato charita změnila můj život a život mého mazlíčka. Adoptovala jsem svého nejlepšího přítele přes ně a nemohla bych být šťastnější.",
        },
        author: { _type: "localizedString", en: "Sarah M.", cs: "Sarah M." },
      },
      {
        _key: "test2",
        quote: {
          _type: "localizedText",
          en: "I'm so grateful for the work they do. The transparency about where donations go is incredible.",
          cs: "Jsem velmi vděčný za práci, kterou dělají. Transparentnost ohledně toho, kam jdou dary, je neuvěřitelná.",
        },
        author: { _type: "localizedString", en: "James K.", cs: "James K." },
      },
      {
        _key: "test3",
        quote: {
          _type: "localizedText",
          en: "Amazing organization! I've been a monthly donor for a year and love seeing the impact reports.",
          cs: "Úžasná organizace! Jsem měsíčním dárcem už rok a rád vidím zprávy o dopadu.",
        },
        author: { _type: "localizedString", en: "Elena R.", cs: "Elena R." },
      },
      {
        _key: "test4",
        quote: {
          _type: "localizedText",
          en: "The shop has such unique items. I bought a collar for my dog and it lasted for years!",
          cs: "Obchod má tak jedinečné produkty. Koupila jsem obojek pro svého psa a vydržel roky!",
        },
        author: { _type: "localizedString", en: "David L.", cs: "David L." },
      },
    ],
    showHeroSection: true,
    showImpactCounters: true,
    showAboutSection: true,
    showCTASection: true,
    showTestimonials: true,
    showFeaturedProducts: true,
  });
  created++;
  console.log("   ✅ Home Page created\n");

  // ─── 4. Donation Settings ───
  console.log("📝 Creating Donation Settings...");
  await client.createOrReplace({
    _type: "donationSettings",
    _id: "donationSettings",
    presetAmounts: [
      {
        _key: "tier1",
        amount: 10,
        achievement: {
          _type: "localizedText",
          en: "Feeds a rescue for a week",
          cs: "Nakrmí záchranu na týden",
        },
        oneTimePriceId: "",
        monthlyPriceId: "",
      },
      {
        _key: "tier2",
        amount: 25,
        achievement: {
          _type: "localizedText",
          en: "Provides medical care for a rescue",
          cs: "Poskytuje lékařskou péči pro záchranu",
        },
        oneTimePriceId: "",
        monthlyPriceId: "",
      },
      {
        _key: "tier3",
        amount: 50,
        achievement: {
          _type: "localizedText",
          en: "Sponsors a rescue mission",
          cs: "Sponzoruje záchrannou misi",
        },
        oneTimePriceId: "",
        monthlyPriceId: "",
      },
      {
        _key: "tier4",
        amount: 100,
        achievement: {
          _type: "localizedText",
          en: "Supports shelter operations for a month",
          cs: "Podporuje provoz útulku na měsíc",
        },
        oneTimePriceId: "",
        monthlyPriceId: "",
      },
    ],
    isDonationSectionVisible: true,
  });
  created++;
  console.log("   ✅ Donation Settings created\n");

  // ─── 5. Shop Settings ───
  console.log("📝 Creating Shop Settings...");
  await client.createOrReplace({
    _type: "shopSettings",
    _id: "shopSettings",
    isShopSectionVisible: true,
  });
  created++;
  console.log("   ✅ Shop Settings created\n");

  // ─── 6. Products ───
  console.log("📝 Creating Products...");
  const products = [
    {
      _id: "product-handcrafted-dog-collar",
      _type: "product",
      name: { _type: "localizedString", en: "Handcrafted Dog Collar", cs: "Ručně vyráběný obojek pro psy" },
      slug: { _type: "slug", current: "handcrafted-dog-collar" },
      price: 24.99,
      description: {
        _type: "localizedText",
        en: "Beautiful handcrafted collar made from premium leather. Adjustable sizing fits dogs of all breeds. Every purchase supports animal rescue operations.",
        cs: "Krásný ručně vyráběný obojek z prémiové kůže. Nastavitelná velikost padne psům všech plemen. Každý nákup podporuje záchranné operace zvířat.",
      },
      category: "Accessories",
      stripePriceId: "",
      inStock: true,
    },
    {
      _id: "product-organic-pet-treats",
      _type: "product",
      name: { _type: "localizedString", en: "Organic Pet Treats", cs: "Bio pamlsky pro mazlíčky" },
      slug: { _type: "slug", current: "organic-pet-treats" },
      price: 12.99,
      description: {
        _type: "localizedText",
        en: "All-natural, organic treats made with love. No artificial flavors or preservatives. Perfect for training or rewarding your furry friend.",
        cs: "Přírodní bio pamlsky vyrobené s láskou. Žádné umělé příchutě ani konzervanty. Ideální pro trénování nebo odměňování vašeho chlupatého přítele.",
      },
      category: "Food",
      stripePriceId: "",
      inStock: true,
    },
    {
      _id: "product-cozy-cat-bed",
      _type: "product",
      name: { _type: "localizedString", en: "Cozy Cat Bed", cs: "Pohodlný pelíšek pro kočky" },
      slug: { _type: "slug", current: "cozy-cat-bed" },
      price: 39.99,
      description: {
        _type: "localizedText",
        en: "Ultra-soft, washable bed designed for cats who love comfort. Machine washable cover with non-slip bottom. Available in multiple colors.",
        cs: "Ultra-měkký, pratelný pelíšek navržený pro kočky, které milují pohodlí. Pratelný potah s protiskluzovým dnem. K dispozici v různých barvách.",
      },
      category: "Beds",
      stripePriceId: "",
      inStock: true,
    },
    {
      _id: "product-interactive-toy-set",
      _type: "product",
      name: { _type: "localizedString", en: "Interactive Toy Set", cs: "Interaktivní sada hraček" },
      slug: { _type: "slug", current: "interactive-toy-set" },
      price: 18.99,
      description: {
        _type: "localizedText",
        en: "Set of 5 interactive toys to keep your pet entertained for hours. Includes balls, ropes, and puzzle toys. Made from durable, pet-safe materials.",
        cs: "Sada 5 interaktivních hraček, které zaměstnají vašeho mazlíčka na hodiny. Zahrnuje míčky, lana a hlavolamy. Vyrobeno z odolných materiálů bezpečných pro zvířata.",
      },
      category: "Toys",
      stripePriceId: "",
      inStock: true,
    },
    {
      _id: "product-natural-pet-shampoo",
      _type: "product",
      name: { _type: "localizedString", en: "Natural Pet Shampoo", cs: "Přírodní šampon pro mazlíčky" },
      slug: { _type: "slug", current: "natural-pet-shampoo" },
      price: 14.99,
      description: {
        _type: "localizedText",
        en: "Gentle, plant-based shampoo for sensitive skin. pH balanced for pets. Leaves coat soft, shiny, and smelling great. Free from harsh chemicals.",
        cs: "Jemný šampon na rostlinné bázi pro citlivou pokožku. pH vyvážené pro domácí mazlíčky. Zanechává srst měkkou, lesklou a voňavou. Bez drsných chemikálií.",
      },
      category: "Care",
      stripePriceId: "",
      inStock: true,
    },
  ];

  for (const product of products) {
    await client.createOrReplace(product);
    created++;
    console.log(`   ✅ Product: ${product.name.en}`);
  }
  console.log("");

  // ─── 7. Pages (About + Contact) ───
  console.log("📝 Creating Pages...");

  // About page
  await client.createOrReplace({
    _type: "page",
    _id: "page-about",
    title: { _type: "localizedString", en: "About Us", cs: "O nás" },
    slug: { _type: "slug", current: "about" },
    showHeroImage: true,
    showBody: true,
  });
  created++;
  console.log("   ✅ About Page created\n");

  // Contact page
  await client.createOrReplace({
    _type: "page",
    _id: "page-contact",
    title: { _type: "localizedString", en: "Contact Us", cs: "Kontaktujte nás" },
    slug: { _type: "slug", current: "contact" },
    showHeroImage: false,
    showBody: true,
  });
  created++;
  console.log("   ✅ Contact Page created\n");

  // ─── Summary ───
  console.log("━".repeat(50));
  console.log(`\n🎉 Seeding complete! Created ${created} documents.\n`);
  console.log("📋 Documents created:");
  console.log("   ✅ Site Settings");
  console.log("   ✅ Navigation");
  console.log("   ✅ Home Page (with counters, testimonials, CTA)");
  console.log("   ✅ Donation Settings (4 tiers)");
  console.log("   ✅ Shop Settings");
  console.log("   ✅ 5 Products (Collar, Treats, Bed, Toys, Shampoo)");
  console.log("   ✅ About Page");
  console.log("   ✅ Contact Page");
  console.log("\n🌐 All content has English + Czech translations!\n");
  console.log("💡 Next steps:");
  console.log("   1. Open Sanity Studio: http://localhost:3000/en/studio");
  console.log("   2. Add Stripe price IDs to donation tiers and products");
  console.log("   3. Upload hero image and product images");
  console.log("   4. Review and adjust Czech translations as needed");
  console.log("   5. Visit http://localhost:3000/en and /cs to see the site!\n");
}

seed().catch((err) => {
  console.error("\n❌ Seeding failed:", err.message);
  process.exit(1);
});
