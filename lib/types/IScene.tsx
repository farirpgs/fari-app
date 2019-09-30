import { IBadGuy } from "./IBadGuy";
import { ICharacter } from "./ICharacter";

export interface IScene {
  _id?: string;
  _rev?: string;
  name?: string;
  description?: string;
  aspects?: Array<string>;
  badGuys?: Array<IBadGuy>;
}
