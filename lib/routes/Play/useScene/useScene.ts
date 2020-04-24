import produce from "immer";
import Peer from "peerjs";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Dice } from "../../../domains/dice/Dice";
import { IAspect, IScene } from "./IScene";

const temporaryGMIdUntilFirstSync = "temporary-gm-id-until-first-sync";

export function useScene(userId: string, gameId: string) {
  const isGM = !gameId;
  const [scene, setScene] = useState<IScene>(() => ({
    name: defaultSceneName,
    aspects: defaultSceneAspects,
    gm: {
      id: isGM ? userId : temporaryGMIdUntilFirstSync,
      playerName: "Game Master",
      rolls: [],
    },
    players: [],
  }));

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

  function addAspectFreeInvoke(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].freeInvokes.push(false);
      })
    );
  }

  function updateAspectFreeInvoke(id: string, index: number, value: boolean) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].freeInvokes[index] = value;
      })
    );
  }
  function addAspectPhysicalStress(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].physicalStress.push(false);
      })
    );
  }

  function updateAspectPhysicalStress(
    id: string,
    index: number,
    value: boolean
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].physicalStress[index] = value;
      })
    );
  }
  function addAspectMentalStress(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].mentalStress.push(false);
      })
    );
  }

  function updateAspectMentalStress(id: string, index: number, value: boolean) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].mentalStress[index] = value;
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
        draft.gm.rolls = [Dice.rollFudgeDice(), ...draft.gm.rolls];
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
      addAspectFreeInvoke,
      updateAspectFreeInvoke,
      addAspectPhysicalStress,
      updateAspectPhysicalStress,
      addAspectMentalStress,
      updateAspectMentalStress,
      addAspectConsequence,
      updateAspectConsequence,
      updatePlayers,
      updateGMRoll,
      updatePlayerRoll,
    },
  };
}

export const defaultSceneName = "Name of your scene...";
const defaultSceneAspect: IAspect = {
  title: "",
  content: "<br/><br/>",
  freeInvokes: [],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
};
const defaultSceneAspects = {};
