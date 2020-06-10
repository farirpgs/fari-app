import { act, renderHook } from "@testing-library/react-hooks";
import Peer from "peerjs";
import { useCharacters } from "../../../../contexts/CharactersContext";
import { IScene } from "../IScene";
import { useScene } from "../useScene";

describe("useScene", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";
    const gameId = undefined;
    const useCharactersMock = mockUseCharacters();

    const defaultScene: IScene = {
      aspects: {},
      badConfetti: 0,
      drawAreaLines: [],
      gm: {
        fatePoints: 3,
        id: "111",
        playedDuringTurn: false,
        playerName: "Game Master",
        rolls: [],
      },
      goodConfetti: 0,
      name: "",
      players: [],
      sort: false,
    };
    // WHEN
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return useScene(userId, gameId, charactersManager);
    });
    // THEN
    expect(result.current.state.scene).toEqual(defaultScene);
  });

  describe("setName", () => {
    it("should set the name", () => {
      // GIVEN
      const userId = "111";
      const gameId = undefined;
      const useCharactersMock = mockUseCharacters();

      // WHEN
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene(userId, gameId, charactersManager);
      });
      act(() => {
        result.current.actions.setName("New Name");
      });
      // THEN
      expect(result.current.state.scene.name).toEqual("New Name");
    });
  });
  describe("updatePlayers", () => {
    it("should map connections to players", () => {
      // GIVEN
      const userId = "111";
      const gameId = undefined;
      const useCharactersMock = mockUseCharacters();

      // WHEN initial render
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene(userId, gameId, charactersManager);
      });
      // WHEN initial connection with a player
      act(() => {
        result.current.actions.updatePlayers([
          {
            label: "1",
            metadata: {
              playerName: "RP",
            },
          },
        ] as Array<Peer.DataConnection>);
      });
      // THEN
      expect(result.current.state.scene.players[0]).toEqual({
        character: undefined,
        fatePoints: 3,
        id: "1",
        playedDuringTurn: false,
        playerName: "RP",
        rolls: [],
      });
      // WHEN player plays (fp, rolls, initiative)
      act(() => {
        result.current.actions.updatePlayerPlayedDuringTurn("1", true);
        result.current.actions.updatePlayerRoll("1", {
          rolls: [1, 1, 1, 1],
          total: 4,
        });
        result.current.actions.updatePlayerFatePoints("1", 1);
      });
      // THEN connection mappings reflects that
      expect(result.current.state.scene.players[0]).toEqual({
        character: undefined,
        fatePoints: 1,
        id: "1",
        playedDuringTurn: true,
        playerName: "RP",
        rolls: [
          {
            rolls: [1, 1, 1, 1],
            total: 4,
          },
        ],
      });
      // WHEN new player joins with high refresh
      act(() => {
        result.current.actions.updatePlayers([
          {
            label: "1",
            metadata: {
              playerName: "RP",
            },
          },
          {
            label: "2",
            metadata: {
              character: {
                refresh: 15,
              },
            },
          },
        ] as Array<Peer.DataConnection>);
      });
      // THEN player 1 is the same but player 2 joined with high refresh
      expect(result.current.state.scene.players[0]).toEqual({
        character: undefined,
        fatePoints: 1,
        id: "1",
        playedDuringTurn: true,
        playerName: "RP",
        rolls: [
          {
            rolls: [1, 1, 1, 1],
            total: 4,
          },
        ],
      });
      expect(result.current.state.scene.players[1]).toEqual({
        character: { refresh: 15 },
        fatePoints: 15,
        id: "2",
        playedDuringTurn: false,
        playerName: undefined,
        rolls: [],
      });
    });
  });
});

function mockUseCharacters() {
  return () => {
    return {
      state: {
        characters: undefined,
        selectedCharacter: undefined,
      },
      actions: {
        add: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        select: jest.fn(),
        close: jest.fn(),
      },
    } as ReturnType<typeof useCharacters>;
  };
}
// reset,
// safeSetScene,
// addAspect,
// removeAspect,
// resetAspect,
// updateAspectTitle,
// updateAspectContent,
// addAspectFreeInvoke,
// updateAspectFreeInvoke,
// addAspectPhysicalStress,
// updateAspectPhysicalStress,
// addAspectMentalStress,
// updateAspectMentalStress,
// addAspectConsequence,
// updateAspectConsequence,
// updateAspectPlayerDuringTurn,
// updateAspectColor,
// addOfflinePlayer,
// addOfflineCharacter,
// removeOfflinePlayer,
// updatePlayerFatePoints,
// updatePlayerPlayedDuringTurn,
// resetInitiative,
// updatePlayerRoll,
// fireGoodConfetti,
// fireBadConfetti,
// toggleSort,
// updatePlayerCharacter,
// setDrawAreaLines,
// ,
