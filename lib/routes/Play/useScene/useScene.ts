import produce from "immer";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { IndexCardColor } from "../../../components/IndexCard/IndexCardColor";
import { Confetti } from "../../../domains/confetti/Confetti";
import { IDiceRoll } from "../../../domains/dice/IDiceRoll";
import { AspectType } from "./AspectType";
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
    goodConfetti: 0,
    badConfetti: 0,
    sort: false,
  }));

  useEffect(() => {
    if (scene.goodConfetti > 0) {
      Confetti.fireConfetti();
      setScene(
        produce((draft: IScene) => {
          draft.goodConfetti = 0;
        })
      );
    }
  }, [scene.goodConfetti]);

  useEffect(() => {
    if (scene.badConfetti > 0) {
      Confetti.fireCannon();
      setScene(
        produce((draft: IScene) => {
          draft.badConfetti = 0;
        })
      );
    }
  }, [scene.badConfetti]);

  function safeSetScene(newScene: IScene) {
    if (newScene) {
      setScene(newScene);
    }
  }

  function reset() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        draft.name = defaultSceneName;
        draft.aspects = defaultSceneAspects;
        everyone.forEach((p) => {
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

  function addAspect(type: AspectType) {
    setScene(
      produce((draft: IScene) => {
        const id = uuidV4();
        draft.aspects[id] = defaultAspects[type];
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
        draft.aspects[id] = defaultAspects[draft.aspects[id].type];
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

  function addOfflinePlayer(playerName: string) {
    setScene(
      produce((draft: IScene) => {
        draft.players.push({
          id: uuidV4(),
          playerName: playerName,
          rolls: [],
          playedDuringTurn: false,
          fatePoints: 3,
        });
      })
    );
  }

  function removeOfflinePlayer(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.players = draft.players.filter((p) => p.id !== id);
      })
    );
  }

  function resetInitiative() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });

        const aspectIds = Object.keys(draft.aspects);
        aspectIds.forEach((id) => {
          draft.aspects[id].playedDuringTurn = false;
        });
      })
    );
  }

  function updatePlayerPlayedDuringTurn(
    id: string,
    playedInTurnOrder: boolean
  ) {
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
            p.fatePoints = fatePoints >= 0 ? fatePoints : 0;
          }
        });
      })
    );
  }

  function updatePlayerRoll(id: string, roll: IDiceRoll) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((player) => {
          if (player.id === id) {
            player.rolls = [roll, ...player.rolls];
          }
        });
      })
    );
  }

  function fireGoodConfetti() {
    setScene(
      produce((draft: IScene) => {
        draft.goodConfetti++;
      })
    );
  }

  function fireBadConfetti() {
    setScene(
      produce((draft: IScene) => {
        draft.badConfetti++;
      })
    );
  }

  function updateAspectPlayerDuringTurn(id: string, playedDuringTurn: boolean) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].playedDuringTurn = playedDuringTurn;
      })
    );
  }

  function toggleSort() {
    setScene(
      produce((draft: IScene) => {
        draft.sort = !draft.sort;
      })
    );
  }

  return {
    state: { scene },
    actions: {
      reset,
      safeSetScene,
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
      updateAspectPlayerDuringTurn,
      updateAspectColor,
      updatePlayers,
      addOfflinePlayer,
      removeOfflinePlayer,
      updatePlayerFatePoints,
      updatePlayerPlayedDuringTurn,
      resetInitiative,
      updatePlayerRoll,
      fireGoodConfetti,
      fireBadConfetti,
      toggleSort,
    },
  };
}

export const defaultSceneName = "Name of your scene...";

const defaultAspect: IAspect = {
  title: "",
  content: "<br/>",
  freeInvokes: [],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  color: IndexCardColor.White,
  type: AspectType.Aspect,
  playedDuringTurn: false,
};

const defaultBoost: IAspect = {
  title: "",
  content: "<br/>",
  freeInvokes: [false],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  color: IndexCardColor.Blue,
  type: AspectType.Boost,
  playedDuringTurn: false,
};

const defaultNPC: IAspect = {
  title: "",
  content: "<br/>",
  freeInvokes: [],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  color: IndexCardColor.Green,
  type: AspectType.NPC,
  playedDuringTurn: false,
};

const defaultBadGuy: IAspect = {
  title: "",
  content: "<br/>",
  freeInvokes: [],
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  color: IndexCardColor.Red,
  type: AspectType.BadGuy,
  playedDuringTurn: false,
};

const defaultAspects: Record<AspectType, IAspect> = {
  [AspectType.Aspect]: defaultAspect,
  [AspectType.Boost]: defaultBoost,
  [AspectType.NPC]: defaultNPC,
  [AspectType.BadGuy]: defaultBadGuy,
};

const defaultSceneAspects = {};
