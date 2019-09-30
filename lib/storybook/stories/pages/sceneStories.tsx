import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";
import { useAspects } from "../../../routes/Scene/hooks/useAspects";
import { useBadGuys } from "../../../routes/Scene/hooks/useBadGuys";
import { useCharacters } from "../../../routes/Scene/hooks/useCharacters";
import { usePeer } from "../../../routes/Scene/hooks/usePeer";
import { ScenePure } from "../../../routes/Scene/ScenePure";
import { BaseStory } from "../BaseStory";
import { IScene } from "../../../types/IScene";
import { ICharacter } from "../../../types/ICharacter";
import { FateCore } from "../../../games/Fate";

const badGuyManagerMock: ReturnType<typeof useBadGuys> = {
  badGuyToModify: undefined,
  isBadGuyModalOpened: false,
  onAddBadBuyButtonClick: action("onAddBadBuyButtonClick"),
  onBadGuyDialogClose: action("onBadGuyDialogClose"),
  onModifyBadBuyButtonClick: action("onModifyBadBuyButtonClick"),
  removeBadGuyFromScene: action("removeBadGuyFromScene"),
  updateBadGuyInScene: action("updateBadGuyInScene")
};

const peerManagerMock: ReturnType<typeof usePeer> = {
  isConnectedToGM: false,
  numberOfConnectedPlayers: 3,
  peerId: "123123",
  sendToAllPlayers: action("sendToAllPlayers"),
  sendToGM: action("sendToGM")
};

const characterManagerMock: ReturnType<typeof useCharacters> = {
  addOrUpdateCharacterInScene: action("addOrUpdateCharacterInScene"),
  isCharacterModalOpened: false,
  onCharacterSelectClose: action("onCharacterSelectClose"),
  onSendCharacterToGMButtonClick: action("onSendCharacterToGMButtonClick"),
  removeCharacterFromScene: action("removeCharacterFromScene")
};

const aspectsManagerMock: ReturnType<typeof useAspects> = {
  addAspectToScene: action("addAspectToScene"),
  removeAspectFromScene: action("removeAspectFromScene"),
  updateAspectInScene: action("updateAspectInScene")
};

const defaultSceneMock: IScene = { badGuys: [], characters: [] };
const scenePlayMock: IScene = {
  badGuys: [
    {
      id: "1",
      name: "Ozai",
      aspects: "Fire Lord",
      skilledAt: "Agni Kai",
      badAt: "Family",
      stress: "2",
      stressValues: {},
      consequences: "2",
      consequencesValues: {}
    }
  ],
  characters: [getFateCoreCharacter()]
};

export function sceneStories() {
  storiesOf("Pages | Scene", module)
    .addDecorator(withKnobs)
    .add("Loading", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={""}
            scene={defaultSceneMock}
            isLoading={true}
            isGM={false}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={peerManagerMock}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    })
    .add("Not Found", () => {
      const sceneId = "";

      return (
        <BaseStory>
          <ScenePure
            sceneId={""}
            scene={defaultSceneMock}
            isLoading={false}
            isGM={false}
            isSceneNotFound={true}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={peerManagerMock}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    })
    .add("GM Create ", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={""}
            scene={defaultSceneMock}
            isLoading={false}
            isGM={true}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={peerManagerMock}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    })
    .add("GM Play (Connected)", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={"existing-uid"}
            scene={scenePlayMock}
            isLoading={false}
            isGM={true}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={peerManagerMock}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    })
    .add("GM Play (Disconnected)", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={"existing-uid"}
            scene={scenePlayMock}
            isLoading={false}
            isGM={true}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={{ ...peerManagerMock, peerId: undefined }}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    })
    .add("Player Play (Connected)", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={"existing-uid"}
            scene={scenePlayMock}
            isLoading={false}
            isGM={false}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={{ ...peerManagerMock, isConnectedToGM: true }}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    })
    .add("Player Play (Disconnected)", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={"existing-uid"}
            scene={scenePlayMock}
            isLoading={false}
            isGM={false}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={characterManagerMock}
            peerManager={{ ...peerManagerMock, isConnectedToGM: false }}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
          >
        </BaseStory>
      );
    });
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
