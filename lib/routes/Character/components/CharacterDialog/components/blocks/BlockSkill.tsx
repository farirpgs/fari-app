import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISkillBlock } from "../../../../../../domains/character/types";
import { AllDiceCommandGroups } from "../../../../../../domains/dice/Dice";
import { Icons } from "../../../../../../domains/Icons/Icons";
import { useHighlight } from "../../../../../../hooks/useHighlight/useHighlight";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useLightBackground } from "../../../../../../hooks/useLightBackground/useLightBackground";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { FateSkillsDescriptions } from "../../../domains/FateSkillsDescriptions";
import { Block } from "../../domains/Block/Block";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";
import { IDicePool, IDicePoolElement, Pool } from "./BlockDicePool";
export function BlockSkill(
  props: IBlockComponentProps<ISkillBlock> & {
    pool: IDicePool;
    onPoolClick(element: IDicePoolElement): void;
  }
) {
  const theme = useTheme();
  const { t } = useTranslate();
  const [state, setState] = useLazyState({
    value: props.block.value,
    onChange: props.onValueChange,
    delay: 300,
  });

  const isSlotTrackerVisible = props.block.meta.checked !== undefined;
  const skillDescription =
    FateSkillsDescriptions[props.block.label.toLowerCase()] ?? "";
  const hasCommands = !!props.block.meta.commands?.length;
  const isSelected = props.pool.some((p) => p.blockId === props.block.id);

  const canRoll = !props.readonly;

  const [firstCommandGroup] =
    props.block.meta?.commands?.map((commandId) => {
      return AllDiceCommandGroups.find((c) => c.id === commandId);
    }) ?? [];
  const commandOptionList = Block.getCommandOptionList(props.block);

  const RollIcon = firstCommandGroup?.icon ?? Icons.ThrowDice;

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          {canRoll && (
            <Grid item>
              <Pool
                tooltipTitle={t("character-dialog.skill-block.roll")}
                fontSize="1.2rem"
                borderRadius="8px"
                selected={isSelected}
                clickable
                borderStyle={"solid"}
                onClick={() => {
                  props.onPoolClick({
                    blockId: props.block.id,
                    blockType: props.block.type,
                    label: props.block.label,
                    commandOptionList: commandOptionList,
                  });
                }}
              >
                <RollIcon />
              </Pool>
            </Grid>
          )}
          <Grid item>
            <CircleTextField
              data-cy={`character-dialog.${props.section.label}.${props.block.label}.value`}
              value={state}
              readonly={props.readonly}
              onChange={(newState) => {
                setState(newState);
              }}
            />
          </Grid>
          <Grid item xs>
            <FateLabel className={css({ display: "inline-block" })}>
              <ContentEditable
                data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
                readonly={!props.advanced}
                border={props.advanced}
                value={props.block.label}
                onChange={(value) => {
                  props.onLabelChange(value);
                }}
              />
            </FateLabel>
          </Grid>

          {isSlotTrackerVisible && (
            <Grid item>
              <BlockToggleMeta
                readonly={props.readonly}
                pageIndex={props.pageIndex}
                sectionIndex={props.sectionIndex}
                section={props.section}
                block={props.block}
                blockIndex={props.blockIndex}
                onMetaChange={props.onMetaChange}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
BlockSkill.displayName = "BlockSkill";

export function BlockSkillActions(
  props: IBlockActionComponentProps<ISkillBlock>
) {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <>
      <Grid item>
        <DiceMenuForCharacterSheet
          commandGroupIds={props.block.meta.commands || []}
          onChange={(newCommandIds) => {
            props.onMetaChange({
              ...props.block.meta,
              commands: newCommandIds,
            });
          }}
        />
      </Grid>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange({
              ...props.block.meta,
              checked:
                props.block.meta.checked === undefined ? false : undefined,
            });
          }}
        >
          {props.block.meta.checked === undefined
            ? t("character-dialog.control.add-toggle")
            : t("character-dialog.control.remove-toggle")}
        </Link>
      </Grid>
    </>
  );
}

