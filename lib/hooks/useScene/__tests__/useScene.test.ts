import { act, renderHook } from "@testing-library/react-hooks";
import { IIndexCard } from "../IScene";
import { useScene } from "../useScene";

describe("useScene", () => {
  it("constructor", () => {
    // GIVEN
    // WHEN
    const { result } = renderHook(() => {
      return useScene();
    });
    // THEN
    expect(result.current.state.scene).toEqual(undefined);
  });

  describe("dirty", () => {
    it("should set the name", () => {
      // GIVEN

      // WHEN
      const { result } = renderHook(() => {
        return useScene();
      });

      // THEN
      expect(result.current.state.scene?.name).toEqual(undefined);
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
        result.current.actions.loadScene(sceneToLoad);
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
        group: undefined,
        notes: undefined,

        id: "new-id",
        lastUpdated: 111,
        name: "new name",
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
        result.current.actions.loadScene(sceneToLoad);
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
        result.current.actions.loadScene({
          id: "new-id",
          group: undefined,
          indexCards: { public: [{ id: "aspect-id" } as any], private: [] },
          lastUpdated: 111,
          name: "new name",
          version: 3,
        });
      });
      // THEN dirty is false
      expect(result.current.state.dirty).toEqual(false);
    });
  });
  describe("setName", () => {
    it("should set the name", () => {
      // GIVEN

      // WHEN
      const { result } = renderHook(() => {
        return useScene();
      });
      const sceneToLoad = {
        id: "new-id",
        group: undefined,
        indexCards: { public: [], private: [] },
        lastUpdated: 111,
        name: "Original Name",
        version: 3,
      };
      act(() => {
        result.current.actions.loadScene(sceneToLoad);
      });
      act(() => {
        result.current.actions.updateName("New Name");
      });
      // THEN
      expect(result.current.state.scene?.name).toEqual("New Name");
      expect(result.current.state.dirty).toEqual(true);
    });
  });

  describe("resetScene,", () => {
    it("should reset a scene", () => {
      // GIVEN

      // WHEN initial render
      const { result } = renderHook(() => {
        return useScene();
      });

      // WHEN setuping scene
      const sceneToLoad = {
        id: "new-id",
        group: undefined,
        indexCards: { public: [], private: [] },
        lastUpdated: 111,
        name: "new name",
        version: 3,
      };
      act(() => {
        result.current.actions.loadScene(sceneToLoad);
      });
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

      // WHEN initial render
      const { result } = renderHook(() => {
        return useScene();
      });

      // WHEN setuping scene
      const sceneToLoad = {
        id: "new-id",
        group: undefined,
        indexCards: { public: [], private: [] },
        lastUpdated: 111,
        name: "new name",
        version: 3,
      };
      act(() => {
        result.current.actions.loadScene(sceneToLoad);
      });
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
});
