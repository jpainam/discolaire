import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..", "..", "..");
const frontendDir = path.join(root, "apps", "frontend");
const desktopDir = path.join(root, "apps", "desktop");
const buildDir = path.join(desktopDir, "build", "frontend");
const appBundleDir = path.join(buildDir, "apps", "frontend");
const standaloneDir = path.join(frontendDir, ".next", "standalone");
const staticDir = path.join(frontendDir, ".next", "static");
const publicDir = path.join(frontendDir, "public");

const run = (command) => {
  execSync(command, { stdio: "inherit", cwd: root });
};

const cleanDir = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};

const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  // Avoid symlinks inside the Electron bundle (breaks codesign on macOS)
  fs.cpSync(from, to, { recursive: true, dereference: true });
};

cleanDir(buildDir);

run("pnpm --filter @repo/frontend build");

copyDir(standaloneDir, buildDir);
copyDir(staticDir, path.join(appBundleDir, ".next", "static"));
copyDir(publicDir, path.join(appBundleDir, "public"));

const rootNodeModules = path.join(buildDir, "node_modules");
const appNodeModules = path.join(appBundleDir, "node_modules");
if (fs.existsSync(rootNodeModules)) {
  fs.rmSync(appNodeModules, { recursive: true, force: true });
  fs.mkdirSync(appBundleDir, { recursive: true });
  fs.renameSync(rootNodeModules, appNodeModules);
}
