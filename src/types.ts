/**
 * Type definitions for memoria-mcp
 */

// Session status
export type SessionStatus = "in_progress" | "completed";

// Work phase
export type WorkPhase = "planning" | "implementation" | "testing" | "debugging" | "review" | "completed";

// Task status
export type TaskStatus = "not_started" | "in_progress" | "blocked";

// Priority level
export type Priority = "high" | "medium" | "low";

// Effort estimation
export type Effort = "small" | "medium" | "large";

// Structured decision
export interface Decision {
  decision: string;
  rationale?: string;
  category?: string;
}

// Structured blocker
export interface Blocker {
  blocker: string;
  resolution?: string;
}

// Structured dependency
export interface Dependency {
  dependency: string;
  type?: string;
  version?: string;
}

// Attempted solution
export interface AttemptedSolution {
  problem: string;
  solution: string;
  outcome: string;
}

// Rejected approach
export interface RejectedApproach {
  approach: string;
  reason: string;
}

// Tool output
export interface ToolOutput {
  toolName: string;
  command?: string;
  output?: string;
  priority?: Priority;
}

// Incomplete task
export interface IncompleteTask {
  task: string;
  activeForm?: string;
  status: TaskStatus;
  priority: number;
  reason?: string;
  nextAction?: string;
  relatedFiles?: string[];
  estimatedEffort?: Effort;
}

// Context state
export interface ContextState {
  currentFocus?: string;
  workPhase?: WorkPhase;
  lastAction?: string;
  progressPercentage?: number;
}

// Checkpoint
export interface Checkpoint {
  id: string;
  number: number;
  summary: string;
  incrementalNote?: string;
  createdAt: string;
}

// Session
export interface Session {
  id: string;
  title: string;
  project: string;
  status: SessionStatus;
  summary: string;

  // Files
  filesModified: string[];
  filesRead: string[];

  // Structured data
  decisions: (string | Decision)[];
  completedTasks: string[];
  incompleteTasks: IncompleteTask[];
  blockers: (string | Blocker)[];
  dependencies: (string | Dependency)[];
  attemptedSolutions: AttemptedSolution[];
  rejectedApproaches: RejectedApproach[];
  toolOutputs: ToolOutput[];

  // Context
  contextState?: ContextState;
  conversationText?: string;

  // Checkpoints
  checkpoints: Checkpoint[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  duration?: string;

  // Git info
  gitBranch?: string;
  gitCommit?: string;
}

// Config stored in .memoria/config.json
export interface MemoriaConfig {
  version: string;
  project: string;
  licenseKey?: string;
  createdAt: string;
}

// Tool response
export interface ToolResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}
