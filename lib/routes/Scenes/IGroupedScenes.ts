import { IScene } from "../../types/IScene";

export interface IGroupedScenes {
  Default?: Array<IScene>;
  [arcName: string]: Array<IScene>;
}
