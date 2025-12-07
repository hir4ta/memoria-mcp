/**
 * Local JSON storage for memoria-mcp
 *
 * Stores sessions in .memoria/ directory at project root
 */

import fs from "node:fs";
import path from "node:path";
import type { Session, MemoriaConfig } from "./types";

const MEMORIA_DIR = ".memoria";
const SESSIONS_DIR = "sessions";
const CONFIG_FILE = "config.json";
const INDEX_FILE = "index.json";

/**
 * Find project root by looking for .memoria directory or common project markers
 */
export function findProjectRoot(): string {
  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;

  // First, look for existing .memoria directory
  while (currentDir !== root) {
    if (fs.existsSync(path.join(currentDir, MEMORIA_DIR))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // If not found, return current working directory
  return process.cwd();
}

/**
 * Get .memoria directory path
 */
export function getMemoriaDir(): string {
  return path.join(findProjectRoot(), MEMORIA_DIR);
}

/**
 * Get sessions directory path
 */
export function getSessionsDir(): string {
  return path.join(getMemoriaDir(), SESSIONS_DIR);
}

/**
 * Check if memoria is initialized in current project
 */
export function isInitialized(): boolean {
  return fs.existsSync(getMemoriaDir());
}

/**
 * Initialize memoria in current directory
 */
export function initialize(projectName?: string): MemoriaConfig {
  const memoriaDir = path.join(process.cwd(), MEMORIA_DIR);
  const sessionsDir = path.join(memoriaDir, SESSIONS_DIR);

  // Create directories
  fs.mkdirSync(sessionsDir, { recursive: true });

  // Detect project name from package.json or directory name
  const detectedProject = detectProjectName(projectName);

  // Create config
  const config: MemoriaConfig = {
    version: "1.0.0",
    project: detectedProject,
    createdAt: new Date().toISOString(),
  };

  // Write config
  fs.writeFileSync(
    path.join(memoriaDir, CONFIG_FILE),
    JSON.stringify(config, null, 2)
  );

  // Create empty index
  fs.writeFileSync(
    path.join(memoriaDir, INDEX_FILE),
    JSON.stringify({ sessions: [] }, null, 2)
  );

  // Create .gitignore (recommend ignoring sessions but keeping config)
  fs.writeFileSync(
    path.join(memoriaDir, ".gitignore"),
    `# Ignore session data (optional - remove if you want to version control sessions)
sessions/
index.json
`
  );

  return config;
}

/**
 * Detect project name from package.json or directory
 */
function detectProjectName(override?: string): string {
  if (override) return override;

  const cwd = process.cwd();

  // Try package.json
  const packageJsonPath = path.join(cwd, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (pkg.name) return pkg.name;
    } catch {
      // Ignore parse errors
    }
  }

  // Fall back to directory name
  return path.basename(cwd);
}

/**
 * Load config
 */
export function loadConfig(): MemoriaConfig | null {
  const configPath = path.join(getMemoriaDir(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Save config
 */
export function saveConfig(config: MemoriaConfig): void {
  const configPath = path.join(getMemoriaDir(), CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `sess_${timestamp}_${random}`;
}

/**
 * Generate unique checkpoint ID
 */
export function generateCheckpointId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `chk_${timestamp}_${random}`;
}

/**
 * Save session to disk
 */
export function saveSession(session: Session): void {
  const sessionsDir = getSessionsDir();
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
  }

  const sessionPath = path.join(sessionsDir, `${session.id}.json`);
  fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));

  // Update index
  updateIndex(session);
}

/**
 * Load session by ID
 */
export function loadSession(sessionId: string): Session | null {
  const sessionPath = path.join(getSessionsDir(), `${sessionId}.json`);
  if (!fs.existsSync(sessionPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(sessionPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Load all sessions (lightweight - from index)
 */
export function loadAllSessions(): Session[] {
  const sessionsDir = getSessionsDir();
  if (!fs.existsSync(sessionsDir)) return [];

  const sessions: Session[] = [];
  const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    try {
      const session = JSON.parse(
        fs.readFileSync(path.join(sessionsDir, file), "utf-8")
      );
      sessions.push(session);
    } catch {
      // Ignore invalid files
    }
  }

  // Sort by updatedAt descending
  return sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Load in-progress sessions
 */
export function loadInProgressSessions(): Session[] {
  return loadAllSessions().filter((s) => s.status === "in_progress");
}

/**
 * Delete session
 */
export function deleteSession(sessionId: string): boolean {
  const sessionPath = path.join(getSessionsDir(), `${sessionId}.json`);
  if (!fs.existsSync(sessionPath)) return false;

  fs.unlinkSync(sessionPath);
  removeFromIndex(sessionId);
  return true;
}

/**
 * Session index entry (lightweight)
 */
interface IndexEntry {
  id: string;
  title: string;
  status: SessionStatus;
  project: string;
  updatedAt: string;
}

type SessionStatus = "in_progress" | "completed";

interface Index {
  sessions: IndexEntry[];
}

/**
 * Update session index
 */
function updateIndex(session: Session): void {
  const indexPath = path.join(getMemoriaDir(), INDEX_FILE);
  let index: Index = { sessions: [] };

  if (fs.existsSync(indexPath)) {
    try {
      index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    } catch {
      // Start fresh if corrupted
    }
  }

  // Remove existing entry
  index.sessions = index.sessions.filter((s) => s.id !== session.id);

  // Add updated entry
  index.sessions.unshift({
    id: session.id,
    title: session.title,
    status: session.status,
    project: session.project,
    updatedAt: session.updatedAt,
  });

  // Keep only last 1000 entries in index
  index.sessions = index.sessions.slice(0, 1000);

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

/**
 * Remove from index
 */
function removeFromIndex(sessionId: string): void {
  const indexPath = path.join(getMemoriaDir(), INDEX_FILE);
  if (!fs.existsSync(indexPath)) return;

  try {
    const index: Index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    index.sessions = index.sessions.filter((s) => s.id !== sessionId);
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  } catch {
    // Ignore errors
  }
}

/**
 * Extract title from summary (first non-header line)
 */
export function extractTitle(summary: string, maxLength = 100): string {
  const lines = summary.split("\n").map((l) => l.trim());

  for (const line of lines) {
    // Skip empty lines and markdown headers
    if (!line || line.startsWith("#")) continue;
    // Return first content line, truncated
    return line.length > maxLength ? line.substring(0, maxLength) + "..." : line;
  }

  return "Untitled Session";
}
