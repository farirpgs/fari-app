import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { ISkillBlock } from "../../../../../../domains/character/types";
import {
  AllDiceCommandGroups,
  IDiceCommandGroup,
  IDiceCommandNames,
  IRollDiceOptions,
} from "../../../../../../domains/dice/Dice";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { FateSkillsDescriptions } from "../../../domains/FateSkillsDescriptions";
import { CommandGroups } from "../../domains/CommandGroups/CommandGroups";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";

export function BlockSkill(
  props: IBlockComponentProps<ISkillBlock> & {
    onSkillClick(
      options: IRollDiceOptions,
      commands: Array<IDiceCommandNames> | undefined
    ): void;
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

  const canRoll = !props.advanced && !props.readonly;

  const [firstCommandGroup] =
    props.block.meta?.commands?.map((commandId) => {
      return AllDiceCommandGroups.find(
        (c) => c.id === commandId
      ) as IDiceCommandGroup;
    }) ?? [];

  const handleRoll = () => {
    if (!canRoll) {
      return;
    }
    const hasCommands = !!props.block.meta.commands?.length;
    const blockCommandNames = CommandGroups.getCommandNamesFromBlock(
      props.block
    );
    const bonus = parseInt(props.block.value) || 0;

    if (hasCommands) {
      props.onSkillClick?.(
        {
          pool: false,
          bonus,
          bonusLabel: props.block.label,
        },
        blockCommandNames
      );
    } else {
      props.onSkillClick?.(
        {
          pool: false,
          bonus,
          bonusLabel: props.block.label,
        },
        undefined
      );
    }
  };

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          {canRoll && (
            <Grid item>
              <Tooltip title={t("character-dialog.skill-block.roll")}>
                <IconButton onClick={handleRoll} size="small">
                  <firstCommandGroup.icon />
                </IconButton>
              </Tooltip>
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
  onChange?(value: string): void;
}) {
  const theme = useTheme();
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
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
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
