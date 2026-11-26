# Security Policy

Marketplace content steers a coding assistant that can run tools, so every
asset is reviewed before it is merged.

## Reporting

Report a malicious or unsafe asset privately through GitHub private
vulnerability reporting (Security tab, Report a vulnerability). Do not open a
public issue.

## Controls

- Every change goes through a pull request and CI validation.
- The build rejects files that look like they contain credentials.
- The catalog publishes a SHA-256 hash per file, which the `tai` CLI verifies.
- MCP server names must be unique across the catalog.

Reviewers should read prompts, agents and skills for instructions that exfiltrate
data, disable safeguards, or run unexpected commands, and MCP entries for
unexpected hosts.
