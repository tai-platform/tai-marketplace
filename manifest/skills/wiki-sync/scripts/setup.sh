#!/bin/sh
set -e
mode=$1
case "$mode" in local|ci|off) ;; *) echo "usage: setup.sh local|ci|off" >&2; exit 1 ;; esac

skill=$(cd "$(dirname "$0")/.." && pwd)
cd "$(git rev-parse --show-toplevel)"
hook=.githooks/post-merge
flow=.github/workflows/wiki.yml

ours() { [ ! -e "$1" ] || grep -q '^# tai wiki-sync' "$1"; }
ours "$hook" || { echo "$hook exists and is not managed by wiki-sync, leaving it alone" >&2; exit 1; }
ours "$flow" || { echo "$flow exists and is not managed by wiki-sync, leaving it alone" >&2; exit 1; }

rm -f "$hook" "$flow"

case "$mode" in
  local)
    mkdir -p .githooks
    cp "$skill/hooks/post-merge" "$hook"
    chmod +x "$hook"
    grep -qs '^\.githooks/' .gitattributes || echo '.githooks/* text eol=lf' >> .gitattributes
    current=$(git config --get core.hooksPath || true)
    if [ -z "$current" ] || [ "$current" = ".githooks" ]; then
      git config core.hooksPath .githooks
    else
      echo "core.hooksPath is '$current', call $hook from your hook manager" >&2
    fi
    echo "wiki sync: local ($hook)"
    ;;
  ci)
    mkdir -p .github/workflows
    cp "$skill/workflows/wiki.yml" "$flow"
    echo "wiki sync: ci ($flow), add the COPILOT_TOKEN repository secret"
    ;;
  off)
    echo "wiki sync: off"
    ;;
esac
