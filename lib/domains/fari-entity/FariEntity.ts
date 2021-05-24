const fariTypes = ["scene", "character", "full"] as const;

type IFariType = typeof fariTypes[number];

type IFariEntity = {
  fariType: IFariType;
};

export const FariEntity = {
  import<T>(props: {
    filesToImport: FileList | null | undefined;
    fariType: IFariType;
    onImport: (element: T) => void;
  }) {
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
            props.onImport((entity as unknown) as T);
          }
        }
      } catch (error) {}
    };
    const firstFile = props.filesToImport[0];
    reader.readAsText(firstFile);
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
  loadEntitiesFromStorage<T>(props: {
    localStorage: Storage;
    key: string;
    migrationFunction: (entity: any) => any;
  }): Array<T> {
    try {
      const localStorageScenes = props.localStorage.getItem(props.key);
      if (localStorageScenes) {
        const parsed = JSON.parse(localStorageScenes);
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
