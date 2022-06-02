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
import isEqual from "lodash/isEqual";
import React from "react";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { IDataCyProps } from "../../../../domains/cypress/types/IDataCyProps";
import { IDiceRollResult } from "../../../../domains/dice/Dice";
import { Font } from "../../../../domains/font/Font";
import { useEvent } from "../../../../hooks/useEvents/useEvents";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
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
    playerName: string | undefined;
    hasCharacterSheet: boolean;
    rolls: Array<IDiceRollResult>;
    characterName: string | undefined;
    pointsLabel: string | undefined;
    points: string;
    playedDuringTurn: boolean;
    isPrivate: boolean;
    maxPoints: string | undefined;
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

  const canOpenOrLoadSheet =
    props.hasCharacterSheet || props.permissions.canLoadCharacterSheet;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<any>(null);

  const handleClickInitiativeTracker = useEvent(() => {
    props.onPlayedInTurnOrderChange(!props.playedDuringTurn);
  });

  const handleRoll = useEvent(() => {
    props.onDiceRoll();
    logger.track("session.player_reroll_dice");
  });

  const handlePointsChange = useEvent(
    (points: string, maxPoints: string | undefined) => {
      props.onPointsChange(points, maxPoints);
    }
  );

  return (
    <PlayerRowContainer isChild={props.isChild} dataCy={props.dataCy}>
      <Box>
        <Grid container wrap="nowrap">
          <Grid item zeroMinWidth xs>
            <Box mb=".5rem">
              <PlayerRowName
                characterName={props.characterName}
                color={props.color}
                playerName={props.playerName}
              />
            </Box>
          </Grid>

          <Grid item>
            <PlayerRowTurnTracker
              playedDuringTurn={props.playedDuringTurn}
              canUpdateInitiative={props.permissions.canUpdateInitiative}
              onClick={handleClickInitiativeTracker}
              dataCy={props.dataCy}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box pb=".5rem">
          <PlayerRowDiceRoller
            canRoll={props.permissions.canRoll}
            rolls={props.rolls}
            isMe={props.isMe}
            onRoll={handleRoll}
          />
        </Box>
        <Box>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <PlayerRowPoints
                label={props.pointsLabel}
                canUpdate={props.permissions.canUpdatePoints}
                value={props.points}
                max={props.maxPoints}
                onChange={handlePointsChange}
                dataCy={props["dataCy"]}
              />
            </Grid>
            <Grid item>
              <Grid container spacing={1} justifyContent="flex-end">
                <Grid item>{renderLoadSheet()}</Grid>
                <Grid item>{renderMoreMenu()}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {props.children}
    </PlayerRowContainer>
  );

  function renderLoadSheet() {
    return (
      <Tooltip
        title={
          props.hasCharacterSheet
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
            data-cy={`${props["dataCy"]}.assign-or-open-character-sheet`}
            className={css({
              visibility: canOpenOrLoadSheet ? "visible" : "hidden",
              border: `1px solid `,
              borderRadius: "50%",
              boxShadow: theme.shadows[2],
            })}
            onClick={() => {
              if (props.hasCharacterSheet) {
                props.onCharacterSheetOpen();
              } else {
                props.onAssignCharacterSheet();
              }

              logger.track("session.open_character_sheet");
            }}
          >
            {props.hasCharacterSheet ? <LaunchIcon /> : <UploadFileIcon />}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  function renderMoreMenu() {
    const shouldRenderSwapSheetButton =
      props.permissions.canLoadCharacterSheet && props.hasCharacterSheet;
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
          data-cy={`${props["dataCy"]}.menu`}
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
              data-cy={`${props["dataCy"]}.swap-character-sheet`}
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
              data-cy={`${props["dataCy"]}.remove`}
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
              data-cy={`${props["dataCy"]}.mark-private`}
              onClick={() => {
                setMenuAnchorEl(false);
                props.onTogglePrivate();
              }}
            >
              <ListItemIcon>
                {props.isPrivate ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {props.isPrivate
                  ? t("player-row.show-to-players")
                  : t("player-row.hide-from-players")}
              </ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Box>
    );
  }
}
PlayerRow.displayName = "PlayerRow";

function PlayerRowContainer(
  props: {
    children: React.ReactNode;
    isChild?: boolean;
  } & IDataCyProps
) {
  const theme = useTheme();

  const miniTheme = useMiniTheme({
    enforceBackground: theme.palette.background.paper,
  });

  const lightBackground = useLightBackground();

  return (
    <>
      <MiniThemeContext.Provider value={miniTheme}>
        <Box
          sx={{
            backgroundColor: lightBackground,
            margin: ".5rem",
          }}
          data-cy={props.dataCy}
        >
          <Box
            sx={{
              padding: "0.5rem 1rem",
              border: props.isChild
                ? `2px solid ${theme.palette.secondary.main}`
                : "none",
            }}
          >
            {props.children}
          </Box>
        </Box>
      </MiniThemeContext.Provider>
    </>
  );
}

const PlayerRowName = React.memo(
  (props: {
    color: string;
    characterName: string | undefined;
    playerName: string | undefined;
  }) => {
    const theme = useTheme();
    return (
      <Box>
        <Grid container alignItems="center" className={css({ height: "100%" })}>
          {props.characterName ? (
            <>
              <Grid
                item
                xs={12}
                zeroMinWidth
                sx={{
                  width: "100%",
                }}
              >
                {renderMainName(props.characterName)}
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
                  <Grid
                    item
                    sx={{
                      width: "100%",
                    }}
                  >
                    {renderSecondaryName(props.playerName)}
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
                  <Grid
                    item
                    sx={{
                      width: "100%",
                    }}
                  >
                    {renderMainName(props.playerName)}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    );

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
  }
);

const PlayerRowTurnTracker = React.memo(
  (
    props: {
      playedDuringTurn: boolean;
      canUpdateInitiative: boolean;
      onClick: () => void;
    } & IDataCyProps
  ) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const logger = useLogger();
    const handleClick = useEvent(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        props.onClick();
        logger.track("session.change_player_initiative");
      }
    );

    return (
      <Box>
        <Tooltip
          title={
            props.playedDuringTurn
              ? t("player-row.played")
              : t("player-row.not-played")
          }
        >
          <span>
            <IconButton
              data-cy={`${props.dataCy}.toggle-initiative`}
              onClick={handleClick}
              disabled={!props.canUpdateInitiative}
            >
              {props.playedDuringTurn ? (
                <DirectionsRunIcon htmlColor={theme.palette.secondary.main} />
              ) : (
                <EmojiPeopleIcon htmlColor={theme.palette.secondary.main} />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    );
  }
);

const PlayerRowDiceRoller = React.memo(
  (props: {
    rolls: Array<IDiceRollResult>;
    isMe: boolean;
    canRoll: boolean;
    onRoll(): void;
  }) => {
    const theme = useTheme();

    return (
      <Box>
        <Grid container spacing={1} wrap="nowrap" alignItems="flex-start">
          <Grid item>
            <Box display="flex" justifyContent="flex-end" height="100%">
              <DiceBox
                rolls={props.rolls}
                size="3rem"
                fontSize="1.5rem"
                borderSize=".15rem"
                disableConfettis={props.isMe}
                disabled={!props.canRoll}
                onClick={props.onRoll}
              />
            </Box>
          </Grid>
          {props.rolls.length > 0 && (
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
                      <DiceBonusLabel rolls={props.rolls} noColor />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <DiceBoxResult rolls={props.rolls} noColor />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  },
  isEqual
);

const PlayerRowPoints = React.memo(
  (
    props: {
      label: string | undefined;
      value: string;
      max: string | undefined;
      canUpdate: boolean;
      onChange(points: string, maxPoints: string | undefined): void;
    } & IDataCyProps
  ) => {
    const theme = useTheme();

    const pointsManager = usePointCounter({
      points: props.value,
      maxPoints: props.max,
      onPointsChange(newPoints) {
        props.onChange(newPoints, pointsManager.state.maxPoints);
      },
      onMaxPointsChange(newMaxPoints) {
        props.onChange(pointsManager.state.points, newMaxPoints);
      },
    });

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
              data-cy={`${props.dataCy}.counter`}
              value={pointsManager.state.points}
              readonly={!props.canUpdate}
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
              <Box color={theme.palette.secondary.main}>
                <CircleTextField
                  borderColor={theme.palette.secondary.main}
                  data-cy={`${props.dataCy}.counter.max`}
                  value={pointsManager.state.maxPoints ?? ""}
                  readonly={!props.canUpdate}
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
              </Box>
            </Grid>
          </>
        )}
        {props.label && (
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
              {previewContentEditable({ value: props.label })}
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  }
);
