import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CircleIcon from "@mui/icons-material/Circle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box } from "@mui/material";

import {
  Autocomplete,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { IDataCyProps } from "../../../../domains/cypress/types/IDataCyProps";
import { useLightBackground } from "../../../../hooks/useLightBackground/useLightBackground";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../../../routes/Character/components/CharacterDialog/MiniThemeContext";

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
    characterName: string | undefined;
    pointsLabel: string | undefined;
    points: string;
    status: string;
    isPrivate: boolean;
    maxPoints: string | undefined;
    isMe: boolean;
    color: string;
    isChild: boolean;
    children?: JSX.Element;
    onStatusChange(status: string): void;
    onTogglePrivate(): void;
    onPlayerRemove(): void;
    onAssignCharacterSheet(): void;
  } & IDataCyProps,
) {
  const { t } = useTranslate();
  const logger = useLogger();

  return (
    <PlayerRowContainer isChild={props.isChild} dataCy={props.dataCy}>
      <Box>
        <Grid container wrap="nowrap">
          <Grid item zeroMinWidth xs>
            <Box mb=".5rem">
              <PlayerRowName
                characterName={props.characterName}
                color={props.isChild ? undefined : props.color}
                playerName={props.playerName}
              />
            </Box>
          </Grid>

          <Grid item>
            {!props.isChild && (
              <CircleIcon
                sx={{
                  marginRight: ".25rem",
                }}
                htmlColor={props.color}
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box>
          <FormLabel>Status</FormLabel>
          <Autocomplete
            freeSolo
            size="small"
            value={props.status}
            onChange={(event, newValue: any) => {
              if (typeof newValue === "string") {
                props.onStatusChange(newValue);
              } else if (newValue && newValue.inputValue) {
                props.onStatusChange(newValue.inputValue);
              } else {
                props.onStatusChange(newValue);
              }
            }}
            disableClearable
            options={["None", "🕒  Waiting", "✅  Played"]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
          <List>
            {props.permissions.canLoadCharacterSheet && (
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    padding: "0",
                  }}
                  data-cy={`${props["dataCy"]}.assign-or-open-character-sheet`}
                  onClick={() => {
                    props.onAssignCharacterSheet();
                    logger.track("session.open_character_sheet");
                  }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      props.hasCharacterSheet
                        ? t("play-route.change-character-sheet")
                        : t("play-route.assign-character-sheet")
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}

            {props.permissions.canMarkPrivate && (
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    padding: "0",
                  }}
                  data-cy={`${props["dataCy"]}.mark-private`}
                  onClick={() => {
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
                  <ListItemText
                    primary={
                      props.isPrivate
                        ? t("player-row.show-to-players")
                        : t("player-row.hide-from-players")
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
            {props.permissions.canRemove && (
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    padding: "0",
                  }}
                  data-cy={`${props["dataCy"]}.remove`}
                  onClick={() => {
                    const confirmed = confirm(
                      t("player-row.remove-player-confirmation"),
                    );
                    if (confirmed) {
                      props.onPlayerRemove();
                      logger.track("session.remove_player");
                    }
                  }}
                >
                  <ListItemIcon>
                    <HighlightOffIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("player-row.remove-player")} />
                </ListItemButton>
              </ListItem>
            )}
          </List>

          {/* <ListItemButton
                sx={{
                  padding: "0",
                }}
                disabled={!props.permissions.canUpdateInitiative}
                data-cy={`${props.dataCy}.toggle-initiative`}
                onClick={() => {
                  handleClickInitiativeTracker();
                  logger.track("session.change_player_initiative");
                }}
              >
                <ListItemIcon>
                  {props.playedDuringTurn ? (
                    <CheckCircleIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    props.playedDuringTurn
                      ? t("player-row.played")
                      : t("player-row.not-played")
                  }
                />
              </ListItemButton> */}

          {/* <Grid container spacing={1} justifyContent="flex-end">
                {props.permissions.canLoadCharacterSheet && (
                  <Grid item xs={12}>
                    {renderLoadSheet()}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <PlayerRowTurnTracker
                    playedDuringTurn={props.playedDuringTurn}
                    canUpdateInitiative={props.permissions.canUpdateInitiative}
                    onClick={handleClickInitiativeTracker}
                    dataCy={props.dataCy}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color={"inherit"}
                    startIcon={<HighlightOffIcon />}
                  
                  >
                  </Button>
                </Grid>
              </Grid> */}
        </Box>
      </Box>
      {props.children}
    </PlayerRowContainer>
  );
}

function PlayerRowContainer(
  props: {
    children: React.ReactNode;
    isChild?: boolean;
  } & IDataCyProps,
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
              borderRadius: "4px",
              border: props.isChild
                ? `1px solid ${theme.palette.secondary.main}`
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
    characterName: string | undefined;
    playerName: string | undefined;
    color?: string;
  }) => {
    const theme = useTheme();
    return (
      <Box>
        <Grid container alignItems="center" sx={{ height: "100%" }}>
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
          sx={{
            color: theme.palette.secondary.main,
            fontWeight: theme.typography.fontWeightMedium,
          }}
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
          sx={{
            fontSize: ".85rem",
            fontWeight: theme.typography.fontWeightRegular,
            color: theme.palette.secondary.main,
          }}
        >
          {name}
        </Typography>
      );
    }
  },
);
PlayerRowName.displayName = "PlayerRowName";
