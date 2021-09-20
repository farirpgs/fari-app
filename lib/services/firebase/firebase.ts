import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  child,
  get,
  getDatabase,
  off,
  onValue,
  ref,
  remove,
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
    remove(path: string) {
      const db = getDatabase();
      remove(ref(db, path));
    },
    put<T>(path: string, body: T) {
      if (body === null || body === undefined) {
        return;
      }
      const db = getDatabase();

      const bodyWithoutUndefined = JSON.parse(JSON.stringify(body));
      set(ref(db, path), bodyWithoutUndefined);
    },
  };
};

export type IFariFirebase = ReturnType<typeof makeFariFirebase>;
