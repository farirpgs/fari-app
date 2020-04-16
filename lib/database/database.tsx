import PouchDB from "pouchdb";
import find from "pouchdb-find";

PouchDB.plugin(find);

export function getCharactersDb() {
  const db = new PouchDB("characters");
  return db;
}
