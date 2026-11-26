---
name: github-actions
description: Secure and maintainable conventions for GitHub Actions workflows, covering permissions, pinning, secrets, caching and reuse.
applyTo: ".github/workflows/*.{yml,yaml}"
version: 1.0.0
author: herrhilmi
maturity: stable
phase: build
tags: [github-actions, ci, security, workflows]
---

# GitHub Actions workflows

- Set `permissions` at the top of every workflow to the minimum, usually `contents: read`. Raise it per job only where needed.
- Pin third party actions to a full commit SHA with the version in a trailing comment. First party `actions/*` may use a major tag.
- Never echo secrets. Pass them through `env` on the single step that needs them, not at workflow level.
- Never interpolate untrusted input such as `github.event.pull_request.title` or branch names directly into `run:`. Put it in an `env` variable and quote it in the script.
- Use `pull_request`, not `pull_request_target`, unless you fully understand and need the elevated context. Never check out untrusted code there.
- Set `concurrency` with `cancel-in-progress: true` for pull request builds and `false` for deploys.
- Set `timeout-minutes` on every job.
- Cache dependencies with the setup action's built in cache. Key on lock files.
- Name workflows, jobs and steps so a failure reads clearly in the UI.
- Extract repeated logic into reusable workflows or composite actions instead of copying steps.
- Prefer OIDC federation to cloud providers over long lived credentials.