BlockSkillActions.displayName = "BlockSkillActions";

export function CircleTextField(props: {
  "data-cy"?: string;
  "value": string;
  "readonly"?: boolean;
  "highlight"?: boolean;
  onChange?(value: string): void;
}) {
  const theme = useTheme();
  const lightBackground = useLightBackground();
  const highlight = useHighlight();

  return (
    <TextField
      type="number"
      data-cy={props["data-cy"]}
      value={props.value}
      variant="outlined"
      className={css({
        textAlign: "center",
      })}
      disabled={props.readonly}
      onChange={(e) => {
        if (!props.onChange) {
          return;
        }
        if (!e.target.value) {
          props.onChange("");
        } else {
          const parsed = parseInt(e.target.value);
          if (parsed > 999) {
            props.onChange("999");
          } else {
            props.onChange(parsed.toString());
          }
        }
      }}
      InputProps={{
        className: css({
          "width": "3rem",
          "height": "3rem",
          "borderRadius": "50%",
          "background": props.highlight
            ? theme.palette.primary.main
            : "inherit",
          "&&": {
            color: props.highlight
              ? theme.palette.getContrastText(theme.palette.primary.main)
              : "inherit",
          },
          "transition": theme.transitions.create(["color", "background"]),
          "boxShadow": theme.shadows[1],
        }),
      }}
      inputProps={{
        className: css({
          "fontWeight": theme.typography.fontWeightBold,
          "textAlign": "center",
          // this disables the up/down browser arrows
          "padding": "0",
          "&[type=number]": {
            MozAppearance: "textfield",
          },
          "&::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        }),
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}

// const commandGroupsMatch =
// props.block.meta?.commands?.map((commandId) => {
//   return AllDiceCommandGroups.find(
//     (c) => c.id === commandId
//   ) as IDiceCommandGroup;
// }) ?? [];

// const shouldDisplayDiceBelowLabel =
//   !props.advanced && commandGroupsMatch.length > 1;

// {skillDescription && (
//   <>
//     <Tooltip
//       placement="right-start"
//       classes={{
//         tooltip: css({
//           backgroundColor: theme.palette.background.paper,
//           color: theme.palette.text.primary,
//           boxShadow: theme.shadows[1],
//           fontSize: "1rem",
//         }),
//       }}
//       title={
//         <>
//           <Typography
//             className={css({
//               fontWeight: "bold",
//               marginBottom: ".5rem",
//             })}
//           >
//             {skillDescription.quick}
//           </Typography>
//           <Typography>{skillDescription.long}</Typography>
//         </>
//       }
//     >
//       <HelpIcon
//         className={css({
//           marginLeft: ".5rem",
//           fontSize: "1rem",
//         })}
//       />
//     </Tooltip>
//   </>
// )}

// {commandGroupsMatch.length === 1 && (
//   <Grid item>
//     {commandGroupsMatch.map((commandGroup, index) => {
//       return (
//         <Grid item key={index}>
//           <Tooltip title={commandGroup.label}>
//             <commandGroup.icon
//               className={css({
//                 display: "flex",
//                 width: "2rem",
//                 height: "2rem",
//               })}
//             />
//           </Tooltip>
//         </Grid>
//       );
//     })}
//   </Grid>
// )}

// {shouldDisplayDiceBelowLabel && (
//   <Box width="100%">
//     <Grid container spacing={1} alignItems="center">
//       {commandGroupsMatch.map((commandGroup, index) => {
//         return (
//           <Grid item key={index}>
//             <Tooltip title={commandGroup.label}>
//               <commandGroup.icon
//                 className={css({
//                   display: "flex",
//                   width: "2rem",
//                   height: "2rem",
//                 })}
//               />
//             </Tooltip>
//           </Grid>
//         );
//       })}
//     </Grid>
//   </Box>
// )}
