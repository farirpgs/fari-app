import { storiesOf } from "@storybook/react";
import { CharacterCard } from "../../../routes/Scene/cards/CharacterCard";
import React from "react";
import { BaseStory } from "../BaseStory";
import { ICharacter } from "../../../types/ICharacter";
import { FateAccelerated, FateCore } from "../../../games/Fate";
import { withKnobs } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export function characterCardStories() {
  storiesOf("Components | Character Card", module)
    .addDecorator(withKnobs)
    .add("Default", () => {
      return (
        <BaseStory>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6">
              <CharacterCard
                isGM={false}
                readOnly={false}
                character={getFaeCharacter()}
                onRemove={action("onRemove")}
                onSync={action("onSync")}
              ></CharacterCard>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6">
              <CharacterCard
                isGM={false}
                readOnly={false}
                character={getFateCoreCharacter()}
                onRemove={action("onRemove")}
                onSync={action("onSync")}
              ></CharacterCard>
            </div>
          </div>
        </BaseStory>
      );
    });
}

function getFaeCharacter(): ICharacter {
  const character: ICharacter = {
    _id: "1",
    _rev: "1",
    description:
      "Zuko is a firebending master, born as a prince in the Fire Nation Royal Family, who reigned as Fire Lord from 100 AG until his abdication in 167 AG",
    game: FateAccelerated.slug,
    name: "Zuko",
    aspect1: "Prince of the Fire Nation",
    aspect2: "All for my honor",
    aspect3: "...",
    aspect4: "...",
    aspect5: "...",
    approachCareful: "1",
    approachClever: "0",
    approachForceful: "3",
    approachFlashy: "2",
    approachQuick: "2",
    approachSneaky: "1"
  };
  return character;
}

function getFateCoreCharacter(): ICharacter {
  const character: ICharacter = {
    _id: "1",
    _rev: "1",
    description:
      "Zuko is a firebending master, born as a prince in the Fire Nation Royal Family, who reigned as Fire Lord from 100 AG until his abdication in 167 AG",
    game: FateCore.slug,
    name: "Zuko",
    aspect1: "Prince of the Fire Nation",
    aspect2: "All for my honor",
    aspect3: "...",
    aspect4: "...",
    aspect5: "...",
    skillSuperb: "",
    skillGreat: "Drive",
    skillGood: "Fight, Physique",
    skillFair: "Rapport, Will",
    skillAverage: "Investigate, Contacts, Burglary, Notice"
  };
  return character;
}
