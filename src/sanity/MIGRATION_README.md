# Sanity Czech Translation Migration

This script automatically fills in Czech (`cs`) translations for all your Sanity documents that use `localizedString` or `localizedText` fields.

## What it does

1. Fetches all `homePage`, `product`, `page`, `siteSettings`, and `navigation` documents
2. For each localized field, if the Czech value is empty but English exists:
   - Looks up a professional Czech translation from the built-in dictionary
   - If no dictionary match exists, copies the English text as a placeholder
3. Updates all documents in a single transactional batch

## Prerequisites

Make sure your `.env.local` has these values:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-api-token-with-write-access>
```

### How to get your API token

1. Go to [sanity.io/manage/personal](https://www.sanity.io/manage/personal)
2. Select your project
3. Go to **API** settings
4. Click **Add API token**
5. Name it something like "Migration Script" with **Write** permissions
6. Copy the token and add it to `.env.local`

## Run the migration

```bash
npm run sanity:migrate-cs
```

## After running

1. Open Sanity Studio (`/studio`)
2. Review the Czech translations — the dictionary covers common phrases
3. Adjust any auto-translated text to match your preferred wording
4. **Publish** the documents to make changes live

## Safety

- The script uses Sanity's transactional API — either all patches succeed or none do
- It only fills in **empty** Czech fields — existing Czech content is never overwritten
- Run it as many times as you want; it's idempotent
