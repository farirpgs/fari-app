import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ThemeProvider,
  Typography,
  useTheme,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { css } from "emotion";
import produce from "immer";
import React from "react";
import {
  ContentEditable,
  sanitizeContentEditable,
} from "../../components/ContentEditable/ContentEditable";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { FateLabel } from "./FateLabel";
import { useCharacter } from "./useCharacter";
import { ICharacter } from "./useCharacters";

export const CharacterDialog: React.FC<{
  character: ICharacter;
  onSave(newCharacter: ICharacter): void;
  onDelete(): void;
  onClose(): void;
  readonly?: boolean;
}> = (props) => {
  const theme = useTheme();
  const characterManager = useCharacter(props.character);

  function onSave() {
    const updatedCharacter = produce(
      characterManager.state.character,
      (draft) => {
        draft.name = sanitizeContentEditable(draft.name);
      }
    );
    props.onSave(updatedCharacter);
  }

  const errorTheme = useButtonTheme(theme.palette.error.main);
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const sheetHeader = css({
    background: headerBackgroundColors.primary,
    color: headerColor,
    width: "100%",
    padding: ".5rem 1.5rem",
  });
  const sheetContentStyle = css({
    width: "100%",
    padding: ".5rem 1.5rem",
  });
  const smallIconButtonStyle = css({
    padding: "0",
  });
  if (!characterManager.state.character) {
    return null;
  }

  return (
    <Dialog
      open={!!props.character}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      onClose={props.onClose}
    >
      <DialogTitle>{renderName()}</DialogTitle>
      <DialogContent className={css({ padding: "0" })} dividers>
        <Grid container>
          <Grid
            item
            xs={6}
            className={css({
              borderRight: `2px solid ${headerBackgroundColors.primary}`,
            })}
          >
            {renderAspects()}
            {renderStunts()}
          </Grid>
          <Grid item xs={6}>
            {renderVitals()}
            {renderSkills()}
          </Grid>
        </Grid>
      </DialogContent>
      {renderActions()}
    </Dialog>
  );

  function renderActions() {
    return (
      <DialogActions className={css({ padding: "0" })}>
        <Box className={sheetContentStyle}>
          <Grid container wrap="nowrap" justify="space-between">
            <Grid item>
              <ThemeProvider theme={errorTheme}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={props.onDelete}
                >
                  {"Delete"}
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                onClick={onSave}
              >
                {"Save"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogActions>
    );
  }

  function renderName() {
    return (
      <>
        <Grid container spacing={2} alignItems="flex-end" wrap="nowrap">
          <Grid item>
            <FateLabel>{"Name"}</FateLabel>
          </Grid>
          <Grid item className={css({ flex: "1 0 auto" })}>
            <ContentEditable
              border
              autoFocus
              fullWidth
              value={characterManager.state.character.name}
              onChange={(value) => {
                characterManager.actions.setName(value);
              }}
            ></ContentEditable>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={props.onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </>
    );
  }

  function renderSheetHeader(label: string, onAdd?: () => void) {
    return (
      <Box className={sheetHeader}>
        <Grid container justify="space-between" wrap="nowrap">
          <Grid item>
            <FateLabel>{label}</FateLabel>
          </Grid>
          {onAdd && (
            <Grid item>
              <IconButton
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  onAdd();
                }}
              >
                <AddIcon htmlColor={headerColor}></AddIcon>
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }

  function renderAspects() {
    return (
      <>
        {renderSheetHeader("Aspects", characterManager.actions.addAspect)}

        <Box className={sheetContentStyle}>
          {characterManager.state.character.aspects.map((aspect, index) => {
            return (
              <Box key={index} py=".5rem">
                <Box pb=".5rem">
                  <Grid
                    container
                    spacing={2}
                    justify="space-between"
                    wrap="nowrap"
                  >
                    <Grid item xs={10}>
                      <FateLabel display="inline">
                        <ContentEditable
                          inline
                          fullWidth
                          value={aspect.name}
                          onChange={(value) => {
                            characterManager.actions.setAspectName(
                              index,
                              value
                            );
                          }}
                        />
                      </FateLabel>
                    </Grid>
                    <Grid item>
                      <IconButton
                        size="small"
                        className={smallIconButtonStyle}
                        onClick={() => {
                          characterManager.actions.removeAspect(index);
                        }}
                      >
                        <RemoveIcon></RemoveIcon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Typography>
                    <ContentEditable
                      border
                      inline
                      fullWidth
                      value={aspect.value}
                      onChange={(value) => {
                        characterManager.actions.setAspect(index, value);
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }

  function renderSkills() {
    return (
      <>
        {renderSheetHeader("Skills", characterManager.actions.addSkill)}

        <Box className={sheetContentStyle}>
          {characterManager.state.character.skills.map((skill, index) => {
            return (
              <Box py=".5rem" key={index}>
                <Grid container spacing={2} alignItems="flex-end" wrap="nowrap">
                  <Grid item xs={1}>
                    <FateLabel display="inline">{"+"}</FateLabel>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography align="center">
                      <ContentEditable
                        border
                        inline
                        fullWidth
                        value={skill.value}
                        onChange={(value) => {
                          characterManager.actions.setSkill(index, value);
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FateLabel display="inline">
                      <ContentEditable
                        inline
                        fullWidth
                        value={skill.name}
                        onChange={(value) => {
                          characterManager.actions.setSkillName(index, value);
                        }}
                      />
                    </FateLabel>
                  </Grid>
                  <Grid item className={css({ marginLeft: "auto" })}>
                    <IconButton
                      size="small"
                      className={smallIconButtonStyle}
                      onClick={() => {
                        characterManager.actions.removeSkill(index);
                      }}
                    >
                      <RemoveIcon></RemoveIcon>
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }

  function renderStunts() {
    return (
      <>
        {renderSheetHeader(
          "Stunts & Extras",
          characterManager.actions.addStunt
        )}
        <Box className={sheetContentStyle}>
          {characterManager.state.character.stunts.map((stunt, index) => {
            return (
              <Box py=".5rem" key={index}>
                <Box pb=".5rem">
                  <Grid
                    container
                    spacing={2}
                    justify="space-between"
                    wrap="nowrap"
                  >
                    <Grid item xs={10}>
                      <FateLabel display="inline">
                        <ContentEditable
                          inline
                          fullWidth
                          value={stunt.name}
                          onChange={(value) => {
                            characterManager.actions.setStuntName(index, value);
                          }}
                        />
                      </FateLabel>
                    </Grid>
                    <Grid item>
                      <IconButton
                        size="small"
                        className={smallIconButtonStyle}
                        onClick={() => {
                          characterManager.actions.removeStunt(index);
                        }}
                      >
                        <RemoveIcon></RemoveIcon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                <Typography>
                  <ContentEditable
                    border
                    inline
                    fullWidth
                    value={stunt.value}
                    onChange={(value) => {
                      characterManager.actions.setStunt(index, value);
                    }}
                  />
                </Typography>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }

  function renderVitals() {
    return (
      <>
        {renderSheetHeader("Stress", characterManager.actions.addStressTrack)}
        <Box className={sheetContentStyle}>{renderStressTracks()}</Box>
        {renderSheetHeader(
          "Consequences",
          characterManager.actions.addConsequence
        )}
        <Box className={sheetContentStyle}>{renderConsequences()}</Box>
      </>
    );
  }

  function renderStressTracks() {
    return (
      <Box>
        {characterManager.state.character.stressTracks.map(
          (stressTrack, index) => {
            return (
              <Box pb=".5rem" key={index}>
                <Grid container justify="space-between" wrap="nowrap">
                  <Grid item xs={6}>
                    <FateLabel display="inline">
                      <ContentEditable
                        inline
                        fullWidth
                        value={stressTrack.name}
                        onChange={(value) => {
                          characterManager.actions.setStressTrackName(
                            index,
                            value
                          );
                        }}
                      />
                    </FateLabel>
                  </Grid>
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        characterManager.actions.removeStressBox(index);
                      }}
                    >
                      <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        characterManager.actions.addStressBox(index);
                      }}
                    >
                      <AddCircleOutlineIcon></AddCircleOutlineIcon>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => {
                        characterManager.actions.removeStressTrack(index);
                      }}
                    >
                      <RemoveIcon></RemoveIcon>
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid container justify="flex-start">
                  {stressTrack.value.map((stressBox, boxIndex) => {
                    return (
                      <Grid item key={boxIndex} xs={2}>
                        <Checkbox
                          color="default"
                          checked={stressBox}
                          onChange={(event) => {
                            characterManager.actions.toggleStressBox(
                              index,
                              boxIndex
                            );
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            );
          }
        )}
      </Box>
    );
  }

  function renderConsequences() {
    return (
      <Box>
        {characterManager.state.character.consequences.map(
          (consequence, index) => {
            return (
              <Box py=".5rem" key={index}>
                <Box pb=".5rem" key={index}>
                  <Grid container justify="space-between" wrap="nowrap">
                    <Grid item>
                      {" "}
                      <FateLabel display="inline">
                        <ContentEditable
                          inline
                          fullWidth
                          value={consequence.name}
                          onChange={(value) => {
                            characterManager.actions.setConsequenceName(
                              index,
                              value
                            );
                          }}
                        />
                      </FateLabel>
                    </Grid>
                    <Grid item>
                      <IconButton
                        size="small"
                        className={smallIconButtonStyle}
                        onClick={() => {
                          characterManager.actions.removeConsequence(index);
                        }}
                      >
                        <RemoveIcon></RemoveIcon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Typography>
                    <ContentEditable
                      border
                      inline
                      fullWidth
                      value={consequence.value}
                      onChange={(value) => {
                        characterManager.actions.setConsequence(index, value);
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            );
          }
        )}
      </Box>
    );
  }
};
CharacterDialog.displayName = "CharacterDialog";
