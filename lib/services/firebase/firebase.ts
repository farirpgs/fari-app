import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  child,
  get,
  getDatabase,
  off,
  onValue,
  ref,
  set,
} from "firebase/database";

export const makeFariFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyB4bNhTI7cSSjOO-PWPfqULyIipDjmYRxM",
    authDomain: "fariapp.firebaseapp.com",
    databaseURL: "https://fariapp.firebaseio.com",
    projectId: "fariapp",
    storageBucket: "fariapp.appspot.com",
    messagingSenderId: "1014337909857",
    appId: "1:1014337909857:web:02c824a1def95c32702620",
    measurementId: "G-NFVS26VDRC",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const analytics = getAnalytics(app);

  return {
    async get<T>(path: string): Promise<T | null> {
      const db = ref(getDatabase());
      try {
        const snapshot = await get(child(db, path));
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    getAndWatch<T>(path: string, callback: (snapshot: T) => void) {
      const db = getDatabase();
      const watcher = ref(db, path);
      onValue(watcher, (snapshot) => {
        const data = snapshot.val();
        callback(data);
      });

      return () => {
        off(watcher);
      };
    },
    put<T>(path: string, body: T) {
      if (!body) {
        return;
      }
      const db = getDatabase();
      const bodyWithoutUndefined = JSON.parse(JSON.stringify(body));
      set(ref(db, path), bodyWithoutUndefined);
    },
    putAsString<T>(path: string, body: T) {
      const db = getDatabase();
      set(ref(db, path), JSON.stringify(body));
    },
  };
};

export type IFariFirebase = ReturnType<typeof makeFariFirebase>;
