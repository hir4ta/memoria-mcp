/**
 * MCP Tool definitions for memoria-mcp
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "save_checkpoint",
    description: `Save a checkpoint for the current session. Use this to save work in progress.

**Before calling:** Create a git commit first to version your code changes.

**Workflow:**
- First checkpoint: Creates new Session + Checkpoint #1
- Subsequent checkpoints: Adds Checkpoint #2, #3, etc. to existing Session

**Summary Structure (REQUIRED):**
First line = Session title (max 100 chars, in user's language)

Then include sections:
- ## Work Overview
- ## Implementation Details
- ## Technical Details
- ## Deliverables
- ## Issues Encountered
- ## Key Decisions
- ## Next Steps

**CRITICAL:** Populate structured fields (attemptedSolutions, rejectedApproaches, blockers) to preserve problem-solving history for auto-compact recovery.`,
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "Session ID for existing session. Leave empty for first checkpoint.",
        },
        summary: {
          type: "string",
          description: "Comprehensive summary. First line becomes session title.",
        },
        incremental_note: {
          type: "string",
          description: "Note describing what was added since last checkpoint.",
        },
        filesModified: {
          type: "array",
          description: "All files modified (cumulative)",
          items: { type: "string" },
        },
        filesRead: {
          type: "array",
          description: "Files read during session",
          items: { type: "string" },
        },
        keyDecisions: {
          type: "array",
          description: "Key decisions made",
          items: {
            oneOf: [
              { type: "string" },
              {
                type: "object",
                properties: {
                  decision: { type: "string" },
                  rationale: { type: "string" },
                  category: { type: "string" },
                },
                required: ["decision"],
              },
            ],
          },
        },
        conversationText: {
          type: "string",
          description: "Complete conversation history for search indexing.",
        },
        completedTasks: {
          type: "array",
          items: { type: "string" },
        },
        incompleteTasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              task: { type: "string" },
              activeForm: { type: "string" },
              status: { type: "string", enum: ["not_started", "in_progress", "blocked"] },
              priority: { type: "number" },
              reason: { type: "string" },
              nextAction: { type: "string" },
              relatedFiles: { type: "array", items: { type: "string" } },
              estimatedEffort: { type: "string", enum: ["small", "medium", "large"] },
            },
            required: ["task", "status", "priority"],
          },
        },
        blockers: {
          type: "array",
          items: {
            oneOf: [
              { type: "string" },
              {
                type: "object",
                properties: {
                  blocker: { type: "string" },
                  resolution: { type: "string" },
                },
                required: ["blocker"],
              },
            ],
          },
        },
        dependencies: {
          type: "array",
          items: {
            oneOf: [
              { type: "string" },
              {
                type: "object",
                properties: {
                  dependency: { type: "string" },
                  type: { type: "string" },
                  version: { type: "string" },
                },
                required: ["dependency"],
              },
            ],
          },
        },
        attemptedSolutions: {
          type: "array",
          description: "Solutions attempted (success/failed). CRITICAL for avoiding repeated debugging.",
          items: {
            type: "object",
            properties: {
              problem: { type: "string" },
              solution: { type: "string" },
              outcome: { type: "string" },
            },
            required: ["problem", "solution", "outcome"],
          },
        },
        rejectedApproaches: {
          type: "array",
          description: "Approaches rejected and why. Prevents repeating mistakes.",
          items: {
            type: "object",
            properties: {
              approach: { type: "string" },
              reason: { type: "string" },
            },
            required: ["approach", "reason"],
          },
        },
        toolOutputs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              toolName: { type: "string" },
              command: { type: "string" },
              output: { type: "string" },
              priority: { type: "string", enum: ["high", "medium", "low"] },
            },
            required: ["toolName"],
          },
        },
        contextState: {
          type: "object",
          properties: {
            currentFocus: { type: "string" },
            workPhase: { type: "string", enum: ["planning", "implementation", "testing", "debugging", "review", "completed"] },
            lastAction: { type: "string" },
            progressPercentage: { type: "number" },
          },
        },
      },
      required: ["summary", "filesModified", "keyDecisions", "conversationText"],
    },
  },
  {
    name: "save_session",
    description: `Save a complete session without checkpoints. Use for small, straightforward tasks.

**Before calling:** Create a git commit first.

Use when:
- Small tasks (adding comments, fixing typos)
- Quick bug fixes
- Simple documentation updates

For larger tasks, use save_checkpoint instead.`,
    inputSchema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Complete summary. First line = session title.",
        },
        filesModified: {
          type: "array",
          items: { type: "string" },
        },
        filesRead: {
          type: "array",
          items: { type: "string" },
        },
        keyDecisions: {
          type: "array",
          items: {
            oneOf: [
              { type: "string" },
              {
                type: "object",
                properties: {
                  decision: { type: "string" },
                  rationale: { type: "string" },
                  category: { type: "string" },
                },
                required: ["decision"],
              },
            ],
          },
        },
        conversationText: { type: "string" },
        completedTasks: { type: "array", items: { type: "string" } },
        incompleteTasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              task: { type: "string" },
              status: { type: "string" },
              priority: { type: "number" },
            },
            required: ["task", "status", "priority"],
          },
        },
        blockers: { type: "array" },
        dependencies: { type: "array" },
        attemptedSolutions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              problem: { type: "string" },
              solution: { type: "string" },
              outcome: { type: "string" },
            },
            required: ["problem", "solution", "outcome"],
          },
        },
        rejectedApproaches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              approach: { type: "string" },
              reason: { type: "string" },
            },
            required: ["approach", "reason"],
          },
        },
        toolOutputs: { type: "array" },
        contextState: { type: "object" },
        duration: { type: "string" },
      },
      required: ["summary", "filesModified", "keyDecisions", "conversationText"],
    },
  },
  {
    name: "complete_session",
    description: `Smart command to complete work. Auto-detects checkpoint vs new session.

**Case 1: With checkpoints (session_id provided)**
- Marks session as completed
- Optional: Override summary with final_summary

**Case 2: Without checkpoints (no session_id)**
- Acts like save_session
- Required: summary, filesModified, keyDecisions, conversationText`,
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "Session ID from previous checkpoint. Leave empty for new work.",
        },
        final_summary: {
          type: "string",
          description: "Final summary to override existing (optional if session_id provided).",
        },
        summary: { type: "string" },
        filesModified: { type: "array", items: { type: "string" } },
        keyDecisions: { type: "array" },
        conversationText: { type: "string" },
        completedTasks: { type: "array", items: { type: "string" } },
        incompleteTasks: { type: "array" },
        blockers: { type: "array" },
        dependencies: { type: "array" },
        attemptedSolutions: { type: "array" },
        rejectedApproaches: { type: "array" },
        toolOutputs: { type: "array" },
        contextState: { type: "object" },
        duration: { type: "string" },
      },
      required: [],
    },
  },
  {
    name: "continue_context",
    description: `Load incomplete sessions to continue work. STEP 1 of 2-step recovery.

Use when:
- Auto-compact triggered
- Starting new chat to continue previous work
- User says "continue from last time"
- After /clear command

**2-Step Workflow:**
1. continue_context() → Get list of in-progress sessions
2. get_session(id) → Get full details including structured data`,
    inputSchema: {
      type: "object",
      properties: {
        project: {
          type: "string",
          description: "Optional project filter",
        },
      },
    },
  },
  {
    name: "get_session",
    description: `Retrieve complete session details by ID. Returns all checkpoints and structured data.

Use after continue_context or semantic_search to get full session details.`,
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "Session ID",
        },
      },
      required: ["session_id"],
    },
  },
  {
    name: "semantic_search",
    description: `Search sessions using natural language queries.

**NOTE:** This is a PAID feature ($2/month). Requires license key.
Run \`memoria-mcp activate <key>\` to enable.

Without license: Returns error with activation instructions.
With license: Uses BM25 + semantic search via cloud API.`,
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Natural language query",
        },
        limit: {
          type: "number",
          description: "Number of results (default: 10)",
        },
        project: {
          type: "string",
          description: "Filter by project name",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "find_related_sessions",
    description: `Find sessions related to current work.

**NOTE:** This is a PAID feature ($2/month). Requires license key.

Searches by:
- File overlap: Sessions that modified same files
- Keywords: Sessions with similar topics
- Session ID: Find similar sessions`,
    inputSchema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          description: "Find sessions that modified these files",
          items: { type: "string" },
        },
        keywords: {
          type: "array",
          description: "Find sessions matching these keywords",
          items: { type: "string" },
        },
        sessionId: {
          type: "string",
          description: "Find sessions related to this session",
        },
        maxResults: {
          type: "number",
          description: "Max results (default: 5)",
        },
      },
    },
  },
];
