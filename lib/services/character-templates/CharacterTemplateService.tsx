import fs from "node:fs";
import path from "node:path";

import { ICharacterTemplate } from "./ICharacterTemplate";

export const CharacterTemplateService = {
  async getAll() {
    debugger;
    const templates: Array<ICharacterTemplate> = [];

    const publishers = fs.readdirSync(
      path.join(process.cwd(), "public/character-templates"),
    );

    publishers.forEach(async (publisher) => {
      const games = fs.readdirSync(
        path.join(process.cwd(), "public/character-templates", publisher),
      );

      games.forEach((game) => {
        templates.push({
          publisher: publisher,
          name: game.split(".json").join(""),
          fetchPath: `/character-templates/${publisher}/${game}`,
        });
      });
    });

    const sorted = templates.sort((a, b) => {
      if (a.publisher === "Fari RPGs" && b.publisher === "Fari RPGs") {
        return a.name.length - b.name.length;
      }

      if (a.publisher === "Fari RPGs") {
        return -1;
      }

      if (a.publisher === b.publisher) {
        return a.name.length - b.name.length;
      }
      return 0;
    });

    return sorted;
  },
};
