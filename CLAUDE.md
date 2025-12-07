# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Build

```bash
bun install
bun run build
```

## Architecture

Local-first MCP server with two entry points built with Bun targeting Node.js:

- `src/cli.ts` → CLI commands (`memoria-mcp init`, `memoria-mcp activate`, etc.)
- `src/server.ts` → MCP server that Claude Code connects to

### Key Files

| File | Purpose |
|------|---------|
| `src/server.ts` | MCP server entry point |
| `src/cli.ts` | CLI entry point |
| `src/tools.ts` | MCP tool definitions |
| `src/handlers.ts` | Tool implementation handlers |
| `src/storage.ts` | Local JSON file storage |
| `src/types.ts` | TypeScript type definitions |

### Data Flow

```
Claude Code → MCP Server (stdio) → handlers.ts → storage.ts → .memoria/*.json
```

### Storage Structure

Data is stored in `.memoria/` at project root:

```
.memoria/
├── config.json      # Project config + license key
├── index.json       # Lightweight session index
└── sessions/
    └── sess_xxx.json  # Full session data
```

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

## Adding New Features

1. Add type definitions to `src/types.ts`
2. Add tool definition to `src/tools.ts`
3. Add handler to `src/handlers.ts`
4. Register handler in `src/server.ts` switch statement
5. Run `bun run build`

## Testing

```bash
# Test CLI
bun run src/cli.ts --help
bun run src/cli.ts init

# Test MCP server manually
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | bun run src/server.ts
```
