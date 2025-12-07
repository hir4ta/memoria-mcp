import React, { useState, useEffect } from "react";
import { SessionList } from "./SessionList";
import { SessionDetail } from "./SessionDetail";
import type { Session } from "../../types";

interface AppProps {
  initialSessions: Session[];
  initialSessionId?: string;
}

export function App({ initialSessions, initialSessionId }: AppProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessionId || null
  );

  const selectedSession = selectedSessionId
    ? sessions.find((s) => s.id === selectedSessionId) || null
    : null;

  const handleBack = () => {
    setSelectedSessionId(null);
    // Update URL without page reload
    window.history.pushState({}, "", "/");
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // Update URL without page reload
    window.history.pushState({}, "", `/session/${sessionId}`);
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/session\/([^/]+)$/);
      if (match) {
        setSelectedSessionId(match[1]);
      } else {
        setSelectedSessionId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="app">
      {selectedSession ? (
        <SessionDetail session={selectedSession} onBack={handleBack} />
      ) : (
        <SessionList sessions={sessions} onSelectSession={handleSelectSession} />
      )}
    </div>
  );
}
