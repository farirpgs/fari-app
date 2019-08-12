import React from "react";
import { DnDDices } from "../components/dice/DnDDices";
import { DungeonWorldDices } from "../components/dice/DungeonWorldDices";
import { FudgeDices } from "../components/dice/FudgeDices";

export const Dices = () => {
  return (
    <div className="route-box">
      <h1>Dices</h1>
      <hr />
      <h2>Fudge</h2>
      <FudgeDices />
      <h2>DnD</h2>
      <DnDDices />
      <h2>Dungeon World</h2>
      <DungeonWorldDices />
    </div>
  );
};
