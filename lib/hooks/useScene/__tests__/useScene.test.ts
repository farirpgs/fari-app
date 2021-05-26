import { act, renderHook } from "@testing-library/react-hooks";
import { useCharacters } from "../../../contexts/CharactersContext/CharactersContext";
import { defaultSceneName } from "../../../contexts/SceneContext/ScenesContext";
import { IIndexCard, IScene } from "../IScene";
import { useScene } from "../useScene";

describe("useScene", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";
    const useCharactersMock = mockUseCharacters();

    const expectDefaultScene: IScene = {
      id: expect.anything(),
      name: defaultSceneName,
      group: undefined,
      indexCards: {
        public: [],
        private: [],
      },

      version: 2,
      lastUpdated: expect.anything(),
    };
    // WHEN
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return useScene({
        userId,
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
      const useCharactersMock = mockUseCharacters();

      // WHEN
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene({
          userId,
          charactersManager,
        });
      });

      // THEN
      expect(result.current.state.scene?.name).toEqual(defaultSceneName);
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
        indexCards: {
          private: [],
          public: [
            {
              id: "aspect-id",
            },
          ],
        },

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
      const useCharactersMock = mockUseCharacters();

      // WHEN
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene({
          userId,
          charactersManager,
        });
      });
      act(() => {
        result.current.actions.updateName("New Name");
      });
      // THEN
      expect(result.current.state.scene?.name).toEqual("New Name");
      expect(result.current.state.dirty).toEqual(false);
    });
  });

  describe("resetScene,", () => {
    it("should reset a scene", () => {
      // GIVEN
      const userId = "111";
      const useCharactersMock = mockUseCharacters();

      // WHEN initial render
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene({
          userId,

          charactersManager,
        });
      });

      // WHEN setuping scene
      act(() => {
        result.current.actions.updateName("NAME");
        result.current.actions.addIndexCard("public");
      });
      // THEN
      expect(result.current.state.scene?.name).toEqual("NAME");
      expect(
        Object.keys(result.current.state.scene?.indexCards.public ?? {}).length
      ).toEqual(1);

      // // WHEN reseting
      // act(() => {
      //   result.current.actions.resetScene();
      // });
      // expect(result.current.state.scene?.name).toEqual(defaultSceneName);
      // expect(
      //   Object.keys(result.current.state.scene?.indexCards.public ?? {}).length
      // ).toEqual(0);
    });
    it("keep sticky aspects", () => {
      // GIVEN
      const userId = "111";
      const useCharactersMock = mockUseCharacters();

      // WHEN initial render
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useScene({
          userId,

          charactersManager,
        });
      });

      // WHEN setuping scene
      let npcIndexCard: IIndexCard;
      act(() => {
        npcIndexCard = result.current.actions.addIndexCard("public");
        result.current.actions.addIndexCard("public");
        result.current.actions.updateIndexCard(
          {
            ...npcIndexCard,
            pinned: true,
          },
          "public"
        );
      });
      // THEN
      expect(
        Object.keys(result.current.state.scene?.indexCards ?? {}).length
      ).toEqual(2);

      // // WHEN reseting
      // act(() => {
      //   result.current.actions.new();
      // });
      // expect(result.current.state.scene?.name).toEqual(defaultSceneName);
      // expect(
      //   Object.keys(result.current.state.scene?.indexCards.public ?? {}).length
      // ).toEqual(1);
    });
  });
  describe("safeSetScene", () => {
    // GIVEN
    const userId = "111";
    const useCharactersMock = mockUseCharacters();

    // WHEN initial render
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return {
        useScene: useScene({
          userId,

          charactersManager,
        }),
        useCharacters: charactersManager,
      };
    });
    // WHEN safeSet with nothing
    act(() => {
      result.current.useScene.actions.overrideScene(
        (undefined as unknown) as any
      );
    });
    // WHEN safeSet
    act(() => {
      result.current.useScene.actions.overrideScene(({
        players: [{ character: {} }, { character: {} }],
      } as unknown) as any);
    });
    // THEN
    expect(result.current.useScene.state.scene).toEqual({
      players: [{ character: {} }, { character: {} }],
    });
    expect(
      result.current.useCharacters.actions.updateIfMoreRecent
    ).toHaveBeenCalledTimes(2);
  });
});

function mockUseCharacters() {
  const result = {
    state: {
      characters: [],
      groups: [],
    },
    actions: {
      add: jest.fn(),
      upsert: jest.fn(),
      updateIfMoreRecent: jest.fn(),
      addIfDoesntExist: jest.fn(),
      remove: jest.fn(),
      duplicate: jest.fn(),
      select: jest.fn(),
      clearSelected: jest.fn(),
      exportEntity: jest.fn(),
      importEntity: jest.fn(),
    },
    selectors: {
      isInStorage: jest.fn(),
    },
  } as ReturnType<typeof useCharacters>;
  return () => {
    return result;
  };
}
