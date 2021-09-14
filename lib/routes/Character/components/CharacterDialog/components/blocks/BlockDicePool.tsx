import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { darken, lighten, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { default as React, useContext } from "react";
import {
  ContentEditable,
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { DiceContext } from "../../../../../../contexts/DiceContext/DiceContext";
import {
  BlockType,
  IDicePoolBlock,
} from "../../../../../../domains/character/types";
import { IRollGroup } from "../../../../../../domains/dice/Dice";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { BlockSelectors } from "../../domains/BlockSelectors/BlockSelectors";
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
  rollGroup: IRollGroup;
};

export type IDicePool = Array<IDicePoolElement>;

export function BlockDicePool(props: IBlockComponentProps<IDicePoolBlock>) {
  const { t } = useTranslate();
  const diceManager = useContext(DiceContext);
  const hasCommands = !!props.block.meta.commands?.length;
  const canRoll = !props.readonly && hasCommands;
  const isSelected = diceManager.state.pool.some(
    (p) => p.blockId === props.block.id
  );
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  const commands = props.block.meta.commands || [];
  const blockCommandSetOptions = DiceCommandGroup.getCommandSetOptionsFromBlock(
    props.block
  );
  const rollGroup = BlockSelectors.getRollGroupFromBlock(props.block);
  return (
    <>
      <Box>
        {isLabelVisible && (
          <Box pb=".5rem">
            <Grid
              container
              spacing={1}
              justifyContent="space-between"
              wrap="nowrap"
            >
              <Grid item xs>
                <FateLabel display="inline" align="center">
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
        )}
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>
            <Box>
              <DiceMenuForCharacterSheet
                commandSetIds={commands}
                onChange={(newCommandIds) => {
                  props.onMetaChange({
                    ...props.block.meta,
                    commands: newCommandIds,
                  });
                }}
                render={(diceMenuProps) => (
                  <Pool
                    fontSize="1.2rem"
                    borderRadius="8px"
                    selected={isSelected}
                    clickable={canRoll}
                    borderStyle={hasCommands ? "solid" : "dashed"}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (!props.readonly) {
                        diceMenuProps.openMenu(e);
                      }
                    }}
                    onClick={() => {
                      if (!canRoll) {
                        return;
                      }

                      diceManager.actions.setOptions({ listResults: true });
                      diceManager.actions.addOrRemovePoolElement({
                        blockId: props.block.id,
                        blockType: props.block.type,
                        label: props.block.label,
                        rollGroup: rollGroup,
                      });
                    }}
                  >
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
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
                      {blockCommandSetOptions.map((commandSet, index) => {
                        return (
                          <Grid item key={index}>
                            <Tooltip title={commandSet.label}>
                              <commandSet.icon
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
                )}
              />
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
  const { t } = useTranslate();

  const commands = props.block.meta.commands || [];
  return (
    <>
      <Grid item>
        <DiceMenuForCharacterSheet
          commandSetIds={commands}
          onChange={(newCommandIds) => {
            props.onMetaChange({
              ...props.block.meta,
              commands: newCommandIds,
            });
          }}
          render={(diceMenuProps) => (
            <Tooltip title={commands.join(" + ")}>
              <Link
                component="button"
                variant="caption"
                className={css({
                  color: theme.palette.primary.main,
                })}
                onClick={(e: any) => {
                  if (!diceMenuProps.open) {
                    diceMenuProps.openMenu(e);
                  } else {
                    diceMenuProps.closeMenu();
                  }
                }}
                underline="hover"
              >
                {t("character-dialog.control.set-dice")}
              </Link>
            </Tooltip>
          )}
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
    theme.palette.mode === "light" ? "#e4e4e4" : "#6b6b6b";
  const hoverColor = theme.palette.getContrastText(hoverBackground);

  const hoverBackgroundColor =
    theme.palette.mode === "light"
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

            "boxShadow": selected ? theme.shadows[0] : theme.shadows[1],
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
