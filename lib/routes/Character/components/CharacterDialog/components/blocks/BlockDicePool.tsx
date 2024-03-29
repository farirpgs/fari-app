import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Badge from "@mui/material/Badge";
import Box, { BoxProps } from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { darken, lighten, useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import isEqual from "lodash/isEqual";
import { default as React, useContext, useEffect, useState } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { Delays } from "../../../../../../constants/Delays";
import { DiceContext } from "../../../../../../contexts/DiceContext/DiceContext";
import {
  BlockType,
  IDicePoolBlock,
  ISkillBlock,
} from "../../../../../../domains/character/types";
import {
  Dice,
  DiceOptions,
  IDiceCommandId,
  IDicePoolResult,
} from "../../../../../../domains/dice/Dice";
import { Icons } from "../../../../../../domains/Icons/Icons";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { BlockSelectors } from "../../domains/BlockSelectors/BlockSelectors";
import { IBlockHandlers } from "../../types/IBlockComponentProps";
import { BlockToggleMeta } from "../BlockToggleMeta";
import { DiceMenuForCharacterSheet } from "../DiceMenuForCharacterSheet";
import { ThemedLabel } from "../ThemedLabel";

const DiceCommandRange: Array<IDiceCommandId> = [
  "1d4",
  "1d6",
  "1d8",
  "1d10",
  "1d12",
  "1d20",
  "1d100",
];
export const BlockDicePool = React.memo(
  (
    props: {
      label: string | undefined;
      value: string | undefined;
      checked: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      blockId: string;
      blockType: BlockType;
      hideModifier: boolean | undefined;
      commands: Array<IDiceCommandId> | undefined;
      dataCy?: string;
      mid?: React.ReactNode;
      onRoll(diceRollResult: IDicePoolResult): void;
    } & IBlockHandlers<IDicePoolBlock | ISkillBlock>
  ) => {
    const { t } = useTranslate();
    const theme = useTheme();
    const diceManager = useContext(DiceContext);
    const [hover, setHover] = useState(false);
    const [hoverControlsVisible, setHoverControlsVisible] = useState(false);
    const hasCommands = !!props.commands?.length;
    const canRoll = !props.readonly;
    const isSelected = diceManager.state.blockWithPools.some(
      (p) => p.blockId === props.blockId
    );
    const isToggleVisible = props.checked === true || props.checked === false;

    const commands = props.commands || [];
    const commandsCount = commands.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: acc[curr] ? acc[curr] + 1 : 1,
      };
    }, {} as Record<IDiceCommandId, number>);

    const firstCommand = commands[0];
    const isAllTheSameCommand =
      !!firstCommand && commands.every((c) => c === firstCommand);
    const canChangeDiceSize =
      isAllTheSameCommand && DiceCommandRange.includes(firstCommand);

    useEffect(() => {
      let enterTimeout: NodeJS.Timeout;
      let leaveTimeout: NodeJS.Timeout;
      if (hover) {
        enterTimeout = setTimeout(() => {
          setHoverControlsVisible(true);
        }, Delays.blockHoverEnterControls);
      } else {
        leaveTimeout = setTimeout(() => {
          setHoverControlsVisible(false);
        }, Delays.blockHoverLeaveControls);
      }
      return () => {
        clearTimeout(enterTimeout);
        clearTimeout(leaveTimeout);
      };
    }, [hover]);

    function handleOnAddDiceFrom() {
      props.onMetaChange((prev) => ({
        ...prev,
        commands: [...commands, firstCommand],
      }));
    }

    function handleOnRemoveDiceFrom() {
      props.onMetaChange((prev) => ({
        ...prev,
        commands: commands.slice(1),
      }));
    }

    function handleStepDownDice() {
      const newCommands = commands.map((c) => {
        const currentDieSize = DiceCommandRange.indexOf(c);
        const newDieSizeIndex = Math.max(0, currentDieSize - 1);
        return DiceCommandRange[newDieSizeIndex];
      });
      props.onMetaChange((prev) => ({
        ...prev,
        commands: newCommands,
      }));
    }

    function handleStepUpDice() {
      const newCommands = commands.map((c) => {
        const currentDieSize = DiceCommandRange.indexOf(c);
        const newDieSizeIndex = Math.min(
          DiceCommandRange.length - 1,
          currentDieSize + 1
        );
        return DiceCommandRange[newDieSizeIndex];
      });
      props.onMetaChange((prev) => ({
        ...prev,
        commands: newCommands,
      }));
    }

    return (
      <>
        <Box
          onPointerEnter={() => {
            setHover(true);
          }}
          onPointerLeave={() => {
            setHover(false);
          }}
        >
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid
              item
              sx={{
                maxWidth: "50%",
              }}
            >
              {renderPool()}
            </Grid>
            {props.mid && <Grid item>{props.mid}</Grid>}

            <Grid item xs>
              {renderLabel()}
            </Grid>
            {isToggleVisible && <Grid item>{renderToggle()}</Grid>}
          </Grid>

          {!props.readonly && (
            <Collapse in={hoverControlsVisible || props.advanced}>
              <Box py=".5rem">
                <Grid container alignItems="center">
                  {canChangeDiceSize && (
                    <Grid item>
                      <Tooltip title={t("character-dialog.control.step-down")}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={firstCommand === DiceCommandRange[0]}
                            color="inherit"
                            data-cy={`${props.dataCy}.step-down`}
                            onClick={() => {
                              handleStepDownDice();
                            }}
                          >
                            <FastRewindIcon
                              sx={{
                                width: "1.1rem",
                                height: "1.1rem",
                              }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  )}
                  {isAllTheSameCommand && (
                    <Grid item>
                      <Tooltip title={t("character-dialog.control.remove-one")}>
                        <span>
                          <IconButton
                            size="small"
                            color="inherit"
                            disabled={commands.length === 1}
                            data-cy={`${props.dataCy}.remove-one`}
                            onClick={() => {
                              handleOnRemoveDiceFrom();
                            }}
                          >
                            <RemoveCircleOutlineIcon
                              sx={{
                                width: "1.1rem",
                                height: "1.1rem",
                              }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  )}
                  <Grid item>{renderSetDice()}</Grid>
                  {isAllTheSameCommand && (
                    <Grid item>
                      <Tooltip title={t("character-dialog.control.add-one")}>
                        <span>
                          <IconButton
                            color="inherit"
                            data-cy={`${props.dataCy}.add-one`}
                            size="small"
                            onClick={() => {
                              handleOnAddDiceFrom();
                            }}
                          >
                            <AddCircleOutlineIcon
                              sx={{
                                width: "1.1rem",
                                height: "1.1rem",
                              }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  )}
                  {canChangeDiceSize && (
                    <Grid item>
                      <Tooltip title={t("character-dialog.control.step-up")}>
                        <span>
                          <IconButton
                            size="small"
                            color="inherit"
                            disabled={
                              firstCommand ===
                              DiceCommandRange[DiceCommandRange.length - 1]
                            }
                            data-cy={`${props.dataCy}.step-up`}
                            onClick={() => {
                              handleStepUpDice();
                            }}
                          >
                            <FastForwardIcon
                              sx={{
                                width: "1.1rem",
                                height: "1.1rem",
                              }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Collapse>
          )}
        </Box>
      </>
    );

    function renderSetDice() {
      return (
        <DiceMenuForCharacterSheet
          commandSetIds={commands}
          onChange={(newCommandIds) => {
            props.onMetaChange((prev) => ({
              ...prev,
              commands: newCommandIds,
            }));
          }}
          render={(diceMenuProps) => (
            <Link
              component="button"
              variant="caption"
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={(e: any) => {
                if (!props.readonly) {
                  diceMenuProps.openMenu(e);
                }

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
          )}
        />
      );
    }

    function renderToggle() {
      return (
        <BlockToggleMeta
          readonly={props.readonly}
          dataCy={props.dataCy}
          checked={props.checked}
          onMetaChange={props.onMetaChange}
        />
      );
    }

    function renderLabel() {
      return (
        <ThemedLabel>
          <ContentEditable
            readonly={props.readonly || !props.advanced}
            border={props.advanced}
            dataCy={`${props.dataCy}.label`}
            value={props.label || ""}
            onChange={(value) => {
              props.onLabelChange(value);
            }}
          />
        </ThemedLabel>
      );
    }

    function renderPool() {
      return (
        <Pool
          fontSize="1.2rem"
          borderRadius="8px"
          selected={isSelected}
          position="relative"
          clickable={canRoll}
          tooltipTitle={
            canRoll ? t("character-dialog.helper-text.pool") : undefined
          }
          borderStyle={hasCommands ? "solid" : "dashed"}
          onContextMenu={(e) => {
            e.preventDefault();
            const pool = BlockSelectors.getPoolFromBlock({
              commands: props.commands,
              label: props.label,
              hideModifier: props.hideModifier,
              type: props.blockType,
              value: props.value,
            });

            diceManager.actions.addOrRemovePoolElement({
              blockId: props.blockId,
              blockType: props.blockType,
              label: props.label || "",
              pool: pool,
            });
          }}
          onClick={() => {
            if (!canRoll) {
              return;
            }
            const rollGroup = BlockSelectors.getPoolFromBlock({
              commands: props.commands,
              label: props.label,
              hideModifier: props.hideModifier,
              type: props.blockType,
              value: props.value,
            });

            const results = Dice.rollPool(rollGroup);

            props.onRoll(results);
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
                <Icons.ThrowDice
                  sx={{
                    display: "flex",
                    fontSize: "2.3rem",
                  }}
                />
              </Grid>
            )}
            {Object.keys(commandsCount).map((commandId, index) => {
              const id = commandId as IDiceCommandId;
              const commandSet = DiceOptions[id];
              const count = commandsCount[id];
              return (
                <Grid item key={index}>
                  <Badge
                    badgeContent={count}
                    color="default"
                    invisible={count === 1}
                    sx={{
                      "& .MuiBadge-badge": {
                        background: theme.palette.text.primary,
                        color: theme.palette.getContrastText(
                          theme.palette.text.primary
                        ),
                      },
                    }}
                  >
                    <commandSet.icon
                      sx={{
                        display: "flex",
                        fontSize: "2.3rem",
                      }}
                    />
                  </Badge>
                </Grid>
              );
            })}
          </Grid>
        </Pool>
      );
    }
  }
);

BlockDicePool.displayName = "BlockDicePool";

export const BlockDicePoolActions = React.memo(
  (
    props: {
      value: string | undefined;
      label: string | undefined;
      checked: boolean | undefined;
    } & IBlockHandlers<IDicePoolBlock>
  ) => {
    const { t } = useTranslate();
    const theme = useTheme();

    const handleAddRemoveToggle = useEvent(() => {
      props.onMetaChange((prev) => ({
        ...prev,
        checked: prev.checked === undefined ? false : undefined,
      }));
    });

    return (
      <>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={handleAddRemoveToggle}
            underline="hover"
          >
            {props.checked === undefined
              ? t("character-dialog.control.add-toggle")
              : t("character-dialog.control.remove-toggle")}
          </Link>
        </Grid>
      </>
    );
  },
  (prev, next) => {
    return isEqual(prev, next);
  }
);

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
    sx,
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
    <Tooltip title={tooltipTitle ?? ""} placement="right">
      <Box
        {...rest}
        sx={{
          "label": "character-circle-box",
          "background": !selected
            ? theme.palette.background.paper
            : theme.palette.primary.main,
          "color": !selected
            ? theme.palette.getContrastText(theme.palette.background.paper)
            : theme.palette.getContrastText(theme.palette.primary.main),
          "border": props.clickable
            ? `1px ${borderStyle} ${theme.palette.text.primary}`
            : `none`,

          "boxShadow":
            selected || !props.clickable ? theme.shadows[0] : theme.shadows[1],
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
          ...sx,
        }}
      >
        <ButtonBase disabled={!props.clickable}>
          <Box
            p=".3rem"
            minWidth="50%"
            textAlign="center"
            display="flex"
            sx={{}}
          >
            {props.children}
          </Box>
        </ButtonBase>
      </Box>
    </Tooltip>
  );
};
