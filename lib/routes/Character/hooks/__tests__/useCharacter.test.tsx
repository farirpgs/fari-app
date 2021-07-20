/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react-hooks";
import { CharacterFactory } from "../../../../domains/character/CharacterFactory";
import { CharacterTemplates } from "../../../../domains/character/CharacterType";
import { ICharacter } from "../../../../domains/character/types";
import { useCharacter } from "../useCharacter";

describe("useCharacter", () => {
  describe("sanitizeCharacter", () => {
    it("should sanitize the character", async () => {
      const defaultCahracter = await CharacterFactory.make(
        CharacterTemplates.FateCondensed
      );
      // GIVEN
      const character = {
        ...defaultCahracter,
        id: "1",
        lastUpdated: 1,
      };
      // WHEN
      const { result } = renderHook(
        () => {
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
        result.current.actions.setName("Luke Skywalker");
      });
      expect(
        result.current.actions.getCharacterWithNewTimestamp().name
      ).toEqual("Luke Skywalker");
      expect(
        result.current.actions.getCharacterWithNewTimestamp().lastUpdated
      ).not.toEqual(1);
    });
  });

  describe("sync props with state", () => {
    it("should not crash if characters in props in undefined", async () => {
      // GIVEN
      const initialRenderCharacter = undefined as unknown as ICharacter;
      // WHEN
      const { result } = renderHook(
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
    it("should load the new template but keep the id and the name as is", async () => {
      const defaultCharacter = await CharacterFactory.make(
        CharacterTemplates.FateCondensed
      );
      // GIVEN
      const character = {
        ...defaultCharacter,
        id: "1",
        name: "Luke Skywalker",
        lastUpdated: 1,
      };
      // WHEN
      const { result, waitForNextUpdate } = renderHook(
        () => {
          return useCharacter(character);
        },
        {
          initialProps: { character: character },
        }
      );
      // THEN
      expect(result.current.state.character).toEqual(character);

      // WHEN a template is loading
      act(() => {
        result.current.actions.loadTemplate(CharacterTemplates.FateAccelerated);
      });

      // Wait for JSON download
      await waitForNextUpdate();
      expect(result.current.state.character?.lastUpdated).not.toEqual(
        character.lastUpdated
      );

      // id: "1", // kept ID
      // name: "Luke Skywalker", // kept name
      expect(result.current.state.character).toEqual({
        group: undefined,
        id: "1",
        lastUpdated: expect.anything(),
        template: "FateAccelerated",
        playedDuringTurn: undefined,
        name: "Luke Skywalker",
        pages: [
          {
            id: expect.anything(),
            label: "Character",
            sections: {
              left: [
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "High Concept",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Trouble",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Relationship",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Other Aspect",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Other Aspect",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                  ],
                  id: expect.anything(),
                  label: "Aspects",
                  visibleOnCard: true,
                },
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Stunt #1",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Stunt #2",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Stunt #3",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                  ],
                  id: expect.anything(),
                  label: "Stunts & Extras",
                  visibleOnCard: undefined,
                },
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Notes",
                      meta: {},
                      type: "Text",
                      value: "",
                    },
                  ],
                  id: expect.anything(),
                  label: "Other",
                  visibleOnCard: undefined,
                },
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Fate Points",
                      meta: { isMainPointCounter: true, max: "3" },
                      type: "PointCounter",
                      value: "3",
                    },
                  ],
                  id: expect.anything(),
                  label: "Fate Points",
                  visibleOnCard: undefined,
                },
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Evil Hat Productions",
                      meta: {
                        hasDisplayName: true,
                      },
                      type: "Link",
                      value: "https://www.evilhat.com/home/",
                    },
                  ],
                  id: expect.anything(),
                  label: "Credits",
                  visibleOnCard: undefined,
                },
              ],
              right: [
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Stress",
                      meta: {},
                      type: "SlotTracker",
                      value: [
                        { checked: false, label: "1" },
                        { checked: false, label: "2" },
                        { checked: false, label: "3" },
                      ],
                    },
                  ],
                  id: expect.anything(),
                  label: "Stress",
                  visibleOnCard: undefined,
                },
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Mild",
                      meta: { checked: false },
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Moderate",
                      meta: { checked: false },
                      type: "Text",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Severe",
                      meta: { checked: false },
                      type: "Text",
                      value: "",
                    },
                  ],
                  id: expect.anything(),
                  label: "Consequences",
                  visibleOnCard: undefined,
                },
                {
                  blocks: [
                    {
                      id: expect.anything(),
                      label: "Careful",
                      meta: { commands: ["4dF"] },
                      type: "Skill",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Clever",
                      meta: { commands: ["4dF"] },
                      type: "Skill",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Forceful",
                      meta: { commands: ["4dF"] },
                      type: "Skill",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Flashy",
                      meta: { commands: ["4dF"] },
                      type: "Skill",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Quick",
                      meta: { commands: ["4dF"] },
                      type: "Skill",
                      value: "",
                    },
                    {
                      id: expect.anything(),
                      label: "Sneaky",
                      meta: { commands: ["4dF"] },
                      type: "Skill",
                      value: "",
                    },
                  ],
                  id: expect.anything(),
                  label: "Approaches",

                  visibleOnCard: true,
                },
              ],
            },
          },
        ],

        wide: false,
        version: 4,
      });
    });
  });
});
