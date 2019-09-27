import Paper from "@material-ui/core/Paper";
import React from "react";
import { DnDDice } from "../../components/Dice/DnDDice";
import { DungeonWorldDice } from "../../components/Dice/DungeonWorldDice";
import { FudgeDice } from "../../components/Dice/FudgeDice";
import { Page } from "../../components/Page/Page";

export const Dice = () => {
  return (
    <Page h1="Dices">
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <h2 className="margin-1">Fudge</h2>
        <FudgeDice />
      </Paper>
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <h2 className="margin-1">DnD</h2>
        <DnDDice />
      </Paper>
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <h2 className="margin-1">Dungeon World</h2>
        <DungeonWorldDice />
      </Paper>
    </Page>
  );
};
