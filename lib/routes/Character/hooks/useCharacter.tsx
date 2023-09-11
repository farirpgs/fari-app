import { produce } from "immer";
import isEqual from "lodash/isEqual";
import { useContext, useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { SettingsContext } from "../../../contexts/SettingsContext/SettingsContext";
import { Id } from "../../../domains/Id/Id";
import { CharacterFactory } from "../../../domains/character/CharacterFactory";
import {
  BlockType,
  IBlock,
  ICharacter,
  ICharacterTheme,
  IPage,
} from "../../../domains/character/types";
import { getUnix, getUnixFrom } from "../../../domains/dayjs/getDayJS";
import { ICharacterTemplate } from "../../../services/character-templates/CharacterTemplateService";

export function useCharacter(
  characterFromProps?: ICharacter | undefined,
  onChange?: (character: ICharacter) => void,
) {
  const settingsManager = useContext(SettingsContext);

  const [character, setCharacter] = useState<ICharacter | undefined>(
    characterFromProps,
  );

  const dirty = useMemo(() => {
    return !isEqual(characterFromProps, character);
  }, [characterFromProps, character]);

  useEffect(() => {
    const characterFromPropsLastUpdated = getUnixFrom(
      characterFromProps?.lastUpdated ?? 0,
    );
    const currentCharacterLastUpdated = getUnixFrom(
      character?.lastUpdated ?? 0,
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
      }),
    );
    onChange?.(character!);
  }

  function setName(newName: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.name = newName;
      }),
    );
    onChange?.(character!);
  }

  function setGroup(newGroup: string | null | undefined) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.group = newGroup as string | undefined;
      }),
    );
    onChange?.(character!);
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
      }),
    );
    onChange?.(character!);
  }

  function deletePage(pageIndex: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages = draft.pages.filter((p, index) => index !== pageIndex);
      }),
    );
    onChange?.(character!);
  }

  function renamePage(pageIndex: number, value: string) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[pageIndex].label = value;
      }),
    );
    onChange?.(character!);
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
          "up",
        );
      }),
    );
    onChange?.(character!);
  }

  function setTheme(setter?: (theme: ICharacterTheme) => void) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.theme = draft.theme ?? {};
        setter?.(draft.theme);
      }),
    );
    onChange?.(character!);
  }
  function removeTheme() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.theme = undefined;
      }),
    );
    onChange?.(character!);
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
          "down",
        );
      }),
    );
    onChange?.(character!);
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
            "up",
          );
      }),
    );
    onChange?.(character!);
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
            "down",
          );
      }),
    );
    onChange?.(character!);
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
          "up",
        );
      }),
    );
    onChange?.(character!);
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
          "down",
        );
      }),
    );
    onChange?.(character!);
  }

  function addRow(indexes: { pageIndex: number; rowIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows.splice(indexes.rowIndex + 1, 0, {
          columns: [{ sections: [] }],
        });
      }),
    );
    onChange?.(character!);
  }

  function deleteRow(indexes: { pageIndex: number; rowIndex: number }) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages[indexes.pageIndex].rows.splice(indexes.rowIndex, 1);
      }),
    );
    onChange?.(character!);
  }

  function addColumn(indexes: {
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
          indexes.columnIndex + 1,
          0,
          {
            sections: [],
          },
        );
      }),
    );
    onChange?.(character!);
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
          1,
        );
      }),
    );
    onChange?.(character!);
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
      }),
    );
    onChange?.(character!);
  }

  function renameSection(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    label: string,
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
      }),
    );
    onChange?.(character!);
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
      }),
    );
    onChange?.(character!);
  }

  function movePage(pageIndex: number, direction: "up" | "down") {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }
        draft.pages = moveValueInList(draft.pages, pageIndex, direction);
      }),
    );
    onChange?.(character!);
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
      }),
    );
    onChange?.(character!);
  }

  function addBlock(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    type: BlockType,
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
          }),
        );
      }),
    );
    onChange?.(character!);
  }
  function pasteBlocks(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    blocks: Array<IBlock>,
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
      }),
    );
    onChange?.(character!);
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
          CharacterFactory.duplicatePage(pageToDuplicate),
        );
      }),
    );
    onChange?.(character!);
  }

  function moveDnDBlock(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    },
    dragIndex: number,
    hoverIndex: number,
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
      }),
    );
    onChange?.(character!);
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
          "up",
        );
      }),
    );
    onChange?.(character!);
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
          "down",
        );
      }),
    );
    onChange?.(character!);
  }

  function duplicateBlock(indexes: {
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
        const block =
          draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
            indexes.columnIndex
          ].sections[indexes.sectionIndex].blocks[indexes.blockIndex];
        const newBlock = CharacterFactory.duplicateBlock(block);

        draft.pages[indexes.pageIndex].rows[indexes.rowIndex].columns[
          indexes.columnIndex
        ].sections[indexes.sectionIndex].blocks.splice(
          indexes.blockIndex + 1,
          0,
          newBlock,
        );
      }),
    );
    onChange?.(character!);
  }

  function setBlock(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
      blockIndex: number;
    },
    block: IBlock,
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
      }),
    );
    onChange?.(character!);
  }

  function setBlockMeta(
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
      blockIndex: number;
    },
    meta: any,
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
      }),
    );
    onChange?.(character!);
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
      }),
    );
    onChange?.(character!);
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
      }),
    );
    onChange?.(character!);
  }

  function toggleWideMode() {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.wide = draft.wide == null ? true : !draft.wide;
      }),
    );
    onChange?.(character!);
  }

  function setZoom(zoom: number) {
    setCharacter(
      produce((draft: ICharacter | undefined) => {
        if (!draft) {
          return;
        }

        draft.zoom = zoom;
      }),
    );
    onChange?.(character!);
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

  return {
    state: { character, dirty },
    actions: {
      loadTemplate,
      setName,
      setGroup,
      addPage,
      addRow,
      moveRowUp,
      removeTheme,
      setTheme,
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
      duplicateBlock,
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
  direction: "up" | "down",
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
