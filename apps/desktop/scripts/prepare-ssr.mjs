// @ts-nocheck
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = resolve(fileURLToPath(new URL(".", import.meta.url)));
const repoRoot = resolve(here, "../../..");
const frontendRoot = resolve(repoRoot, "apps/frontend");
const desktopRoot = resolve(repoRoot, "apps/desktop");

const standaloneDir = resolve(frontendRoot, ".next/standalone");
const staticDir = resolve(frontendRoot, ".next/static");
const publicDir = resolve(frontendRoot, "public");

const outDir = resolve(desktopRoot, "src-tauri/next");
const serverDir = resolve(outDir, "server");
const loaderDir = resolve(outDir, "loader");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(serverDir, { recursive: true });
mkdirSync(loaderDir, { recursive: true });

function findServerRoot(dir, depth = 6) {
  const direct = resolve(dir, "server.js");
  if (existsSync(direct)) return dir;
  if (depth === 0) return null;
  const entries = [];
  try {
    entries.push(...readdirSync(dir, { withFileTypes: true }));
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "node_modules") continue;
    const child = findServerRoot(resolve(dir, entry.name), depth - 1);
    if (child) return child;
  }
  return null;
}

const serverRoot = findServerRoot(standaloneDir);
if (!serverRoot) {
  throw new Error(`Could not find server.js under ${standaloneDir}`);
}

const appRel = relative(standaloneDir, serverRoot) || ".";

cpSync(standaloneDir, serverDir, { recursive: true });
cpSync(staticDir, resolve(serverDir, appRel, ".next/static"), {
  recursive: true,
});
if (existsSync(publicDir)) {
  cpSync(publicDir, resolve(serverDir, appRel, "public"), { recursive: true });
}

writeFileSync(resolve(serverDir, "server-entry.txt"), appRel, "utf8");

const loaderHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Starting...</title>
    <style>
      body { margin: 0; font-family: sans-serif; background: #0f0f0f; color: #fafafa; }
      .wrap { min-height: 100vh; display: grid; place-items: center; }
      .card { padding: 24px 28px; border-radius: 12px; background: #171717; box-shadow: 0 12px 30px rgba(0,0,0,.35); }
      .muted { opacity: .7; font-size: 14px; margin-top: 8px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div>Starting the app…</div>
        <div class="muted" id="status">Connecting to the local server.</div>
      </div>
    </div>
    <script>
      const target = "http://127.0.0.1:1430";
      const status = document.getElementById("status");
      async function probe() {
        try {
          await fetch(target, { mode: "no-cors" });
          window.location.replace(target);
        } catch {
          status.textContent = "Waiting for the server…";
          setTimeout(probe, 400);
        }
      }
      probe();
    </script>
  </body>
</html>
`;

writeFileSync(resolve(loaderDir, "index.html"), loaderHtml, "utf8");
