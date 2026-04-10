import path from "path";

/**
 * Returns the project root directory.
 * - In Docker (Railway): uses PROJECT_ROOT env var ("/app")
 * - Locally: falls back to process.cwd() + ".." (frontend → project root)
 */
export function getProjectRoot(): string {
  return process.env.PROJECT_ROOT || path.join(process.cwd(), "..");
}
