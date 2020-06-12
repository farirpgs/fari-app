import {
  Avatar,
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
import React from "react";
import { ContentEditable } from "../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { ICharacter } from "../../contexts/CharactersContext";
import { useButtonTheme } from "../../hooks/useButtonTheme/useButtonTheme";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useCharacter } from "./hooks/useCharacter";

export const CharacterDialog: React.FC<{
  open: boolean;
  character: ICharacter;
  readonly?: boolean;
  onClose(): void;
  onSave?(newCharacter: ICharacter): void;
  onDelete?(): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const characterManager = useCharacter(props.character);

  function onSave() {
    const updatedCharacter = characterManager.actions.sanitizeCharacter();
    props.onSave(updatedCharacter);
  }

  function onClose() {
    if (characterManager.state.isDirty && !props.readonly) {
      const confirmed = confirm(t("character-dialog.close-confirmation"));
      if (confirmed) {
        props.onClose();
      }
    } else {
      props.onClose();
    }
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
      open={props.open}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      onClose={onClose}
    >
      <DialogTitle>{renderName()}</DialogTitle>
      <DialogContent className={css({ padding: "0" })} dividers>
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            className={css({
              borderRight: `2px solid ${headerBackgroundColors.primary}`,
            })}
          >
            {renderAspects()}
            {renderStunts()}
            {renderRefresh()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderVitals()}
            {renderSkills()}
          </Grid>
        </Grid>
      </DialogContent>
      {renderActions()}
    </Dialog>
  );

  function renderActions() {
    if (props.readonly || (!props.onDelete && !props.onSave)) {
      return null;
    }
    return (
      <DialogActions className={css({ padding: "0" })}>
        <Box className={sheetContentStyle}>
          <Grid container wrap="nowrap">
            {props.onDelete && (
              <Grid item>
                <ThemeProvider theme={errorTheme}>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={props.onDelete}
                  >
                    {t("character-dialog.delete")}
                  </Button>
                </ThemeProvider>
              </Grid>
            )}
            {props.onSave && (
              <Grid item className={css({ marginLeft: "auto" })}>
                <Button
                  color="primary"
                  variant={
                    characterManager.state.isDirty ? "contained" : "outlined"
                  }
                  type="submit"
                  onClick={onSave}
                >
                  {t("character-dialog.save")}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogActions>
    );
  }

  function renderName() {
    return (
      <>
        <Grid container spacing={2} alignItems="flex-end" wrap="nowrap">
          <Grid item className={css({ flex: "0 0 auto" })}>
            <FateLabel>{t("character-dialog.name")}</FateLabel>
          </Grid>
          <Grid item className={css({ flex: "1 1 auto" })}>
            <ContentEditable
              border
              autoFocus
              readonly={props.readonly}
              value={characterManager.state.character.name}
              onChange={(value) => {
                characterManager.actions.setName(value);
              }}
            ></ContentEditable>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </>
    );
  }

  function renderSheetHeader(label: string, onAdd?: () => void) {
    const shouldRenderAddButton = onAdd && !props.readonly;
    return (
      <Box className={sheetHeader}>
        <Grid container justify="space-between" wrap="nowrap">
          <Grid item>
            <FateLabel>{label}</FateLabel>
          </Grid>
          {shouldRenderAddButton && (
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
        {renderSheetHeader(
          t("character-dialog.aspects"),
          characterManager.actions.addAspect
        )}

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
                          readonly={props.readonly}
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
                    {!props.readonly && (
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
                    )}
                  </Grid>
                </Box>
                <Box>
                  <Typography>
                    <ContentEditable
                      border
                      readonly={props.readonly}
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
        {renderSheetHeader(
          t("character-dialog.skills"),
          characterManager.actions.addSkill
        )}

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
                        readonly={props.readonly}
                        value={skill.value}
                        onChange={(value) => {
                          characterManager.actions.setSkill(index, value);
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FateLabel display="inline">
                      <ContentEditable
                        readonly={props.readonly}
                        value={skill.name}
                        onChange={(value) => {
                          characterManager.actions.setSkillName(index, value);
                        }}
                      />
                    </FateLabel>
                  </Grid>
                  {!props.readonly && (
                    <Grid item className={css({ marginLeft: "auto" })} xs={2}>
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
                  )}
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
          t("character-dialog.stunts-extras"),
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
                          readonly={props.readonly}
                          value={stunt.name}
                          onChange={(value) => {
                            characterManager.actions.setStuntName(index, value);
                          }}
                        />
                      </FateLabel>
                    </Grid>
                    {!props.readonly && (
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
                    )}
                  </Grid>
                </Box>
                <Typography>
                  <ContentEditable
                    border
                    readonly={props.readonly}
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

  function renderRefresh() {
    return (
      <>
        {renderSheetHeader(t("character-dialog.refresh"))}
        <Box className={sheetContentStyle}>
          <Grid container justify="center">
            <Grid item>
              <Avatar
                className={css({
                  color: headerBackgroundColors.primary,
                  background: theme.palette.background.paper,
                  border: `3px solid ${headerBackgroundColors.primary}`,
                  width: "5rem",
                  height: "5rem",
                  fontSize: "2rem",
                  textAlign: "center",
                })}
              >
                <ContentEditable
                  readonly={props.readonly}
                  value={characterManager.state.character.refresh.toString()}
                  onChange={(value, e) => {
                    const intValue = parseInt(value);
                    if (!isNaN(intValue)) {
                      characterManager.actions.udpateRefresh(intValue);
                    }
                  }}
                ></ContentEditable>
              </Avatar>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  function renderVitals() {
    return (
      <>
        {renderSheetHeader(
          t("character-dialog.stress"),
          characterManager.actions.addStressTrack
        )}
        <Box className={sheetContentStyle}>{renderStressTracks()}</Box>
        {renderSheetHeader(
          t("character-dialog.consequences"),
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
                <Grid
                  container
                  justify="space-between"
                  wrap="nowrap"
                  spacing={2}
                >
                  <Grid item className={css({ flex: "1 0 auto" })}>
                    <FateLabel display="inline">
                      <ContentEditable
                        readonly={props.readonly}
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
                  {!props.readonly && (
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
                  )}
                  {!props.readonly && (
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
                  )}
                  {!props.readonly && (
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
                  )}
                </Grid>

                <Grid container justify="flex-start" spacing={2}>
                  {stressTrack.value.map((stressBox, boxIndex) => {
                    return (
                      <Grid item key={boxIndex} xs={2}>
                        <Box
                          className={css({
                            display: "flex",
                            justifyContent: "center",
                          })}
                        >
                          <Checkbox
                            color="default"
                            size="small"
                            checked={stressBox.checked}
                            onChange={(event) => {
                              if (props.readonly) {
                                return;
                              }
                              characterManager.actions.toggleStressBox(
                                index,
                                boxIndex
                              );
                            }}
                          />
                        </Box>
                        <Box>
                          <FateLabel className={css({ textAlign: "center" })}>
                            <ContentEditable
                              readonly={props.readonly}
                              value={stressBox.label}
                              onChange={(value) => {
                                characterManager.actions.setStressBoxLabel(
                                  index,
                                  boxIndex,
                                  value
                                );
                              }}
                            ></ContentEditable>
                          </FateLabel>
                        </Box>
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
                    <Grid item xs={10}>
                      {" "}
                      <FateLabel display="inline">
                        <ContentEditable
                          readonly={props.readonly}
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
                    {!props.readonly && (
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
                    )}
                  </Grid>
                </Box>
                <Box>
                  <Typography>
                    <ContentEditable
                      border
                      readonly={props.readonly}
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
