#!/usr/bin/env node

/**
 * Memoria Dashboard Server
 *
 * Bun + React SSR dashboard for viewing sessions
 */

import http from "node:http";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  isInitialized,
  loadAllSessions,
  loadSession,
} from "../storage";
import { App } from "./components/App";
import { styles } from "./styles";
import type { Session } from "../types";

const DEFAULT_PORT = 3456;

/**
 * Render the full HTML page with React SSR
 */
function renderPage(sessions: Session[], selectedSession?: Session): string {
  const appHtml = renderToString(
    <App
      initialSessions={sessions}
      initialSessionId={selectedSession?.id}
    />
  );

  // Serialize data for hydration
  const initialData = JSON.stringify({
    sessions,
    selectedSessionId: selectedSession?.id || null,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${selectedSession ? `${selectedSession.title} - ` : ""}Memoria Dashboard</title>
  <style>${styles}</style>
</head>
<body>
  <div id="root">${appHtml}</div>
  <script>
    window.__INITIAL_DATA__ = ${initialData};
  </script>
</body>
</html>`;
}

/**
 * Render 404 page
 */
function render404(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Not Found - Memoria</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0d1117; color: #c9d1d9; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .container { text-align: center; }
    h1 { font-size: 48px; margin-bottom: 16px; }
    a { color: #58a6ff; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>Page not found. <a href="/">Go back</a></p>
  </div>
</body>
</html>`;
}

/**
 * Render not initialized page
 */
function renderNotInitialized(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Memoria Dashboard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0d1117; color: #c9d1d9; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .container { text-align: center; }
    h1 { font-size: 24px; margin-bottom: 16px; }
    code { background: #21262d; padding: 8px 16px; border-radius: 4px; display: inline-block; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Not Initialized</h1>
    <p>Run the following command first:</p>
    <code>memoria-mcp init</code>
  </div>
</body>
</html>`;
}

/**
 * Start dashboard server
 */
export function startDashboard(port: number = DEFAULT_PORT): void {
  if (!isInitialized()) {
    console.log("Not initialized. Run: memoria-mcp init");
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const path = url.pathname;

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    // Check initialization
    if (!isInitialized()) {
      res.writeHead(200);
      res.end(renderNotInitialized());
      return;
    }

    // Load all sessions for the list
    const sessions = loadAllSessions();

    // Routes
    if (path === "/" || path === "") {
      res.writeHead(200);
      res.end(renderPage(sessions));
      return;
    }

    const sessionMatch = path.match(/^\/session\/([^/]+)$/);
    if (sessionMatch) {
      const sessionId = sessionMatch[1];
      const session = loadSession(sessionId);
      if (session) {
        res.writeHead(200);
        res.end(renderPage(sessions, session));
        return;
      }
    }

    // 404
    res.writeHead(404);
    res.end(render404());
  });

  server.listen(port, () => {
    console.log(`Dashboard: http://localhost:${port}`);
  });
}

// Run if executed directly
const port = parseInt(process.argv[2]) || DEFAULT_PORT;
startDashboard(port);
