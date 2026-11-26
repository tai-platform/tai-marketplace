# skills

Packaged know-how: instructions plus supporting files that Copilot loads when relevant.

## Why it exists

Some work is a procedure, not a single request: build an endpoint end to end,
validate a chart, produce a diagram. A skill bundles the steps and reference
material, and Copilot picks it up from its `description` when the task matches.

## What goes here

- Multi-step procedures with checklists
- Workflows that need templates or reference files
- Domain knowledge Copilot should apply on demand

## Folder format

One folder per skill. `SKILL.md` is required, anything else is supporting material:

```text
skills/<name>/
├── SKILL.md
├── reference/dependencies.md
└── scripts/
    ├── new-project.sh     # macOS and Linux
    └── new-project.ps1    # PowerShell
```

```yaml
---
name: spring-starter
description: 'What it does. Use when ...'
argument-hint: 'Project name and what it needs'
version: 1.0.0
author: herrhilmi
maturity: beta
phase: build
dependencies: []
---
```

Write `description` so it states when to use the skill. It is what triggers it.
`dependencies` are installed together with the skill.

Helper scripts in any language are allowed. The CLI copies them verified and
sets the executable bit on POSIX, but never runs them. Keep them read-only and
explain in `SKILL.md` when to run each. Files may not exceed 10 MB.

## Install

```bash
tai install skill spring-starter --global             # ~/.copilot/skills/
tai install skill spring-starter                    # .github/skills/
```

## Example

[spring-starter](spring-starter/SKILL.md) calls a live API through helper scripts and is the reference example for a skill.
