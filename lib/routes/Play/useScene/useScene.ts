import produce from "immer";
import Peer from "peerjs";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Dice } from "../../../domains/dice/Dice";
import { IPlayer, IScene } from "./IScene";

export function useScene() {
  const [scene, setScene] = useState<IScene>({
    name: defaultSceneName,
    aspects: defaultSceneAspects,
    gm: defaultSceneGM,
    players: [],
  });

  function reset() {
    setScene(
      produce((draft: IScene) => {
        draft.name = defaultSceneName;
        draft.aspects = defaultSceneAspects;
      })
    );
  }

  function setName(name: string) {
    setScene(
      produce((draft: IScene) => {
        draft.name = name;
      })
    );
  }

  function addAspect() {
    setScene(
      produce((draft: IScene) => {
        const id = uuidV4();
        draft.aspects[id] = defaultSceneAspect;
      })
    );
  }

  function removeAspect(id: string) {
    setScene(
      produce((draft: IScene) => {
        delete draft.aspects[id];
      })
    );
  }

  function resetAspect(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id] = defaultSceneAspect;
      })
    );
  }

  function updateAspectTitle(id: string, title: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].title = title;
      })
    );
  }

  function updateAspectContent(id: string, content: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].content = content;
      })
    );
  }

  function addAspectCheckbox(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].checkboxes.push(false);
      })
    );
  }

  function updateAspectCheckbox(id: string, index: number, value: boolean) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].checkboxes[index] = value;
      })
    );
  }

  function addAspectConsequence(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].consequences.push("");
      })
    );
  }

  function updateAspectConsequence(id: string, index: number, value: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].consequences[index] = value;
      })
    );
  }

  function updatePlayers(connections: Array<Peer.DataConnection>) {
    setScene(
      produce((draft: IScene) => {
        draft.players = connections.map((c) => {
          return { id: c.label, playerName: c.metadata.playerName, rolls: [] };
        });
      })
    );
  }

  function updateGMRoll() {
    setScene(
      produce((draft: IScene) => {
        draft.gm.rolls = [Dice.runFudgeDice(), ...draft.gm.rolls];
      })
    );
  }

  function updatePlayerRoll(id: string, roll: number) {
    setScene(
      produce((draft: IScene) => {
        draft.players.forEach((player) => {
          if (player.id === id) {
            player.rolls = [roll, ...player.rolls];
          }
        });
      })
    );
  }

  return {
    state: { scene },
    actions: {
      reset,
      setScene,
      setName,
      addAspect,
      removeAspect,
      resetAspect,
      updateAspectTitle,
      updateAspectContent,
      addAspectCheckbox,
      updateAspectCheckbox,
      addAspectConsequence,
      updateAspectConsequence,
      updatePlayers,
      updateGMRoll,
      updatePlayerRoll,
    },
  };
}

const defaultSceneGM: IPlayer = {
  id: uuidV4(),
  playerName: "Game Master",
  rolls: [],
};

const defaultSceneName = "Name of your scene...";
const defaultSceneAspect = {
  title: "",
  content: "<br/><br/>",
  checkboxes: [],
  consequences: [],
};
const defaultSceneAspects = {};
