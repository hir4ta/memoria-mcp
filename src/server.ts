#!/usr/bin/env node

/**
 * Memoria MCP Server
 *
 * Local-first MCP server for AI coding session management.
 * Stores data in .memoria/ directory at project root.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools";
import {
  handleSaveCheckpoint,
  handleSaveSession,
  handleCompleteSession,
  handleContinueContext,
  handleGetSession,
  handleSemanticSearch,
  handleFindRelatedSessions,
} from "./handlers";

// Version
const VERSION = "0.1.1";

/**
 * MCP Server for Memoria
 */
class MemoriaMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "memoria-mcp",
        version: VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;

        switch (name) {
          case "save_checkpoint":
            result = handleSaveCheckpoint(args || {});
            break;

          case "save_session":
            result = handleSaveSession(args || {});
            break;

          case "complete_session":
            result = handleCompleteSession(args || {});
            break;

          case "continue_context":
            result = handleContinueContext(args || {});
            break;

          case "get_session":
            result = handleGetSession(args || {});
            break;

          case "semantic_search":
            result = handleSemanticSearch(args || {});
            break;

          case "find_related_sessions":
            result = handleFindRelatedSessions(args || {});
            break;

          default:
            result = {
              success: false,
              message: `Unknown tool: ${name}`,
              error: "UNKNOWN_TOOL",
            };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
          isError: !result.success,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                message: `Error: ${error instanceof Error ? error.message : String(error)}`,
                error: "INTERNAL_ERROR",
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`Memoria MCP server v${VERSION} running on stdio`);
  }
}

// Run server
const server = new MemoriaMCPServer();
server.run().catch(console.error);
