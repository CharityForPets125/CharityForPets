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

console.log("\n🔍 Checking Sanity dataset...\n");

client.fetch("*[_type != null]{_id,_type}")
  .then((docs) => {
    if (docs.length === 0) {
      console.log("⚠️  Your Sanity dataset is EMPTY.\n");
      console.log("📋 You need to create content first:\n");
      console.log("   1. Open Sanity Studio: http://localhost:3000/en/studio");
      console.log("   2. Create these documents and PUBLISH them:");
      console.log("      - Home Page (hero, counters, testimonials, etc.)");
      console.log("      - Products (name, description, price, images)");
      console.log("      - Pages (About, Contact)");
      console.log("      - Site Settings (site name, footer text)");
      console.log("      - Navigation (header/footer links)");
      console.log("      - Donation Settings");
      console.log("      - Shop Settings\n");
      console.log("   3. Then run: npm run sanity:migrate-cs\n");
    } else {
      console.log(`✅ Found ${docs.length} documents:\n`);
      docs.forEach((d) => console.log(`   - ${d._type.padEnd(20)} ${d._id}`));
      console.log(`\n💡 Run: npm run sanity:migrate-cs`);
      console.log("   to fill in Czech translations.\n");
    }
  })
  .catch((e) => {
    console.error("❌ Error connecting to Sanity:", e.message);
    console.error("\n   Check your SANITY_API_TOKEN in .env.local");
    console.error("   Get token at: https://www.sanity.io/manage/personal\n");
  });
