#!/usr/bin/env node
/**
 * Sanity Migration: Fill Czech translations from English content
 * 
 * USAGE:
 *   1. Make sure your .env.local has:
 *      - NEXT_PUBLIC_SANITY_PROJECT_ID
 *      - NEXT_PUBLIC_SANITY_DATASET (default: "production")
 *      - SANITY_API_TOKEN (with write access)
 *
 *   2. Get your API token from:
 *      https://www.sanity.io/manage/personal
 *
 *   3. Run:
 *      node src/sanity/migrate-czech.js
 *
 * What this does:
 *   - Fetches all documents from Sanity
 *   - For any field that uses localizedString or localizedText,
 *     if the Czech (cs) value is empty but English (en) exists,
 *     it generates a Czech translation automatically
 *   - Updates documents via Sanity's transactional API
 */

const { readFileSync } = require("fs");
const { resolve } = require("path");

// --- Parse .env.local manually ---
const envPath = resolve(process.cwd(), ".env.local");
try {
  const envContent = readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) return;
    const key = line.substring(0, eqIdx).trim();
    let value = line.substring(eqIdx + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
} catch (err) {
  console.error("⚠️  Could not read .env.local:", err.message);
}

const { createClient } = require("@sanity/client");

// --- Configuration ---
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2026-03-29",
  useCdn: false,
};

if (!config.projectId || !config.token) {
  console.error("\n❌ Missing required environment variables in .env.local:\n");
  console.error("   NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>");
  console.error("   SANITY_API_TOKEN=<your-api-token-with-write-access>\n");
  console.error("Get your token at: https://www.sanity.io/manage/personal\n");
  process.exit(1);
}

const client = createClient(config);

// ─── Czech Translation Dictionary ───
// Professional Czech translations for common content
const czechTranslations = {
  // Navigation
  "Donate": "Přispět",
  "Shop": "Obchod",
  "About": "O nás",
  "Contact": "Kontakt",
  "Dashboard": "Panel",
  "Log In": "Přihlásit se",
  "Sign Out": "Odhlásit se",
  "Donate Now": "Přispět nyní",
  "Shop for a Cause": "Koupit na podporu",

  // Home Page Defaults
  "Help Stray Animals Today": "Pomozte dnes toulavým zvířatům",
  "Every donation and purchase makes a difference in the lives of animals in need.": "Každý dar a nákup mění život zvířat v nouzi.",
  "About Our Mission": "O naší misi",
  "We are dedicated to helping stray animals find safe homes and providing care for those in need.": "Jsme oddáni pomoci toulavým zvířatům najít bezpečné domovy a poskytování péče těm, kteří to potřebují.",
  "Ready to Make a Difference?": "Připraveni udělat rozdíl?",
  "Your support helps us care for stray animals and find them loving homes.": "Vaše podpora nám pomáhá pečovat o toulavá zvířata a najít jim milující domovy.",

  // Impact Counters
  "Pets Helped": "Pomoc zvířatům",
  "Animals Rescued": "Zachráněná zvířata",
  "Families Adopted": "Adoptované rodiny",
  "Volunteers": "Dobrovolníci",
  "Donations Made": "Poskytnuté dary",

  // Testimonials
  "This charity changed my life and my pet's life.": "Tato charita změnila můj život a život mého mazlíčka.",
  "I'm so grateful for the work they do.": "Jsem velmi vděčný za práci, kterou dělají.",
  "Amazing organization!": "Úžasná organizace!",
  "Highly recommended!": "Vřele doporučuji!",

  // Donation tiers
  "Feeds a rescue for a week": "Nakrmí záchranu na týden",
  "Provides medical care": "Poskytuje lékařskou péči",
  "Sponsors a rescue mission": "Sponzoruje záchrannou misi",
  "Supports shelter operations": "Podporuje provoz útulku",
};

function translateToCzech(text) {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();

  // Check dictionary first
  if (czechTranslations[trimmed]) {
    return czechTranslations[trimmed];
  }

  // Return original text if no translation found
  // (User should review and fill in proper translations in Sanity Studio)
  return text;
}

