import produce from "immer";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { sanitizeContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { CharacterFactory } from "../../../domains/character/CharacterFactory";
import { CharacterType } from "../../../domains/character/CharacterType";
import {
  CheckboxesFieldValue,
  ICharacter,
  Position,
  SectionType,
} from "../../../domains/character/types";
import { getUnix, getUnixFrom } from "../../../domains/dayjs/getDayJS";
import { Id } from "../../../domains/id/Id";

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
        const defaultCharacter = CharacterFactory.make(type);

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

  function addPage(pageIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages.splice(pageIndex + 1, 0, {
          id: Id.generate(),
          sections: [],
        });
      })
    );
  }

  function removePage(pageIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages = draft.pages.filter((p, index) => index !== pageIndex);
      })
    );
  }

  function addSection(
    pageIndex: number,
    sectionType: SectionType,
    position: Position
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections.push({
          id: Id.generate(),
          label: "Section",
          position: position,
          type: sectionType,
          fields: [CharacterFactory.makeField(sectionType)],
        });
      })
    );
  }

  function renameSection(
    pageIndex: number,
    sectionIndex: number,
    label: string
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].label = label;
      })
    );
  }

  function toggleSectionVisibleOnCard(pageIndex: number, sectionIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const oldValue =
          draft.pages[pageIndex].sections[sectionIndex].visibleOnCard;
        draft.pages[pageIndex].sections[sectionIndex].visibleOnCard = !oldValue;
      })
    );
  }

  function repositionSection(
    pageIndex: number,
    sectionIndex: number,
    position: Position
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].position = position;
      })
    );
  }

  function moveSection(
    pageIndex: number,
    sectionIndex: number,
    direction: "up" | "down"
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections = moveValueInList(
          draft.pages[pageIndex].sections,
          sectionIndex,
          direction
        );
      })
    );
  }

  function removeSection(pageIndex: number, sectionIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections = draft.pages[
          pageIndex
        ].sections.filter((a, index) => {
          return index !== sectionIndex;
        });
      })
    );
  }

  function addSectionField(pageIndex: number, sectionIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const type = draft.pages[pageIndex].sections[sectionIndex].type;
        draft.pages[pageIndex].sections[sectionIndex].fields.push(
          CharacterFactory.makeField(type)
        );
      })
    );
  }

  function renameSectionField(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number,
    label: string
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].fields[
          fieldIndex
        ].label = label;
      })
    );
  }

  function moveSectionField(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number,

    direction: "up" | "down"
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].fields = moveValueInList(
          draft.pages[pageIndex].sections[sectionIndex].fields,
          fieldIndex,
          direction
        );
      })
    );
  }

  function moveDnDSection(
    pageIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }

        const dragItem = draft.pages[pageIndex].sections[dragIndex];

        draft.pages[pageIndex].sections.splice(dragIndex, 1);
        draft.pages[pageIndex].sections.splice(hoverIndex, 0, dragItem);
      })
    );
  }

  function moveDnDSectionField(
    pageIndex: number,
    sectionIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }

        const dragItem =
          draft.pages[pageIndex].sections[sectionIndex].fields[dragIndex];

        draft.pages[pageIndex].sections[sectionIndex].fields.splice(
          dragIndex,
          1
        );
        draft.pages[pageIndex].sections[sectionIndex].fields.splice(
          hoverIndex,
          0,
          dragItem
        );
      })
    );
  }

  function setSectionFieldLabel(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number,
    label: any
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].fields[
          fieldIndex
        ].label = label;
      })
    );
  }

  function setSectionFieldValue(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number,
    value: any
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].fields[
          fieldIndex
        ].value = value;
      })
    );
  }

  function removeSectionField(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].fields = draft.pages[
          pageIndex
        ].sections[sectionIndex].fields.filter((field, index) => {
          return index !== fieldIndex;
        });
      })
    );
  }

  function addCheckboxFieldValue(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const numberOfBoxes = (draft.pages[pageIndex].sections[sectionIndex]
          .fields[fieldIndex].value as CheckboxesFieldValue).length;

        (draft.pages[pageIndex].sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue).push({
          label: (numberOfBoxes + 1).toString(),
          checked: false,
        });
      })
    );
  }

  function removeCheckboxFieldValue(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].fields[
          fieldIndex
        ].value = (draft.pages[pageIndex].sections[sectionIndex].fields[
          fieldIndex
        ].value as CheckboxesFieldValue).filter((box, boxIndex, boxes) => {
          return boxIndex !== boxes.length - 1;
        });
      })
    );
  }

  function toggleCheckboxFieldValue(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number,
    boxIndexToToggle: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const currentValue = (draft.pages[pageIndex].sections[sectionIndex]
          .fields[fieldIndex].value as CheckboxesFieldValue)[boxIndexToToggle];

        (draft.pages[pageIndex].sections[sectionIndex].fields[fieldIndex]
          .value as CheckboxesFieldValue)[boxIndexToToggle] = {
          label: currentValue.label,
          checked: !currentValue.checked,
        };
      })
    );
  }

  function renameCheckboxFieldValue(
    pageIndex: number,
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
        const currentValue = (draft.pages[pageIndex].sections[sectionIndex]
          .fields[fieldIndex].value as CheckboxesFieldValue)[boxIndexToRename];

        (draft.pages[pageIndex].sections[sectionIndex].fields[fieldIndex]
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
      addPage,
      removePage,
      addSection,
      renameSection,
      toggleSectionVisibleOnCard,
      moveSection,
      repositionSection,
      removeSection,
      addSectionField,
      renameSectionField,
      moveSectionField,
      moveDnDSection,
      moveDnDSectionField,
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
