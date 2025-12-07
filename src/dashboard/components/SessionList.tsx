import React from "react";
import type { Session } from "../../types";
import { formatDate } from "../utils";

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (sessionId: string) => void;
}

export function SessionList({ sessions, onSelectSession }: SessionListProps) {
  return (
    <div className="container">
      <h1>Memoria</h1>
      <p className="subtitle">{sessions.length} sessions</p>

      {sessions.length === 0 ? (
        <div className="empty">No sessions yet</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Checkpoints</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{session.title}</td>
                <td>
                  <span className={`status ${session.status}`}>
                    {session.status}
                  </span>
                </td>
                <td>{session.checkpoints.length}</td>
                <td>{formatDate(session.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
