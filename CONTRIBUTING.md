# Contributing an asset

1. Fork, branch from `main`.
2. Add one file (or one folder for a skill) under `manifest/`, following the layout in the [README](README.md).
3. Fill the frontmatter: `name`, `description`, `version`, `maturity`, `phase`.
4. Run `cd app && npm install && npm run validate`.
5. Open a PR. Required checks must pass.

Rules:

- Lowercase names with hyphens; `name` equals the file or folder name.
- Bump `version` for every content change.
- No secrets, internal hostnames or customer data.
- Content must be yours to license under Apache 2.0.
- Dependencies must exist in this catalog.

After merge to `main`, the catalog republishes automatically.
