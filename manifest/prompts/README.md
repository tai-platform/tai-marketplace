# prompts

Reusable tasks run as slash commands.

## Why it exists

Teams repeat the same requests: scaffold a controller, check a pull request,
implement a ticket. A prompt turns a good request into a command with the same
quality every time.

## What goes here

- Scaffolding and refactoring recipes
- Review and health-check routines
- Ticket-to-code workflows

Prompts are single tasks. If it needs bundled reference files or several phases,
make it a [skill](../skills/README.md).

## File format

`<name>.prompt.md` with frontmatter:

```yaml
---
name: rest-controller
description: One line.
argument-hint: 'Resource name, e.g. "invoice"'
agent: agent
version: 1.0.0
author: herrhilmi
---
```

## Install

```bash
tai install prompt rest-controller --global          # ~/.copilot/prompts/
tai install prompt rest-controller                   # .github/prompts/
```

## Examples

[adr](adr.prompt.md), [write-tests](write-tests.prompt.md), [release-notes](release-notes.prompt.md)
