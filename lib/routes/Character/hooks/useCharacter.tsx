import produce from "immer";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { sanitizeContentEditable } from "../../../components/ContentEditable/ContentEditable";
import {
  CharacterType,
  defaultCharactersByType,
  ICharacter,
} from "../../../contexts/CharactersContext/CharactersContext";

export function useCharacter(c?: ICharacter | undefined) {
  const [character, setCharacter] = useState<ICharacter | undefined>(c);

  const dirty = useMemo(() => {
    return !isEqual(c, character);
  }, [c, character]);

  useEffect(() => {
    const isDifferent = c?.id !== character?.id;
    const isMoreRecent = (c?.lastUpdated ?? 0) > (character?.lastUpdated ?? 0);
    if (isDifferent || isMoreRecent) {
      setCharacter(c);
    }
  }, [c]);

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
          lastUpdated: new Date().getTime(),
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

  function udpateRefresh(newRefresh: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.refresh = newRefresh;
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

  function sanitizeCharacter() {
    const updatedCharacter = produce(character!, (draft) => {
      if (!draft) {
        return;
      }
      draft.name = sanitizeContentEditable(draft.name);
      draft.lastUpdated = new Date().getTime();
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
      udpateRefresh,
      setAspectsLabel,
      setSkillsLabel,
      setStuntsLabel,
      setStressTracksLabel,
      setConsequencesLabel,
      setRefreshLabel,
      sanitizeCharacter,
    },
  };
}
