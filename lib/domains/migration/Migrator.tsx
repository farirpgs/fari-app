type IMigratableEntity = {
  version: number;
};
export const Migrator = {
  makeMigrationFunction<T extends IMigratableEntity>(
    migrationFunctions: Array<{
      from: number;
      migrate: (entity: any) => any;
    }>
  ) {
    return (entity: IMigratableEntity): T => {
      let migratedEntity = { ...entity };
      for (const migrationFunction of migrationFunctions) {
        if (migratedEntity.version === migrationFunction.from) {
          migratedEntity = migrationFunction.migrate(migratedEntity);
        }
      }

      return migratedEntity as unknown as T;
    };
  },
};
