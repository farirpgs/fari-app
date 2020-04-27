import produce from "immer";
import Peer from "peerjs";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { IndexCardColor } from "../../../components/IndexCard/IndexCardColor";
import { Dice } from "../../../domains/dice/Dice";
import { IAspect, IPlayer, IScene } from "./IScene";

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
      playedDuringTurn: false,
      fatePoints: 3,
    },
    players: [],
  }));

  function reset() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        draft.name = defaultSceneName;
        draft.aspects = defaultSceneAspects;
        everyone.forEach((p) => {
          p.fatePoints = 3;
          p.playedDuringTurn = false;
        });
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

  function addBoost() {
    setScene(
      produce((draft: IScene) => {
        const id = uuidV4();
        draft.aspects[id] = defaultSceneBoost;
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
        if (draft.aspects[id].isBoost) {
          draft.aspects[id] = defaultSceneBoost;
        } else {
          draft.aspects[id] = defaultSceneAspect;
        }
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

  function updateAspectColor(id: string, color: IndexCardColor) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].color = color;
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
          return {
            id: c.label,
            playerName: c.metadata.playerName,
            rolls: [],
            playedDuringTurn: false,
            fatePoints: 3,
          } as IPlayer;
        });
      })
    );
  }

  function resetPlayerPlayedStatus() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });
      })
    );
  }

  function updatePlayerPlayedStatus(id: string, playedInTurnOrder: boolean) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            p.playedDuringTurn = playedInTurnOrder;
          }
        });
      })
    );
  }

  function updatePlayerFatePoints(id: string, fatePoints: number) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            p.fatePoints = fatePoints;
          }
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
      addBoost,
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
      updateAspectColor,
      updatePlayers,
      updatePlayerFatePoints,
      updatePlayerPlayedStatus,
      resetPlayerPlayedStatus,
      updateGMRoll,
      updatePlayerRoll,
    },
  };
}

export const defaultSceneName = "Name of your scene...";
const defaultSceneAspect: IAspect = {
  title: "",
  content: "<br/>",
  freeInvokes: [],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  color: IndexCardColor.White,
  isBoost: false,
};

const defaultSceneBoost: IAspect = {
  title: "",
  content: "<br/>",
  freeInvokes: [false],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  color: IndexCardColor.Blue,
  isBoost: true,
};
const defaultSceneAspects = {};
