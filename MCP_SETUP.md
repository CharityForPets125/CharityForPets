# MCP Server Setup & Troubleshooting

## Current Configuration

MCP servers are configured in `.vscode/settings.json` under `modelcontextprotocol.servers`:
- **filesystem**: Access repo files
- **supabase**: Query Supabase DB, Auth, Storage  
- **stripe**: Query Stripe API

## Verify MCP Servers Are Running

### Step 1: Check Environment Variables

Open PowerShell and verify these are set:

```powershell
$env:SUPABASE_ACCESS_TOKEN
$env:SUPABASE_PROJECT_REF
$env:STRIPE_SECRET_KEY
```

If any are missing, set them:

```powershell
$env:SUPABASE_ACCESS_TOKEN = "your_token_here"
$env:SUPABASE_PROJECT_REF = "your_project_ref_here"
$env:STRIPE_SECRET_KEY = "sk_test_..."
```

### Step 2: Restart VS Code

After setting env vars, close and reopen VS Code so it reads the environment.

### Step 3: Check MCP Panel in Claude Extension

1. Look for **Claude** or **MCP** panel in VS Code activity bar or command palette
2. Open **View > Output** and select **MCP** or **Model Context Protocol** channel
3. You should see:
   - Server startup logs
   - Connection status (✓ Connected or ✗ Failed)
   - Any error messages if servers failed to start

### Common Issues

**Issue: "Server failed to start"**
- Verify npm is in PATH: `npm --version`
- Try running MCP server manually:
  ```powershell
  npx @modelcontextprotocol/server-filesystem d:/CharityApp
  ```

**Issue: "Cannot find module"**
- Run `npm install` to ensure MCP packages are available
- Or try: `npx -y @modelcontextprotocol/server-filesystem --help`

**Issue: Environment variables not being read**
- Restart VS Code after setting env vars
- Or set globally in PowerShell profile:
  ```powershell
  # Add to $PROFILE (usually C:\Users\<user>\Documents\PowerShell\profile.ps1)
  $env:SUPABASE_ACCESS_TOKEN = "..."
  $env:SUPABASE_PROJECT_REF = "..."
  $env:STRIPE_SECRET_KEY = "..."
  ```

## Manual Server Test

Start a server manually to diagnose:

```powershell
# Filesystem MCP
npx -y @modelcontextprotocol/server-filesystem d:/CharityApp

# Supabase MCP (requires tokens)
$env:SUPABASE_ACCESS_TOKEN = "your_token"
$env:SUPABASE_PROJECT_REF = "your_ref"
npx -y @supabase/mcp-server-supabase@latest

# Stripe MCP
$env:STRIPE_SECRET_KEY = "sk_test_..."
npx -y @stripe/mcp@latest
```

If you see `I'm ready to accept requests` or similar, the server started successfully.
