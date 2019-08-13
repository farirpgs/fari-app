import { FateAccelerated, FateCore } from "./Fate";
import { IGame } from "./IGame";

export const games = [FateAccelerated, FateCore];

export function getGameBySlug(gameSlug: string): IGame {
  const [game] = games.filter(s => s.slug === gameSlug);
  return game;
}
