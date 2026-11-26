# tai-marketplace

Community catalog of Copilot assets for the [`tai`](https://github.com/tai-platform/tai-cli) CLI.
Every merge to `main` rebuilds the catalog and publishes it to GitHub Pages:

- Browse: `https://tai-platform.github.io/tai-marketplace`
- CLI feed: `https://tai-platform.github.io/tai-marketplace/catalog.json`

The catalog lives here. The CLI is a static tool that fetches from it.

## Use

```bash
npm install -g @tai-platform/tai
tai search
tai install skill spring-starter                # this repository
tai install mcp atlassian -g                    # ~/.copilot
```

Then ask Copilot: `start product-api using latest stable spring and add rest and jpa`.

## Layout

`manifest/` mirrors the Copilot user directory (`~/.copilot`) one to one, so a
file here is exactly the file that lands on disk.

```text
manifest/                                    public content, see manifest/README.md
├── instructions/<name>.instructions.md      path-scoped (applyTo)
├── prompts/<name>.prompt.md                 slash-command prompts
├── agents/<name>.agent.md                   custom agents
├── skills/<name>/SKILL.md                   skills, plus supporting files
└── mcp/<name>.json                          MCP servers
app/                                         catalog UI and build tooling, see app/README.md
```

Each section has its own README explaining why it exists and how to write for it.

| Kind | Installs to (project) | Installs to (`-g`) |
| --- | --- | --- |
| `instruction` | `.github/instructions/` | `~/.copilot/instructions/` |
| `prompt` | `.github/prompts/` | `~/.copilot/prompts/` |
| `agent` | `.github/agents/` | `~/.copilot/agents/` |
| `skill` | `.github/skills/<name>/` | `~/.copilot/skills/<name>/` |
| `mcp` | not supported | merged into `~/.copilot/mcp-config.json` |

`mcp` servers are merged, so personal servers survive. There is deliberately no
shared `copilot-instructions.md`: that file holds one team's own rules, so each
team writes and owns its own.

## Metadata

There are no sidecar files. Metadata sits in the frontmatter of the content
file, next to the usual Copilot keys.

```yaml
---
name: spring-starter            # must equal the file or folder name
description: One line.
version: 1.1.0                   # semver
author: herrhilmi
maturity: stable                 # required: beta | stable | deprecated
author: your-github-username     # optional; defaults to the first committer
phase: build                    # required: all | design | build | review | test | docs
tags: [java, rest]
dependencies: ["prompt/other@^1.0.0"]   # optional, kind/name@range
---
```

MCP files are JSON with the same fields under a top-level `tai` key. It is
ignored when servers are merged.

```json
{
  "tai": { "name": "atlassian", "description": "...", "version": "1.0.0", "author": "herrhilmi" },
  "mcpServers": { "atlassian": { "type": "http", "url": "https://mcp.atlassian.com/v2/mcp" } }
}
```

Bump `version` whenever you change an asset. Never put secrets in `mcp/`; use
`${ENV_VAR}` references.

## Authors and contributors

Credit is derived, not typed. At build time the catalog records, per asset:

- `author`: the `author` frontmatter value if set, otherwise the GitHub login of
  the first commit that touched the asset.
- `contributors`: every GitHub login with a commit touching the asset, most
  commits first. Bots are skipped.

Logins come from the commit email (`<id>+<login>@users.noreply.github.com`) or,
in CI, from the GitHub API. Keep your commit email private-noreply or verified
on GitHub so you get credited. The details page links each person to their profile.

## Examples

| Kind | Asset |
| --- | --- |
| instruction | [markdown-style](manifest/instructions/markdown-style.instructions.md), [github-actions](manifest/instructions/github-actions.instructions.md), [java-spring](manifest/instructions/java-spring.instructions.md), [diagram-style](manifest/instructions/diagram-style.instructions.md) |
| prompt | [adr](manifest/prompts/adr.prompt.md), [write-tests](manifest/prompts/write-tests.prompt.md), [release-notes](manifest/prompts/release-notes.prompt.md) |
| agent | [github-wiki](manifest/agents/github-wiki.agent.md), generates and syncs the repository wiki |
| skill | [spring-starter](manifest/skills/spring-starter/SKILL.md), scaffolds Spring Boot from start.spring.io with helper scripts |
| skill | [c4-context-diagram](manifest/skills/c4-context-diagram/SKILL.md), [component-diagram](manifest/skills/component-diagram/SKILL.md), [sequence-diagram](manifest/skills/sequence-diagram/SKILL.md), Mermaid architecture diagrams |
| skill | [wiki-sync](manifest/skills/wiki-sync/SKILL.md), switches wiki sync between a local git hook, GitHub Actions or off |
| mcp | [atlassian](manifest/mcp/atlassian.json), Jira and Confluence over the official remote server |

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Open a PR; CI validates it; after merge it is live.

## Develop

```bash
cd app
npm install
npm run validate     # check manifest/
npm run build        # write site/
npm run serve        # preview at http://localhost:8080
```

Enable Pages once: repository Settings, Pages, Source: GitHub Actions.

## Private marketplace

Fork this repo, publish `app/site/` on any static host, then:

```bash
tai config set marketplace https://tai.internal.example.com
export TAI_TOKEN=<token>
```

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Author

Made by [Mohammed HILMI](https://www.linkedin.com/in/hilmim/).
