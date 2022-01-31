const allCharactersTemplatesFiles = import.meta.glob(
  "./character-templates/*/*.json"
);

export type ICharacterTemplate = {
  category: string;
  fileName: string;
  importFunction: any;
};

export const CharacterTemplatesDerp = Object.keys(allCharactersTemplatesFiles)
  .reduce(
    (
      acc: Array<ICharacterTemplate>,
      fileLocation
    ): Array<ICharacterTemplate> => {
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
  )
  .sort((a) => {
    if (a.category === "Fari RPGs") {
      return -1;
    }
    return 0;
  });
