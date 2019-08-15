import React from "react";
import { DnDDices } from "../../components/Dices/DnDDices";
import { DungeonWorldDices } from "../../components/Dices/DungeonWorldDices";
import { FudgeDices } from "../../components/Dices/FudgeDices";
import { Page } from "../../components/Page/Page";

export const Dices = () => {
  return (
    <Page h1="Dices">
      <h2>Fudge</h2>
      <FudgeDices />
      <h2>DnD</h2>
      <DnDDices />
      <h2>Dungeon World</h2>
      <DungeonWorldDices />
    </Page>
  );
};
