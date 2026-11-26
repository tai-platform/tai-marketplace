# agents

Custom agents: specialized roles with their own scope and tool limits.

## Why it exists

One general assistant does everything loosely. An agent fixes a role, such as a
read-only reviewer or a documentation writer, and bounds what it may do, so
results are predictable and safe.

## What goes here

- Reviewers that must never edit files
- Delivery agents tied to a team workflow
- Documentation or operations specialists

## File format

`<name>.agent.md` with frontmatter and the role instructions as the body:

```yaml
---
name: github-wiki
description: One line used to pick the agent.
tools: ["read", "search"]
version: 1.0.0
author: herrhilmi
---
```

Keep `tools` as small as the role allows.

## Install

```bash
tai install agent github-wiki --global             # ~/.copilot/agents/
tai install agent github-wiki                      # .github/agents/
```

## Example

[github-wiki.agent.md](github-wiki.agent.md)
