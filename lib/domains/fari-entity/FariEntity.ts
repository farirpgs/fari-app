const fariTypes = [
  "scene",
  "character",
  "index-card-template",
  "full",
] as const;

export type IFariType = typeof fariTypes[number];

type IFariEntity = {
  fariType: IFariType;
};

export const FariEntity = {
  async import<T>(props: {
    filesToImport: FileList | null | undefined;
    fariType: IFariType;
  }): Promise<T> {
    const promise = new Promise<T>((resolve) => {
      if (!props.filesToImport) {
        return;
      }
      type IExportedFariEntity = T & IFariEntity;
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          if (!!event.target?.result) {
            const data = JSON.parse(
              event.target.result.toString()
            ) as IExportedFariEntity;
            const { fariType, ...entity } = data;
            if (fariType === props.fariType) {
              resolve(entity as unknown as T);
            }
          }
        } catch (error) {
          // reject(error)
        }
      };
      const firstFile = props.filesToImport[0];
      reader.readAsText(firstFile);
    });
    return promise;
  },
  export<T>(props: { element: T; name: string; fariType: IFariType }) {
    const elementWithMeta = {
      ...props.element,
      fariType: props.fariType,
    };
    const stringifiedElement = JSON.stringify(elementWithMeta);
    const blob = new Blob([stringifiedElement], {
      type: "text/plain",
    });
    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = `${props.name}.fari.json`;
    link.click();
  },
  loadEntityFromStorage<T>(props: {
    defaultValue: T;
    localStorage: Storage;
    key: string;
    migrationFunction?: (entity: any) => any;
  }): T {
    try {
      const localStorageValue = props.localStorage.getItem(props.key);
      if (localStorageValue) {
        const parsed = JSON.parse(localStorageValue);
        const migrated = props.migrationFunction?.(parsed) ?? parsed;
        return migrated;
      }
    } catch (error) {
      if (!process.env.IS_JEST) {
        console.error(error);
      }
    }
    return props.defaultValue;
  },
  loadEntitiesFromStorage<T>(props: {
    localStorage: Storage;
    key: string;
    migrationFunction: (entity: any) => any;
  }): Array<T> {
    try {
      const localStorageValue = props.localStorage.getItem(props.key);
      if (localStorageValue) {
        const parsed = JSON.parse(localStorageValue);
        const migrated = parsed.map(props.migrationFunction);
        return migrated;
      }
    } catch (error) {
      if (!process.env.IS_JEST) {
        console.error(error);
      }
    }
    return [];
  },
  getSize(obj: any) {
    const size = new TextEncoder().encode(JSON.stringify(obj)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;

    return { kiloBytes, megaBytes };
  },
  formatSize(kiloBytes: number) {
    const megaBytes = kiloBytes / 1024;
    const formatted =
      kiloBytes >= 1000
        ? `${megaBytes.toFixed(1).toString()} MB`
        : `${kiloBytes.toFixed(0).toString()} KB`;

    return formatted;
  },
};
