import { IGame } from "../types/IGame";
import { games } from "./games";
export function getGameBySlug(gameSlug: string): IGame {
  const [game] = games.filter(s => s.slug === gameSlug);
  return game;
}
