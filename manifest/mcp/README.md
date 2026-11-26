# mcp

Model Context Protocol servers that give Copilot access to external tools.

## Why it exists

Copilot can read Jira, Confluence or an internal API only if a server exposes
them. Sharing the server definition means everyone gets the same integration
without hand-editing config files.

## What goes here

- Remote servers for issue trackers, wikis and documentation
- Internal tool servers

Never put secrets here. Reference environment variables as `${ENV_VAR}`.

## File format

`<name>.json`. The `mcpServers` object uses the same schema as
`~/.copilot/mcp-config.json`. Marketplace metadata goes under a top-level `tai`
key, which is ignored when merging.

```json
{
  "tai": { "name": "atlassian", "description": "One line.", "version": "1.0.0", "author": "herrhilmi" },
  "mcpServers": { "atlassian": { "type": "http", "url": "https://mcp.atlassian.com/v2/mcp" } }
}
```

## Install

MCP servers are user-level, so installing needs `--global`:

```bash
tai install mcp atlassian --global
```

The servers are merged into `~/.copilot/mcp-config.json`. Personal servers
survive, and `tai uninstall mcp atlassian --global` removes only what tai added.
Servers that need sign-in still require a one-time interactive login.

## Example

[atlassian.json](atlassian.json)
