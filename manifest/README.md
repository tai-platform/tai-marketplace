# Manifest

The public, versioned content of the marketplace. Everything the `tai` CLI can
install lives here, and nothing else does.

## Why it exists

Copilot reads user and repository customizations from fixed locations. Teams
copy and paste these files between repositories and drift apart. The manifest
is one shared, reviewed source for them, so a good prompt or agent written once
is available to everyone through `tai install`.

## How it is organized

The folders mirror the Copilot user directory (`~/.copilot`) one to one. A file
here is byte for byte the file that lands on disk, so you can also copy it by hand.

| Section | Purpose | Use it for |
| --- | --- | --- |
| [instructions](instructions/README.md) | Rules scoped to file patterns | Language or path specific style |
| [prompts](prompts/README.md) | Reusable slash-command tasks | Repeatable workflows |
| [agents](agents/README.md) | Specialized roles with tool limits | Review, docs, delivery roles |
| [skills](skills/README.md) | Packaged know-how with resources | Multi-step procedures |
| [mcp](mcp/README.md) | External tool servers | Jira, Confluence, internal APIs |

## How it is consumed

On every merge to `main`, CI validates this folder, builds `catalog.json` and
publishes both to GitHub Pages. The CLI reads the catalog and downloads files
from here. See the [root README](../README.md) for install locations.

## Rules for every asset

- Metadata sits in the file's frontmatter: `name`, `description`, `version`, `maturity`, `phase`.
- `name` equals the file or folder name, in lowercase with hyphens.
- Bump `version` on every change. Consumers pin versions in `.tai.yaml`.
- No secrets, tokens, customer data or internal hostnames.
- Content must be yours to license under Apache 2.0.

To add something, follow [CONTRIBUTING.md](../CONTRIBUTING.md).
