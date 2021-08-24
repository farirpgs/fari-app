import { getUnix } from "../../domains/dayjs/getDayJS";
import { FariEntity, IFariType } from "../../domains/fari-entity/FariEntity";
import { Id } from "../../domains/Id/Id";
import { useGroups } from "../useGroups/useGroups";
import { useStorageEntities } from "../useStorageEntities/useStorageEntities";

export function useAppEntity<
  T extends { id: string | undefined; name: string; group: string | undefined }
>(props: {
  fariType: IFariType;
  localStorageKey: string;
  onMakeEntity?: () => T;
  onMakeTemplate: (entity: T) => Omit<T, "id"> & { id: undefined };
  onDuplicate: (entity: T) => T;
  onMigration: (entity: T) => T;
  localStorage: Storage | undefined;
}) {
  const localStorage = props?.localStorage ?? window.localStorage;

  const [entities, setEntities] = useStorageEntities<T>({
    key: props.localStorageKey,
    localStorage: localStorage,
    migrationFunction: props.onMigration,
  });

  const groups = useGroups(entities, (s) => s.group);

  function add() {
    if (!props.onMakeEntity) {
      throw new Error("onMakeEntity is not defined.");
    }
    const newEntity: T = props.onMakeEntity();
    setEntities((draft: Array<T>) => {
      return [newEntity, ...draft];
    });
    return newEntity;
  }

  function upsert(entity: T | undefined) {
    if (!entity) {
      return;
    }
    const exists = entities.find((s) => s.id === entity.id);

    const id = entity.id || Id.generate(); // If the file was exported without an id, it was exported as a template
    const entityToUpsert = {
      ...entity,
      id: id,
      lastUpdated: getUnix(),
    };
    if (!exists) {
      setEntities((draft: Array<T>) => {
        return [entityToUpsert, ...draft];
      });
    } else {
      setEntities((draft: Array<T>) => {
        return draft.map((c) => {
          if (c.id === entity.id) {
            return entityToUpsert;
          }
          return c;
        });
      });
    }
    return entityToUpsert;
  }

  function remove(id: string | undefined) {
    setEntities((draft: Array<T>) => {
      return draft.filter((s) => s.id !== id);
    });
  }

  function duplicate(id: string | undefined) {
    const match = entities.find((s) => s.id === id);
    if (!match) {
      return;
    }
    const newEntity = props.onDuplicate(match);
    setEntities((draft: Array<T>) => {
      return [...draft, newEntity];
    });
    return newEntity;
  }

  async function importEntity(entityFile: FileList | null) {
    const entityToImport = await FariEntity.import<T>({
      filesToImport: entityFile,
      fariType: props.fariType,
    });
    const migratedEntity = props.onMigration(entityToImport);
    const match = entities.find((s) => s.id === migratedEntity.id);
    return { entity: migratedEntity, exists: !!match };
  }

  function exportEntity(entity: T) {
    FariEntity.export({
      element: entity,
      fariType: props.fariType,
      name: entity.name,
    });
  }

  function exportEntityAsTemplate(entity: T) {
    const template = props.onMakeTemplate(entity);
    FariEntity.export({
      element: template,
      fariType: props.fariType,
      name: entity.name,
    });
  }

  return {
    state: {
      entities: entities,
      groups: groups,
    },
    actions: {
      setEntities,
      add,
      upsert,
      remove,
      duplicate,
      importEntity,
      exportEntity,
      exportEntityAsTemplate,
    },
  };
}
