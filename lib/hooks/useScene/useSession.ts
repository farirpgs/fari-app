import produce from "immer";
import { useEffect, useState } from "react";
import { Delays } from "../../constants/Delays";
import { useCharacters } from "../../contexts/CharactersContext/CharactersContext";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPointCounterBlock,
} from "../../domains/character/types";
import { Confetti } from "../../domains/confetti/Confetti";
import { getUnix } from "../../domains/dayjs/getDayJS";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { Id } from "../../domains/Id/Id";
import { IDrawingAreaState } from "../../routes/Draw/TldrawWriterAndReader";
import {
  DefaultPlayerColor,
  PlayerColors,
} from "../../routes/Play/consts/PlayerColors";
import { IPlayer, ISession } from "./IScene";

export function useSession(props: { userId: string }) {
  const [session, setSession] = useState<ISession>(
    (): ISession => ({
      gm: {
        id: props.userId,
        playerName: "Game Master",
        rolls: [],
        playedDuringTurn: false,
        points: "3",
        isGM: true,
        private: false,
        color: DefaultPlayerColor,
        npcs: [],
      },
      players: {},
      goodConfetti: 0,
      badConfetti: 0,
      paused: false,
      tlDrawDoc: {
        bindings: {},
        shapes: {},
      },
    })
  );
  const [playerColorIndex, setPlayerColorIndex] = useState(0);
  const me = getEveryone(session).find((p) => p.id === props.userId);

  useEffect(() => {
    let timeout: any;
    if (session.goodConfetti > 0) {
      Confetti.fireConfetti();
      timeout = setTimeout(() => {
        setSession(
          produce((draft) => {
            if (!draft) {
              return;
            }
            draft.goodConfetti = 0;
          })
        );
      }, Delays.clearSessionConfetti);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [session.goodConfetti]);

  useEffect(() => {
    let timeout: any;
    if (session.badConfetti > 0) {
      Confetti.fireCannon();

      timeout = setTimeout(() => {
        setSession(
          produce((draft) => {
            if (!draft) {
              return;
            }
            draft.badConfetti = 0;
          })
        );
      }, Delays.clearSessionConfetti);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [session.badConfetti]);

  function overrideSession(newSession: ISession | undefined) {
    if (newSession) {
      setSession(newSession);
    }
  }
  function updateGmRoll(roll: IDiceRollResult) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.gm.rolls = getNewRolls(roll, draft.gm.rolls);
      })
    );
  }

  function updatePlayerRoll(id: string | undefined, roll: IDiceRollResult) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const everyone = getEveryone(draft);
        everyone.forEach((player) => {
          if (player.id === id) {
            player.rolls = getNewRolls(roll, player.rolls);
          }
        });
      })
    );
  }

  function getNewRolls(
    roll: IDiceRollResult,
    previousRolls: IDiceRollResult[]
  ) {
    const newRolls = [roll, ...previousRolls];

    if (newRolls.length === 10) {
      newRolls.splice(newRolls.length - 5, 5);
    }
    return newRolls;
  }

  function addPlayer(player: IPlayer) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        if (!draft.players[player.id]) {
          draft.players[player.id] = {
            ...player,
            color: PlayerColors[playerColorIndex],
          };
        }
      })
    );
    setPlayerColorIndex((prev) => {
      return (prev + 1) % PlayerColors.length;
    });
  }

  function fireGoodConfetti() {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.goodConfetti++;
      })
    );
  }

  function fireBadConfetti() {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.badConfetti++;
      })
    );
  }
  function pause() {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.paused = true;
      })
    );
  }
  function unpause() {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.paused = false;
      })
    );
  }

  function updateDrawAreaObjects(state: IDrawingAreaState) {
    setSession((prev) => {
      return {
        ...prev,
        tlDrawDoc: state,
      };
    });
  }

  function addOfflinePlayer() {
    const id = Id.generate();
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.gm.npcs.push({
          id: id,
          playerName: `Character #${draft.gm.npcs.length + 1}`,
          rolls: [],
          playedDuringTurn: false,
          isGM: false,
          private: false,
          points: "3",
          color: draft.gm.color,
        });
      })
    );

    return id;
  }

  function removePlayer(id: string) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.gm.npcs = draft.gm.npcs.filter((p) => {
          return p.id !== id;
        });
        delete draft.players[id];
      })
    );
  }

  function togglePlayerVisibility(id: string) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const everyone = getEveryone(draft);
        everyone.forEach((p) => {
          if (p.id === id) {
            p.private = !p.private;
          }
        });
      })
    );
  }

  function resetInitiative() {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const everyone = getEveryone(draft);
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });
      })
    );
  }

  function updatePlayerPlayedDuringTurn(
    id: string,
    playedInTurnOrder: boolean
  ) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const everyone = getEveryone(draft);
        everyone.forEach((p) => {
          if (p.id === id) {
            p.playedDuringTurn = playedInTurnOrder;
          }
        });
      })
    );
  }

  function getEveryone(session: ISession) {
    const players = Object.values(session.players);
    return [session.gm, ...players, ...session.gm.npcs];
  }

  function getPlayersAndNPCs(session: ISession) {
    const players = Object.values(session.players);
    return [session.gm, ...players, ...session.gm.npcs];
  }

  return {
    state: { session },
    computed: {
      me: me,
      everyone: getEveryone(session),
      playersAndNPCs: getPlayersAndNPCs(session),
    },
    actions: {
      overrideSession,
      resetInitiative,
      addNpc: addOfflinePlayer,
      fireBadConfetti,
      fireGoodConfetti,
      removePlayer,
      togglePlayerVisibility,
      updateDrawAreaObjects,
      updateGmRoll,
      updatePlayerPlayedDuringTurn,
      updatePlayerRoll,
      addPlayer,
      pause,
      unpause,
    },
  };
}

