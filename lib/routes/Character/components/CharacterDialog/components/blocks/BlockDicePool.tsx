import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import { darken, lighten } from "@material-ui/core/styles/colorManipulator";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import { default as React } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import {
  BlockType,
  IDicePoolBlock,
} from "../../../../../../domains/character/types";
import { IDiceCommandOption } from "../../../../../../domains/dice/Dice";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { Block } from "../../domains/Block/Block";
import { DiceCommandGroup } from "../../domains/DiceCommandGroup/DiceCommandGroup";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";

export type IDicePoolElement = {
  blockId: string;
  blockType: BlockType;
  label: string;
  commandOptionList: IDiceCommandOption[];
};

export type IDicePool = Array<IDicePoolElement>;

export function BlockDicePool(
  props: IBlockComponentProps<IDicePoolBlock> & {
    pool: IDicePool;
    onPoolClick(element: IDicePoolElement): void;
  }
) {
  const { t } = useTranslate();
  const hasCommands = !!props.block.meta.commands?.length;
  const canRoll = !props.readonly && hasCommands;
  const isSelected = props.pool.some((p) => p.blockId === props.block.id);

  const blockCommandGroups = DiceCommandGroup.getCommandGroupFromBlock(
    props.block
  );
  const commandOptionList = Block.getCommandOptionList(props.block);

  return (
    <>
      <Box>
        <Box>
          <Grid container spacing={1} justify="space-between" wrap="nowrap">
            <Grid item xs>
              <FateLabel display="inline" align={"center"}>
                <ContentEditable
                  readonly={props.readonly}
                  border={props.advanced}
                  data-cy={`${props.dataCy}.label`}
                  value={props.block.label}
                  onChange={(value) => {
                    props.onLabelChange(value);
                  }}
                />
              </FateLabel>
            </Grid>
          </Grid>
        </Box>
        <Grid
          container
          spacing={1}
          justify="center"
          alignItems="center"
          wrap="nowrap"
        >
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
                    blockType: props.block.type,
                    label: props.block.label,
                    commandOptionList: commandOptionList,
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
                      <FormHelperText
                        className={css({
                          margin: "0",
                          padding: ".5rem",
                        })}
                      >
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
                              fontSize: "2.3rem",
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

export const Pool: React.FC<
  BoxProps & {
    clickable?: boolean;
    tooltipTitle?: string;
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
    tooltipTitle,
    borderStyle = "solid",
    ...rest
  } = props;
  const theme = useTheme();
  const hoverBackground =
    theme.palette.type === "light" ? "#e4e4e4" : "#6b6b6b";
  const hoverColor = theme.palette.getContrastText(hoverBackground);

  const hoverBackgroundColor =
    theme.palette.type === "light"
      ? lighten(theme.palette.primary.main, 0.9)
      : darken(theme.palette.primary.main, 0.7);

  return (
    <Tooltip title={tooltipTitle ?? ""}>
      <Box
        {...rest}
        className={cx(
          css({
            "label": "character-circle-box",
            "background": !selected
              ? theme.palette.background.paper
              : theme.palette.primary.main,
            "color": !selected
              ? theme.palette.getContrastText(theme.palette.background.paper)
              : theme.palette.getContrastText(theme.palette.primary.main),
            "border": props.clickable
              ? `1px ${borderStyle} ${theme.palette.primary.main}`
              : `1px ${borderStyle} #bdbdbd`,

            "boxShadow": selected ? theme.shadows[0] : theme.shadows[2],
            "transition": theme.transitions.create(
              ["color", "background", "border", "borderWidth", "boxShadow"],
              { duration: theme.transitions.duration.shorter }
            ),
            "borderRadius": borderRadius ?? "24px",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "cursor": !clickable ? "inherit" : "pointer",
            "&:hover": {
              color: !clickable || selected ? undefined : hoverColor,
              background:
                !clickable || selected ? undefined : hoverBackgroundColor,
            },
          }),
          className
        )}
      >
        <ButtonBase>
          <Box
            p=".3rem"
            minWidth="50%"
            textAlign="center"
            display="flex"
            className={css({})}
          >
            {props.children}
          </Box>
        </ButtonBase>
      </Box>
    </Tooltip>
  );
};
