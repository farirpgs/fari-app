import produce from "immer";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { sanitizeContentEditable } from "../../../components/ContentEditable/ContentEditable";
import {
  CharacterType,
  CheckboxesFieldValue,
  defaultCharactersByType,
  DefaultFields,
  ICharacter,
  Position,
  SectionType,
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

  function addSection(sectionType: SectionType, position: Position) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const defaultField = DefaultFields[sectionType];

        draft.sections.push({
          label: "Section",
          position: position,
          type: sectionType,
          fields: [defaultField],
        });
      })
    );
  }

  function renameSection(sectionIndex: number, label: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].label = label;
      })
    );
  }

  function repositionSection(sectionIndex: number, position: Position) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].position = position;
      })
    );
  }

  function moveSection(sectionIndex: number, direction: "up" | "down") {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections = moveValueInList(
          draft.sections,
          sectionIndex,
          direction
        );
      })
    );
  }

  function removeSection(sectionIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections = draft.sections.filter((a, index) => {
          return index !== sectionIndex;
        });
      })
    );
  }

  function addSectionField(sectionIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const type = draft.sections[sectionIndex].type;
        const defaultField = DefaultFields[type];
        draft.sections[sectionIndex].fields.push(
          (defaultField as unknown) as any
        );
      })
    );
  }

  function renameSectionField(
    sectionIndex: number,
    fieldIndex: number,
    label: string
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].fields[fieldIndex].label = label;
      })
    );
  }

  function moveSectionField(
    sectionIndex: number,
    fieldIndex: number,

    direction: "up" | "down"
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].fields = moveValueInList(
          draft.sections[sectionIndex].fields,
          fieldIndex,
          direction
        );
      })
    );
  }

  function setSectionFieldLabel(
    sectionIndex: number,
    fieldIndex: number,
    label: any
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].fields[fieldIndex].label = label;
      })
    );
  }

  function setSectionFieldValue(
    sectionIndex: number,
    fieldIndex: number,
    value: any
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].fields[fieldIndex].value = value;
      })
    );
  }

  function removeSectionField(sectionIndex: number, fieldIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].fields = draft.sections[
          sectionIndex
        ].fields.filter((field, index) => {
          return index !== fieldIndex;
        });
      })
    );
  }

  function addCheckboxFieldValue(sectionIndex: number, fieldIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        (draft.sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue).push({
          label: "",
          checked: false,
        });
      })
    );
  }

  function removeCheckboxFieldValue(sectionIndex: number, fieldIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.sections[sectionIndex].fields[fieldIndex].value = (draft.sections[
          sectionIndex
        ].fields[fieldIndex].value as CheckboxesFieldValue).filter(
          (box, boxIndex, boxes) => {
            return boxIndex !== boxes.length - 1;
          }
        );
      })
    );
  }

  function toggleCheckboxFieldValue(
    sectionIndex: number,
    fieldIndex: number,
    boxIndexToToggle: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const currentValue = (draft.sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue)[boxIndexToToggle];

        (draft.sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue)[boxIndexToToggle] = {
          label: currentValue.label,
          checked: !currentValue.checked,
        };
      })
    );
  }

  function renameCheckboxFieldValue(
    sectionIndex: number,
    fieldIndex: number,
    boxIndexToRename: number,
    label: string
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const currentValue = (draft.sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue)[boxIndexToRename];

        (draft.sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue)[boxIndexToRename] = {
          label: label,
          checked: currentValue.checked,
        };
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

  function sanitizeCharacter() {
    const updatedCharacter = produce(character!, (draft) => {
      if (!draft) {
        return;
      }
      draft.name = sanitizeContentEditable(draft.name);
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
      addSection,
      renameSection,
      moveSection,
      repositionSection,
      removeSection,
      addSectionField,
      renameSectionField,
      moveSectionField,
      setSectionFieldValue,
      setSectionFieldLabel,
      removeSectionField,
      addCheckboxFieldValue,
      removeCheckboxFieldValue,
      toggleCheckboxFieldValue,
      renameCheckboxFieldValue,
      updateRefresh,
      sanitizeCharacter,
    },
  };
}

function moveValueInList<T>(
  list: Array<T>,
  index: number,
  direction: "up" | "down"
) {
  if (direction === "up") {
    return moveUp(list, index);
  }
  if (direction === "down") {
    return moveDown(list, index);
  }
  return list;
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
