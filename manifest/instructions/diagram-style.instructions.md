---
name: diagram-style
description: Rules for architecture diagrams kept in Markdown. Mermaid only, one shared palette, nothing invented. Pairs with the c4-context-diagram, component-diagram and sequence-diagram skills.
applyTo: "docs/architecture/**/*.md"
version: 1.0.0
author: herrhilmi
maturity: stable
phase: design
tags: [diagram, mermaid, architecture, documentation]
---

# Architecture diagrams

- Diagrams are fenced `mermaid` blocks in Markdown. No images, no draw.io files, no screenshots.
- One diagram per question: context (who calls what), component (what is inside), sequence (what happens in order). Never mix levels.
- Use the shared palette so diagrams look alike across repositories:
  - this system `fill:#dae8fc,stroke:#1368ce`
  - callers `fill:#d5e8d4,stroke:#82b366`
  - third party `fill:#f5f5f5,stroke:#999`
  - owned infrastructure `fill:#fff2cc,stroke:#d6b656`
- Every node and message must trace to code, config or a document. Do not add a box for something that might exist.
- At most one arrow between two nodes. Label arrows with protocol and intent.
- Name nodes as they appear in code or config, never `Service A`.
- A diagram has a title heading above it and one or two sentences below it saying what a reader would otherwise miss.
- When code changes a dependency, update the diagram in the same pull request.
- For generating or refreshing diagrams use the skills `c4-context-diagram`, `component-diagram` and `sequence-diagram`.
