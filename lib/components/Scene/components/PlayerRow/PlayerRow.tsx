import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
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
import {
  DiceBonusLabel,
  DiceBox,
  DiceBoxResult,
} from "../../../DiceBox/DiceBox";

export const PlayerRow: React.FC<
  {
    player: IPlayer;
    readonly: boolean;
    renderControls: boolean;
    highlight: boolean;

    onDiceRoll(options: IRollDiceOptions): void;
    onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
    onUpdatePlayerCharacterMainPointCounter(points: number): void;
    onPlayerRemove(): void;
    onCharacterSheetOpen(): void;
    onLoadCharacterSheet(): void;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const logger = useLogger();
  const shouldHighlight = props.highlight;

  const textColor = useTextColors(theme.palette.background.default);
  const lightBackground = useLightBackground();
  const playedDuringTurnColor = props.player.playedDuringTurn
    ? theme.palette.primary.main
    : textColor.disabled;

  const name =
    props.player?.character?.name ||
    props.player?.playerName ||
    t("play-route.character-name");

  const hasCharacterSheet = !!props.player.character;
  const selectedRowStyle = css({ backgroundColor: lightBackground });

  const mainPointerBlock = CharacterSelector.getCharacterMainPointerBlock(
    props.player.character
  );
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
      <Box>
        <Box p=".5rem">
          <Grid container spacing={2} wrap="nowrap">
            <Grid item xs={9}>
              {renderCharacterSheetButton()}
            </Grid>
            <Grid item xs className={css({ textAlign: "right" })}>
              {renderInitiative()}
            </Grid>
          </Grid>
          <Grid container spacing={2} wrap="nowrap">
            <Grid item>{renderDiceBox()}</Grid>
          </Grid>
          {/* <Grid container spacing={2} wrap="nowrap">
            <Grid item>
              <BlockPointCounter
                editing={false}
                readonly={true}
                pageIndex={0}
                sectionIndex={0}
                blockIndex={0}
                section={{}}
                block={mainPointerBlock}
                onLabelChange={(value) => {}}
                onValueChange={(value) => {}}
                onMetaChange={(meta) => {}}
              />
            </Grid>
          </Grid> */}
        </Box>
        <Divider light />
      </Box>
    </>
  );

  function renderDiceBox() {
    return (
      <Grid container spacing={2} wrap="nowrap">
        <Grid item>
          <Box display="flex" justifyContent="flex-end">
            <DiceBox
              rolls={props.player.rolls}
              size="2rem"
              fontSize="1rem"
              borderSize=".15rem"
              disabled={props.readonly}
              onClick={() => {
                handleRoll({});
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
            disabled={props.readonly}
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
          {!props.readonly && (
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
                  className={css({ padding: "0" })}
                  color={hasCharacterSheet ? "default" : "primary"}
                >
                  {!hasCharacterSheet ? <NoteAddIcon /> : <RestorePageIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          <Grid item xs zeroMinWidth>
            <Button
              className={css({
                width: "100%",
                background: "transparent",
                textTransform: "none",
                color: hasCharacterSheet
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
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
              <Typography
                noWrap
                color="inherit"
                className={css({
                  width: "100%",
                  textAlign: "left",
                  fontSize: "1rem",
                  lineHeight: Font.lineHeight(0.8),
                  fontWeight: props.highlight ? "bold" : "normal",
                })}
              >
                {name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
  function renderGMControls() {
    if (!props.renderControls) {
      return null;
    }

    return (
      <TableRow
        selected={false}
        className={cx(undefined, {
          [selectedRowStyle]: shouldHighlight,
        })}
      >
        <TableCell>
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
              <HighlightOffIcon color="error" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell />
        <TableCell>
          <Grid container alignItems="center" justify="center" spacing={1}>
            <Grid item>
              <Tooltip
                title={`${t("player-row.remove")}: ${mainPointerBlock?.label}`}
              >
                <span>
                  <IconButton
                    data-cy={`${props["data-cy"]}.consume-point-gm`}
                    size="small"
                    disabled={points === 0}
                    onClick={(e) => {
                      e.stopPropagation();

                      props.onUpdatePlayerCharacterMainPointCounter(points - 1);
                      logger.info("ScenePlayer:onGMConsumePoint");
                    }}
                  >
                    <RemoveCircleOutlineOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip
                title={`${t("player-row.add")}: ${mainPointerBlock?.label}`}
              >
                <IconButton
                  data-cy={`${props["data-cy"]}.add-point-gm`}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onUpdatePlayerCharacterMainPointCounter(points + 1);
                    logger.info("ScenePlayer:onGMAddPoint");
                  }}
                >
                  <AddCircleOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell />
      </TableRow>
    );
  }
};
PlayerRow.displayName = "PlayerRow";
