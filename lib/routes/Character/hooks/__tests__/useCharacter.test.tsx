import { act, renderHook } from "@testing-library/react-hooks";
import {
  CharacterType,
  defaultCharactersByType,
  ICharacter,
} from "../../../../contexts/CharactersContext/CharactersContext";
import { useCharacter } from "../useCharacter";

// import { v4 as uuidV4 } from "uuid";

describe("useCharacter", () => {
  describe("name and aspects", () => {
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

    // WHEN the name is updated
    act(() => {
      result.current.actions.setName("Luke Skywalker");
    });

    // THEN
    expect(result.current.state.character!.name).toEqual("Luke Skywalker");

    // WHEN an aspect is added
    act(() => {
      result.current.actions.addAspect();
    });

    // THEN
    const newAspectIndex = result.current.state.character!.aspects.length - 1;
    expect(result.current.state.character!.aspects[newAspectIndex]).toEqual({
      name: "Aspect",
      value: "",
    });

    // WHEN the aspect name is updated
    act(() => {
      result.current.actions.setAspectName(newAspectIndex, "Core Concept");
    });
    expect(result.current.state.character!.aspects[newAspectIndex]).toEqual({
      name: "Core Concept",
      value: "",
    });

    // WHEN the aspect value is updated
    act(() => {
      result.current.actions.setAspect(newAspectIndex, "The Last Jedi");
    });
    expect(result.current.state.character!.aspects[newAspectIndex]).toEqual({
      name: "Core Concept",
      value: "The Last Jedi",
    });

    // WHEN the aspect value is deleted
    act(() => {
      result.current.actions.removeAspect(newAspectIndex);
    });
    expect(result.current.state.character!.aspects[newAspectIndex]).toEqual(
      undefined
    );
  });

  describe("skills", () => {
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

    // WHEN a skill is added
    act(() => {
      result.current.actions.addSkill();
    });

    // THEN
    const newSkillIndex = result.current.state.character!.skills.length - 1;
    expect(result.current.state.character!.skills[newSkillIndex]).toEqual({
      name: "Skill",
      value: "",
    });

    // WHEN the skill name is updated
    act(() => {
      result.current.actions.setSkillName(newSkillIndex, "The Force");
    });
    expect(result.current.state.character!.skills[newSkillIndex]).toEqual({
      name: "The Force",
      value: "",
    });

    // WHEN the skill value is updated
    act(() => {
      result.current.actions.setSkill(newSkillIndex, "4");
    });
    expect(result.current.state.character!.skills[newSkillIndex]).toEqual({
      name: "The Force",
      value: "4",
    });

    // WHEN the skill value is deleted
    act(() => {
      result.current.actions.removeSkill(newSkillIndex);
    });
    expect(result.current.state.character!.skills[newSkillIndex]).toEqual(
      undefined
    );
  });

  describe("stunts", () => {
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

    // WHEN a Stunt is added
    act(() => {
      result.current.actions.addStunt();
    });

    // THEN
    const newStuntIndex = result.current.state.character!.stunts.length - 1;
    expect(result.current.state.character!.stunts[newStuntIndex]).toEqual({
      name: "Stunt",
      value: "",
    });

    // WHEN the Stunt name is updated
    act(() => {
      result.current.actions.setStuntName(
        newStuntIndex,
        "The Force is with me"
      );
    });
    expect(result.current.state.character!.stunts[newStuntIndex]).toEqual({
      name: "The Force is with me",
      value: "",
    });

    // WHEN the Stunt value is updated
    act(() => {
      result.current.actions.setStunt(
        newStuntIndex,
        "+2 when I try to create an advance with Investigate"
      );
    });
    expect(result.current.state.character!.stunts[newStuntIndex]).toEqual({
      name: "The Force is with me",
      value: "+2 when I try to create an advance with Investigate",
    });

    // WHEN the skill value is deleted
    act(() => {
      result.current.actions.removeStunt(newStuntIndex);
    });
    expect(result.current.state.character!.stunts[newStuntIndex]).toEqual(
      undefined
    );
  });

  describe("stress tracks", () => {
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

    // WHEN a stress track is added
    act(() => {
      result.current.actions.addStressTrack();
    });

    // THEN
    const newTrackIndex =
      result.current.state.character!.stressTracks.length - 1;
    expect(result.current.state.character!.stressTracks[newTrackIndex]).toEqual(
      {
        name: "Stress",
        value: [
          {
            checked: false,
            label: "1",
          },
          {
            checked: false,
            label: "2",
          },
          {
            checked: false,
            label: "3",
          },
        ],
      }
    );

    // WHEN the StressTrack name is updated
    act(() => {
      result.current.actions.setStressTrackName(newTrackIndex, "The Force");
    });
    expect(
      result.current.state.character!.stressTracks[newTrackIndex].name
    ).toEqual("The Force");

    // WHEN a stress box is added
    act(() => {
      result.current.actions.addStressBox(newTrackIndex);
    });
    expect(result.current.state.character!.stressTracks[newTrackIndex]).toEqual(
      {
        name: "The Force",
        value: [
          {
            checked: false,
            label: "1",
          },
          {
            checked: false,
            label: "2",
          },
          {
            checked: false,
            label: "3",
          },
          {
            checked: false,
            label: "4",
          },
        ],
      }
    );
    // WHEN a stress box is toggled
    act(() => {
      result.current.actions.toggleStressBox(newTrackIndex, 0);
    });
    expect(result.current.state.character!.stressTracks[newTrackIndex]).toEqual(
      {
        name: "The Force",
        value: [
          {
            checked: true,
            label: "1",
          },
          {
            checked: false,
            label: "2",
          },
          {
            checked: false,
            label: "3",
          },
          {
            checked: false,
            label: "4",
          },
        ],
      }
    );
    // WHEN a stress box is removed
    act(() => {
      result.current.actions.removeStressBox(newTrackIndex);
    });
    expect(result.current.state.character!.stressTracks[newTrackIndex]).toEqual(
      {
        name: "The Force",
        value: [
          {
            checked: true,
            label: "1",
          },
          {
            checked: false,
            label: "2",
          },
          {
            checked: false,
            label: "3",
          },
        ],
      }
    );
    // WHEN a stress box is removed
    act(() => {
      result.current.actions.setStressBoxLabel(newTrackIndex, 0, "Spirit");
      result.current.actions.setStressBoxLabel(newTrackIndex, 1, "Power");
      result.current.actions.setStressBoxLabel(newTrackIndex, 2, "Light Saber");
    });
    expect(result.current.state.character!.stressTracks[newTrackIndex]).toEqual(
      {
        name: "The Force",
        value: [
          {
            checked: true,
            label: "Spirit",
          },
          {
            checked: false,
            label: "Power",
          },
          {
            checked: false,
            label: "Light Saber",
          },
        ],
      }
    );

    // WHEN the stress track value is deleted
    act(() => {
      result.current.actions.removeStressTrack(newTrackIndex);
    });
    expect(result.current.state.character!.stressTracks[newTrackIndex]).toEqual(
      undefined
    );
  });

  describe("consequences", () => {
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

    // WHEN a consequence is added
    act(() => {
      result.current.actions.addConsequence();
    });

    // THEN
    const newConsequenceIndex =
      result.current.state.character!.consequences.length - 1;
    expect(
      result.current.state.character!.consequences[newConsequenceIndex]
    ).toEqual({
      name: "Consequence",
      value: "",
    });

    // WHEN the Consequence name is updated
    act(() => {
      result.current.actions.setConsequenceName(newConsequenceIndex, "Extreme");
    });
    expect(
      result.current.state.character!.consequences[newConsequenceIndex]
    ).toEqual({
      name: "Extreme",
      value: "",
    });

    // WHEN the Consequence value is updated
    act(() => {
      result.current.actions.setConsequence(
        newConsequenceIndex,
        "He is my father"
      );
    });
    expect(
      result.current.state.character!.consequences[newConsequenceIndex]
    ).toEqual({
      name: "Extreme",
      value: "He is my father",
    });

    // WHEN the skill value is deleted
    act(() => {
      result.current.actions.removeConsequence(newConsequenceIndex);
    });
    expect(
      result.current.state.character!.consequences[newConsequenceIndex]
    ).toEqual(undefined);
  });

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
      result.current.actions.udpateRefresh(4);
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

  describe("no character", () => {
    // GIVEN
    const character = undefined;
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

    // WHEN I call all the actions but without a character
    act(() => {
      result.current.actions.setName("Luke Skywalker");
      result.current.actions.addAspect();
      result.current.actions.removeAspect(0);
      result.current.actions.setAspectName(0, "Core Concept");
      result.current.actions.setAspect(0, "The Last Jedi");
      result.current.actions.addSkill();
      result.current.actions.setSkillName(0, "The Force");
      result.current.actions.setSkill(0, "4");
      result.current.actions.removeSkill(0);
      result.current.actions.addStunt();
      result.current.actions.setStuntName(0, "The Force is with me");
      result.current.actions.setStunt(
        0,
        "+2 when I try to create an advance with Investigate"
      );
      result.current.actions.removeStunt(0);
      result.current.actions.addStressTrack();
      result.current.actions.setStressTrackName(0, "The Force");
      result.current.actions.addStressBox(0);
      result.current.actions.removeStressBox(0);
      result.current.actions.toggleStressBox(0, 0);
      result.current.actions.setStressBoxLabel(0, 0, "The Force");
      result.current.actions.removeStressTrack(0);
      result.current.actions.addConsequence();
      result.current.actions.setConsequenceName(0, "Extreme");
      result.current.actions.setConsequence(0, "He is my father");
      result.current.actions.removeConsequence(0);
      result.current.actions.udpateRefresh(5);
      result.current.actions.loadTemplate(CharacterType.Accelerated);
      result.current.actions.sanitizeCharacter();
    });
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
