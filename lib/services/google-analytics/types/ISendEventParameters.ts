type ICategories =
  | "Fari"
  | "Character"
  | "Scene"
  | "SceneSession"
  | "Dice"
  | "SceneAspect"
  | "SceneCharacter"
  | "SceneBadGuy";

type IActions =
  | "Install"
  | "Support"
  | "Get"
  | "GetAll"
  | "Create"
  | "Update"
  | "Delete"
  | "CreateOrUpdate"
  | "Sync"
  | "Open"
  | "Roll";

export interface ISendEventParameters {
  category: ICategories;
  action: IActions;
  label?: string;
  value?: number;
}
