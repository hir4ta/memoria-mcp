# memoria-mcp

MCP server for saving and resuming Claude Code sessions.

## Installation

```bash
npm install -g memoria-mcp
```

## Setup

### 1. Add to Claude Code

```bash
claude mcp add memoria -- memoria-mcp-server
```

### 2. Initialize in your project

```bash
cd your-project
memoria-mcp init
```

### 3. Restart Claude Code

## Tools

| Tool | Description |
|------|-------------|
| `save_checkpoint` | Save incremental progress with checkpoints |
| `save_session` | Save a complete session |
| `complete_session` | Mark a session as completed |
| `continue_context` | List in-progress sessions |
| `get_session` | Get session details |

### Coming Soon

| Tool | Description |
|------|-------------|
| `semantic_search` | Search sessions |
| `find_related_sessions` | Find related sessions |

## CLI

```bash
memoria-mcp init        # Initialize .memoria/ in current directory
memoria-mcp init        # Initialize with project name
memoria-mcp status      # Show project status
```

## Data Storage

```text
.memoria/
├── config.json
├── index.json
└── sessions/
    └── sess_xxx.json
```

## License

MIT
