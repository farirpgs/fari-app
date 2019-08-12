import { IField } from "./IField";

export interface IGame {
  name: string;
  slug: string;
  fields: Array<IField>;
}

export interface ICharacter {
  _id: string;
  _rev: string;
}
