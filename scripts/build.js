import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const buildDir = path.join(projectRoot, "build");

const dashboards = [
  { target: "corp", outputName: "corp_index.html" },
  { target: "hr", outputName: "hr_index.html" },
  { target: "items", outputName: "items_index.html" },
  { target: "pin", outputName: "pin_index.html" },
  { target: "pos", outputName: "pos_index.html" },
  { target: "scm_IM", outputName: "scm_IM_index.html" },
  { target: "scm_IO", outputName: "scm_IO_index.html" },
  { target: "scm_MB", outputName: "scm_MB_index.html" },
];

function runViteBuild(target) {
  return new Promise((resolve, reject) => {
    const viteBin = path.join(projectRoot, "node_modules", "vite", "bin", "vite.js");
    const child = spawn(process.execPath, [viteBin, "build", "--outDir", "build"], {
      cwd: projectRoot,
      env: {
        ...process.env,
        VITE_DASHBOARD_TARGET: target,
      },
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`vite build failed for ${target} with exit code ${code}`));
    });
  });
}

async function buildDashboards() {
  await fs.rm(buildDir, { recursive: true, force: true });
  await fs.mkdir(buildDir, { recursive: true });

  for (const dashboard of dashboards) {
    console.log(`\nBuilding ${dashboard.target} -> ${dashboard.outputName}`);
    await runViteBuild(dashboard.target);

    const indexPath = path.join(buildDir, "index.html");
    const outputPath = path.join(buildDir, dashboard.outputName);
    await fs.rename(indexPath, outputPath);
    console.log(`Built ${dashboard.outputName}`);
  }

  console.log(`\nBuilt ${dashboards.length} dashboards in ${buildDir}`);
}

buildDashboards().catch((error) => {
  console.error("\nBuild failed:");
  console.error(error);
  process.exit(1);
});