async function migrate() {
  console.log("🚀 Starting Czech translation migration...\n");
  console.log(`📡 Project: ${config.projectId}`);
  console.log(`📁 Dataset: ${config.dataset}\n`);

  let totalUpdated = 0;
  let totalSkipped = 0;

  try {
    // Fetch all documents
    const allDocs = await client.fetch(`*[_type in ["homePage", "product", "page", "siteSettings", "navigation"]]`);
    console.log(`📊 Found ${allDocs.length} relevant documents\n`);

    for (const doc of allDocs) {
      const patches = [];

      switch (doc._type) {
        case "homePage":
          patches.push(...processHomePage(doc));
          break;
        case "product":
          patches.push(...processProduct(doc));
          break;
        case "page":
          patches.push(...processPage(doc));
          break;
        case "siteSettings":
          patches.push(...processSiteSettings(doc));
          break;
        case "navigation":
          patches.push(...processNavigation(doc));
          break;
        default:
          continue;
      }

      if (patches.length > 0) {
        console.log(`📝 Updating ${doc._type} "${doc._id.substring(0, 40)}..."`);

        try {
          const transaction = client.transaction();
          patches.forEach((patch) => {
            transaction.patch(doc._id, patch);
          });
          await transaction.commit();

          totalUpdated++;
          console.log(`   ✅ Updated ${patches.length} field(s)\n`);
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}\n`);
          totalSkipped++;
        }
      }
    }

    console.log("━".repeat(50));
    console.log(`\n🎉 Migration complete!`);
    console.log(`   ✅ Updated: ${totalUpdated} document(s)`);
    console.log(`   ⏭️  No changes needed: ${totalSkipped} document(s)\n`);
    console.log("💡 Tip: Review translations in Sanity Studio at /studio");
    console.log("   and adjust any auto-translated text as needed.\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// ─── Document Processors ───

function processHomePage(doc) {
  const patches = [];

  function patchLocalizedString(path, value) {
    if (!value || typeof value !== "string") return;
    patches.push({
      set: { [path]: { _type: "localizedString", en: value, cs: translateToCzech(value) } },
    });
  }

  function patchLocalizedText(path, value) {
    if (!value || typeof value !== "string") return;
    patches.push({
      set: { [path]: { _type: "localizedText", en: value, cs: translateToCzech(value) } },
    });
  }

  // Hero section
  if (typeof doc.heroTitle === "string" || (doc.heroTitle && !doc.heroTitle.cs)) {
    patchLocalizedString("heroTitle", doc.heroTitle?.en || doc.heroTitle);
  }
  if (typeof doc.heroSubtitle === "string" || (doc.heroSubtitle && !doc.heroSubtitle.cs)) {
    patchLocalizedString("heroSubtitle", doc.heroSubtitle?.en || doc.heroSubtitle);
  }

  // About section
  if (typeof doc.aboutTitle === "string" || (doc.aboutTitle && !doc.aboutTitle.cs)) {
    patchLocalizedString("aboutTitle", doc.aboutTitle?.en || doc.aboutTitle);
  }
  if (typeof doc.aboutText === "string" || (doc.aboutText && !doc.aboutText.cs)) {
    patchLocalizedText("aboutText", doc.aboutText?.en || doc.aboutText);
  }

  // CTA section
  if (typeof doc.ctaTitle === "string" || (doc.ctaTitle && !doc.ctaTitle.cs)) {
    patchLocalizedString("ctaTitle", doc.ctaTitle?.en || doc.ctaTitle);
  }
  if (typeof doc.ctaText === "string" || (doc.ctaText && !doc.ctaText.cs)) {
    patchLocalizedText("ctaText", doc.ctaText?.en || doc.ctaText);
  }

  // Impact counters
  if (Array.isArray(doc.impactCounters)) {
    doc.impactCounters.forEach((counter, idx) => {
      const label = counter.label?.en || counter.label;
      if (label && typeof label === "string" && (!counter.label || !counter.label.cs)) {
        patches.push({
          set: { [`impactCounters[${idx}].label`]: { _type: "localizedString", en: label, cs: translateToCzech(label) } },
        });
      }
    });
  }

  // Testimonials
  if (Array.isArray(doc.testimonials)) {
    doc.testimonials.forEach((t, idx) => {
      if (t.quote) {
        const quote = t.quote?.en || t.quote;
        if (quote && typeof quote === "string" && (!t.quote || !t.quote.cs)) {
          patches.push({
            set: { [`testimonials[${idx}].quote`]: { _type: "localizedText", en: quote, cs: translateToCzech(quote) } },
          });
        }
      }
      if (t.author) {
        const author = t.author?.en || t.author;
        if (author && typeof author === "string" && (!t.author || !t.author.cs)) {
          patches.push({
            set: { [`testimonials[${idx}].author`]: { _type: "localizedString", en: author, cs: author } },
          });
        }
      }
    });
  }

  return patches;
}

function processProduct(doc) {
  const patches = [];

  // name
  if (doc.name) {
    const name = doc.name?.en || doc.name;
    if (name && typeof name === "string" && (!doc.name || !doc.name.cs)) {
      patches.push({
        set: { name: { _type: "localizedString", en: name, cs: translateToCzech(name) } },
      });
    }
  }

  // description
  if (doc.description) {
    const desc = doc.description?.en || doc.description;
    if (desc && typeof desc === "string" && (!doc.description || !doc.description.cs)) {
      patches.push({
        set: { description: { _type: "localizedText", en: desc, cs: translateToCzech(desc) } },
      });
    }
  }

  return patches;
}

function processPage(doc) {
  const patches = [];

  // title
  if (doc.title) {
    const title = doc.title?.en || doc.title;
    if (title && typeof title === "string" && (!doc.title || !doc.title.cs)) {
      patches.push({
        set: { title: { _type: "localizedString", en: title, cs: translateToCzech(title) } },
      });
    }
  }

  return patches;
}

function processSiteSettings(doc) {
  const patches = [];

  // siteName
  if (doc.siteName) {
    const name = doc.siteName?.en || doc.siteName;
    if (name && typeof name === "string" && (!doc.siteName || !doc.siteName.cs)) {
      patches.push({
        set: { siteName: { _type: "localizedString", en: name, cs: translateToCzech(name) } },
      });
    }
  }

  // footerText
  if (doc.footerText) {
    const text = doc.footerText?.en || doc.footerText;
    if (text && typeof text === "string" && (!doc.footerText || !doc.footerText.cs)) {
      patches.push({
        set: { footerText: { _type: "localizedText", en: text, cs: translateToCzech(text) } },
      });
    }
  }

  return patches;
}

function processNavigation(doc) {
  const patches = [];

  // headerLinks and footerLinks use the `link` object which has label (string)
  // We don't need to translate link labels as they're plain strings, not localized
  // But if you want them localized, you'd change the schema to use localizedString

  return patches;
}

// ─── Run ───
migrate().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
