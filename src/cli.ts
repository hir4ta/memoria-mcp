#!/usr/bin/env node

/**
 * Memoria CLI
 *
 * Commands:
 *   memoria-mcp init        Initialize .memoria/ in current directory
 *   memoria-mcp activate    Activate license key for paid features
 *   memoria-mcp status      Show status of current project
 *   memoria-mcp dashboard   Start local dashboard (coming soon)
 *   memoria-mcp --help      Show help
 */

import fs from "node:fs";
import path from "node:path";
import {
  isInitialized,
  initialize,
  loadConfig,
  saveConfig,
  getMemoriaDir,
  loadAllSessions,
} from "./storage";

const VERSION = "0.1.1";

function showHelp(): void {
  console.log(`
Memoria MCP - Local-first AI coding session management

Usage:
  memoria-mcp <command> [options]

Commands:
  init [name]      Initialize .memoria/ in current directory
                   Optional: specify project name

  status           Show status of current project

  dashboard        Start local web dashboard (coming soon)

  --help, -h       Show this help message
  --version, -v    Show version

Installation (Claude Code):
  claude mcp add memoria -- npx -y memoria-mcp-server

Examples:
  cd your-project
  npx memoria-mcp init
  npx memoria-mcp init my-project
  npx memoria-mcp status
`);
}

function showVersion(): void {
  console.log(`memoria-mcp v${VERSION}`);
}

function cmdInit(projectName?: string): void {
  if (isInitialized()) {
    console.log("Memoria is already initialized in this directory.");
    const config = loadConfig();
    if (config) {
      console.log(`Project: ${config.project}`);
      console.log(`Directory: ${getMemoriaDir()}`);
    }
    return;
  }

  console.log("Initializing Memoria...\n");

  const config = initialize(projectName);

  console.log(`✓ Created .memoria/ directory`);
  console.log(`✓ Project name: ${config.project}`);
  console.log(`✓ Config saved\n`);

  console.log("Next steps:");
  console.log("1. Add MCP server to Claude Code:");
  console.log("   claude mcp add memoria -- npx -y memoria-mcp-server\n");
  console.log("2. Restart Claude Code");
  console.log("3. Start saving your coding sessions!\n");

  console.log("Tip: Add .memoria/sessions/ to .gitignore if you don't want to");
  console.log("     version control your session data.");
}

function cmdActivate(_licenseKey?: string): void {
  console.log("Search features coming soon!\n");
  console.log("Stay tuned for:");
  console.log("  - semantic_search: Natural language search");
  console.log("  - find_related_sessions: Find similar past work");
}

function cmdStatus(): void {
  if (!isInitialized()) {
    console.log("Memoria is not initialized in this directory.");
    console.log("Run `memoria-mcp init` to get started.");
    return;
  }

  const config = loadConfig();
  if (!config) {
    console.log("Error: Failed to load config.");
    return;
  }

  const sessions = loadAllSessions();
  const inProgress = sessions.filter((s) => s.status === "in_progress");
  const completed = sessions.filter((s) => s.status === "completed");

  console.log("Memoria Status\n");
  console.log(`Project:     ${config.project}`);
  console.log(`Directory:   ${getMemoriaDir()}`);
  console.log("");
  console.log(`Sessions:    ${sessions.length} total`);
  console.log(`  In Progress: ${inProgress.length}`);
  console.log(`  Completed:   ${completed.length}`);

  if (inProgress.length > 0) {
    console.log("\nIn-Progress Sessions:");
    for (const session of inProgress.slice(0, 5)) {
      console.log(`  - ${session.title} (${session.id})`);
    }
    if (inProgress.length > 5) {
      console.log(`  ... and ${inProgress.length - 5} more`);
    }
  }
}

function cmdDashboard(): void {
  console.log("Dashboard feature coming soon!\n");
  console.log("In the meantime, you can view sessions with:");
  console.log("  memoria-mcp status");
  console.log("\nOr inspect JSON files directly:");
  console.log("  cat .memoria/sessions/<session-id>.json");
}

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  showHelp();
} else if (command === "--version" || command === "-v") {
  showVersion();
} else if (command === "init") {
  cmdInit(args[1]);
} else if (command === "activate") {
  cmdActivate(args[1]);
} else if (command === "status") {
  cmdStatus();
} else if (command === "dashboard") {
  cmdDashboard();
} else {
  console.log(`Unknown command: ${command}`);
  console.log("Run `memoria-mcp --help` for usage.");
}
