import React, { useContext, useState } from "react";

export interface ILiveSession {
  label: string;
  description: string;
}

export const StoreContext = React.createContext({});

export function useStoreContext(): ReturnType<typeof _useStore> {
  return (useContext(StoreContext) as unknown) as any;
}

export function _useStore() {
  const [liveSessions, setLiveSessions] = useState<{
    [url: string]: ILiveSession;
  }>({});

  function addLiveSession(session: {
    label: string;
    description: string;
    pathname: string;
  }) {
    setLiveSessions(liveSessions => {
      return {
        ...liveSessions,
        [session.pathname]: {
          label: session.label,
          description: session.description
        }
      };
    });
  }

  return {
    session: {
      liveSessions,
      addLiveSession
    }
  };
}
