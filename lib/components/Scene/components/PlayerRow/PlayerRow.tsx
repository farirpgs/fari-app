import { css } from "@emotion/css";
import CircleIcon from "@mui/icons-material/Circle";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LaunchIcon from "@mui/icons-material/Launch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterSelector } from "../../../../domains/character/CharacterSelector";
import { ICharacter } from "../../../../domains/character/types";
import { IDataCyProps } from "../../../../domains/cypress/types/IDataCyProps";
import { Font } from "../../../../domains/font/Font";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
import { IPlayer } from "../../../../hooks/useScene/IScene";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { usePointCounter } from "../../../../routes/Character/components/CharacterDialog/components/blocks/BlockPointCounter";
import { CircleTextField } from "../../../../routes/Character/components/CharacterDialog/components/CircleTextField";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../../../routes/Character/components/CharacterDialog/MiniThemeContext";
import { previewContentEditable } from "../../../ContentEditable/ContentEditable";
import {
  DiceBonusLabel,
  DiceBox,
  DiceBoxResult,
} from "../../../DiceBox/DiceBox";

export function PlayerRow(
  props: {
    permissions: {
      canRoll: boolean;
      canUpdatePoints: boolean;
      canUpdateInitiative: boolean;
      canLoadCharacterSheet: boolean;
      canRemove: boolean;
      canMarkPrivate: boolean;
    };
    player: IPlayer;
    characterSheet: ICharacter | undefined;
    connectionState?: string;
    isMe: boolean;
    color: string;
    isChild: boolean;
    children?: JSX.Element;
    onDiceRoll(): void;
    onPlayedInTurnOrderChange(playedDuringTurn: boolean): void;
    onPointsChange(newPoints: string, newMaxPoints: string | undefined): void;

    onTogglePrivate(): void;
    onPlayerRemove(): void;
    onCharacterSheetOpen(): void;
    onAssignCharacterSheet(): void;
  } & IDataCyProps
) {
  const theme = useTheme();
  const { t } = useTranslate();
  const logger = useLogger();
  const hasCharacterSheet = !!props.characterSheet;
  const canOpenOrLoadSheet =
    hasCharacterSheet || props.permissions.canLoadCharacterSheet;

  const mainPointerBlock = CharacterSelector.getCharacterMainPointerBlock(
    props.characterSheet
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

  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.paper,
  });

  const lightBackground = useLightBackground();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<any>(null);

  function handleOnRoll() {
    props.onDiceRoll();
    logger.track("session.player_reroll_dice");
  }

  return (
    <>
      <MiniThemeContext.Provider value={miniTheme}>
        <Box
          sx={{
            backgroundColor: lightBackground,
            margin: ".5rem",
          }}
          data-cy={props["data-cy"]}
        >
          <Box
            sx={{
              padding: "0.5rem 1rem",
              border: props.isChild
                ? `2px solid ${theme.palette.secondary.main}`
                : "none",
            }}
          >
            <Box>{renderName()}</Box>

            <Box
              sx={{
                position: "relative",
              }}
            >
              <Box pb=".5rem">{renderDice()}</Box>
              <Box>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>{renderPointCounter()}</Grid>
                  <Grid item>
                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>{renderLoadSheet()}</Grid>
                      <Grid item>{renderMoreMenu()}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              {/* <Box pb={props.children ? ".5rem" : undefined}>
                {renderControls()}
              </Box> */}
            </Box>
            {props.children}
          </Box>
        </Box>
      </MiniThemeContext.Provider>
    </>
  );

  function renderLoadSheet() {
    return (
      <Tooltip
        title={
          hasCharacterSheet
            ? t("player-row.open-character-sheet")
            : props.permissions.canLoadCharacterSheet
            ? t("play-route.assign-character-sheet")
            : ""
        }
      >
        <span>
          <IconButton
            size="small"
            disabled={!canOpenOrLoadSheet}
            color={"secondary"}
            data-cy={`${props["data-cy"]}.assign-or-open-character-sheet`}
            className={css({
              visibility: canOpenOrLoadSheet ? "visible" : "hidden",
              border: `1px solid `,
              borderRadius: "50%",
              boxShadow: theme.shadows[2],
            })}
            onClick={() => {
              if (hasCharacterSheet) {
                props.onCharacterSheetOpen();
              } else {
                props.onAssignCharacterSheet();
              }

              logger.track("session.open_character_sheet");
            }}
          >
            {hasCharacterSheet ? <LaunchIcon /> : <UploadFileIcon />}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  function renderMoreMenu() {
    const shouldRenderSwapSheetButton =
      props.permissions.canLoadCharacterSheet && hasCharacterSheet;
    const shouldRenderRemovePlayerButton = props.permissions.canRemove;
    const shouldRenderMarkPrivateButton = props.permissions.canRemove;
    if (
      !shouldRenderSwapSheetButton &&
      !shouldRenderRemovePlayerButton &&
      !shouldRenderMarkPrivateButton
    ) {
      return null;
    }
    return (
      <Box>
        <IconButton
          data-cy={`${props["data-cy"]}.menu`}
          onClick={(event) => {
            setMenuAnchorEl(event?.currentTarget);
          }}
        >
          <MoreVertIcon color="secondary" />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={!!menuAnchorEl}
          onClose={() => {
            setMenuAnchorEl(false);
          }}
        >
          {shouldRenderSwapSheetButton && (
            <MenuItem
              data-cy={`${props["data-cy"]}.swap-character-sheet`}
              onClick={() => {
                setMenuAnchorEl(false);
                props.onAssignCharacterSheet();
              }}
            >
              <ListItemIcon>
                <RestorePageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {t("player-row.swap-character-sheet")}
              </ListItemText>
            </MenuItem>
          )}
          {shouldRenderRemovePlayerButton && (
            <MenuItem
              data-cy={`${props["data-cy"]}.remove`}
              onClick={() => {
                setMenuAnchorEl(false);
                const confirmed = confirm(
                  t("player-row.remove-player-confirmation")
                );
                if (confirmed) {
                  props.onPlayerRemove();
                  logger.track("session.remove_player");
                }
              }}
            >
              <ListItemIcon>
                <HighlightOffIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("player-row.remove-player")}</ListItemText>
            </MenuItem>
          )}
          {shouldRenderMarkPrivateButton && (
            <MenuItem
              data-cy={`${props["data-cy"]}.mark-private`}
              onClick={() => {
                setMenuAnchorEl(false);
                props.onTogglePrivate();
              }}
            >
              <ListItemIcon>
                {props.player.private ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {props.player.private
                  ? t("player-row.show-to-players")
                  : t("player-row.hide-from-players")}
              </ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Box>
    );
  }

  function renderDice() {
    return (
      <Box>
        <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
          <Grid item>
            <Box display="flex" justifyContent="flex-end" height="100%">
              <DiceBox
                rolls={props.player.rolls}
                size="3rem"
                fontSize="1.5rem"
                borderSize=".15rem"
                disableConfettis={props.isMe}
                disabled={!props.permissions.canRoll}
                onClick={() => {
                  handleOnRoll();
                }}
              />
            </Box>
          </Grid>
          {props.player.rolls.length > 0 && (
            <Grid item>
              <Box
                className={css({
                  fontWeight: theme.typography.fontWeightBold,
                  borderRadius: "4px",
                  padding: ".3rem .5rem",
                })}
              >
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        fontSize: ".75rem",
                        textTransform: "uppercase",
                        fontWeight: theme.typography.fontWeightBold,
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <DiceBonusLabel rolls={props.player.rolls} noColor />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <DiceBoxResult rolls={props.player.rolls} noColor />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
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
              logger.track("session.change_player_initiative");
            }}
            disabled={!props.permissions.canUpdateInitiative}
          >
            {props.player.playedDuringTurn ? (
              <DirectionsRunIcon htmlColor={theme.palette.secondary.main} />
            ) : (
              <EmojiPeopleIcon htmlColor={theme.palette.secondary.main} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  function renderPointCounter() {
    return (
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item>
          <Box ml="-.25rem" color={theme.palette.secondary.main}>
            <CircleTextField
              borderColor={theme.palette.secondary.main}
              data-cy={`${props["data-cy"]}.counter`}
              value={pointsManager.state.points}
              readonly={!props.permissions.canUpdatePoints}
              onChange={(newValue) => {
                pointsManager.actions.setPoints(newValue);
              }}
              onIncrement={() => {
                pointsManager.actions.increment();
              }}
              onDecrement={() => {
                pointsManager.actions.decrement();
              }}
            />
          </Box>
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
                data-cy={`${props["data-cy"]}.counter.max`}
                value={pointsManager.state.maxPoints ?? ""}
                readonly={!props.permissions.canUpdatePoints}
                highlight
                onChange={(newMax) => {
                  pointsManager.actions.setMaxPoints(newMax);
                }}
                onIncrement={() => {
                  pointsManager.actions.incrementMax();
                }}
                onDecrement={() => {
                  pointsManager.actions.decrementMax();
                }}
              />
            </Grid>
          </>
        )}
        {mainPointerBlock?.label && (
          <Grid
            item
            className={css({
              alignSelf: "flex-end",
              marginBottom: ".2rem",
            })}
          >
            <Typography
              color="secondary"
              noWrap
              className={css({
                fontSize: ".8rem",
                fontWeight: theme.typography.fontWeightBold,
                marginLeft: ".5rem",
              })}
            >
              {previewContentEditable({ value: mainPointerBlock?.label })}
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  }

  function renderMainName(name: string | undefined) {
    return (
      <Typography
        title={name}
        noWrap
        className={css({
          color: theme.palette.secondary.main,
          fontWeight: theme.typography.fontWeightMedium,
        })}
      >
        {name ?? "Untitled"}
      </Typography>
    );
  }

  function renderSecondaryName(name: string | undefined) {
    return (
      <Typography
        noWrap
        title={name}
        className={css({
          fontSize: ".85rem",
          fontWeight: theme.typography.fontWeightRegular,
          color: theme.palette.secondary.main,
        })}
      >
        {name}
      </Typography>
    );
  }

  function renderName() {
    return (
      <>
        <Box>
          <Grid container wrap="nowrap">
            <Grid item zeroMinWidth xs>
              <Box mb=".5rem">
                <Grid
                  container
                  alignItems="center"
                  className={css({ height: "100%" })}
                >
                  {hasCharacterSheet ? (
                    <>
                      <Grid item xs={12} zeroMinWidth>
                        {renderMainName(props.characterSheet?.name)}
                      </Grid>
                      <Grid item xs={12} zeroMinWidth>
                        <Grid container>
                          <Grid item>
                            <CircleIcon
                              sx={{
                                marginRight: ".25rem",
                              }}
                              htmlColor={props.color}
                            />
                          </Grid>
                          <Grid item>
                            {renderSecondaryName(props.player.playerName)}
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} zeroMinWidth>
                        <Grid container>
                          <Grid item>
                            <CircleIcon
                              sx={{
                                marginRight: ".25rem",
                              }}
                              htmlColor={props.color}
                            />
                          </Grid>
                          <Grid item>
                            {renderMainName(props.player.playerName)}
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>

            <Grid item>{renderInitiative()}</Grid>
          </Grid>
        </Box>
      </>
    );
  }
}
PlayerRow.displayName = "PlayerRow";
