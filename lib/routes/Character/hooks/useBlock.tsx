// POC

import produce from "immer";
import { IBlock, ISlotTrackerBlock } from "../../../domains/character/types";
import { useLazyState } from "../../../hooks/useLazyState/useLazyState";

export function useBlock(props: {
  block: IBlock;
  onChange(newBlock: IBlock): void;
}) {
  const [block, setBlock] = useLazyState({
    delay: 750,
    value: props.block,
    onChange: props.onChange,
  });

  function setBlockLabel(label: any) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.label = label;
      })
    );
  }

  function setBlockValue(value: any) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.value = value;
      })
    );
  }

  function setBlockMeta(meta: any) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        draft.meta = meta;
      })
    );
  }

  function addCheckboxFieldValue() {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        (draft.value as ISlotTrackerBlock["value"]).push({
          label: "0",
          checked: false,
        });
      })
    );
  }

  function removeCheckboxFieldValue(
    pageIndex: number,
    sectionIndex: number,
    blockIndex: number
  ) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        (draft.value as ISlotTrackerBlock["value"]).filter(
          (box, boxIndex, boxes) => {
            return boxIndex !== boxes.length - 1;
          }
        );
      })
    );
  }

  function toggleCheckboxFieldValue(boxIndexToToggle: number) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        const currentValue = (block.value as ISlotTrackerBlock["value"])[
          boxIndexToToggle
        ];

        (block.value as ISlotTrackerBlock["value"])[boxIndexToToggle] = {
          label: currentValue.label,
          checked: !currentValue.checked,
        };
      })
    );
  }

  function renameCheckboxFieldValue(boxIndexToRename: number, label: string) {
    setBlock(
      produce((draft: IBlock | undefined) => {
        if (!draft) {
          return;
        }
        const currentValue = (block.value as ISlotTrackerBlock["value"])[
          boxIndexToRename
        ];

        (block.value as ISlotTrackerBlock["value"])[boxIndexToRename] = {
          label: label,
          checked: currentValue.checked,
        };
      })
    );
  }

  return {
    state: {
      block: block,
    },
    actions: {
      setBlockLabel,
      setBlockValue,
      setBlockMeta,
      addCheckboxFieldValue,
      removeCheckboxFieldValue,
      toggleCheckboxFieldValue,
      renameCheckboxFieldValue,
    },
  };
}
