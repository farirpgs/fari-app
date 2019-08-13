import { IField } from "./IField";

export interface IGame {
  name: string;
  slug: string;
  rows: Array<IRow>;
}

export interface IRow {
  fields: Array<IField>;
  tab?: string;
}

export interface ICharacter {
  _id: string;
  _rev: string;
}
