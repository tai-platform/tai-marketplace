---
name: wiki-sync
description: 'Switch automatic GitHub wiki sync between a local git hook (default, uses your own Copilot), a GitHub Actions job, or off. Use when asked to automate, enable, disable or change how the github-wiki agent runs after merges to the default branch.'
argument-hint: 'Mode: local, ci or off'
version: 1.1.0
author: herrhilmi
maturity: beta
phase: docs
tags: [wiki, git-hook, github-actions, automation, documentation]
---

# Wiki sync modes

Keeps the repository wiki current by running the `github-wiki` agent when the default branch changes. One mode at a time. Only the files of the active mode exist in the repo, so inactive modes cost nothing.

| Mode | Triggers when | Needs | Files in repo |
| --- | --- | --- | --- |
| `local` | Your clone of the default branch gets new commits, by `git pull` or a local merge | Copilot CLI installed and signed in, which is the normal case | `.githooks/post-merge` |
| `ci` | A push or pull request merge lands on `main` | A Copilot enabled token stored as the `COPILOT_TOKEN` repository secret | `.github/workflows/wiki.yml` |
| `off` | Never, run the agent by hand | Nothing | none |

`local` needs no token because Copilot CLI is already signed in on your machine. `ci` does need one: the built in `GITHUB_TOKEN` cannot call Copilot, so CI has to carry a token of a Copilot licensed user.

The agent records the last documented commit in the wiki and each run only processes the diff since then, so every mode is incremental and stays consistent with the others.

Feature branches are ignored in both modes. Work happens on a branch, the pull request merges on GitHub, and the wiki updates when the default branch moves: instantly in `ci`, and in `local` the first time anyone pulls the default branch.

## Switch

Run from anywhere inside the repository. The script lives next to this file.

```bash
sh <path-to-this-skill>/scripts/setup.sh local
sh <path-to-this-skill>/scripts/setup.sh ci
sh <path-to-this-skill>/scripts/setup.sh off
```

Switching removes the files of the previous mode, writes the new ones and prints what changed. Commit the result so the team shares the mode. The script refuses to overwrite a `post-merge` hook or `wiki.yml` it did not create.

## Behaviour

- **local:** the hook returns immediately and runs the agent in the background. It skips silently when `copilot` is not installed, when the current branch is not the default branch, or when a run is in progress. The agent itself skips work when the wiki already matches the commit. Output goes to `.git/wiki-sync.log`. Hooks are per clone, so each developer runs `setup.sh local` once, or `git config core.hooksPath .githooks`. One developer pulling is enough to refresh the wiki for everyone.
- **ci:** the job ends green without doing anything when `COPILOT_TOKEN` is not set. It installs Copilot CLI, Tai, the `github-wiki` agent and the three diagram skills, then runs the agent. Expose the token to Copilot CLI as its documentation describes.

Do not enable both modes: two writers on the same wiki produce noisy history.
