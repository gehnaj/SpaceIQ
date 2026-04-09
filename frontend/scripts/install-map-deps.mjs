import { execSync } from "child_process";

console.log("Installing react-simple-maps, d3-geo, @types/d3-geo...");
execSync("pnpm add react-simple-maps d3-geo && pnpm add -D @types/d3-geo", {
  cwd: "/vercel/share/v0-project",
  stdio: "inherit",
});
console.log("Done!");
