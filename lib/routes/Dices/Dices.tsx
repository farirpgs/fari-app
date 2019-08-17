import Paper from "@material-ui/core/Paper";
import React from "react";
import { DnDDices } from "../../components/Dices/DnDDices";
import { DungeonWorldDices } from "../../components/Dices/DungeonWorldDices";
import { FudgeDices } from "../../components/Dices/FudgeDices";
import { Page } from "../../components/Page/Page";

export const Dices = () => {
  return (
    <Page h1="Dices">
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <h2>Fudge</h2>
        <FudgeDices />
      </Paper>
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <h2>DnD</h2>
        <DnDDices />
      </Paper>
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <h2>Dungeon World</h2>
        <DungeonWorldDices />
      </Paper>
    </Page>
  );
};
