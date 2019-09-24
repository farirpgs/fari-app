import { IScene } from "../../typings/IScene";

export interface IGroupedScenes {
  Default?: Array<IScene>;
  [arcName: string]: Array<IScene>;
}
