import { act, renderHook } from "@testing-library/react-hooks";
import {
  CharacterType,
  defaultCharactersByType,
  ICharacter,
} from "../../../../contexts/CharactersContext/CharactersContext";
import { useCharacter } from "../useCharacter";

describe("useCharacter", () => {
  describe("refresh", () => {
    // GIVEN
    const character = {
      ...defaultCharactersByType[CharacterType.CoreCondensed],
      id: "1",
      lastUpdated: 1,
    };
    // WHEN
    const { result, rerender } = renderHook(
      (props) => {
        return useCharacter(character);
      },
      {
        initialProps: { character: character },
      }
    );
    // THEN
    expect(result.current.state.character).toEqual(character);
    // WHEN the refresh i updated
    act(() => {
      result.current.actions.updateRefresh(4);
    });
    expect(result.current.state.character?.refresh).toEqual(4);
  });

  describe("sanitizeCharacter", () => {
    // GIVEN
    const character = {
      ...defaultCharactersByType[CharacterType.CoreCondensed],
      id: "1",
      lastUpdated: 1,
    };
    // WHEN
    const { result, rerender } = renderHook(
      (props) => {
        return useCharacter(character);
      },
      {
        initialProps: { character: character },
      }
    );
    // THEN
    expect(result.current.state.character).toEqual(character);
    // WHEN the refresh i updated
    act(() => {
      result.current.actions.setName("Luke&nbsp;Skywalker&nbsp;&nbsp;");
    });
    expect(result.current.actions.sanitizeCharacter().name).toEqual(
      "Luke Skywalker"
    );
    expect(result.current.actions.sanitizeCharacter().lastUpdated).not.toEqual(
      1
    );
  });

  describe("sync props with state", () => {
    it("should not crash if characters in props in undefined", async () => {
      // GIVEN
      const initialRenderCharacter = (undefined as unknown) as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      expect(result.current.state.character).toEqual(undefined);
    });
    it("should not update state if character in props lastTimeUpdated is older than current state", async () => {
      // GIVEN
      const initialRenderCharacter = {
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      // CHARACTER UPDATED IN DIALOG
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      // GM SYNC SCENE WITH PLAYER WITH OUTDATED CHARACTER
      rerender({
        character: { name: "Luke", lastUpdated: 4 } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Luke Skywalker");
    });
    it("should update state if character in props lastTimeUpdated is older than current state but id is different", async () => {
      // GIVEN
      const initialRenderCharacter = {
        id: "1-luke",
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      rerender({
        character: {
          id: "2-chewie",
          name: "Chewie",
          lastUpdated: 4,
        } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Chewie");
    });
    it("should not update state if character in props lastUpdatedTime is same as current state", async () => {
      // GIVEN
      const initialRenderCharacter = {
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      // CHARACTER UPDATED IN DIALOG
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      // GM SYNC SCENE WITH PLAYER WITH OUTDATED CHARACTER
      rerender({
        character: { name: "Luke", lastUpdated: 5 } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Luke Skywalker");
    });
    it("should update state if character in props is newer than current state", async () => {
      // GIVEN
      const initialRenderCharacter = {
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      // CHARACTER UPDATED IN DIALOG
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      // GM SYNC SCENE WITH PLAYER WITH NEW VERSION CHARACTER
      rerender({
        character: { name: "Leia", lastUpdated: 6 } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Leia");
    });
  });

  describe("load template", () => {
    it("should load the new template but keep the id and the name as is", () => {
      // GIVEN
      const character = {
        ...defaultCharactersByType[CharacterType.CoreCondensed],
        id: "1",
        name: "Luke Skywalker",
        lastUpdated: 1,
      };
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(character);
        },
        {
          initialProps: { character: character },
        }
      );
      // THEN
      expect(result.current.state.character).toEqual(character);

      // WHEN a tempalte is laoded
      act(() => {
        result.current.actions.loadTemplate(CharacterType.Accelerated);
      });
      expect(result.current.state.character?.lastUpdated).not.toEqual(
        character.lastUpdated
      );

      expect(result.current.state.character).toEqual({
        id: "1", // kept ID
        name: "Luke Skywalker", // kept name
        aspects: [
          { name: "High Concept", value: "" },
          { name: "Trouble", value: "" },
          { name: "Relationship", value: "" },
          { name: "Other Aspect", value: "" },
          { name: "Other Aspect", value: "" },
        ],
        consequences: [
          { name: "Mild", value: "" },
          { name: "Moderate", value: "" },
          { name: "Severe", value: "" },
        ],
        lastUpdated: expect.anything(),
        refresh: 3,
        skills: [
          { name: "Careful", value: "" },
          { name: "Clever", value: "" },
          { name: "Forceful", value: "" },
          { name: "Flashy", value: "" },
          { name: "Quick", value: "" },
          { name: "Sneaky", value: "" },
        ],
        stressTracks: [
          {
            name: "Stress",
            value: [
              { checked: false, label: "1" },
              { checked: false, label: "2" },
              { checked: false, label: "3" },
            ],
          },
        ],
        stunts: [
          { name: "Stunt #1", value: "" },
          { name: "Stunt #2", value: "" },
          { name: "Stunt #3", value: "" },
        ],
        version: 2,
      });
    });
  });
});
