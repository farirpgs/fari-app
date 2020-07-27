import { act, renderHook } from "@testing-library/react-hooks";
import Peer from "peerjs";
import {
  CharactersManagerMode,
  useCharacters,
} from "../../../contexts/CharactersContext";
import { ISavableScene } from "../../../contexts/ScenesContext";
import { AspectType } from "../AspectType";
import { IScene } from "../IScene";
import { useScene } from "../useScene";

fdescribe("useScene", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";
    const gameId = undefined;
    const useCharactersMock = mockUseCharacters();

    const expectDefaultScene: IScene = {
      id: expect.anything(),
      name: "",
      aspects: {},
      gm: {
        id: "111",
        playerName: "Game Master",
        rolls: [],
        playedDuringTurn: false,
        fatePoints: 3,
      },
      players: [],
      goodConfetti: 0,
      badConfetti: 0,
      sort: false,
      drawAreaLines: [],
      version: 1,
      lastUpdated: expect.anything(),
    };
    // WHEN
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return useScene({
        userId,
        gameId,
        charactersManager,
        sceneToLoad: undefined,
      });
    });
    // THEN
    expect(result.current.state.scene).toEqual(expectDefaultScene);
  });

  describe("dirty", () => {
    it("should set the name", () => {
      // GIVEN
      const userId = "111";
      const gameId = undefined;
      const useCharactersMock = mockUseCharacters();

      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          const charactersManager = useCharactersMock();
          return useScene({
            userId,
            gameId,
            charactersManager,
            sceneToLoad: props.sceneToLoad,
          });
        },
        {
          initialProps: {
            sceneToLoad: (undefined as unknown) as ISavableScene,
          },
        }
      );

      // THEN
      expect(result.current.state.scene.name).toEqual("");
      expect(result.current.state.dirty).toEqual(false);

      // WHEN
      rerender({
        sceneToLoad: {
          id: "new-id",
          aspects: { "aspect-id": { toto: 3 } as any },
          lastUpdated: 111,
          name: "new name",
          version: 3,
        },
      });

      // THEN
      expect(result.current.state.scene).toEqual({
        aspects: { "aspect-id": { toto: 3 } },
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
        id: "new-id",
        lastUpdated: 111,
        name: "new name",
        players: [],
        sort: false,
        version: 3,
      });

      // WHEN name is different
      act(() => {
        result.current.actions.updateName("New Name from input");
      });
      // THEN dirty is true
      expect(result.current.state.dirty).toEqual(true);

      // WHEN reload
      rerender({
        sceneToLoad: {
          id: "new-id",
          aspects: { "aspect-id": { toto: 3 } as any },
          lastUpdated: 111,
          name: "new name",
          version: 3,
        },
      });
      // THEN dirty is false
      expect(result.current.state.dirty).toEqual(false);

      // WHEN name is different
      act(() => {
        result.current.actions.addAspect(AspectType.Aspect);
      });
      // THEN dirty is true
      expect(result.current.state.dirty).toEqual(true);

      // WHEN reload
      rerender({
        sceneToLoad: {
          id: "new-id",
          aspects: { "aspect-id": { toto: 3 } as any },
          lastUpdated: 111,
          name: "new name",
          version: 3,
        },
      });
      // THEN dirty is false
      expect(result.current.state.dirty).toEqual(false);
    });
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
        return useScene({
          userId,
          gameId,
          charactersManager,
          sceneToLoad: undefined,
        });
      });
      act(() => {
        result.current.actions.updateName("New Name");
      });
      // THEN
      expect(result.current.state.scene.name).toEqual("New Name");
      expect(result.current.state.dirty).toEqual(false);
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
        return useScene({
          userId,
          gameId,
          charactersManager,
          sceneToLoad: undefined,
        });
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
        tracks: [],
        playedDuringTurn: false,
        title: "",
        type: 0,
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
        result.current.actions.addAspectTrack(firstAspectId, "Free Invokes");
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].tracks[0]
      ).toEqual({
        name: "Free Invokes",
        value: [{ checked: false, label: "1" }],
      });
      act(() => {
        // WHEN adding a track box
        result.current.actions.addAspectTrackBox(firstAspectId, 0);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].tracks[0]
      ).toEqual({
        name: "Free Invokes",
        value: [
          { checked: false, label: "1" },
          { checked: false, label: "2" },
        ],
      });
      act(() => {
        // WHEN toggling a track box
        result.current.actions.toggleAspectTrackBox(firstAspectId, 0, 1);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].tracks[0]
      ).toEqual({
        name: "Free Invokes",
        value: [
          { checked: false, label: "1" },
          { checked: true, label: "2" },
        ],
      });
      act(() => {
        // WHEN removing a track box
        result.current.actions.removeAspectTrackBox(firstAspectId, 0);
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].tracks[0]
      ).toEqual({
        name: "Free Invokes",
        value: [{ checked: false, label: "1" }],
      });
      act(() => {
        // WHEN renaming a track
        result.current.actions.updateAspectTrackName(
          firstAspectId,
          0,
          "Countdown"
        );
      });
      // THEN
      expect(
        result.current.state.scene.aspects[firstAspectId].tracks[0]
      ).toEqual({
        name: "Countdown",
        value: [{ checked: false, label: "1" }],
      });
      act(() => {
        // WHEN removing a track
        result.current.actions.removeAspectTrack(firstAspectId, 0);
      });
      // THEN
      expect(result.current.state.scene.aspects[firstAspectId].tracks).toEqual(
        []
      );
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
        tracks: [],
        playedDuringTurn: false,
        title: "",
        type: AspectType.Aspect,
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
        return useScene({
          userId,
          gameId,
          charactersManager,
          sceneToLoad: undefined,
        });
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
        characters: [],
        mode: CharactersManagerMode.Close,
        selectedCharacter: undefined,
      },
      actions: {
        add: jest.fn(),
        upsert: jest.fn(),
        remove: jest.fn(),
        select: jest.fn(),
        clearSelected: jest.fn(),
        closeManager: jest.fn(),
        openManager: jest.fn(),
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
