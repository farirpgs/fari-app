import { IIndexCard } from "../../hooks/useScene/IScene";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../Id/Id";
import { Migrator } from "../migration/Migrator";

export type IIndexCardCollection = {
  id: string;
  name: string;
  indexCards: Array<IIndexCard>;
  group: string | undefined;
  version: number;
  lastUpdated: number;
};

export const IndexCardCollectionFactory = {
  make(): IIndexCardCollection {
    return {
      id: Id.generate(),
      name: "",
      group: undefined,
      indexCards: [],
      version: 1,
      lastUpdated: getUnix(),
    };
  },
  duplicate(entity: IIndexCardCollection): IIndexCardCollection {
    return {
      ...entity,
      id: Id.generate(),
      lastUpdated: getUnix(),
    };
  },
  makeATemplate(
    entity: IIndexCardCollection
  ): Omit<IIndexCardCollection, "id"> & { id: undefined } {
    return {
      ...entity,
      id: undefined,
      lastUpdated: getUnix(),
    };
  },

  migrate(s: IIndexCardCollection): IIndexCardCollection {
    const migrate = Migrator.makeMigrationFunction<IIndexCardCollection>([]);
    const migrated = migrate(s);
    return migrated;
  },
};
