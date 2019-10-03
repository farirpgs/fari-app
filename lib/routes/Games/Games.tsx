import React from "react";
import { games } from "../../games/games";
import { GamesPure } from "./GamesPure";

export const Games: React.FC<{}> = props => {
  return <GamesPure games={games}></GamesPure>;
};
