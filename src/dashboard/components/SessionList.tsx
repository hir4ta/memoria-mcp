import React from "react";
import type { Session } from "../../types";
import { formatDate } from "../utils";

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <div className="container">
      <h1>Memoria</h1>
      <p className="subtitle">{sessions.length} sessions</p>

      {sessions.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p className="empty-title">No sessions yet</p>
          <p className="empty-desc">Sessions will appear here once you start using Memoria MCP</p>
        </div>
      ) : (
        <div>
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <a href={`/session/${session.id}`} className="card-link">
                <div className="card-header">
                  <span className="card-title">{session.title}</span>
                  <span className={`badge ${session.status === "completed" ? "badge-completed" : "badge-in-progress"}`}>
                    {session.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                </div>
                {session.project && (
                  <div className="card-project">
                    <span>Project:</span>
                    <span className="badge badge-project">{session.project}</span>
                  </div>
                )}
                <p className="card-summary">{session.summary}</p>
                <div className="card-meta">
                  <span>Updated: {formatDate(session.updatedAt)}</span>
                  {session.checkpoints.length > 0 && (
                    <span> · {session.checkpoints.length} checkpoint{session.checkpoints.length > 1 ? "s" : ""}</span>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
