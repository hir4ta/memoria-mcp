# memoria-mcp

Local-first MCP server for AI coding session management. Save, search, and resume your Claude Code sessions.

## Features

- **Save Sessions** - Track your coding sessions with checkpoints
- **Local Storage** - All data stored in `.memoria/` at project root
- **No Account Required** - Works offline, no signup needed
- **Search** (Paid) - BM25 + semantic search across sessions

## Installation

### 1. Add to Claude Code

```bash
claude mcp add memoria -- npx -y memoria-mcp-server
```

### 2. Initialize in your project

```bash
cd your-project
npx memoria-mcp init
```

This creates a `.memoria/` directory to store your sessions.

### 3. Restart Claude Code

The MCP server will now be available in your project.

## Usage

Once installed, Claude Code will automatically have access to these tools:

### Free Tools

| Tool | Description |
|------|-------------|
| `save_checkpoint` | Save incremental progress with checkpoints |
| `save_session` | Save a complete session (no checkpoints) |
| `complete_session` | Mark a session as completed |
| `continue_context` | List in-progress sessions to resume |
| `get_session` | Get full session details |

### Paid Tools ($2/month)

| Tool | Description |
|------|-------------|
| `semantic_search` | Natural language search across sessions |
| `find_related_sessions` | Find similar past work |

To enable paid features:
```bash
npx memoria-mcp activate <your-license-key>
```

Get your license key at [memoria.dev/pricing](https://memoria.dev/pricing)

## CLI Commands

```bash
# Initialize in current directory
npx memoria-mcp init [project-name]

# Activate license for search features
npx memoria-mcp activate <license-key>

# Show project status
npx memoria-mcp status

# Start local dashboard (coming soon)
npx memoria-mcp dashboard
```

## Data Storage

Sessions are stored in `.memoria/` at your project root:

```
.memoria/
├── config.json      # Project configuration
├── index.json       # Session index
├── sessions/        # Individual session files
│   ├── sess_xxx.json
│   └── sess_yyy.json
└── .gitignore       # Recommends ignoring sessions/
```

### Git Integration

By default, `.memoria/.gitignore` excludes session data. You can:

1. **Keep sessions local** (default) - Session data stays on your machine
2. **Version control sessions** - Remove entries from `.memoria/.gitignore`

## Example Workflow

```
You: "Help me implement user authentication"

Claude: [works on implementation...]

You: "Save a checkpoint"

Claude: [calls save_checkpoint with summary, files modified, etc.]

--- Next day ---

You: "Continue from where we left off"

Claude: [calls continue_context, then get_session to restore full context]
```

## License

MIT
