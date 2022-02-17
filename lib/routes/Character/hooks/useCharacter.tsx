import produce from "immer";
import isEqual from "lodash/isEqual";
import { useContext, useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { SettingsContext } from "../../../contexts/SettingsContext/SettingsContext";
import { CharacterFactory } from "../../../domains/character/CharacterFactory";
import { ICharacterTemplate } from "../../../domains/character/CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPage
} from "../../../domains/character/types";
import { getUnix, getUnixFrom } from "../../../domains/dayjs/getDayJS";
import { Id } from "../../../domains/Id/Id";

export function useCharacter(characterFromProps?: ICharacter | undefined) {
  const settingsManager = useContext(SettingsContext);

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

  async function loadTemplate(template: ICharacterTemplate) {
    const defaultCharacter = await CharacterFactory.make(template);

    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const id = draft.id;
        const name = draft.name || defaultCharacter.name;
        const group = draft.group || defaultCharacter.group;

        return {
          ...defaultCharacter,
          id: id,
          name: name,
          group: group,
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

  function addPage() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const newPage: IPage = {
          id: Id.generate(),
          rows: [],
          label: "Page",
        };
        draft.pages.push(newPage);
      })
    );
  }

  function deletePage(pageIndex: number) {
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

  function moveRowUp(indexes: { pageIndex: number; rowIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows = moveValueInList(
          draft.pages[indexes.pageIndex].rows,
          indexes.rowIndex,
          "up"
        );
      })
    );
  }

  function moveRowDown(indexes: { pageIndex: number; rowIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows = moveValueInList(
          draft.pages[indexes.pageIndex].rows,
          indexes.rowIndex,
          "down"
        );
      })
    );
  }

  function moveColumnLeft(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns =
          moveValueInList(
            draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns,
            indexes.columnIndex,
            "up"
          );
      })
    );
  }

  function moveColumnRight(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns =
          moveValueInList(
            draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns,
            indexes.columnIndex,
            "down"
          );
      })
    );
  }

  function moveSectionUp(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
          indexes.columnIndex
        ].sections = moveValueInList(
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections,
          indexes.sectionIndex,
          "up"
        );
      })
    );
  }

  function moveSectionDown(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
          indexes.columnIndex
        ].sections = moveValueInList(
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections,
          indexes.sectionIndex,
          "down"
        );
      })
    );
  }

  function addRow(indexes: { pageIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows.push({
          columns: [{ sections: [] }],
        });
      })
    );
  }

  function deleteRow(indexes: { pageIndex: number; rowIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows.splice(indexes.rowIndex, 1);
      })
    );
  }

  function addColumn(indexes: { pageIndex: number; rowIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns.push({
          sections: [],
        });
      })
    );
  }

  function deleteColumn(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns.splice(
          indexes.columnIndex,
          1
        );
      })
    );
  }

  function addSection(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
          indexes.columnIndex
        ].sections.splice(indexes.sectionIndex + 1, 0, {
          id: Id.generate(),
          label: "Section",
          blocks: [],
        });
      })
    );
  }

  function renameSection(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    label: string
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const sections =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections;
        sections[indexes.sectionIndex].label = label;
      })
    );
  }

  function toggleSectionVisibleOnCard(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        const sections =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections;
        const oldValue = sections[indexes.sectionIndex].visibleOnCard;
        sections[indexes.sectionIndex].visibleOnCard = !oldValue;
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

  function deleteSection(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        const column =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ];

        column.sections = column.sections.filter((a, index) => {
          return index !== indexes.sectionIndex;
        });
      })
    );
  }

  function addBlock(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    type: BlockType
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        const section =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex];
        section.blocks.push(
          CharacterFactory.makeBlock(type, {
            defaultCommands: settingsManager.state.diceCommandIds,
          })
        );
      })
    );
  }
  function pasteBlocks(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    blocks: Array<IBlock>
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        const section =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex];
        for (const block of blocks) {
          section.blocks.push(CharacterFactory.duplicateBlock(block));
        }
      })
    );
  }

  function duplicatePage(pageIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const pageToDuplicate = draft.pages[pageIndex];
        draft.pages.splice(
          pageIndex + 1,
          0,
          CharacterFactory.duplicatePage(pageToDuplicate)
        );
      })
    );
  }

  function moveDnDBlock(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
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

        const section =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex];

        const dragItem = section.blocks[dragIndex];

        section.blocks.splice(dragIndex, 1);
        section.blocks.splice(hoverIndex, 0, dragItem);
      })
    );
  }

  function moveBlockUp(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
    blockIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
          indexes.columnIndex
        ].sections[indexes.sectionIndex].blocks = moveValueInList(
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex].blocks,
          indexes.blockIndex,
          "up"
        );
      })
    );
  }

  function moveBlockDown(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
    blockIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
          indexes.columnIndex
        ].sections[indexes.sectionIndex].blocks = moveValueInList(
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex].blocks,
          indexes.blockIndex,
          "down"
        );
      })
    );
  }

  function setBlock(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
      blockIndex: number;
    },
    block: IBlock
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const section =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex];
        section.blocks[indexes.blockIndex] = block;
      })
    );
  }

  function setBlockMeta(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
      blockIndex: number;
    },
    meta: any
  ) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const section =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex];
        section.blocks[indexes.blockIndex].meta = meta;
      })
    );
  }

  function toggleBlockMainPointCounter(blockId: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        for (const page of draft.pages) {
          for (const row of page.rows) {
            for (const column of row.columns) {
              for (const section of column.sections) {
                for (const block of section.blocks) {
                  const match = block.id === blockId;

                  if (block.type === BlockType.PointCounter) {
                    if (match) {
                      block.meta.isMainPointCounter =
                        !block.meta.isMainPointCounter;
                    } else {
                      block.meta.isMainPointCounter = false;
                    }
                  }
                }
              }
            }
          }
        }
      })
    );
  }

  function deleteBlock(indexes: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
    sectionIndex: number;
    blockIndex: number;
  }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        const section =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex];
        section.blocks = section.blocks.filter((field, index) => {
          return index !== indexes.blockIndex;
        });
      })
    );
  }

  function getCharacterWithNewTimestamp() {
    const updatedCharacter = produce(character!, (draft) => {
      if (!draft) {
        return;
      }
      draft.name = previewContentEditable({ value: draft.name });
      draft.lastUpdated = getUnix();
    });
    return updatedCharacter;
  }

  function toggleWideMode() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.wide = draft.wide == null ? true : !draft.wide;
      })
    );
  }

  function setZoom(zoom: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.zoom = zoom;
      })
    );
  }

  return {
    state: { character, dirty },
    actions: {
      loadTemplate,
      setName,
      setGroup,
      addPage,
      addRow,
      moveRowUp,
      moveRowDown,
      deleteRow,
      addColumn,
      moveColumnLeft,
      moveColumnRight,
      deleteColumn,
      renamePage,
      deletePage,
      addSection,
      moveSectionUp,
      moveSectionDown,
      pasteBlocks,
      renameSection,
      toggleSectionVisibleOnCard,
      movePage,
      deleteSection,
      addBlock,
      duplicatePage,
      moveDnDBlock,
      moveBlockUp,
      moveBlockDown,
      setBlock,
      setBlockMeta,
      toggleBlockMainPointCounter,
      deleteBlock,
      getCharacterWithNewTimestamp,
      toggleWideMode,
      setZoom,
    },
  };
}

export function moveValueInList<T>(
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
