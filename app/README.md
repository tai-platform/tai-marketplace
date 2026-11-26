# app

The tooling and catalog UI of the marketplace. Contributors of assets never need
to touch this folder; they work in [`../manifest`](../manifest/README.md).

## Why it exists

The manifest is plain files. This folder turns it into something the CLI and
people can use:

- `scripts/build-catalog.mjs` validates every asset and generates `catalog.json`.
- `index.html` is a static browse and search UI, no framework or build step.

## Output

`npm run build` writes `app/site/`, which is what GitHub Pages serves:

```text
site/
├── index.html       the UI
├── catalog.json     the feed the tai CLI reads
└── manifest/        the asset files, copied as is
```

## Commands

```bash
npm install
npm run validate     # check manifest/, no output files
npm run build        # validate and write site
npm run serve        # build and preview at http://localhost:8080
```

## Validation rules

- `name` equals the file or folder name, lowercase with hyphens
- `description`, `maturity` and a semver `version` are present
- `maturity` is required and is `beta`, `stable` or `deprecated`. Use `beta` for anything new
- `phase` is required and is `all`, `design`, `build`, `review`, `test` or `docs`
- Every dependency exists in the catalog and its range matches

Requires Node.js 20.11 or later.
