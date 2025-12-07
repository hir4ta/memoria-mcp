/**
 * Tool handlers for memoria-mcp
 */

import type { Session, Checkpoint, ToolResponse } from "./types";
import {
  isInitialized,
  loadConfig,
  saveSession,
  loadSession,
  loadInProgressSessions,
  loadAllSessions,
  generateSessionId,
  generateCheckpointId,
  extractTitle,
} from "./storage";

/**
 * Handle save_checkpoint
 */
export function handleSaveCheckpoint(args: Record<string, unknown>): ToolResponse {
  if (!isInitialized()) {
    return {
      success: false,
      message: "Memoria not initialized. Run `memoria-mcp init` first.",
      error: "NOT_INITIALIZED",
    };
  }

  const config = loadConfig();
  if (!config) {
    return {
      success: false,
      message: "Failed to load config.",
      error: "CONFIG_ERROR",
    };
  }

  const sessionId = args.session_id as string | undefined;
  const summary = args.summary as string;
  const now = new Date().toISOString();

  let session: Session;
  let checkpointNumber: number;

  if (sessionId) {
    // Add checkpoint to existing session
    const existing = loadSession(sessionId);
    if (!existing) {
      return {
        success: false,
        message: `Session not found: ${sessionId}`,
        error: "SESSION_NOT_FOUND",
      };
    }

    checkpointNumber = existing.checkpoints.length + 1;
    const checkpoint: Checkpoint = {
      id: generateCheckpointId(),
      number: checkpointNumber,
      summary: summary,
      incrementalNote: args.incremental_note as string | undefined,
      createdAt: now,
    };

    // Update session with new data
    session = {
      ...existing,
      summary: summary,
      filesModified: (args.filesModified as string[]) || existing.filesModified,
      filesRead: (args.filesRead as string[]) || existing.filesRead,
      decisions: (args.keyDecisions as Session["decisions"]) || existing.decisions,
      completedTasks: (args.completedTasks as string[]) || existing.completedTasks,
      incompleteTasks: (args.incompleteTasks as Session["incompleteTasks"]) || existing.incompleteTasks,
      blockers: (args.blockers as Session["blockers"]) || existing.blockers,
      dependencies: (args.dependencies as Session["dependencies"]) || existing.dependencies,
      attemptedSolutions: (args.attemptedSolutions as Session["attemptedSolutions"]) || existing.attemptedSolutions,
      rejectedApproaches: (args.rejectedApproaches as Session["rejectedApproaches"]) || existing.rejectedApproaches,
      toolOutputs: (args.toolOutputs as Session["toolOutputs"]) || existing.toolOutputs,
      contextState: (args.contextState as Session["contextState"]) || existing.contextState,
      conversationText: (args.conversationText as string) || existing.conversationText,
      checkpoints: [...existing.checkpoints, checkpoint],
      updatedAt: now,
    };
  } else {
    // Create new session with first checkpoint
    const newSessionId = generateSessionId();
    checkpointNumber = 1;

    const checkpoint: Checkpoint = {
      id: generateCheckpointId(),
      number: 1,
      summary: summary,
      incrementalNote: args.incremental_note as string | undefined,
      createdAt: now,
    };

    session = {
      id: newSessionId,
      title: extractTitle(summary),
      project: config.project,
      status: "in_progress",
      summary: summary,
      filesModified: (args.filesModified as string[]) || [],
      filesRead: (args.filesRead as string[]) || [],
      decisions: (args.keyDecisions as Session["decisions"]) || [],
      completedTasks: (args.completedTasks as string[]) || [],
      incompleteTasks: (args.incompleteTasks as Session["incompleteTasks"]) || [],
      blockers: (args.blockers as Session["blockers"]) || [],
      dependencies: (args.dependencies as Session["dependencies"]) || [],
      attemptedSolutions: (args.attemptedSolutions as Session["attemptedSolutions"]) || [],
      rejectedApproaches: (args.rejectedApproaches as Session["rejectedApproaches"]) || [],
      toolOutputs: (args.toolOutputs as Session["toolOutputs"]) || [],
      contextState: args.contextState as Session["contextState"],
      conversationText: args.conversationText as string,
      checkpoints: [checkpoint],
      createdAt: now,
      updatedAt: now,
    };
  }

  saveSession(session);

  return {
    success: true,
    message: `Checkpoint #${checkpointNumber} saved successfully.`,
    data: {
      session_id: session.id,
      checkpoint_number: checkpointNumber,
      title: session.title,
    },
  };
}

/**
 * Handle save_session
 */
export function handleSaveSession(args: Record<string, unknown>): ToolResponse {
  if (!isInitialized()) {
    return {
      success: false,
      message: "Memoria not initialized. Run `memoria-mcp init` first.",
      error: "NOT_INITIALIZED",
    };
  }

  const config = loadConfig();
  if (!config) {
    return {
      success: false,
      message: "Failed to load config.",
      error: "CONFIG_ERROR",
    };
  }

  const summary = args.summary as string;
  const now = new Date().toISOString();

  const session: Session = {
    id: generateSessionId(),
    title: extractTitle(summary),
    project: config.project,
    status: "completed",
    summary: summary,
    filesModified: (args.filesModified as string[]) || [],
    filesRead: (args.filesRead as string[]) || [],
    decisions: (args.keyDecisions as Session["decisions"]) || [],
    completedTasks: (args.completedTasks as string[]) || [],
    incompleteTasks: (args.incompleteTasks as Session["incompleteTasks"]) || [],
    blockers: (args.blockers as Session["blockers"]) || [],
    dependencies: (args.dependencies as Session["dependencies"]) || [],
    attemptedSolutions: (args.attemptedSolutions as Session["attemptedSolutions"]) || [],
    rejectedApproaches: (args.rejectedApproaches as Session["rejectedApproaches"]) || [],
    toolOutputs: (args.toolOutputs as Session["toolOutputs"]) || [],
    contextState: args.contextState as Session["contextState"],
    conversationText: args.conversationText as string,
    checkpoints: [],
    createdAt: now,
    updatedAt: now,
    completedAt: now,
    duration: args.duration as string | undefined,
  };

  saveSession(session);

  return {
    success: true,
    message: "Session saved successfully.",
    data: {
      session_id: session.id,
      title: session.title,
    },
  };
}

