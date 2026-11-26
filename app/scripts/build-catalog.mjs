// Validates manifest/ and builds app/site/ (catalog.json, manifest/, index.html) for GitHub Pages.
// manifest/ mirrors ~/.copilot, so files are published byte for byte.
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import semver from "semver";
import YAML from "yaml";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const APP = path.join(ROOT, "app");
const MANIFEST = path.join(ROOT, "manifest");
const SITE = path.join(APP, "site");
const MATURITY = ["beta", "stable", "deprecated"];
const PHASES = ["all", "design", "build", "review", "test", "docs"];
const NAME = /^[a-z0-9][a-z0-9-]*$/;
const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const NOREPLY = /^(?:\d+\+)?([A-Za-z0-9-]+)@users\.noreply\.github\.com$/;

// kind -> folder and file suffix, same layout as ~/.copilot
const KINDS = {
  instruction: { dir: "instructions", suffix: ".instructions.md" },
  prompt: { dir: "prompts", suffix: ".prompt.md" },
  agent: { dir: "agents", suffix: ".agent.md" },
  mcp: { dir: "mcp", suffix: ".json" },
  skill: { dir: "skills", skill: true },
};

const errors = [];
const fail = (m) => errors.push(m);

function walk(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, base) : [path.relative(base, p).split(path.sep).join("/")];
  });
}

function metaOf(kind, text) {
  if (kind === "mcp") return JSON.parse(text).tai ?? {};
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  return m ? (YAML.parse(m[1]) ?? {}) : {};
}

function parseDep(s) {
  const m = /^([a-z-]+)\/([a-z0-9-]+)(?:@(.+))?$/.exec(String(s).trim());
  return m ? { kind: m[1], name: m[2], ...(m[3] ? { version: m[3] } : {}) } : null;
}

// Section READMEs document the manifest and are not assets.
const isAsset = (f) => f.toLowerCase() !== "readme.md";

// Cheap guard against pasting credentials. Not a substitute for a real scanner.
const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /xox[abprs]-[A-Za-z0-9-]{10,}/,
  /(?:api[_-]?key|secret|token|password)["']?\s*[:=]\s*["'][^"'$\s]{16,}["']/i,
];

const loginCache = new Map();

async function resolveLogin(sha, email, name) {
  const direct = NOREPLY.exec(email)?.[1];
  if (direct) return direct;
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) return null;
  if (!loginCache.has(sha)) {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, {
      headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json" },
    }).catch(() => null);
    loginCache.set(sha, res?.ok ? ((await res.json()).author?.login ?? null) : null);
  }
  return loginCache.get(sha);
}

