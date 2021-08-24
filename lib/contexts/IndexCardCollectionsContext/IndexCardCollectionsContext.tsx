import React, { useMemo } from "react";
import { IndexCardCollectionFactory } from "../../domains/index-card-collection/IndexCardCollectionFactory";
import { useAppEntity } from "../../hooks/useAppEntity/useAppEntity";
import { defaultIndexCardCollection } from "./sceneButtonTemplates";

export const IndexCardCollectionsContext = React.createContext<
  ReturnType<typeof useIndexCardCollections>
>(undefined as any);

export function useIndexCardCollections(props?: { localStorage: Storage }) {
  const entityManager = useAppEntity({
    fariType: "index-card-template",
    localStorageKey: "fari-index-card-collections",
    localStorage: props?.localStorage,
    onMakeEntity: IndexCardCollectionFactory.make,
    onDuplicate: IndexCardCollectionFactory.duplicate,
    onMakeTemplate: IndexCardCollectionFactory.makeATemplate,
    onMigration: IndexCardCollectionFactory.migrate,
  });
  const sceneIndexCardCollections = useMemo(() => {
    return [...entityManager.state.entities, ...defaultIndexCardCollection];
  }, [entityManager.state.entities]);

  return {
    state: {
      indexCardCollections: entityManager.state.entities,
      sceneIndexCardCollections: sceneIndexCardCollections,
      groups: entityManager.state.groups,
    },
    actions: entityManager.actions,
  };
}
