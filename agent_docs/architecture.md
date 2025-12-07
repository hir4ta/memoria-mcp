# Architecture

## Data Flow

```
Claude Code → MCP Server (stdio) → handlers.ts → storage.ts → .memoria/*.json
```

## Storage Structure

```
.memoria/
├── config.json      # Project config + license key
├── index.json       # Lightweight session index
└── sessions/
    └── sess_xxx.json  # Full session data
```

## Key Files

| File | Purpose |
|------|---------|
| `src/server.ts` | MCP server entry point |
| `src/cli.ts` | CLI entry point |
| `src/tools.ts` | MCP tool definitions |
| `src/handlers.ts` | Tool implementation handlers |
| `src/storage.ts` | Local JSON file storage |
| `src/types.ts` | TypeScript type definitions |

## MCP Tools

| Tool | Free | Handler |
|------|:----:|---------|
| save_checkpoint | ✓ | `handleSaveCheckpoint` |
| save_session | ✓ | `handleSaveSession` |
| complete_session | ✓ | `handleCompleteSession` |
| continue_context | ✓ | `handleContinueContext` |
| get_session | ✓ | `handleGetSession` |
| semantic_search | Paid | `handleSemanticSearch` |
| find_related_sessions | Paid | `handleFindRelatedSessions` |
