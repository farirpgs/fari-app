import produce from "immer";
import { useEffect, useState } from "react";
import { ICharacter } from "./useCharacters";

export function useCharacter(c: ICharacter) {
  const [character, setCharacter] = useState<ICharacter>(c);

  useEffect(() => {
    setCharacter(c);
  }, [c]);

  function setName(value: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.name = value;
      })
    );
  }
  function addAspect() {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.aspects.push({
          name: `Other Aspect`,
          value: "",
        });
      })
    );
  }
  function addSkill() {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.skills.push({
          name: `Skill`,
          value: "",
        });
      })
    );
  }
  function removeAspect(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        delete draft.aspects[index];
      })
    );
  }

  function setAspectName(index: number, newAspectName: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.aspects[index].name = newAspectName;
      })
    );
  }
  function setAspect(index: number, newAspectValue: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.aspects[index].value = newAspectValue;
      })
    );
  }
  function setSkillName(index: number, newSkillName: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.skills[index].name = newSkillName;
      })
    );
  }
  function setSkill(index: number, newSkillValue: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.skills[index].value = newSkillValue;
      })
    );
  }
  function removeSkill(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        delete draft.skills[index];
      })
    );
  }
  function addStunt() {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stunts.push({
          name: "Stunt",
          value: "",
        });
      })
    );
  }
  function setStuntName(index: number, newStuntName: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stunts[index].name = newStuntName;
      })
    );
  }
  function setStunt(index: number, newStuntValue: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stunts[index].value = newStuntValue;
      })
    );
  }
  function removeStunt(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        delete draft.stunts[index];
      })
    );
  }
  function addStressTrack() {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stressTracks.push({
          name: "Stress",
          value: [false, false, false],
        });
      })
    );
  }
  function setStressTrackName(index: number, newStressTrackName: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stressTracks[index].name = newStressTrackName;
      })
    );
  }
  function addStressBox(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stressTracks[index].value.push(false);
      })
    );
  }
  function removeStressBox(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        const numberOfBoxes = draft.stressTracks[index].value.length;
        delete draft.stressTracks[index].value[numberOfBoxes - 1];
      })
    );
  }
  function toggleStressBox(index: number, boxIndex: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        const oldValue = draft.stressTracks[index].value[boxIndex];
        draft.stressTracks[index].value[boxIndex] = !oldValue;
      })
    );
  }
  function removeStressTrack(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        delete draft.stressTracks[index];
      })
    );
  }
  function addConsequence() {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.consequences.push({
          name: `Consequence`,
          value: "",
        });
      })
    );
  }
  function setConsequenceName(index: number, newConsequenceName: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.consequences[index].name = newConsequenceName;
      })
    );
  }
  function setConsequence(index: number, newConsequenceValue: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.consequences[index].value = newConsequenceValue;
      })
    );
  }
  function removeConsequence(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        delete draft.consequences[index];
      })
    );
  }
  return {
    state: { character },
    actions: {
      setName,
      addAspect,
      addSkill,
      removeAspect,
      setAspectName,
      setAspect,
      setSkillName,
      setSkill,
      removeSkill,
      addStunt,
      setStuntName,
      setStunt,
      removeStunt,
      addStressTrack,
      setStressTrackName,
      addStressBox,
      removeStressBox,
      toggleStressBox,
      removeStressTrack,
      addConsequence,
      setConsequenceName,
      setConsequence,
      removeConsequence,
    },
  };
}
