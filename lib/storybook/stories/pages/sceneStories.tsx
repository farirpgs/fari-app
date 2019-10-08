import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";
import { FateCore, FateAccelerated } from "../../../games/Fate";
import { useAspects } from "../../../routes/Scene/hooks/useAspects";
import { IBadGuysManager } from "../../../routes/Scene/hooks/useBadGuys";
import { ICharactersManager } from "../../../routes/Scene/hooks/useCharacters";
import { IPeerManager } from "../../../routes/Scene/hooks/usePeer";
import { ScenePure } from "../../../routes/Scene/ScenePure";
import { ICharacter } from "../../../types/ICharacter";
import { IScene } from "../../../types/IScene";
import { BaseStory } from "../BaseStory";
import { CharacterSelectDialogPure } from "../../../routes/Scene/dialogs/CharacterSelectDialogPure";

const badGuyManagerMock: IBadGuysManager = {
  badGuyToModify: undefined,
  isBadGuyModalOpened: false,
  onAddBadBuyButtonClick: action("onAddBadBuyButtonClick"),
  onBadGuyDialogClose: action("onBadGuyDialogClose"),
  onModifyBadBuyButtonClick: action("onModifyBadBuyButtonClick"),
  removeBadGuyFromScene: action("removeBadGuyFromScene"),
  updateBadGuyInScene: action("updateBadGuyInScene")
};

const peerManagerMock: IPeerManager = {
  isConnectedToGM: false,
  numberOfConnectedPlayers: 3,
  peerId: "123123",
  sendToAllPlayers: action("sendToAllPlayers"),
  sendToGM: action("sendToGM")
};

const characterManagerMockEmpty: ICharactersManager = {
  global: {
    sceneCharacters: []
  },
  gm: {
    addOrUpdateCharacterInScene: action("addOrUpdateCharacterInScene"),
    removeCharacterFromScene: action("removeCharacterFromScene")
  },
  player: {
    setSceneCharacters: action("setSceneCharacters"),
    playerCharactersIds: [],
    isCharacterModalOpened: false,
    onCharacterSelectClose: action("onCharacterSelectClose"),
    onSendCharacterToGMButtonClick: action("onSendCharacterToGMButtonClick"),
    syncACharacter: action("syncACharacter") as any
  }
};
const characterManagerMock: ICharactersManager = {
  global: {
    sceneCharacters: [getFateCoreCharacter("2"), getFateCoreCharacter("1")]
  },
  gm: {
    addOrUpdateCharacterInScene: action("addOrUpdateCharacterInScene"),
    removeCharacterFromScene: action("removeCharacterFromScene")
  },
  player: {
    setSceneCharacters: action("setSceneCharacters"),
    playerCharactersIds: ["1"],
    isCharacterModalOpened: false,
    onCharacterSelectClose: action("onCharacterSelectClose"),
    onSendCharacterToGMButtonClick: action("onSendCharacterToGMButtonClick"),
    syncACharacter: action("syncACharacter") as any
  }
};

const aspectsManagerMock: ReturnType<typeof useAspects> = {
  addAspectToScene: action("addAspectToScene"),
  removeAspectFromScene: action("removeAspectFromScene"),
  updateAspectInScene: action("updateAspectInScene")
};

const defaultSceneMock: IScene = { badGuys: [] };
const scenePlayMock: IScene = {
  name: "Ba Sing Se",
  description: `Ba Sing Se is the capital of the Earth Kingdom as well as one of its constituent states, encompassing a large portion of the nation's northeastern corner. 

After the Surrender of Omashu, the city became the last great Earth 
Kingdom stronghold during the Hundred Year War.`,

  aspects: ["The city is on fire", "My cabbages"],
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
  ]
};

const characterManagerPlayMock: ICharactersManager = {
  ...characterManagerMock,
  global: {
    ...characterManagerMock.global,
    sceneCharacters: []
  },
  player: {
    ...characterManagerMock.player,
    playerCharactersIds: []
  }
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
            characterManager={characterManagerMockEmpty}
            peerManager={peerManagerMock}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
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
        </BaseStory>
      );
    })
    .add("GM Play Empty", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={"existing-uid"}
            scene={{ ...scenePlayMock, badGuys: [] }}
            isLoading={false}
            isGM={true}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={{
              ...characterManagerMock,
              global: { ...characterManagerMock.global, sceneCharacters: [] }
            }}
            peerManager={peerManagerMock}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
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
        </BaseStory>
      );
    })
    .add("Player Play Empty", () => {
      return (
        <BaseStory>
          <ScenePure
            sceneId={"existing-uid"}
            scene={{ ...scenePlayMock, badGuys: [] }}
            isLoading={false}
            isGM={false}
            isSceneNotFound={false}
            setScene={action("setScene")}
            saveScene={action("saveScene") as any}
            aspectsManager={aspectsManagerMock}
            characterManager={{
              ...characterManagerMock,
              global: { ...characterManagerMock.global, sceneCharacters: [] }
            }}
            peerManager={{ ...peerManagerMock, isConnectedToGM: true }}
            badGuyManager={badGuyManagerMock}
          ></ScenePure>
        </BaseStory>
      );
    })
    .add("Character Dialog Loading", () => {
      return (
        <BaseStory>
          <CharacterSelectDialogPure
            characters={[]}
            open={true}
            isLoading={true}
            onClose={action("onClose")}
          ></CharacterSelectDialogPure>
        </BaseStory>
      );
    })
    .add("Character Dialog Empty", () => {
      return (
        <BaseStory>
          <CharacterSelectDialogPure
            characters={[]}
            open={true}
            isLoading={false}
            onClose={action("onClose")}
          ></CharacterSelectDialogPure>
        </BaseStory>
      );
    })
    .add("Character Dialog with Characters", () => {
      return (
        <BaseStory>
          <CharacterSelectDialogPure
            characters={[
              getFateCoreCharacter("1"),
              getFateCoreCharacter("2"),
              getFateCoreCharacter("3"),
              getFateCoreCharacter("4"),
              getFateCoreCharacter("5")
            ]}
            open={true}
            isLoading={false}
            onClose={action("onClose")}
          ></CharacterSelectDialogPure>
        </BaseStory>
      );
    });
}

function getFateCoreCharacter(id: string): ICharacter {
  const character: ICharacter = {
    _id: id,
    _rev: "1",
    description:
      "Zuko is a firebending master, born as a prince in the Fire Nation Royal Family, who reigned as Fire Lord from 100 AG until his abdication in 167 AG",
    game: FateAccelerated.slug,
    name: "Zuko",
    aspect1: "Prince of the Fire Nation",
    aspect2: "All for my honor",
    careful: "1",
    clever: "0",
    forceful: "3",
    flashy: "2",
    quick: "2",
    sneaky: "1"
  };
  return character;
}