export function useSessionCharacterSheets(props: {
  userId: string;
  charactersManager: ReturnType<typeof useCharacters>;
}) {
  const { charactersManager } = props;

  const [characterSheets, setCharacterSheets] = useState<
    Record<string, ICharacter>
  >({});

  useEffect(
    function syncCharacterSheetForMe() {
      Object.entries(characterSheets).forEach(([id, characterSheet]) => {
        const mySheet = id === props.userId;

        if (mySheet) {
          charactersManager.actions.addIfDoesntExist(characterSheet);
        }
        charactersManager.actions.updateIfStoredAndMoreRecent(characterSheet);
      });
    },
    [props.userId, characterSheets]
  );

  function updatePlayerCharacter(
    id: string,
    character: ICharacter,
    loadCharacterHiddenFieldsInPlayer = false
  ) {
    setCharacterSheets(
      produce((draft) => {
        if (!draft) {
          return;
        }

        draft[id] = character;

        if (loadCharacterHiddenFieldsInPlayer) {
          draft[id].playedDuringTurn = character.playedDuringTurn ?? false;
        }
      })
    );
  }

  function loadPlayerCharacter(id: string, character: ICharacter) {
    updatePlayerCharacter(id, character, true);
  }

  function updatePlayerCharacterMainPointCounter(
    id: string,
    points: string,
    maxPoints: string | undefined
  ) {
    setCharacterSheets(
      produce((draft) => {
        if (!draft) {
          return;
        }

        Object.keys(draft).forEach((key) => {
          if (key === id) {
            const character = draft[key];
            const blocks = character.pages
              .flatMap((p) => p.rows)
              .flatMap((r) => r.columns)
              .flatMap((c) => c.sections)
              .flatMap((s) => s.blocks);
            for (const block of blocks) {
              const shouldUpdateBlock =
                block.type === BlockType.PointCounter &&
                block.meta.isMainPointCounter;
              if (shouldUpdateBlock) {
                const typedBlock = block as IPointCounterBlock & IBlock;

                typedBlock.value = points;
                typedBlock.meta.max = maxPoints;
                character.lastUpdated = getUnix();
              }
            }
          }
        });
      })
    );
  }

  function overrideCharacterSheets(
    newCharacterSheets: Record<string, ICharacter> | undefined
  ) {
    if (newCharacterSheets) {
      setCharacterSheets(newCharacterSheets);
    }
  }

  function removeCharacterSheet(playerId: string) {
    setCharacterSheets(
      produce((draft) => {
        if (!draft) {
          return;
        }

        delete draft[playerId];
      })
    );
  }

  return {
    state: {
      characterSheets,
    },
    computed: {},
    actions: {
      overrideCharacterSheets,
      updatePlayerCharacter,
      loadPlayerCharacter,
      updatePlayerCharacterMainPointCounter,
      removeCharacterSheet,
    },
  };
}
