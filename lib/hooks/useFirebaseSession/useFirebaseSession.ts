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
  const [ready, setReady] = useState(false);

  async function test(id: string | undefined) {
    try {
      const session = await fariFirebase.get<IFirebaseSession>(
        `/sessions/${id}`
      );

      if (session) {
        setReady(true);
        return true;
      }
      throw new Error("Session not found");
    } catch (error) {
      setError(error);
      console.error(error);
    }

    setLoading(false);
    setReady(false);
    return false;
  }

  return {
    state: { loading, error, ready },
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
  function put(path: string, payload: any) {
    fariFirebase.put(`/sessions/${sessionId}/${path}`, payload);
  }
  function clearScene() {
    fariFirebase.remove(`/sessions/${sessionId}/scene`);
  }
  function putScene(scene: IScene | undefined) {
    fariFirebase.put(`/sessions/${sessionId}/scene`, scene);
  }

  function addPlayer(id: string, name: string) {
    const player = {
      id: id,
      playerName: name,
      character: undefined,
      rolls: [],
      isGM: false,
      points: 3,
      private: false,
      playedDuringTurn: false,
      offline: false,
    };

    fariFirebase.put(`/sessions/${sessionId}/info/players/${id}`, player);
  }

  return {
    state: {
      ready: firebaseSessionTester.state.ready,
      error: firebaseSessionTester.state.error,
      loading: firebaseSessionTester.state.loading,
      firebaseSession,
    },
    actions: {
      putSessionInfo,
      putScene,
      put,
      addPlayer,
      clearScene,
    },
  };
}
