import Divider from "@material-ui/core/Divider";
import React from "react";
import { DnDDices } from "../components/Dice/DnDDices";
import { DungeonWorldDices } from "../components/Dice/DungeonWorldDices";
import { FudgeDices } from "../components/Dice/FudgeDices";

export const Dices = () => {
  return (
    <div className="route-box">
      <h1>Dices</h1>
      <Divider style={{ margin: "1rem 0" }} />
      <h2>Fudge</h2>
      <FudgeDices />
      <h2>DnD</h2>
      <DnDDices />
      <h2>Dungeon World</h2>
      <DungeonWorldDices />
    </div>
  );
};
