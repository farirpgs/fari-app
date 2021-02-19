import produce from "immer";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../../components/ContentEditable/ContentEditable";
import {
  CharacterType,
  defaultCharactersByType,
  ICharacter,
} from "../../../contexts/CharactersContext/CharactersContext";
import { getUnix, getUnixFrom } from "../../../domains/dayjs/getDayJS";

export function useCharacter(characterFromProps?: ICharacter | undefined) {
  const [character, setCharacter] = useState<ICharacter | undefined>(
    characterFromProps
  );

  const dirty = useMemo(() => {
    return !isEqual(characterFromProps, character);
  }, [characterFromProps, character]);

  useEffect(() => {
    const characterFromPropsLastUpdated = getUnixFrom(
      characterFromProps?.lastUpdated ?? 0
    );
    const currentCharacterLastUpdated = getUnixFrom(
      character?.lastUpdated ?? 0
    );

    const isDifferentCharacter = characterFromProps?.id !== character?.id;
    const isOutdated =
      characterFromPropsLastUpdated > currentCharacterLastUpdated;

    if (isDifferentCharacter || isOutdated) {
      setCharacter(characterFromProps);
    }
  }, [characterFromProps]);

  function loadTemplate(type: CharacterType) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const oldId = draft.id;
        const oldName = draft.name;
        const defaultCharacter = defaultCharactersByType[type];

        return {
          ...defaultCharacter,
          id: oldId,
          name: oldName,
          lastUpdated: getUnix(),
        };
      })
    );
  }

  function setName(newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.name = newName;
      })
    );
  }

  function setGroup(newGroup: string | null | undefined) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.group = newGroup as string | undefined;
      })
    );
  }

  function addAspect() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.aspects.push({
          name: `Aspect`,
          value: "",
        });
      })
    );
  }

  function addSkill() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.skills.push({
          name: `Skill`,
          value: "",
        });
      })
    );
  }

  function moveValueInList(
    property: keyof Pick<
      ICharacter,
      "aspects" | "stressTracks" | "consequences" | "stunts" | "skills"
    >,
    index: number,
    direction: "up" | "down"
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        if (direction === "up") {
          draft[property] = moveUp(draft[property] as Array<any>, index);
        }
        if (direction === "down") {
          draft[property] = moveDown(draft[property] as Array<any>, index);
        }
      })
    );
  }

  function removeAspect(aspectIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.aspects = draft.aspects.filter((aspect, index) => {
          return index !== aspectIndex;
        });
      })
    );
  }

  function setAspectName(aspectIndex: number, newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.aspects[aspectIndex].name = newName;
      })
    );
  }

  function setAspect(aspectIndex: number, newValue: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.aspects[aspectIndex].value = newValue;
      })
    );
  }

  function setSkillName(aspectIndex: number, newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.skills[aspectIndex].name = newName;
      })
    );
  }

  function setSkill(aspectIndex: number, newValue: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.skills[aspectIndex].value = newValue;
      })
    );
  }

  function removeSkill(aspectIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.skills = draft.skills.filter((skill, index) => {
          return index !== aspectIndex;
        });
      })
    );
  }

  function addStunt() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stunts.push({
          name: "Stunt",
          value: "",
        });
      })
    );
  }

  function setStuntName(stuntIndex: number, newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stunts[stuntIndex].name = newName;
      })
    );
  }

  function setStunt(stuntIndex: number, newValue: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stunts[stuntIndex].value = newValue;
      })
    );
  }

  function removeStunt(stuntIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stunts = draft.stunts.filter((stunt, index) => {
          return index !== stuntIndex;
        });
      })
    );
  }

  function addStressTrack() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
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
  function setStressTrackName(trackIndex: number, newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stressTracks[trackIndex].name = newName;
      })
    );
  }

  function addStressBox(trackIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const numberOfBoxes = draft.stressTracks[trackIndex].value.length;
        draft.stressTracks[trackIndex].value.push({
          checked: false,
          label: `${numberOfBoxes + 1}`,
        });
      })
    );
  }

  function removeStressBox(trackIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const numberOfBoxes = draft.stressTracks[trackIndex].value.length;
        draft.stressTracks[trackIndex].value = draft.stressTracks[
          trackIndex
        ].value.filter((value, index) => {
          return index !== numberOfBoxes - 1;
        });
      })
    );
  }

  function toggleStressBox(trackIndex: number, boxIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const oldValue = draft.stressTracks[trackIndex].value[boxIndex].checked;
        draft.stressTracks[trackIndex].value[boxIndex].checked = !oldValue;
      })
    );
  }

  function setStressBoxLabel(
    trackIndex: number,
    boxIndex: number,
    newLabel: string
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stressTracks[trackIndex].value[boxIndex].label = newLabel;
      })
    );
  }

  function removeStressTrack(trackIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stressTracks = draft.stressTracks.filter((track, index) => {
          return index !== trackIndex;
        });
      })
    );
  }

  function addConsequence() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.consequences.push({
          name: `Consequence`,
          value: "",
        });
      })
    );
  }

  function setConsequenceName(consequenceIndex: number, newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.consequences[consequenceIndex].name = newName;
      })
    );
  }

  function setConsequence(consequenceIndex: number, newValue: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.consequences[consequenceIndex].value = newValue;
      })
    );
  }

  function removeConsequence(consequenceIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.consequences = draft.consequences.filter((consequence, index) => {
          return index !== consequenceIndex;
        });
      })
    );
  }

  function updateRefresh(newRefresh: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.refresh = newRefresh;
      })
    );
  }

  function setNotes(newNotes: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.notes = newNotes;
      })
    );
  }

  function setAspectsLabel(newAspectsLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.aspectsLabel = newAspectsLabel;
      })
    );
  }

  function setSkillsLabel(newSkillsLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.skillsLabel = newSkillsLabel;
      })
    );
  }

  function setStuntsLabel(newStuntsLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stuntsLabel = newStuntsLabel;
      })
    );
  }

  function setStressTracksLabel(newStressTracksLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.stressTracksLabel = newStressTracksLabel;
      })
    );
  }

  function setConsequencesLabel(newConsequencesLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.consequencesLabel = newConsequencesLabel;
      })
    );
  }

  function setRefreshLabel(newRefreshLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.refreshLabel = newRefreshLabel;
      })
    );
  }

  function setNotesLabel(newNotesLabel: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.notesLabel = newNotesLabel;
      })
    );
  }

  function sanitizeCharacter() {
    const updatedCharacter = produce(character!, (draft) => {
      if (!draft) {
        return;
      }
      draft.name = previewContentEditable({ value: draft.name });
      draft.lastUpdated = getUnix();
    });
    return updatedCharacter;
  }

  return {
    state: { character, dirty },
    actions: {
      loadTemplate,
      setName,
      setGroup,
      addAspect,
      removeAspect,
      setAspectName,
      setAspect,
      addSkill,
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
      updateRefresh,
      setNotes,
      setAspectsLabel,
      setSkillsLabel,
      setStuntsLabel,
      setStressTracksLabel,
      setConsequencesLabel,
      setRefreshLabel,
      setNotesLabel,
      moveValueInList,
      sanitizeCharacter,
    },
  };
}

function moveUp<T>(list: Array<T>, index: number) {
  if (index === 0) {
    return list;
  }
  const newIndex = index - 1;
  const element = list[index];
  const swap = list[newIndex];

  return list.map((el, i) => {
    if (i === index) {
      return swap;
    }
    if (i === newIndex) {
      return element;
    }
    return el;
  });
}

function moveDown<T>(list: Array<T>, index: number) {
  if (index === list.length - 1) {
    return list;
  }

  const newIndex = index + 1;
  const element = list[index];
  const swap = list[newIndex];

  return list.map((el, i) => {
    if (i === index) {
      return swap;
    }
    if (i === newIndex) {
      return element;
    }
    return el;
  });
}
