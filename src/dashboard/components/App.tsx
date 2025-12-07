import React from "react";
import { SessionList } from "./SessionList";
import { SessionDetail } from "./SessionDetail";
import type { Session } from "../../types";

interface AppProps {
  sessions: Session[];
  selectedSession?: Session;
}

export function App({ sessions, selectedSession }: AppProps) {
  return (
    <div className="app">
      {selectedSession ? (
        <SessionDetail session={selectedSession} />
      ) : (
        <SessionList sessions={sessions} />
      )}
    </div>
  );
}
