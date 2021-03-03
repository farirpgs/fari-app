import { act, renderHook } from "@testing-library/react-hooks";
import { CharacterFactory } from "../../../../domains/character/CharacterFactory";
import { CharacterType } from "../../../../domains/character/CharacterType";
import { ICharacter } from "../../../../domains/character/types";
import { useCharacter } from "../useCharacter";

describe("useCharacter", () => {
  describe("sanitizeCharacter", () => {
    // GIVEN
    const character = {
      ...CharacterFactory.make(CharacterType.CoreCondensed),
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
    // WHEN the name is updated
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
        ...CharacterFactory.make(CharacterType.CoreCondensed),
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

      // id: "1", // kept ID
      // name: "Luke Skywalker", // kept name
      expect(result.current.state.character).toEqual({
        group: undefined,
        id: "1",
        lastUpdated: expect.anything(),
        name: "Luke Skywalker",
        pages: [
          {
            id: expect.anything(),
            sections: [
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "High Concept",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Trouble",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Relationship",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Other Aspect",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Other Aspect",
                    value: "",
                  },
                ],
                id: expect.anything(),
                visibleOnCard: true,
                label: "Aspects",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Stunt #1",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Stunt #2",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Stunt #3",
                    value: "",
                  },
                ],

                id: expect.anything(),
                label: "Stunts & Extras",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Notes",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Other",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Stress",
                    value: [
                      {
                        checked: false,
                        id: expect.anything(),
                        label: "1",
                      },
                      {
                        checked: false,
                        id: expect.anything(),
                        label: "2",
                      },
                      {
                        checked: false,
                        id: expect.anything(),
                        label: "3",
                      },
                    ],
                  },
                ],
                id: expect.anything(),
                label: "Stress",
                position: 1,
                type: 2,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Mild",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Moderate",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Severe",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Consequences",
                position: 1,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Careful",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Clever",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Forceful",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Flashy",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Quick",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Sneaky",
                    value: "",
                  },
                ],
                id: expect.anything(),
                visibleOnCard: true,
                label: "Skills",
                position: 1,
                type: 1,
              },
            ],
          },
        ],
        playedDuringTurn: undefined,
        version: CharacterFactory.latestVersion,
      });
    });
  });
});
