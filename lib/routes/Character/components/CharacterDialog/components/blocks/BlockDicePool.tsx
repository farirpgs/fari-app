import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import { default as React } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IDicePoolBlock } from "../../../../../../domains/character/types";
import { IDiceCommandNames } from "../../../../../../domains/dice/Dice";
import { useLightBackground } from "../../../../../../hooks/useLightBackground/useLightBackground";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { CommandGroups } from "../../domains/CommandGroups/CommandGroups";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";

export type IDicePoolElement = {
  blockId: string;
  label: string;
  commands: IDiceCommandNames[];
};

export type IDicePool = Array<IDicePoolElement>;

export function BlockDicePool(
  props: IBlockComponentProps<IDicePoolBlock> & {
    pool: IDicePool;
    onPoolClick(element: IDicePoolElement): void;
  }
) {
  const theme = useTheme();
  const { t } = useTranslate();
  const hasCommands = !!props.block.meta.commands?.length;
  const canRoll = !props.advanced && !props.readonly && hasCommands;
  const isSelected = props.pool.some((p) => p.blockId === props.block.id);

  const blockCommandGroups = CommandGroups.getCommandGroupFromBlock(
    props.block
  );
  const blockCommandNames = CommandGroups.getCommandNamesFromBlock(props.block);

  return (
    <>
      <Box>
        <Box>
          <Grid container spacing={1} justify="space-between" wrap="nowrap">
            <Grid item xs>
              <FateLabel display="inline">
                <ContentEditable
                  readonly={!props.advanced}
                  border={props.advanced}
                  data-cy={`character-dialog.${props.section.label}.${props.block.label}.label`}
                  value={props.block.label}
                  onChange={(value) => {
                    props.onLabelChange(value);
                  }}
                />
              </FateLabel>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          <Grid item>
            <Box>
              <Pool
                fontSize="1.2rem"
                borderRadius="8px"
                selected={isSelected}
                clickable={canRoll}
                borderStyle={hasCommands ? "solid" : "dashed"}
                onClick={() => {
                  if (!canRoll) {
                    return;
                  }

                  props.onPoolClick({
                    blockId: props.block.id,
                    label: previewContentEditable({ value: props.block.label }),
                    commands: blockCommandNames,
                  });
                }}
              >
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justify="center"
                >
                  {!hasCommands && (
                    <Grid item>
                      <FormHelperText>
                        {t("character-dialog.helper-text.empty-dice-pool")}
                      </FormHelperText>
                    </Grid>
                  )}
                  {blockCommandGroups.map((commandGroup, index) => {
                    return (
                      <Grid item key={index}>
                        <Tooltip title={commandGroup.label}>
                          <commandGroup.icon
                            className={css({
                              display: "flex",
                              width: "2rem",
                              height: "2rem",
                            })}
                          />
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Pool>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
BlockDicePool.displayName = "BlockDicePool";

export function BlockDicePoolActions(
  props: IBlockActionComponentProps<IDicePoolBlock>
) {
  const theme = useTheme();

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
    </>
  );
}

BlockDicePoolActions.displayName = "BlockDicePoolActions";

const Pool: React.FC<
  BoxProps & {
    clickable?: boolean;
    selected?: boolean;
    borderRadius?: string;
    borderStyle?: string;
  }
> = (props) => {
  const {
    className,
    clickable,
    selected,
    borderRadius,
    borderStyle = "solid",
    ...rest
  } = props;
  const theme = useTheme();
  const hoverBackground =
    theme.palette.type === "light" ? "#e4e4e4" : "#6b6b6b";
  const hoverColor = theme.palette.getContrastText(hoverBackground);
  const lightBackground = useLightBackground();
  return (
    <Box
      {...rest}
      className={cx(
        css({
          "label": "character-circle-box",
          "background": !selected
            ? theme.palette.background.paper
            : lightBackground,
          "color": !selected
            ? theme.palette.getContrastText(theme.palette.background.paper)
            : theme.palette.getContrastText(lightBackground),
          "border": `2px ${borderStyle} ${
            selected ? theme.palette.primary.main : "#bdbdbd"
          }`,
          "boxShadow": selected ? theme.shadows[6] : theme.shadows[1],
          "transition": theme.transitions.create([
            "color",
            "background",
            "border",
            "boxShadow",
          ]),
          "borderRadius": borderRadius ?? "24px",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "cursor": !clickable ? "inherit" : "pointer",
          "&:hover": {
            color: !clickable || selected ? undefined : hoverColor,
            background: !clickable || selected ? undefined : hoverBackground,
          },
        }),
        className
      )}
    >
      <Box p=".5rem" minWidth="50%" textAlign="center">
        {props.children}
      </Box>
    </Box>
  );
};
Pool.displayName = "CharacterCircleBox";