async function history(relPath) {
  let log;
  try {
    log = execFileSync("git", ["log", "--format=%H%x09%ae%x09%an%x09%cI", "--reverse", "--", relPath], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return { author: null, contributors: [], createdAt: null, updatedAt: null };
  }
  const counts = new Map();
  let createdAt = null;
  let updatedAt = null;
  let author = null;
  for (const line of log.split("\n").filter(Boolean)) {
    const [sha, email, name, date] = line.split("\t");
    if (/\[bot\]/i.test(name) || /\[bot\]/i.test(email)) continue;
    const login = await resolveLogin(sha, email, name);
    if (!login) continue;
    author ??= login;
    createdAt ??= date;
    updatedAt = date;
    const key = login.toLowerCase();
    const seen = counts.get(key);
    counts.set(key, { login: seen?.login ?? login, commits: (seen?.commits ?? 0) + 1 });
  }
  const contributors = [...counts.values()].sort((a, b) => b.commits - a.commits || a.login.localeCompare(b.login));
  return { author, contributors, createdAt, updatedAt };
}

const sha256 = (buf) => `sha256-${crypto.createHash("sha256").update(buf).digest("hex")}`;

const assets = [];
const serverOwners = new Map();
for (const [kind, spec] of Object.entries(KINDS)) {
  const kdir = path.join(MANIFEST, spec.dir);
  if (!fs.existsSync(kdir)) continue;

  const names = spec.skill
    ? fs.readdirSync(kdir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
    : fs.readdirSync(kdir).filter((f) => isAsset(f) && f.endsWith(spec.suffix)).map((f) => f.slice(0, -spec.suffix.length));

  for (const name of names) {
    const id = `${kind}/${name}`;
    if (!NAME.test(name)) fail(`${id}: name must be lowercase letters, digits, hyphens`);

    const base = spec.skill ? path.join(kdir, name) : kdir;
    const main = spec.skill ? "SKILL.md" : `${name}${spec.suffix}`;
    const files = spec.skill ? walk(base) : [main];
    if (!files.includes(main)) {
      fail(`${id}: missing ${main}`);
      continue;
    }

    let meta;
    try {
      meta = metaOf(kind, fs.readFileSync(path.join(base, main), "utf8"));
    } catch (e) {
      fail(`${id}: cannot parse metadata (${e.message})`);
      continue;
    }
    if (meta.name !== name) fail(`${id}: name "${meta.name}" must equal "${name}"`);
    if (!meta.description) fail(`${id}: description is required`);
    if (!semver.valid(meta.version)) fail(`${id}: version must be semver`);
    if (!MATURITY.includes(meta.maturity)) fail(`${id}: maturity is required: ${MATURITY.join("|")}`);
    if (!PHASES.includes(meta.phase)) fail(`${id}: phase is required: ${PHASES.join("|")}`);
    if (meta.author !== undefined && !LOGIN.test(String(meta.author))) fail(`${id}: author must be a GitHub username`);

    const dependencies = [];
    for (const s of meta.dependencies ?? []) {
      const d = parseDep(s);
      if (d && KINDS[d.kind]) dependencies.push(d);
      else fail(`${id}: bad dependency "${s}" (use kind/name@range)`);
    }

    const integrity = {};
    for (const f of files) {
      const buf = fs.readFileSync(path.join(base, f));
      integrity[f] = sha256(buf);
      if (SECRET_PATTERNS.some((re) => re.test(buf.toString("utf8")))) {
        fail(`${id}: ${f} looks like it contains a secret`);
      }
    }
    if (kind === "mcp") {
      const servers = Object.keys(JSON.parse(fs.readFileSync(path.join(base, main), "utf8")).mcpServers ?? {});
      if (!servers.length) fail(`${id}: mcpServers is empty`);
      for (const s of servers) {
        if (serverOwners.has(s)) fail(`${id}: server "${s}" is already defined by ${serverOwners.get(s)}`);
        else serverOwners.set(s, id);
      }
    }

    const relPath = `manifest/${spec.dir}${spec.skill ? `/${name}` : `/${main}`}`;
    const { author, contributors, createdAt, updatedAt } = await history(relPath);
    const authorLogin = meta.author ?? author;
    if (!authorLogin) console.warn(`warning: ${id}: no author (set "author" in frontmatter or commit the file)`);
    const people = !authorLogin || contributors.some((c) => c.login.toLowerCase() === authorLogin.toLowerCase())
      ? contributors
      : [{ login: authorLogin, commits: 0 }, ...contributors];

    assets.push({
      kind,
      name,
      description: meta.description,
      author: authorLogin ?? null,
      contributors: people,
      createdAt,
      updatedAt,
      maturity: meta.maturity,
      phase: meta.phase,
      tags: meta.tags ?? [],
      versions: [
        {
          version: meta.version,
          path: `manifest/${spec.dir}${spec.skill ? `/${name}` : ""}`,
          files: [main, ...files.filter((f) => f !== main).sort()],
          integrity,
          ...(dependencies.length ? { dependencies } : {}),
        },
      ],
    });
  }
}

const index = new Map(assets.map((a) => [`${a.kind}/${a.name}`, a]));
for (const a of assets) {
  for (const d of a.versions[0].dependencies ?? []) {
    const t = index.get(`${d.kind}/${d.name}`);
    if (!t) fail(`${a.kind}/${a.name}: unknown dependency ${d.kind}/${d.name}`);
    else if (d.version && !semver.satisfies(t.versions[0].version, d.version)) {
      fail(`${a.kind}/${a.name}: ${d.kind}/${d.name}@${t.versions[0].version} does not match ${d.version}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}

if (process.argv.includes("--check")) {
  console.log(`ok: ${assets.length} assets`);
  process.exit(0);
}

fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });
fs.cpSync(MANIFEST, path.join(SITE, "manifest"), { recursive: true });
fs.copyFileSync(path.join(APP, "index.html"), path.join(SITE, "index.html"));
fs.writeFileSync(path.join(SITE, ".nojekyll"), "");
fs.writeFileSync(
  path.join(SITE, "catalog.json"),
  JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), assets }, null, 2) + "\n",
);
console.log(`built site/ with ${assets.length} assets`);
