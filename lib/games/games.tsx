import { FateAccelerated } from "./FateAccelerated";
import { IGame } from "./IGame";

export const games = [FateAccelerated];

export function getGameBySlug(gameSlug: string): IGame {
  const [game] = games.filter(s => s.slug === gameSlug);
  return game;
}
