import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";
import { FariEntity } from "../../domains/fari-entity/FariEntity";

export function useStorageEntities<T>(props: {
  localStorage: Storage;
  key: string;
  migrationFunction: (entity: T) => T;
}) {
  const [entities, setEntities] = useState<Array<T>>(() => {
    const entities = FariEntity.loadEntitiesFromStorage<T>({
      key: props.key,
      localStorage: props.localStorage,
      migrationFunction: props.migrationFunction,
    });
    return entities;
  });

  useEffect(
    function syncLocalStorage() {
      try {
        const serialized = JSON.stringify(entities);
        props.localStorage.setItem(props.key, serialized);
      } catch (error) {
        console.error(error);
      }
    },
    [entities]
  );

  useEffect(function syncOtherTabLocalStorage() {
    window.addEventListener?.("storage", refreshStorage);

    return () => {
      window.removeEventListener?.("storage", refreshStorage);
    };

    function refreshStorage(event: StorageEvent) {
      if (event.key !== props.key) {
        return;
      }

      const entitiesFromStorage = FariEntity.loadEntitiesFromStorage<T>({
        key: props.key,
        localStorage: props.localStorage,
        migrationFunction: props.migrationFunction,
      });

      const isDeepEqual = isEqual(entities, entitiesFromStorage);

      if (!isDeepEqual) {
        setEntities(entitiesFromStorage);
      }
    }
  }, []);

  return [entities, setEntities] as const;
}
