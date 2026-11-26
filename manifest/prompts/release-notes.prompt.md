---
name: release-notes
description: Draft release notes from the commits and merged pull requests since the last tag, grouped by type, in user language.
argument-hint: 'Optional range or version, e.g. "since v1.2.0" or "v1.3.0"'
agent: agent
version: 1.0.0
author: herrhilmi
maturity: stable
phase: docs
tags: [release, changelog, documentation]
---

Draft release notes for the next release.

1. Find the range: from the last tag, or the one the user names, to the default branch tip. Use `git describe --tags --abbrev=0` and `git log` for the commits and merge commits.
2. Read each change's subject and, when unclear, its diff. Ignore merges, formatting, CI churn and dependency bumps unless they affect users or security.
3. Group under these headings and omit empty ones: **Breaking changes**, **Features**, **Fixes**, **Security**, **Internal**.
4. Write each entry as one line in plain language for someone who uses the project, not for someone who wrote it. Say what changed and why it matters. Link the pull request or issue number when the commit has one.
5. Put breaking changes first with a one line migration hint.
6. If a `CHANGELOG.md` exists, add the section at the top in its existing format. Otherwise print the notes only.
7. Do not invent changes, versions or dates. If the next version is not given, propose one following semantic versioning from the groups above and say why.
