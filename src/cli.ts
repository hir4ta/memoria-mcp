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
Usage: memoria-mcp <command>

Commands:
  init [name]    Initialize .memoria/ in current directory
  status         Show project status
  dashboard      Start web dashboard (coming soon)

Options:
  --help, -h     Show help
  --version, -v  Show version

Examples:
  memoria-mcp init
  memoria-mcp init my-project
  memoria-mcp status
`);
}

function showVersion(): void {
  console.log(`memoria-mcp v${VERSION}`);
}

function cmdInit(projectName?: string): void {
  if (isInitialized()) {
    const config = loadConfig();
    console.log("Already initialized.");
    if (config) {
      console.log(`Project: ${config.project}`);
    }
    return;
  }

  const config = initialize(projectName);

  console.log("Initialized .memoria/");
  console.log(`Project: ${config.project}`);
}

function cmdActivate(): void {
  console.log("Coming soon.");
}

function cmdStatus(): void {
  if (!isInitialized()) {
    console.log("Not initialized. Run: memoria-mcp init");
    return;
  }

  const config = loadConfig();
  if (!config) {
    console.log("Failed to load config.");
    return;
  }

  const sessions = loadAllSessions();
  const inProgress = sessions.filter((s) => s.status === "in_progress");
  const completed = sessions.filter((s) => s.status === "completed");

  console.log(`Project: ${config.project}`);
  console.log(`Sessions: ${sessions.length} (${inProgress.length} in progress, ${completed.length} completed)`);

  if (inProgress.length > 0) {
    console.log("\nIn Progress:");
    for (const session of inProgress.slice(0, 5)) {
      console.log(`  ${session.id}: ${session.title}`);
    }
    if (inProgress.length > 5) {
      console.log(`  ... +${inProgress.length - 5} more`);
    }
  }
}

function cmdDashboard(): void {
  console.log("Coming soon.");
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
  cmdActivate();
} else if (command === "status") {
  cmdStatus();
} else if (command === "dashboard") {
  cmdDashboard();
} else {
  console.log(`Unknown command: ${command}`);
  showHelp();
}
