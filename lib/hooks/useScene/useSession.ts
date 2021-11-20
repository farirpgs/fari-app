import { TLDrawDocument } from "@tldraw/tldraw";
import produce from "immer";
import { useEffect, useState } from "react";
import { Delays } from "../../constants/Delays";
import { arraySort } from "../../domains/array/arraySort";
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
import { BlankTLDrawDocument } from "../../routes/Draw/TLDraw";
import { IPlayer, ISession } from "./IScene";
import { IProps } from "./useScene";

export function useSession(props: IProps) {
  const { userId, charactersManager } = props;

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
        npcs: [],
      },
      players: {},
      goodConfetti: 0,
      badConfetti: 0,
      paused: false,
      tlDrawDoc: BlankTLDrawDocument,
    })
  );

  const playersWithCharacterSheets = Object.values(session.players).filter(
    (player) => !!player.character
  );
  const npcsWithCharacterSheets = session.gm.npcs.filter(
    (npc) => !!npc.character
  );
  const sortedPlayersWithCharacterSheets = arraySort(
    playersWithCharacterSheets,
    [
      (p) => {
        return { value: p.id === userId, direction: "asc" };
      },
    ]
  );
  const hasPlayersWithCharacterSheets =
    !!sortedPlayersWithCharacterSheets.length;

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

  useEffect(
    function syncCharacterSheetForMe() {
      const everyone = getEveryone(session);

      everyone.forEach((player) => {
        if (!player.character) {
          return;
        }
        const isMe = props.userId === player.id;

        if (isMe) {
          charactersManager.actions.addIfDoesntExist(player.character);
        }
        charactersManager.actions.updateIfMoreRecent(player.character);
      });
    },
    [props.userId, session]
  );

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
        draft.gm.rolls = [roll, ...draft.gm.rolls];
      })
    );
  }

  function addPlayer(player: IPlayer) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        if (!draft.players[player.id]) {
          draft.players[player.id] = player;
        }
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
            player.rolls = [roll, ...player.rolls];
          }
        });
      })
    );
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

  function updateDrawAreaObjects(doc: TLDrawDocument) {
    setSession((prev) => {
      return {
        ...prev,
        tlDrawDoc: doc,
      };
    });
  }

  // function updatePlayersWithConnections(
  //   connections: Array<Peer.DataConnection>
  // ) {
  //   setSession(
  //     produce((draft) => {
  //       if (!draft) {
  //         return;
  //       }

  //       const players = connections.map<IPlayer>((c) => {
  //         const meta: IPeerMeta = c.metadata;
  //         const playerName = meta.playerName;
  //         const peerJsId = c.label;

  //         const playerMatch = draft.players.find((p) => p.id === peerJsId);
  //         const playerCharacter = playerMatch?.character;

  //         const rolls = playerMatch?.rolls ?? [];
  //         const playedDuringTurn = playerMatch?.playedDuringTurn ?? false;
  //         const points = playerMatch?.points ?? "3";

  //         return {
  //           id: c.label,
  //           playerName: playerName,
  //           character: playerCharacter,
  //           rolls: rolls,
  //           isGM: false,
  //           points: points,
  //           private: false,
  //           playedDuringTurn: playedDuringTurn,
  //           offline: false,
  //         };
  //       });
  //       const allPlayersMinusRemovedPlayersFromStaleConnections =
  //         players.filter((p) => {
  //           return removedPlayers.find((id) => id === p.id) === undefined;
  //         });

  //       draft.players = allPlayersMinusRemovedPlayersFromStaleConnections;
  //     })
  //   );
  // }

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
          character: undefined,
          rolls: [],
          playedDuringTurn: false,
          isGM: false,
          private: false,
          points: "3",
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

  function updatePlayerCharacter(
    id: string,
    character: ICharacter,
    loadCharacterHiddenFieldsInPlayer = false
  ) {
    setSession(
      produce((draft) => {
        const everyone = getEveryone(draft);

        everyone.forEach((p) => {
          if (p.id === id) {
            p.character = character;
            if (loadCharacterHiddenFieldsInPlayer) {
              p.playedDuringTurn = character.playedDuringTurn ?? false;
            }
          }
        });
      })
    );
  }

  function loadPlayerCharacter(id: string, character: ICharacter) {
    updatePlayerCharacter(id, character, true);
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

            if (p.character) {
              p.character.playedDuringTurn = playedInTurnOrder;
              p.character.lastUpdated = getUnix();
            }
          }
        });
      })
    );
  }

  function reset() {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const everyone = getEveryone(draft);
        draft.tlDrawDoc = BlankTLDrawDocument;
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });
      })
    );
  }

  function updatePlayerCharacterMainPointCounter(
    id: string,
    points: string,
    maxPoints: string | undefined
  ) {
    setSession(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const everyone = getEveryone(draft);
        everyone.forEach((p) => {
          if (p.id === id) {
            p.points = points;
            if (p.character) {
              const blocks = p.character.pages
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
                  p.character.lastUpdated = getUnix();
                }
              }
            }
          }
        });
      })
    );
  }

  function getEveryone(session: ISession) {
    const players = Object.values(session.players);
    return [session.gm, ...session.gm.npcs, ...players];
  }

  return {
    state: { session },
    computed: {
      npcsWithCharacterSheets: npcsWithCharacterSheets,
      playersWithCharacterSheets: sortedPlayersWithCharacterSheets,
      hasPlayersWithCharacterSheets,
    },
    actions: {
      overrideSession,
      resetInitiative,
      addNpc: addOfflinePlayer,
      fireBadConfetti,
      fireGoodConfetti,
      loadPlayerCharacter: loadPlayerCharacter,
      removePlayer,
      togglePlayerVisibility,
      reset,
      updateDrawAreaObjects,
      updateGmRoll,
      updatePlayerCharacter,
      updatePlayerPlayedDuringTurn,
      updatePlayerRoll,
      addPlayer,
      updatePlayerCharacterMainPointCounter,
      pause,
      unpause,
    },
  };
}
