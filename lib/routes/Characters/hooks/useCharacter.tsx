import produce from "immer";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { sanitizeContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { ICharacter } from "../../../contexts/CharactersContext";

export function useCharacter(c: ICharacter) {
  const [character, setCharacter] = useState<ICharacter>(c);

  const isDirty = useMemo(() => {
    return !isEqual(c, character);
  }, [c, character]);

  useEffect(() => {
    const isDifferent = c?.id !== character?.id;
    const isMoreRecent = c.lastUpdated > character.lastUpdated;
    if (isDifferent || isMoreRecent) {
      setCharacter(c);
    }
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
          name: `Aspect`,
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
  function removeAspect(indexToRemove: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.aspects = draft.aspects.filter((aspect, index) => {
          return index !== indexToRemove;
        });
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
  function removeSkill(indexToRemove: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.skills = draft.skills.filter((skill, index) => {
          return index !== indexToRemove;
        });
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
  function removeStunt(indexToRemove: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stunts = draft.stunts.filter((stunt, index) => {
          return index !== indexToRemove;
        });
      })
    );
  }
  function addStressTrack() {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stressTracks.push({
          name: "Stress",
          value: [
            { checked: false, label: "1" },
            { checked: false, label: "2" },
            { checked: false, label: "3" },
          ],
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
        const numberOfBoxes = draft.stressTracks[index].value.length;
        draft.stressTracks[index].value.push({
          checked: false,
          label: `${numberOfBoxes + 1}`,
        });
      })
    );
  }
  function removeStressBox(index: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        const numberOfBoxes = draft.stressTracks[index].value.length;
        draft.stressTracks[index].value = draft.stressTracks[
          index
        ].value.filter((value, index) => {
          return index !== numberOfBoxes - 1;
        });
      })
    );
  }
  function toggleStressBox(index: number, boxIndex: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        const oldValue = draft.stressTracks[index].value[boxIndex].checked;
        draft.stressTracks[index].value[boxIndex].checked = !oldValue;
      })
    );
  }
  function setStressBoxLabel(index: number, boxIndex: number, label: string) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stressTracks[index].value[boxIndex].label = label;
      })
    );
  }
  function removeStressTrack(indexToRemove: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.stressTracks = draft.stressTracks.filter((track, index) => {
          return index !== indexToRemove;
        });
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
  function removeConsequence(indexToRemove: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.consequences = draft.consequences.filter((consequence, index) => {
          return index !== indexToRemove;
        });
      })
    );
  }

  function udpateRefresh(value: number) {
    setCharacter(
      produce((draft: ICharacter) => {
        draft.refresh = value;
      })
    );
  }

  function sanitizeCharacter() {
    const updatedCharacter = produce(character, (draft) => {
      draft.name = sanitizeContentEditable(draft.name);
      draft.lastUpdated = new Date().getTime();
    });
    return updatedCharacter;
  }

  return {
    state: { character, isDirty },
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
      setStressBoxLabel,
      removeStressTrack,
      addConsequence,
      setConsequenceName,
      setConsequence,
      removeConsequence,
      udpateRefresh,
      sanitizeCharacter,
    },
  };
}
