import kebabCase from "lodash/kebabCase";
import { IGame } from "../games/games";

export const ShopId = {
  makeId(game: IGame | undefined) {
    if (!game) {
      return "";
    }
    return `${kebabCase(game.creator)}-${kebabCase(game.name)}`;
  },
};
