// src/store/sessionStore.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { sessionEngine, type SessionState } from '../engine/sessionEngine';

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(() => sessionEngine.getState());

  useEffect(() => {
    const unsub = sessionEngine.subscribe(setState);
    return unsub;
  }, []);

  return (
    <SessionContext.Provider value={state}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
