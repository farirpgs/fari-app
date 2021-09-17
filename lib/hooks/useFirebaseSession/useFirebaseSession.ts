import { useContext, useEffect, useState } from "react";
import { InjectionsContext } from "../../contexts/InjectionsContext/InjectionsContext";
import { IScene, ISession } from "../useScene/IScene";
import { SafeFirebaseSession } from "./buildSafeFirebaseSession";

export type IFirebaseSession = {
  info: ISession;
  scene: IScene;
};

export function useFirebaseSessionTester() {
  const { fariFirebase } = useContext(InjectionsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  async function test(id: string | undefined) {
    try {
      const session = await fariFirebase.get<IFirebaseSession>(
        `/sessions/${id}`
      );

      if (session) {
        return true;
      }
      throw new Error("Session not found");
    } catch (error) {
      setError(error);
      console.error(error);
    }

    setLoading(false);
    return false;
  }

  return {
    state: { loading, error },
    actions: { test },
  };
}

export function useFirebaseSession(sessionId: string) {
  const { fariFirebase } = useContext(InjectionsContext);
  const firebaseSessionTester = useFirebaseSessionTester();

  const [firebaseSession, setFirebaseSession] = useState<IFirebaseSession>();

  useEffect(() => {
    firebaseSessionTester.actions.test(sessionId);
  }, [sessionId]);

  useEffect(() => {
    const unsubscribe = fariFirebase.getAndWatch(
      `/sessions/${sessionId}`,
      (snapshot) => {
        const safeSession = SafeFirebaseSession.build(snapshot);
        setFirebaseSession(safeSession);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [sessionId]);

  function putSessionInfo(sessionInfo: ISession) {
    fariFirebase.put(`/sessions/${sessionId}/info`, sessionInfo);
  }
  function putScene(scene: IScene | undefined) {
    fariFirebase.put(`/sessions/${sessionId}/scene`, scene);
  }

  return {
    state: {
      error: firebaseSessionTester.state.error,
      loading: firebaseSessionTester.state.loading,
      firebaseSession,
    },
    actions: {
      putSessionInfo,
      putScene,
    },
  };
}
