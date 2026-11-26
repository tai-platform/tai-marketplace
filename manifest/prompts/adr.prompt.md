---
name: adr
description: Draft an Architecture Decision Record for a technical decision, with context, options, consequences and a status, saved under docs/adr.
argument-hint: 'The decision, e.g. "use PostgreSQL instead of MongoDB for orders"'
agent: agent
version: 1.0.0
author: herrhilmi
maturity: stable
phase: design
tags: [adr, architecture, decision, documentation]
---

Write an Architecture Decision Record for the decision the user describes.

1. Read `docs/adr` if it exists. Use its numbering and template. If it does not exist, create it and start at `0001`.
2. Look in the repository for evidence of the problem: current code, config, dependencies and open issues. Cite files, never guess.
3. Create `docs/adr/NNNN-short-title.md` with these sections:
   - **Status**: Proposed, Accepted, Superseded by NNNN, or Deprecated.
   - **Context**: the forces at play, in a few sentences.
   - **Decision**: one clear sentence starting with "We will".
   - **Options considered**: at least two, each with one line of pros and one of cons. Include the do nothing option.
   - **Consequences**: what gets easier, what gets harder, what must change next.
4. If the decision replaces an earlier ADR, mark that file Superseded and link both ways.
5. Keep it under one page. Do not invent constraints, numbers or stakeholders the user did not give.

Finish by listing the file you created and any assumption you made.
