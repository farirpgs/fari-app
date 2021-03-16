import fs from "fs-extra";
import glob from "glob";

main();
async function main() {
  const sourceFileLocations = await globPromise("./lib/**/*.tsx");
  const translationKeys = await findTranslations(sourceFileLocations);
  const translationFileLocations = await globPromise("./locales/**/*.json");
  await updateTranslations(translationKeys, translationFileLocations);
}

//#region
async function findTranslations(sourceFileLocations) {
  const files = await getFilesContent(sourceFileLocations);

  const translationKeys = [];
  files.forEach((item) => {
    /**
     * `\b` is for space or beginning of line
     * then look for any `t("*")`
     */
    const match = item.content.match(/(\b)t\(".+"\)/gm);

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

async function updateTranslations(keys, translationFilesLocations) {
  const files = await importJsonFiles(translationFilesLocations);

  for (const file of files) {
    const content = file.content;

    const newData = keys.reduce((acc, curr, index) => {
      const existingValue = content[curr];

      return {
        ...acc,
        [curr]: existingValue || "",
      };
    }, {});
    // console.debug('newData', newData)
    // await fs.writeFile(file.location, JSON.stringify(newData, null, 2));
  }
}

//#endregion

//#region
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
