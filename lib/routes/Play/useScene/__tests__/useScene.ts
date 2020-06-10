import { act, renderHook } from "@testing-library/react-hooks";
import Peer from "peerjs";
import { useCharacters } from "../../../../contexts/CharactersContext";
import { AspectType } from "../AspectType";
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

  describe("aspects", () => {
    it("should be able to manage aspects", () => {
      // GIVEN
      const userId = "111";
      const gameId = undefined;
      const useCharactersMock = mockUseCharacters();

      // WHEN initial render
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene(userId, gameId, charactersManager);
      });
      act(() => {
        // WHEN adding an aspect
        result.current.actions.addAspect(AspectType.Aspect);
      });
      // THEN aspect exists
      const [firstAspectId] = Object.keys(result.current.state.scene.aspects);
      expect(result.current.state.scene.aspects[firstAspectId]).toEqual({
        color: "white",
        consequences: [],
        content: "<br/>",
        freeInvokes: [],
        mentalStress: [],
        physicalStress: [],
        playedDuringTurn: false,
        title: "",
        type: 2,
      });
      act(() => {
        // WHEN updating the title
        result.current.actions.updateAspectTitle(firstAspectId, "new title");
      });
      // THEN
      expect(result.current.state.scene.aspects[firstAspectId].title).toEqual(
        "new title"
      );
      act(() => {
        // WHEN updating the content
        result.current.actions.updateAspectContent(
          firstAspectId,
          "new content"
        );
      });
      // THEN
      expect(result.current.state.scene.aspects[firstAspectId].content).toEqual(
        "new content"
      );
      act(() => {
        // WHEN adding free invoke
        result.current.actions.addAspectFreeInvoke(firstAspectId);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].freeInvokes
      ).toEqual([false]);
      act(() => {
        // WHEN updating free invoke
        result.current.actions.updateAspectFreeInvoke(firstAspectId, 0, true);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].freeInvokes
      ).toEqual([true]);
      act(() => {
        // WHEN adding physical stress
        result.current.actions.addAspectPhysicalStress(firstAspectId);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].physicalStress
      ).toEqual([false]);
      act(() => {
        // WHEN updating physical stress
        result.current.actions.updateAspectPhysicalStress(
          firstAspectId,
          0,
          true
        );
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].physicalStress
      ).toEqual([true]);
      act(() => {
        // WHEN adding mental stress
        result.current.actions.addAspectMentalStress(firstAspectId);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].mentalStress
      ).toEqual([false]);
      act(() => {
        // WHEN updating mental stress
        result.current.actions.updateAspectMentalStress(firstAspectId, 0, true);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].mentalStress
      ).toEqual([true]);
      act(() => {
        // WHEN adding consequence
        result.current.actions.addAspectConsequence(firstAspectId);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].consequences
      ).toEqual([""]);
      act(() => {
        // WHEN updating consequence
        result.current.actions.updateAspectConsequence(
          firstAspectId,
          0,
          "new consequence"
        );
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].consequences
      ).toEqual(["new consequence"]);
      act(() => {
        // WHEN updating initiative
        result.current.actions.updateAspectPlayerDuringTurn(
          firstAspectId,
          true
        );
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].playedDuringTurn
      ).toEqual(true);
      act(() => {
        // WHEN updating color
        result.current.actions.updateAspectColor(firstAspectId, "blue");
      });
      // THEN
      expect(result.current.state.scene.aspects[firstAspectId].color).toEqual(
        "blue"
      );
      act(() => {
        // WHEN reseting aspect
        result.current.actions.resetAspect(firstAspectId);
      });
      // THEN
      expect(result.current.state.scene.aspects[firstAspectId]).toEqual({
        color: "white",
        consequences: [],
        content: "<br/>",
        freeInvokes: [],
        mentalStress: [],
        physicalStress: [],
        playedDuringTurn: false,
        title: "",
        type: 2,
      });
      act(() => {
        // WHEN removing aspect
        result.current.actions.removeAspect(firstAspectId);
      });
      // THEN
      expect(result.current.state.scene.aspects).toEqual({});
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