/**
 * Handle complete_session
 */
export function handleCompleteSession(args: Record<string, unknown>): ToolResponse {
  const sessionId = args.session_id as string | undefined;

  if (sessionId) {
    // Complete existing session
    const session = loadSession(sessionId);
    if (!session) {
      return {
        success: false,
        message: `Session not found: ${sessionId}`,
        error: "SESSION_NOT_FOUND",
      };
    }

    const now = new Date().toISOString();
    const finalSummary = args.final_summary as string | undefined;

    const updated: Session = {
      ...session,
      status: "completed",
      summary: finalSummary || session.summary,
      title: finalSummary ? extractTitle(finalSummary) : session.title,
      updatedAt: now,
      completedAt: now,
      duration: (args.duration as string) || session.duration,
    };

    saveSession(updated);

    return {
      success: true,
      message: "Session completed successfully.",
      data: {
        session_id: updated.id,
        title: updated.title,
        checkpoints: updated.checkpoints.length,
      },
    };
  } else {
    // No session_id - act like save_session
    return handleSaveSession(args);
  }
}

/**
 * Handle continue_context
 */
export function handleContinueContext(args: Record<string, unknown>): ToolResponse {
  if (!isInitialized()) {
    return {
      success: false,
      message: "Memoria not initialized. Run `memoria-mcp init` first.",
      error: "NOT_INITIALIZED",
    };
  }

  const projectFilter = args.project as string | undefined;
  let sessions = loadInProgressSessions();

  if (projectFilter) {
    sessions = sessions.filter((s) => s.project === projectFilter);
  }

  // Return lightweight session list
  const sessionList = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    project: s.project,
    status: s.status,
    checkpoints: s.checkpoints.length,
    updatedAt: s.updatedAt,
    createdAt: s.createdAt,
  }));

  return {
    success: true,
    message: `Found ${sessionList.length} in-progress session(s).`,
    data: {
      sessions: sessionList,
    },
  };
}

/**
 * Handle get_session
 */
export function handleGetSession(args: Record<string, unknown>): ToolResponse {
  if (!isInitialized()) {
    return {
      success: false,
      message: "Memoria not initialized. Run `memoria-mcp init` first.",
      error: "NOT_INITIALIZED",
    };
  }

  const sessionId = args.session_id as string;
  if (!sessionId) {
    return {
      success: false,
      message: "session_id is required.",
      error: "MISSING_SESSION_ID",
    };
  }

  const session = loadSession(sessionId);
  if (!session) {
    return {
      success: false,
      message: `Session not found: ${sessionId}`,
      error: "SESSION_NOT_FOUND",
    };
  }

  return {
    success: true,
    message: "Session retrieved successfully.",
    data: {
      session: session,
    },
  };
}

/**
 * Handle semantic_search (PAID feature)
 */
export function handleSemanticSearch(args: Record<string, unknown>): ToolResponse {
  if (!isInitialized()) {
    return {
      success: false,
      message: "Memoria not initialized. Run `memoria-mcp init` first.",
      error: "NOT_INITIALIZED",
    };
  }

  const config = loadConfig();
  if (!config?.licenseKey) {
    return {
      success: false,
      message: `Search is a paid feature ($2/month).

To enable:
1. Get a license key at https://memoria.dev/pricing
2. Run: memoria-mcp activate <your-license-key>

This supports continued development of memoria-mcp.`,
      error: "LICENSE_REQUIRED",
    };
  }

  // TODO: Implement cloud API call for search
  // For now, return placeholder
  return {
    success: false,
    message: "Search API not yet implemented. Coming soon!",
    error: "NOT_IMPLEMENTED",
  };
}

/**
 * Handle find_related_sessions (PAID feature)
 */
export function handleFindRelatedSessions(args: Record<string, unknown>): ToolResponse {
  if (!isInitialized()) {
    return {
      success: false,
      message: "Memoria not initialized. Run `memoria-mcp init` first.",
      error: "NOT_INITIALIZED",
    };
  }

  const config = loadConfig();
  if (!config?.licenseKey) {
    return {
      success: false,
      message: `Find related sessions is a paid feature ($2/month).

To enable:
1. Get a license key at https://memoria.dev/pricing
2. Run: memoria-mcp activate <your-license-key>

This supports continued development of memoria-mcp.`,
      error: "LICENSE_REQUIRED",
    };
  }

  // TODO: Implement cloud API call for related sessions
  return {
    success: false,
    message: "Related sessions API not yet implemented. Coming soon!",
    error: "NOT_IMPLEMENTED",
  };
}
