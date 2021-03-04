import produce from "immer";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { CharacterFactory } from "../../../domains/character/CharacterFactory";
import { CharacterType } from "../../../domains/character/CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPage,
  ISlotTrackerBlock,
  Position,
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
        const newPage: IPage = {
          id: Id.generate(),
          sections: [],
          label: "Page",
        };
        draft.pages.push(newPage);
        // draft.pages.splice(pageIndex + 1, 0, );
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

  function renamePage(pageIndex: number, value: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].label = value;
      })
    );
  }

  function addSection(
    pageIndex: number,
    sectionIndex: number,
    position: Position
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.pages[pageIndex].sections.splice(sectionIndex + 1, 0, {
          id: Id.generate(),
          label: "Section",
          position: position,
          blocks: [],
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

  function movePage(pageIndex: number, direction: "up" | "down") {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages = moveValueInList(draft.pages, pageIndex, direction);
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
  function moveSectionInPage(
    pageIndex: number,
    sectionIndex: number,
    newPageIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const [section] = draft.pages[pageIndex].sections.splice(
          sectionIndex,
          1
        );
        draft.pages[newPageIndex].sections.push(section);
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

  function addBlock(pageIndex: number, sectionIndex: number, type: BlockType) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].blocks.push(
          CharacterFactory.makeBlock(type)
        );
      })
    );
  }
  function duplicateBlock(
    pageIndex: number,
    sectionIndex: number,
    block: IBlock
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].blocks.push(
          CharacterFactory.duplicateBlock(block)
        );
      })
    );
  }

  function renameBlock(
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
        draft.pages[pageIndex].sections[sectionIndex].blocks[
          fieldIndex
        ].label = label;
      })
    );
  }

  function moveBlock(
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
        draft.pages[pageIndex].sections[sectionIndex].blocks = moveValueInList(
          draft.pages[pageIndex].sections[sectionIndex].blocks,
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

  function moveDnDBlock(
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
          draft.pages[pageIndex].sections[sectionIndex].blocks[dragIndex];

        draft.pages[pageIndex].sections[sectionIndex].blocks.splice(
          dragIndex,
          1
        );
        draft.pages[pageIndex].sections[sectionIndex].blocks.splice(
          hoverIndex,
          0,
          dragItem
        );
      })
    );
  }

  function setBlockLabel(
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
        draft.pages[pageIndex].sections[sectionIndex].blocks[
          fieldIndex
        ].label = label;
      })
    );
  }

  function setBlockValue(
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
        draft.pages[pageIndex].sections[sectionIndex].blocks[
          fieldIndex
        ].value = value;
      })
    );
  }

  function setBlockMeta(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number,
    meta: any
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.pages[pageIndex].sections[sectionIndex].blocks[
          fieldIndex
        ].meta = meta;
      })
    );
  }

  function removeBlock(
    pageIndex: number,
    sectionIndex: number,
    fieldIndex: number
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].sections[sectionIndex].blocks = draft.pages[
          pageIndex
        ].sections[sectionIndex].blocks.filter((field, index) => {
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
          .blocks[fieldIndex].value as ISlotTrackerBlock["value"]).length;

        (draft.pages[pageIndex].sections[sectionIndex].blocks[fieldIndex]
          .value as ISlotTrackerBlock["value"]).push({
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
        draft.pages[pageIndex].sections[sectionIndex].blocks[
          fieldIndex
        ].value = (draft.pages[pageIndex].sections[sectionIndex].blocks[
          fieldIndex
        ].value as ISlotTrackerBlock["value"]).filter(
          (box, boxIndex, boxes) => {
            return boxIndex !== boxes.length - 1;
          }
        );
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
          .blocks[fieldIndex].value as ISlotTrackerBlock["value"])[
          boxIndexToToggle
        ];

        (draft.pages[pageIndex].sections[sectionIndex].blocks[fieldIndex]
          .value as ISlotTrackerBlock["value"])[boxIndexToToggle] = {
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
          .blocks[fieldIndex].value as ISlotTrackerBlock["value"])[
          boxIndexToRename
        ];

        (draft.pages[pageIndex].sections[sectionIndex].blocks[fieldIndex]
          .value as ISlotTrackerBlock["value"])[boxIndexToRename] = {
          label: label,
          checked: currentValue.checked,
        };
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
      addPage,
      renamePage,
      removePage,
      addSection,
      renameSection,
      toggleSectionVisibleOnCard,
      moveSection,
      repositionSection,
      movePage: movePage,
      moveSectionInPage: moveSectionInPage,
      removeSection,
      addBlock: addBlock,
      duplicateBlock: duplicateBlock,
      renameBlock: renameBlock,
      moveBlock: moveBlock,
      moveDnDSection,
      moveDnDBlock: moveDnDBlock,
      setBlockValue: setBlockValue,
      setBlockMeta: setBlockMeta,
      setBlockLabel: setBlockLabel,
      removeBlock: removeBlock,
      addCheckboxFieldValue,
      removeCheckboxFieldValue,
      toggleCheckboxFieldValue,
      renameCheckboxFieldValue,
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
