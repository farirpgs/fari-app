import kebabCase from "lodash/kebabCase";
import { IGame } from "../games/games";

export const ShopLink = {
  makeCreatorLink(game: IGame | undefined) {
    if (!game) {
      return "";
    }
    return `/shop/c/${kebabCase(game.creator)}`;
  },
  makeGameLink(game: IGame | undefined) {
    if (!game) {
      return "";
    }
    return `/shop/p/${kebabCase(game.creator)}/${kebabCase(game.name)}`;
  },
};
