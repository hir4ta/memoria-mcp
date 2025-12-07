export const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #0d1117;
    color: #c9d1d9;
    line-height: 1.6;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 24px; margin-bottom: 8px; color: #f0f6fc; }
  .subtitle { color: #8b949e; margin-bottom: 24px; }

  /* Table */
  table { width: 100%; border-collapse: collapse; background: #161b22; border-radius: 6px; overflow: hidden; }
  th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #21262d; }
  th { background: #21262d; color: #8b949e; font-weight: 600; font-size: 12px; text-transform: uppercase; }
  tr:hover { background: #1f2428; }
  tr:last-child td { border-bottom: none; }

  /* Status badges */
  .status { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
  .status.completed { background: #238636; color: #fff; }
  .status.in_progress { background: #1f6feb; color: #fff; }

  /* Empty state */
  .empty { text-align: center; padding: 48px; color: #8b949e; }

  /* Links */
  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .back { font-size: 14px; }

  /* Meta info */
  .meta { color: #8b949e; font-size: 14px; margin-bottom: 24px; margin-top: 16px; }
  .meta span { margin-right: 16px; }

  /* Sections */
  .section { background: #161b22; border-radius: 6px; padding: 16px; margin-bottom: 16px; }
  .section-title { font-size: 14px; font-weight: 600; color: #8b949e; margin-bottom: 12px; text-transform: uppercase; }
  .summary { white-space: pre-wrap; font-size: 14px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; font-size: 14px; }

  /* Checkpoints */
  .checkpoint { padding: 12px; background: #21262d; border-radius: 4px; margin-bottom: 8px; }
  .checkpoint-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .checkpoint-num { font-weight: 600; color: #58a6ff; }
  .checkpoint-date { color: #8b949e; font-size: 12px; }
  .checkpoint-note { font-size: 14px; color: #c9d1d9; }

  /* Solutions */
  .solution { padding: 12px; background: #21262d; border-radius: 4px; margin-bottom: 8px; border-left: 3px solid #8b949e; }
  .solution.success { border-left-color: #238636; }
  .solution.failed { border-left-color: #f85149; }
  .solution div { margin-bottom: 4px; font-size: 14px; }
`;
