import { IScene } from "../../root/AppRouter";

export interface IGroupedScenes {
  Default?: Array<IScene>;
  [arcName: string]: Array<IScene>;
}
