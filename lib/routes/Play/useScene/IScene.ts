export interface IPlayer {
  id: string;
  playerName: string;
  rolls: Array<number>;
}

export interface IScene {
  name: string;
  aspects: Record<
    string,
    {
      title: string;
      content: string;
      checkboxes: Array<boolean>;
      consequences: Array<string>;
    }
  >;
  gm: IPlayer;
  players: Array<IPlayer>;
}
