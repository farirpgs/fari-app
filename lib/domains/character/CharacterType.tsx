let allCharactersTemplatesFiles: Record<
  string,
  () => Promise<{
    [key: string]: any;
  }>
> = {};
try {
  allCharactersTemplatesFiles = import.meta.glob(
    "./character-templates/*/*.json"
  );
} catch (error) {}

export type ICharacterTemplate = {
  category: string;
  fileName: string;
  importFunction: any;
};

export const allTemplates = Object.keys(allCharactersTemplatesFiles).reduce(
  (acc: Array<ICharacterTemplate>, fileLocation): Array<ICharacterTemplate> => {
    const importFunction = allCharactersTemplatesFiles[fileLocation];

    const folderAndFileName = fileLocation
      .split("./character-templates/")
      .join("");
    const folderName = folderAndFileName.split("/")[0];
    const fileName = folderAndFileName.split("/")[1].split(".json")[0];

    return [
      ...acc,
      {
        fileName,
        category: folderName,
        importFunction,
      },
    ];
  },
  []
);

export const CharacterTemplates = [...allTemplates].sort((a, b) => {
  if (a.category === "Fari RPGs" && b.category === "Fari RPGs") {
    return a.fileName.length - b.fileName.length;
  }

  if (a.category === "Fari RPGs") {
    return -1;
  }

  if (a.category === b.category) {
    return a.fileName.length - b.fileName.length;
  }
  return 0;
});
