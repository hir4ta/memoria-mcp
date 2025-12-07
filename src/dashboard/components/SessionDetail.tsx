import React from "react";
import type { Session } from "../../types";
import { formatDate } from "../utils";

interface SessionDetailProps {
  session: Session;
}

// Icons as inline SVG
const FileIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const LightbulbIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const GitBranchIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CheckpointIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const GitHubIcon = () => (
  <svg fill="currentColor" viewBox="0 0 16 16" width="12" height="12">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

/**
 * Extract GitHub URL from git remote URL
 */
function getGitHubUrl(remoteUrl: string | null | undefined, commitHash: string | null | undefined): string | null {
  if (!remoteUrl || !commitHash) return null;

  try {
    let owner: string | undefined;
    let repo: string | undefined;

    const httpsMatch = remoteUrl.match(/github\.com[/:](.+?)\/(.+?)(\.git)?$/);
    if (httpsMatch) {
      owner = httpsMatch[1];
      repo = httpsMatch[2].replace(/\.git$/, '');
    }

    const sshMatch = remoteUrl.match(/git@github\.com:(.+?)\/(.+?)(\.git)?$/);
    if (sshMatch) {
      owner = sshMatch[1];
      repo = sshMatch[2].replace(/\.git$/, '');
    }

    if (owner && repo) {
      return `https://github.com/${owner}/${repo}/commit/${commitHash}`;
    }
  } catch (e) {
    // Ignore parse errors
  }

  return null;
}

export function SessionDetail({ session }: SessionDetailProps) {
  const gitInfo = (session as any).gitInfo;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <a href="/">Sessions</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{session.title}</span>
      </nav>

      {/* Header Card */}
      <div className="detail-header">
        <div className="detail-header-top">
          <h1 className="detail-title">{session.title}</h1>
          <span className={`badge ${session.status === "completed" ? "badge-completed" : "badge-in-progress"}`}>
            {session.status === "completed" ? "Completed" : "In Progress"}
          </span>
        </div>
        <div className="detail-meta">
          {session.project && (
            <span>
              Project: <span className="badge badge-project">{session.project}</span>
            </span>
          )}
          <span>ID: <code className="detail-id">{session.id}</code></span>
          <span>Created: {formatDate(session.createdAt)}</span>
          {session.completedAt && (
            <span>Completed: {formatDate(session.completedAt)}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="section">
        <div className="section-content">
          <div className="summary">{session.summary}</div>
        </div>
      </div>

      {/* Attempted Solutions - Most Important */}
      {session.attemptedSolutions.length > 0 && (
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-title-icon red"><AlertIcon /></span>
              Issues Encountered and Solutions
            </div>
            <p className="section-desc">Problems encountered and how they were resolved</p>
          </div>
          <div className="section-content">
            {session.attemptedSolutions.map((solution, i) => (
              <div key={i} className="solution-item">
                <div className="solution-problem">Issue {i + 1}: {solution.problem}</div>
                <div>
                  <span className="solution-label">Solution:</span>
                  <p className="solution-text">{solution.solution}</p>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className="solution-label">Outcome:</span>
                  <p className="solution-text">{solution.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Modified */}
      {session.filesModified.length > 0 && (
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-title-icon purple"><FileIcon /></span>
              Files Modified
            </div>
            <p className="section-desc">Files modified in this session</p>
          </div>
          <div className="section-content">
            <ul className="file-list">
              {session.filesModified.map((file, i) => (
                <li key={i} className="file-item">{file}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Key Decisions */}
      {session.decisions.length > 0 && (
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-title-icon orange"><LightbulbIcon /></span>
              Key Decisions
            </div>
            <p className="section-desc">Important decisions made in this session</p>
          </div>
          <div className="section-content">
            {session.decisions.map((decision, i) => (
              <div key={i} className="decision-item">
                <p className="decision-text">
                  {typeof decision === "string" ? decision : decision.decision}
                </p>
                {typeof decision !== "string" && decision.rationale && (
                  <p className="decision-rationale">Rationale: {decision.rationale}</p>
                )}
                {typeof decision !== "string" && decision.category && (
                  <span className="decision-category">{decision.category}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Git Info */}
      {gitInfo && (gitInfo.commitHash || gitInfo.branch) && (
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-title-icon blue"><GitBranchIcon /></span>
              Git Information
            </div>
            <p className="section-desc">Commit information related to this session</p>
          </div>
          <div className="section-content">
            <div className="git-info">
              {gitInfo.commitHash && (
                <div className="git-row">
                  <span className="git-label">Commit: </span>
                  {(() => {
                    const githubUrl = getGitHubUrl(gitInfo.remoteUrl, gitInfo.commitHash);
                    const shortHash = gitInfo.commitHash.substring(0, 7);
                    return githubUrl ? (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="git-commit">
                        {shortHash} <GitHubIcon />
                      </a>
                    ) : (
                      <code className="detail-id">{shortHash}</code>
                    );
                  })()}
                </div>
              )}
              {gitInfo.branch && (
                <div className="git-row">
                  <span className="git-label">Branch: </span>
                  <span className="git-branch">{gitInfo.branch}</span>
                </div>
              )}
              {gitInfo.message && (
                <div className="git-row">
                  <span className="git-label">Message:</span>
                  <p className="git-value">{gitInfo.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkpoints */}
      {session.checkpoints.length > 0 && (
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-title-icon blue"><CheckpointIcon /></span>
              Checkpoints
            </div>
            <p className="section-desc">Progress checkpoints saved during this session</p>
          </div>
          <div className="section-content">
            {session.checkpoints.map((checkpoint) => (
              <div key={checkpoint.id} className="checkpoint-item">
                <div className="checkpoint-header">
                  Checkpoint #{checkpoint.number} - {formatDate(checkpoint.createdAt)}
                </div>
                {checkpoint.incrementalNote && (
                  <p className="checkpoint-note">{checkpoint.incrementalNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
