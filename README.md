# Pet Charity App

Full-stack pet charity platform with CMS-managed content, Stripe commerce, Supabase backend, and MCP-ready tooling.

## Latest Stack (Current)

- Next.js 16 (App Router)
- React 19
- Sanity 5 + Next Studio integration
- Supabase Auth/DB/Storage (`@supabase/supabase-js` + `@supabase/ssr`)
- Stripe Checkout + Subscriptions + Customer Portal
- Tailwind CSS v4 + shadcn/ui
- Resend for transactional email

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill all required keys in `.env.local`.

4. Start development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## MCP Integration

Workspace MCP config is pre-created at `.vscode/mcp.json` with:

- Filesystem MCP server (scoped to this repo)
- Supabase MCP server
- Stripe MCP server

Set these shell/user environment variables before launching VS Code so MCP servers can authenticate:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `STRIPE_SECRET_KEY`

## Validation Commands

```bash
npm run lint
npm run build
```
