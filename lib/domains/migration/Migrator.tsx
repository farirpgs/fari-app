type IMigratableEntity = {
  version: number;
};
export const Migrator = {
  makeMigrationFunction<T extends IMigratableEntity>(
    migrationFunctions: Array<{
      version: number;
      migrate: (entity: IMigratableEntity) => IMigratableEntity;
    }>
  ) {
    return (entity: IMigratableEntity): T => {
      let migratedEntity = { ...entity };
      for (const migrationFunction of migrationFunctions) {
        if (entity.version === migrationFunction.version) {
          migratedEntity = migrationFunction.migrate(entity);
        }
      }

      return migratedEntity as unknown as T;
    };
  },
};
