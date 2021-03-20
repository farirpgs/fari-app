import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import React from "react";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterSelector } from "../../../../domains/character/CharacterSelector";
import { IDataCyProps } from "../../../../domains/cypress/types/IDataCyProps";
import { IRollDiceOptions } from "../../../../domains/dice/Dice";
import { Font } from "../../../../domains/font/Font";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
import { IPlayer } from "../../../../hooks/useScene/IScene";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { usePointCounter } from "../../../../routes/Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { CircleTextField } from "../../../../routes/Character/components/CharacterDialog/components/blocks/BlockSkill";
import { ConditionalWrapper } from "../../../ConditionalWrapper/ConditionalWrapper";
import { previewContentEditable } from "../../../ContentEditable/ContentEditable";
import {
  DiceBonusLabel,
  DiceBox,
  DiceBoxResult,
} from "../../../DiceBox/DiceBox";
import { FateLabel } from "../../../FateLabel/FateLabel";

export const PlayerRow: React.FC<
  {
    permissions: {
      canRoll: boolean;
      canUpdatePoints: boolean;
      canUpdateInitiative: boolean;
      canLoadCharacterSheet: boolean;
      canRemove: boolean;
    };
    player: IPlayer;

    renderControls: boolean;
    highlight: boolean;
    number: number;
    onDiceRoll(options: IRollDiceOptions): void;
    onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
    onPointsChange(newPoints: string, newMaxPoints: string | undefined): void;

    onPlayerRemove(): void;
    onCharacterSheetOpen(): void;
    onLoadCharacterSheet(): void;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const logger = useLogger();

  const mainPointerBlock = CharacterSelector.getCharacterMainPointerBlock(
    props.player.character
  );
  const pointFromProps = mainPointerBlock?.value ?? props.player.points;
  const maxPointsFromProps = mainPointerBlock?.meta.max ?? undefined;

  const pointsManager = usePointCounter({
    points: pointFromProps,
    maxPoints: maxPointsFromProps,
    onPointsChange(newPoints) {
      props.onPointsChange(newPoints, pointsManager.state.maxPoints);
    },
    onMaxPointsChange(newMaxPoints) {
      props.onPointsChange(pointsManager.state.points, newMaxPoints);
    },
  });

  const textColor = useTextColors(theme.palette.background.default);
  const lightBackground = useLightBackground();
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;

  const name =
    props.player?.character?.name ||
    props.player?.playerName ||
    `Player #${props.number}`;

  const hasCharacterSheet = !!props.player.character;

  const points = parseInt(mainPointerBlock?.value ?? "0") || 0;

  const pointsStyle = css({
    background: points === 0 ? textColor.disabled : theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create("background"),
    width: "2rem",
    height: "2rem",
    margin: "0 auto",
  });

  const handleRoll = (options: IRollDiceOptions) => {
    props.onDiceRoll(options);
    logger.info("ScenePlayer:onDiceRoll");
  };

  return (
    <>
      <Box bgcolor={props.highlight ? lightBackground : undefined}>
        <Box py=".8rem" px=".5rem">
          <Grid container spacing={1} wrap="nowrap">
            <Grid item xs={9}>
              {renderCharacterSheetButton()}
            </Grid>
            <Grid item xs container spacing={1} justify="flex-end">
              <Grid item>{renderInitiative()}</Grid>
              {props.permissions.canRemove && (
                <Grid item>{renderDeleteButton()}</Grid>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} wrap="nowrap">
            <Grid item>
              <Box display="flex" justifyContent="flex-end">
                <DiceBox
                  rolls={props.player.rolls}
                  size="2rem"
                  fontSize="1rem"
                  borderSize=".15rem"
                  disabled={!props.permissions.canRoll}
                  onClick={() => {
                    handleRoll({ pool: false });
                  }}
                />
              </Box>
            </Grid>

            <Grid item container>
              <Grid item xs={12}>
                <DiceBonusLabel rolls={props.player.rolls} />
              </Grid>
              <Grid item xs={12}>
                <DiceBoxResult rolls={props.player.rolls} />
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2} wrap="nowrap">
            <Grid item>{renderPointCounter()}</Grid>
          </Grid>
        </Box>
        <Divider light />
      </Box>
    </>
  );

  function renderDeleteButton() {
    return (
      <Tooltip title={t("player-row.remove-character")}>
        <IconButton
          data-cy={`${props["data-cy"]}.remove`}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            props.onPlayerRemove();
            logger.info("ScenePlayer:onPlayerRemove");
          }}
        >
          <HighlightOffIcon
            color="error"
            className={css({ width: "1rem", height: "1rem" })}
          />
        </IconButton>
      </Tooltip>
    );
  }

  function renderPointCounter() {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={1}
        wrap="nowrap"
      >
        {props.permissions.canUpdatePoints && (
          <Grid item>
            <IconButton
              size="small"
              onClick={() => {
                pointsManager.actions.decrement();
              }}
            >
              <RemoveCircleOutlineOutlinedIcon
                className={css({ width: "1rem", height: "1rem" })}
              />
            </IconButton>
          </Grid>
        )}
        <Grid item>
          <CircleTextField
            data-cy={`player-row.points`}
            value={pointsManager.state.points}
            readonly={!props.permissions.canUpdatePoints}
            onChange={(newValue) => {
              pointsManager.actions.setPoints(newValue);
            }}
          />
        </Grid>
        {pointsManager.state.maxPoints !== undefined && (
          <>
            <Grid item>
              <Typography
                className={css({
                  fontSize: "2rem",
                  color: "#bdbdbd",
                  lineHeight: Font.lineHeight(2),
                })}
              >
                {"/"}
              </Typography>
            </Grid>
            <Grid item>
              <CircleTextField
                data-cy={`player-row.max-points`}
                value={pointsManager.state.maxPoints ?? ""}
                readonly={!props.permissions.canUpdatePoints}
                onChange={(newMax) => {
                  pointsManager.actions.setMaxPoints(newMax);
                }}
              />
            </Grid>
          </>
        )}
        {props.permissions.canUpdatePoints && (
          <Grid item>
            <IconButton
              size="small"
              onClick={() => {
                pointsManager.actions.increment();
              }}
            >
              <AddCircleOutlineOutlinedIcon
                className={css({ width: "1rem", height: "1rem" })}
              />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  }

  function renderInitiative() {
    return (
      <Tooltip
        title={
          props.player.playedDuringTurn
            ? t("player-row.played")
            : t("player-row.not-played")
        }
      >
        <span>
          <IconButton
            data-cy={`${props["data-cy"]}.toggle-initiative`}
            onClick={(e) => {
              e.stopPropagation();
              props.onPlayedInTurnOrderChange(!props.player.playedDuringTurn);
              logger.info("ScenePlayer:onPlayedInTurnOrderChange", {
                playedDuringTurn: !props.player.playedDuringTurn,
              });
            }}
            disabled={!props.permissions.canUpdateInitiative}
            className={css({ padding: "0" })}
          >
            {props.player.playedDuringTurn ? (
              <DirectionsRunIcon htmlColor={playedDuringTurnColor} />
            ) : (
              <EmojiPeopleIcon htmlColor={playedDuringTurnColor} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  function renderCharacterSheetButton() {
    return (
      <>
        <Grid container wrap="nowrap" alignItems="center">
          {props.permissions.canLoadCharacterSheet && (
            <Grid item>
              <Tooltip
                title={
                  hasCharacterSheet
                    ? t("player-row.swap-character-sheet")
                    : t("play-route.add-character-sheet")
                }
                onClick={() => {
                  props.onLoadCharacterSheet();
                  logger.info("ScenePlayer:onCharacterSheetContextButtonPress");
                }}
              >
                <IconButton
                  size="small"
                  color={hasCharacterSheet ? "default" : "primary"}
                >
                  {!hasCharacterSheet ? <NoteAddIcon /> : <RestorePageIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          <Grid item xs zeroMinWidth>
            <ConditionalWrapper
              condition={hasCharacterSheet}
              wrapper={(children) => (
                <Button
                  className={css({
                    width: "100%",
                    background: "transparent",
                    textTransform: "none",
                    color: theme.palette.text.primary,
                    border: "none",
                    borderRadius: "4px",
                  })}
                  data-cy={`${props["data-cy"]}.open-character-sheet`}
                  disabled={!props.player.character}
                  size="small"
                  onClick={(e) => {
                    props.onCharacterSheetOpen();
                    logger.info("ScenePlayer:onCharacterSheetButtonPress");
                  }}
                >
                  {children}
                </Button>
              )}
            >
              <FateLabel
                noWrap
                color="inherit"
                className={css({
                  width: "100%",
                  textAlign: "left",
                  fontSize: "1rem",
                  lineHeight: Font.lineHeight(1),
                })}
              >
                {previewContentEditable({ value: name })}
              </FateLabel>
            </ConditionalWrapper>
          </Grid>
        </Grid>
      </>
    );
  }
};
PlayerRow.displayName = "PlayerRow";
