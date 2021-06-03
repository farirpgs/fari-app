import { useEffect, useState } from "react";
import { FariEntity } from "../../domains/fari-entity/FariEntity";

export function useStorageEntity<T>(props: {
  defaulValue: T;
  localStorage: Storage;
  key: string;
  migrationFunction?: (entity: T) => T;
}) {
  const [entity, setEntity] = useState<T>(() => {
    const newEntity = FariEntity.loadEntityFromStorage<T>({
      defaultValue: props.defaulValue,
      key: props.key,
      localStorage: props.localStorage,
      migrationFunction: props.migrationFunction,
    });
    return newEntity;
  });

  useEffect(
    function syncLocalStorage() {
      try {
        const serialized = JSON.stringify(entity);
        props.localStorage.setItem(props.key, serialized);
      } catch (error) {
        console.error(error);
      }
    },
    [entity]
  );

  useEffect(function syncOtherTabLocalStorage() {
    function refreshStorage() {
      const newEntity = FariEntity.loadEntityFromStorage<T>({
        defaultValue: props.defaulValue,
        key: props.key,
        localStorage: props.localStorage,
        migrationFunction: props.migrationFunction,
      });

      setEntity(newEntity);
    }

    window.addEventListener?.("storage", refreshStorage);

    return () => {
      window.removeEventListener?.("storage", refreshStorage);
    };
  }, []);

  return [entity, setEntity] as const;
}
