import React from "react";
import type { Session } from "../../types";
import { formatDate } from "../utils";

interface SessionDetailProps {
  session: Session;
  onBack: () => void;
}

export function SessionDetail({ session, onBack }: SessionDetailProps) {
  return (
    <div className="container">
      <a href="#" className="back" onClick={(e) => { e.preventDefault(); onBack(); }}>
        ← Back
      </a>
      <h1>{session.title}</h1>
      <div className="meta">
        <span className={`status ${session.status}`}>{session.status}</span>
        <span>Project: {session.project}</span>
        <span>Created: {formatDate(session.createdAt)}</span>
        {session.completedAt && (
          <span>Completed: {formatDate(session.completedAt)}</span>
        )}
      </div>

      <Section title="Summary">
        <div className="summary">{session.summary}</div>
      </Section>

      {session.filesModified.length > 0 && (
        <Section title={`Files Modified (${session.filesModified.length})`}>
          <ul>
            {session.filesModified.map((file, i) => (
              <li key={i}>{file}</li>
            ))}
          </ul>
        </Section>
      )}

      {session.decisions.length > 0 && (
        <Section title={`Key Decisions (${session.decisions.length})`}>
          <ul>
            {session.decisions.map((decision, i) => (
              <li key={i}>
                {typeof decision === "string" ? (
                  decision
                ) : (
                  <>
                    <strong>{decision.decision}</strong>
                    {decision.rationale && ` - ${decision.rationale}`}
                  </>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {session.checkpoints.length > 0 && (
        <Section title={`Checkpoints (${session.checkpoints.length})`}>
          {session.checkpoints.map((checkpoint) => (
            <div key={checkpoint.id} className="checkpoint">
              <div className="checkpoint-header">
                <span className="checkpoint-num">#{checkpoint.number}</span>
                <span className="checkpoint-date">
                  {formatDate(checkpoint.createdAt)}
                </span>
              </div>
              {checkpoint.incrementalNote && (
                <p className="checkpoint-note">{checkpoint.incrementalNote}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {session.attemptedSolutions.length > 0 && (
        <Section title={`Attempted Solutions (${session.attemptedSolutions.length})`}>
          {session.attemptedSolutions.map((solution, i) => (
            <div
              key={i}
              className={`solution ${
                solution.outcome.startsWith("success")
                  ? "success"
                  : solution.outcome.startsWith("failed")
                  ? "failed"
                  : ""
              }`}
            >
              <div className="solution-problem">
                <strong>Problem:</strong> {solution.problem}
              </div>
              <div className="solution-solution">
                <strong>Solution:</strong> {solution.solution}
              </div>
              <div className="solution-outcome">
                <strong>Outcome:</strong> {solution.outcome}
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="section">
      <div className="section-title">{title}</div>
      {children}
    </div>
  );
}
