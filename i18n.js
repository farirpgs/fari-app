import fs from "fs-extra";
import glob from "glob";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import prettier from "prettier";

main();
async function main() {
  const sourceFileLocations = await globPromise("./lib/**/*.tsx");
  const translationKeys = await findTranslations(sourceFileLocations);

  await updateTranslations(translationKeys);
  await updateTypeDefinitions(translationKeys);
}

//#region Translations
async function findTranslations(sourceFileLocations) {
  const files = await getFilesContent(sourceFileLocations);

  const translationKeys = [];
  files.forEach((item) => {
    const contentWithoutLineBreaksOrSpaces = item.content
      .split("\n")
      .join(" ")
      .replace(/\s+/g, "");
    /**
     * `\b` is for space or beginning of line
     * then look for any `t("*")`
     * `.*?` is not greedy
     */
    const match = contentWithoutLineBreaksOrSpaces.match(/(\b)t\(".*?"\)/gm);

    if (match) {
      match.forEach((m) => {
        /**
         * remove `"` `t` `(` and `)`
         */
        const formatted = m
          .split('"')
          .join("")
          .split("(")
          .join("")
          .split(")")
          .join("");
        const withoutT = formatted.substring(1);
        translationKeys.push(withoutT);
      });
    }
  });

  return translationKeys;
}

async function updateTranslations(keys) {
  const sortedKeys = sortBy(keys, (k) => k);

  const files = await importJsonFiles(["./public/locales/en/translation.json"]);
  // const files = await importJsonFiles(translationFilesLocations);

  for (const file of files) {
    const content = file.content;

    const newData = sortedKeys.reduce((acc, curr, index) => {
      const existingValue = content[curr];
      return {
        ...acc,
        [curr]: existingValue || "",
      };
    }, {});
    const formattedData = prettier.format(JSON.stringify(newData), {
      parser: "json",
    });
    await fs.writeFile(file.location, formattedData);
  }
}
async function updateTypeDefinitions(keys) {
  const sortedKeys = uniq(sortBy(keys, (k) => k));

  const typescript = `
    export type ITranslationKeys = ${sortedKeys
      .map((k) => `"${k}"`)
      .join(" | ")};
  `;

  const formattedData = prettier.format(typescript, {
    parser: "typescript",
  });
  await fs.writeFile("./lib/locale.ts", formattedData);
}

//#endregion

//#region Glob
async function globPromise(pattern) {
  const promise = new Promise((resolve, reject) => {
    glob(pattern, {}, function (er, matchingFiles) {
      if (er) {
        reject(er);
      } else {
        resolve(matchingFiles);
      }
    });
  });
  return promise;
}

async function getFilesContent(locations) {
  return Promise.all(
    locations.map(async (file) => {
      const content = await fs.readFile(file, "utf8");

      return {
        location: file,
        content: content,
      };
    })
  );
}

async function importJsonFiles(translationFilesLocations) {
  return Promise.all(
    translationFilesLocations.map(async (file) => {
      const content = await import(file);
      return {
        location: file,
        content: content,
      };
    })
  );
}

//#endregion
