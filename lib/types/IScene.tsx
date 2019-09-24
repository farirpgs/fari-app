import { IBadGuy } from "./IBadGuy";

export interface IScene {
  _id?: string;
  _rev?: string;
  name?: string;
  description?: string;
  images?: string;
  aspects?: Array<string>;
  badGuys?: Array<IBadGuy>;
}
