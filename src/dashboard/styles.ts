export const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f9fafb;
    color: #111827;
    line-height: 1.6;
  }
  .container { max-width: 900px; margin: 0 auto; padding: 24px; }

  /* Header */
  h1 { font-size: 1.875rem; font-weight: 600; color: #111827; margin-bottom: 6px; }
  .subtitle { color: #4b5563; font-size: 1rem; margin-bottom: 32px; }

  /* Cards */
  .card {
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 0.6);
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;
    transition: all 0.15s ease;
  }
  .card:hover {
    border-color: #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 16px;
  }
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
  }
  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-summary {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 8px;
  }
  .card-meta {
    font-size: 0.75rem;
    color: #6b7280;
  }
  .card-project {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* Status badges */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    flex-shrink: 0;
  }
  .badge-completed { background: #2D5F3F; color: #fff; }
  .badge-in-progress { background: #FF7759; color: #fff; }
  .badge-project { background: #A78BFA; color: #fff; padding: 2px 8px; }

  /* Empty state */
  .empty {
    text-align: center;
    padding: 64px 24px;
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 0.6);
    border-radius: 8px;
  }
  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .empty-icon svg { width: 40px; height: 40px; color: #9ca3af; }
  .empty-title { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 6px; }
  .empty-desc { font-size: 0.875rem; color: #4b5563; }

  /* Links */
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 20px;
  }
  .back-link:hover { color: #111827; text-decoration: none; }

  /* Breadcrumb */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    margin-bottom: 20px;
  }
  .breadcrumb a { color: #6b7280; }
  .breadcrumb a:hover { color: #111827; text-decoration: none; }
  .breadcrumb-sep { color: #9ca3af; }
  .breadcrumb-current { color: #111827; font-weight: 500; }

  /* Detail page header */
  .detail-header {
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 0.6);
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 16px;
    margin-bottom: 20px;
  }
  .detail-header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .detail-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    flex: 1;
    min-width: 0;
  }
  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    font-size: 0.875rem;
    color: #6b7280;
  }
  .detail-id {
    background: #f9fafb;
    color: #4b5563;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-family: monospace;
    border: 1px solid #e5e7eb;
  }

  /* Sections */
  .section {
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 0.6);
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    overflow: hidden;
  }
  .section-header {
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
  }
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
  }
  .section-title-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .section-title-icon svg { width: 20px; height: 20px; }
  .section-title-icon.purple { background: #f3e8ff; color: #A78BFA; }
  .section-title-icon.orange { background: #ffedd5; color: #FF7759; }
  .section-title-icon.blue { background: #dbeafe; color: #3b82f6; }
  .section-title-icon.red { background: #fee2e2; color: #ef4444; }
  .section-desc {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 4px;
  }
  .section-content { padding: 16px; }

  /* Summary */
  .summary {
    white-space: pre-wrap;
    font-size: 0.875rem;
    line-height: 1.7;
    color: #374151;
  }

  /* File list */
  .file-list { list-style: none; }
  .file-item {
    background: rgba(167, 139, 250, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.3);
    border-radius: 4px;
    padding: 6px 10px;
    margin-bottom: 6px;
    font-family: monospace;
    font-size: 0.75rem;
    color: #4b5563;
  }

  /* Decision list */
  .decision-item {
    background: rgba(255, 119, 89, 0.1);
    border: 1px solid rgba(255, 119, 89, 0.3);
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 8px;
  }
  .decision-text { font-size: 0.875rem; font-weight: 500; color: #111827; }
  .decision-rationale { font-size: 0.75rem; color: #4b5563; margin-top: 6px; }
  .decision-category {
    display: inline-block;
    background: #ffedd5;
    color: #9a3412;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    margin-top: 6px;
  }

  /* Checkpoints */
  .checkpoint-item {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 8px;
  }
  .checkpoint-header {
    font-size: 0.75rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 8px;
  }
  .checkpoint-note {
    font-size: 0.75rem;
    color: #4b5563;
    font-style: italic;
  }

  /* Solutions */
  .solution-item {
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 8px;
  }
  .solution-problem {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }
  .solution-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
  }
  .solution-text {
    font-size: 0.75rem;
    color: #4b5563;
    margin-top: 4px;
  }

  /* Git info */
  .git-info {
    background: rgba(59, 130, 246, 0.05);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 4px;
    padding: 12px;
  }
  .git-row {
    margin-bottom: 8px;
  }
  .git-row:last-child { margin-bottom: 0; }
  .git-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
  }
  .git-value {
    font-size: 0.75rem;
    color: #4b5563;
    margin-top: 2px;
  }
  .git-commit {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #fff;
    color: #2563eb;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.75rem;
    border: 1px solid #e5e7eb;
    text-decoration: none;
  }
  .git-commit:hover {
    border-color: #93c5fd;
    text-decoration: none;
  }
  .git-branch {
    display: inline-block;
    background: #dbeafe;
    color: #1e40af;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }
`;
