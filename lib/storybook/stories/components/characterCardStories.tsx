import { storiesOf } from "@storybook/react";
import { CharacterCard } from "../../../routes/Scene/CharacterCard";
import React from "react";
import { BaseStory } from "../BaseStory";
import { ICharacter } from "../../../types/ICharacter";
import { FateAccelerated, FateCore } from "../../../games/Fate";
import { withKnobs } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export function characterCardStories() {
  storiesOf("Components | Characters", module)
    .addDecorator(withKnobs)
    .add("Default", () => {
      return (
        <BaseStory>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6">
              <CharacterCard
                character={getFaeCharacter()}
                onRemove={action("onRemove")}
                onModify={action("onModify")}
              ></CharacterCard>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6">
              <CharacterCard
                character={getFateCoreCharacter()}
                onRemove={action("onRemove")}
                onModify={action("onModify")}
              ></CharacterCard>
            </div>
          </div>
        </BaseStory>
      );
    });
}

function getFaeCharacter(): ICharacter {
  const character = {
    _id: "1",
    _rev: "1",
    description:
      "Zuko is a firebending master, born as a prince in the Fire Nation Royal Family, who reigned as Fire Lord from 100 AG until his abdication in 167 AG",
    game: FateAccelerated.slug,
    name: "Zuko"
  };
  character["aspect1"] = "Prince of the Fire Nation";
  character["aspect2"] = "All for my honor";
  return character;
}

function getFateCoreCharacter(): ICharacter {
  const character = {
    _id: "1",
    _rev: "1",
    description:
      "Zuko is a firebending master, born as a prince in the Fire Nation Royal Family, who reigned as Fire Lord from 100 AG until his abdication in 167 AG",
    game: FateCore.slug,
    name: "Zuko"
  };
  character["aspect1"] = "Prince of the Fire Nation";
  character["aspect2"] = "All for my honor";
  return character;
}
