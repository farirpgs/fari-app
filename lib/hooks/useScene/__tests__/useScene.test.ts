import { act, renderHook } from "@testing-library/react-hooks";
import Peer from "peerjs";
import {
  ILineObject,
  ObjectType,
} from "../../../components/DrawArea/hooks/useDrawing";
import { ManagerMode } from "../../../components/Manager/Manager";
import { useCharacters } from "../../../contexts/CharactersContext/CharactersContext";
import { defaultSceneName } from "../../../contexts/SceneContext/ScenesContext";
import { RollType } from "../../../domains/dice/Dice";
import { IIndexCard, IScene } from "../IScene";
import { useScene } from "../useScene";

describe("useScene", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";
    const gameId = undefined;
    const useCharactersMock = mockUseCharacters();

    const expectDefaultScene: IScene = {
      id: expect.anything(),
      name: defaultSceneName,
      group: undefined,
      indexCards: {
        public: [],
        private: [],
      },
      gm: {
        id: "111",
        playerName: "Game Master",
        rolls: [],
        playedDuringTurn: false,
        offline: false,
        isGM: true,
        points: "3",
      },
      players: [],
      goodConfetti: 0,
      badConfetti: 0,
      sort: false,
      drawAreaObjects: [],
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
      const { result, rerender } = renderHook((props) => {
        const charactersManager = useCharactersMock();
        return useScene({
          userId,
          gameId,
          charactersManager,
        });
      });

      // THEN
      expect(result.current.state.scene.name).toEqual(defaultSceneName);
      expect(result.current.state.dirty).toEqual(false);

      // GIVEN
      const sceneToLoad = {
        id: "new-id",
        group: undefined,

        indexCards: { public: [{ id: "aspect-id" } as any], private: [] },
        lastUpdated: 111,
        name: "new name",
        version: 3,
      };
      // WHEN
      act(() => {
        result.current.actions.loadScene(sceneToLoad, true);
      });

      // THEN
      expect(result.current.state.scene).toEqual({
        aspects: { "aspect-id": { toto: 3 } },
        badConfetti: 0,
        drawAreaObjects: [],
        group: undefined,
        notes: undefined,
        gm: {
          id: "111",
          playedDuringTurn: false,
          playerName: "Game Master",
          rolls: [],
          offline: false,
          isGM: true,
          points: "3",
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

      // WHEN reload the same scene
      act(() => {
        result.current.actions.loadScene(sceneToLoad, true);
      });

      // THEN dirty is false
      expect(result.current.state.dirty).toEqual(false);

      // WHEN name is different
      act(() => {
        result.current.actions.addIndexCard("public");
      });
      // THEN dirty is true
      expect(result.current.state.dirty).toEqual(true);

      // WHEN reload
      act(() => {
        result.current.actions.loadScene(
          {
            id: "new-id",
            group: undefined,
            indexCards: { public: [{ id: "aspect-id" } as any], private: [] },
            lastUpdated: 111,
            name: "new name",
            version: 3,
          },
          true
        );
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

  describe("players", () => {
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
        });
      });
      // WHEN initial connection with a player
      act(() => {
        result.current.actions.updatePlayersWithConnections([
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
        id: "1",
        isGM: false,
        points: "3",
        playedDuringTurn: false,
        offline: false,
        playerName: "RP",
        rolls: [],
      });
      // WHEN player plays (fp, rolls, initiative)
      act(() => {
        result.current.actions.updatePlayerPlayedDuringTurn("1", true);
        result.current.actions.updatePlayerRoll("1", {
          commandResult: [
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
          ],
          total: 4,
          totalWithoutModifiers: 4,
          options: { listResults: false },
        });
        result.current.actions.updatePlayerCharacterMainPointCounter(
          "1",
          "1",
          "3"
        );
      });
      // THEN connection mappings reflects that
      expect(result.current.state.scene.players[0]).toEqual({
        character: undefined,
        id: "1",
        playedDuringTurn: true,
        isGM: false,
        points: "1",
        offline: false,
        playerName: "RP",
        rolls: [
          {
            commandResult: [
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
            ],
            options: {
              listResults: false,
            },
            total: 4,
            totalWithoutModifiers: 4,
          },
        ],
      });
      act(() => {
        // WHEN reseting initiative
        result.current.actions.resetInitiative();
      });
      // THEN initiative is reset
      expect(result.current.state.scene.players[0]).toEqual({
        character: undefined,
        id: "1",
        playedDuringTurn: false,
        isGM: false,
        points: "1",
        offline: false,
        playerName: "RP",
        rolls: [
          {
            commandResult: [
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
              {
                command: "1dF",
                type: "DiceCommand",
                value: 1,
              },
            ],
            options: {
              listResults: false,
            },
            total: 4,
            totalWithoutModifiers: 4,
          },
        ],
      });
      act(() => {
        // WHEN player adds character sheet
        result.current.actions.updatePlayerCharacter("1", ({
          myCharacter: "my first character",
        } as unknown) as any);
      });
      // THEN player as character
      expect(result.current.state.scene.players[0].character).toEqual({
        myCharacter: "my first character",
      });
      act(() => {
        // WHEN player reloads character sheet
        result.current.actions.updatePlayerCharacter("1", ({
          myCharacter: "my second character",
        } as unknown) as any);
      });
      // THEN player as character
      expect(result.current.state.scene.players[0].character).toEqual({
        myCharacter: "my second character",
      });

      act(() => {
        // WHEN player reloads character sheet
        result.current.actions.updatePlayerCharacter("1", ({
          myCharacter: "my second character",
        } as unknown) as any);
      });
      // THEN player as character
      expect(result.current.state.scene.players[0].character).toEqual({
        myCharacter: "my second character",
      });
    });
    describe("removePlayers sticky connections", () => {
      it("should keep removed players out", () => {
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
          });
        });
        // WHEN initial connection with a player
        act(() => {
          result.current.actions.updatePlayersWithConnections([
            {
              label: "1",
              metadata: {
                playerName: "RP",
              },
            },
            {
              label: "2",
              metadata: {
                playerName: "Xav Bad Connection",
              },
            },
          ] as Array<Peer.DataConnection>);
        });
        // THEN I should have 2 players
        expect(result.current.state.scene.players).toEqual([
          {
            character: undefined,
            id: "1",
            playedDuringTurn: false,
            offline: false,
            isGM: false,
            points: "3",
            playerName: "RP",
            rolls: [],
          },
          {
            character: undefined,
            id: "2",
            playedDuringTurn: false,
            offline: false,
            isGM: false,
            points: "3",
            playerName: "Xav Bad Connection",
            rolls: [],
          },
        ]);

        // WHEN I kick a bad connection
        act(() => {
          result.current.actions.removePlayer("2");
        });

        // THEN I only have one player
        expect(result.current._.removedPlayers).toEqual(["2"]);
        expect(result.current.state.scene.players).toEqual([
          {
            character: undefined,
            id: "1",
            playedDuringTurn: false,
            isGM: false,
            points: "3",
            offline: false,
            playerName: "RP",
            rolls: [],
          },
        ]);

        // WHEN the bad connection joins with a new id
        act(() => {
          result.current.actions.updatePlayersWithConnections([
            {
              label: "1",
              metadata: {
                playerName: "RP",
              },
            },
            {
              label: "2",
              metadata: {
                playerName: "Xav Bad Connection",
              },
            },
            {
              label: "3",
              metadata: {
                playerName: "Xav GOOD",
              },
            },
          ] as Array<Peer.DataConnection>);

          // THEN I only have two player
          expect(result.current.state.scene.players).toEqual([
            {
              character: undefined,
              id: "1",
              offline: false,
              isGM: false,
              points: "3",
              playedDuringTurn: false,
              playerName: "RP",
              rolls: [],
            },
          ]);
        });
      });
    });
  });

  describe("sort", () => {
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
      });
    });
    expect(result.current.state.scene.sort).toEqual(false);
    // WHEN toggle sort
    act(() => {
      result.current.actions.toggleSort();
    });
    // THEN
    expect(result.current.state.scene.sort).toEqual(true);
    // WHEN toggle sort
    act(() => {
      result.current.actions.toggleSort();
    });
    // THEN
    expect(result.current.state.scene.sort).toEqual(false);
  });
  describe("draw area", () => {
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
      });
    });
    expect(result.current.state.scene.drawAreaObjects).toEqual([]);
    // WHEN drawing
    act(() => {
      result.current.actions.updateDrawAreaObjects([
        { color: "", points: [], type: ObjectType.Line } as ILineObject,
      ]);
    });
    // THEN
    expect(result.current.state.scene.drawAreaObjects).toEqual([
      { color: "", points: [], type: ObjectType.Line },
    ]);
  });
  describe("confetti", () => {
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
      });
    });
    expect(result.current.state.scene.goodConfetti).toEqual(0);
    expect(result.current.state.scene.badConfetti).toEqual(0);

    // WHEN good confetti
    act(() => {
      result.current.actions.fireGoodConfetti();
    });
    // THEN
    expect(result.current.state.scene.goodConfetti).toEqual(0);
    expect(result.current.state.scene.badConfetti).toEqual(0);
    // WHEN bad confetti
    act(() => {
      result.current.actions.fireBadConfetti();
    });
    // THEN
    expect(result.current.state.scene.goodConfetti).toEqual(0);
    expect(result.current.state.scene.badConfetti).toEqual(0);
  });

  describe("resetScene,", () => {
    it("should reset a scene", () => {
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
        });
      });

      // WHEN setuping scene
      act(() => {
        result.current.actions.updateName("NAME");
        result.current.actions.addIndexCard(false);
      });
      // THEN
      expect(result.current.state.scene.name).toEqual("NAME");
      expect(Object.keys(result.current.state.scene.indexCards).length).toEqual(
        1
      );

      // WHEN reseting
      act(() => {
        result.current.actions.resetScene();
      });
      expect(result.current.state.scene.name).toEqual(defaultSceneName);
      expect(Object.keys(result.current.state.scene.indexCards).length).toEqual(
        0
      );
    });
    it("keep sticky aspects", () => {
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
        });
      });

      // WHEN setuping scene
      let npcIndexCard: IIndexCard;
      act(() => {
        npcIndexCard = result.current.actions.addIndexCard(false);
        result.current.actions.addIndexCard(false);
        result.current.actions.updateIndexCard({
          ...npcIndexCard,
          pinned: true,
        });
      });
      // THEN
      expect(Object.keys(result.current.state.scene.indexCards).length).toEqual(
        2
      );

      // WHEN reseting
      act(() => {
        result.current.actions.resetScene();
      });
      expect(result.current.state.scene.name).toEqual(defaultSceneName);
      expect(Object.keys(result.current.state.scene.indexCards).length).toEqual(
        1
      );
    });
  });
  describe("safeSetScene", () => {
    // GIVEN
    const userId = "111";
    const gameId = undefined;
    const useCharactersMock = mockUseCharacters();

    // WHEN initial render
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return {
        useScene: useScene({
          userId,
          gameId,
          charactersManager,
        }),
        useCharacters: charactersManager,
      };
    });
    // WHEN safeSet with nothing
    act(() => {
      result.current.useScene.actions.safeSetScene(
        (undefined as unknown) as any
      );
    });
    // WHEN safeSet
    act(() => {
      result.current.useScene.actions.safeSetScene(({
        players: [{ character: {} }, { character: {} }],
      } as unknown) as any);
    });
    // THEN
    expect(result.current.useScene.state.scene).toEqual({
      players: [{ character: {} }, { character: {} }],
    });
    expect(
      result.current.useCharacters.actions.updateIfExists
    ).toHaveBeenCalledTimes(2);
  });
  describe("o", () => {
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
      });
    });
    expect(result.current.state.scene.sort).toEqual(false);
    // WHEN adding an offline character
    let playerId = "";
    act(() => {
      playerId = result.current.actions.addOfflinePlayer();
    });
    // THEN
    expect(result.current.state.scene.players).toEqual([
      {
        character: undefined,
        points: "3",
        id: playerId,
        playedDuringTurn: false,
        isGM: false,
        offline: true,
        playerName: "",
        rolls: [],
      },
    ]);
    // WHEN removing an offline player
    act(() => {
      result.current.actions.removePlayer(playerId);
    });
  });
});

function mockUseCharacters() {
  const result = {
    state: {
      characters: [],
      groups: [],
      mode: ManagerMode.Close,
      managerCallback: undefined,
    },
    actions: {
      add: jest.fn(),
      upsert: jest.fn(),
      updateIfExists: jest.fn(),
      remove: jest.fn(),
      duplicate: jest.fn(),
      select: jest.fn(),
      clearSelected: jest.fn(),
      closeManager: jest.fn(),
      openManager: jest.fn(),
    },
    selectors: {
      isInStorage: jest.fn(),
    },
  } as ReturnType<typeof useCharacters>;
  return () => {
    return result;
  };
}

// TODO: ...
// updatePlayerCharacterMainPointCounter
// cloneAndLoadNewScene
// forceDirty
// setGroup
// moveAspects
