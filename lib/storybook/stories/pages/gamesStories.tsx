import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";
import { games } from "../../../games/games";
import { GamesPure } from "../../../routes/Games/GamesPure";
import { BaseStory } from "../BaseStory";

export function gameStories() {
  storiesOf("Pages | Games", module)
    .addDecorator(withKnobs)
    .add("Default", () => {
      return (
        <BaseStory>
          <GamesPure games={games}></GamesPure>
        </BaseStory>
      );
    });
}
