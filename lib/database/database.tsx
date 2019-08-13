import PouchDB from "pouchdb";
import { IGame } from "../games/IGame";

export function getCharactersDb(game: IGame) {
  return new PouchDB(`characters-${game.slug}`);
}
