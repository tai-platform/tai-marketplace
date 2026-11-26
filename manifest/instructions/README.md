# instructions

Path-scoped instructions that apply only when Copilot works on matching files.

## Why it exists

A Markdown rule should not apply to Java files and a Java rule should not apply
to Markdown. Scoping keeps context small and rules relevant.

## What goes here

- Language or framework conventions (`**/*.java`, `**/*.ts`)
- Documentation style (`**/*.md`)
- Rules for a file type such as Helm values or SQL migrations

## File format

`<name>.instructions.md` with frontmatter:

```yaml
---
name: markdown-style
description: One line.
applyTo: "**/*.md"
version: 1.0.0
author: herrhilmi
---
```

`applyTo` is a glob. Without it the file applies nowhere useful, so always set it.

## Install

```bash
tai install instruction markdown-style --global      # ~/.copilot/instructions/
tai install instruction markdown-style               # .github/instructions/
```

## Examples

[markdown-style](markdown-style.instructions.md), [github-actions](github-actions.instructions.md), [java-spring](java-spring.instructions.md), [diagram-style](diagram-style.instructions.md)
