type ICategories =
  | "Fari"
  | "Character"
  | "Scene"
  | "SceneSession"
  | "Dice"
  | "SceneAspect"
  | "SceneCharacter"
  | "Chat"
  | "SceneBadGuy";

type IActions =
  | "Install"
  | "Support"
  | "Get"
  | "GetAll"
  | "Create"
  | "Update"
  | "Send"
  | "Delete"
  | "CreateOrUpdate"
  | "Sync"
  | "Migration"
  | "Open"
  | "Roll";

export interface ISendEventParameters {
  category: ICategories;
  action: IActions;
  label?: string;
  value?: number;
}
