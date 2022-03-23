export type IPlayerPresence = {
  cursor: {
    x: number;
    y: number;
  } | null;
  message: string;
  color: string | undefined;
  playerName: string | undefined;
  characterName: string | undefined;
};
