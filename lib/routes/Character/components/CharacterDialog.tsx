import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Alert } from "@material-ui/lab";
import { css } from "emotion";
import React, { useState } from "react";
import { ContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../components/FateLabel/FateLabel";
import { ICharacter } from "../../../contexts/CharactersContext";
import { useTextColors } from "../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { useCharacter } from "../hooks/useCharacter";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CharacterDialog: React.FC<{
  open: boolean;
  character: ICharacter | undefined;
  readonly?: boolean;
  dialog: boolean;
  onClose?(): void;
  onSave?(newCharacter: ICharacter): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const characterManager = useCharacter(props.character);
  const [advanced, setAdvanced] = useState(false);
  const [savedSnack, setSavedSnack] = useState(false);

  function onSave() {
    const updatedCharacter = characterManager.actions.sanitizeCharacter();
    props.onSave?.(updatedCharacter!);
    setSavedSnack(true);
  }

  function onAdvanced() {
    setAdvanced((prev) => !prev);
  }

  function onClose() {
    if (characterManager.state.isDirty && !props.readonly) {
      const confirmed = confirm(t("character-dialog.close-confirmation"));
      if (confirmed) {
        props.onClose?.();
        setAdvanced(false);
      }
    } else {
      props.onClose?.();
      setAdvanced(false);
    }
  }

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
    <>
      <Snackbar
        open={savedSnack}
        autoHideDuration={6000}
        onClose={() => {
          setSavedSnack(false);
        }}
      >
        <Alert
          severity="success"
          onClose={() => {
            setSavedSnack(false);
          }}
        >
          {t("character-dialog.saved")}
        </Alert>
      </Snackbar>
      {renderDialog()}
    </>
  );

  function renderDialog() {
    if (props.dialog && characterManager.state.character) {
      return (
        <Dialog
          open={props.open}
          fullWidth
          maxWidth="md"
          scroll="paper"
          onClose={onClose}
          fullScreen
          TransitionComponent={Transition}
        >
          <DialogTitle>{renderName()}</DialogTitle>
          <DialogContent className={css({ padding: "0" })} dividers>
            {renderContent()}
          </DialogContent>
          <Box className={sheetContentStyle}>{renderActions()}</Box>
        </Dialog>
      );
    }

    return (
      <>
        <Container maxWidth="md">
          <Box className={sheetContentStyle}>{renderActions()}</Box>
          <Box className={sheetContentStyle}>{renderName()}</Box>
          <Box className={sheetContentStyle}>{renderContent()}</Box>
        </Container>
      </>
    );
  }

  function renderContent() {
    return (
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          className={css({
            border: `2px solid ${headerBackgroundColors.primary}`,
          })}
        >
          {renderAspects()}
          {renderStunts()}
          {renderRefresh()}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className={css({
            border: `2px solid ${headerBackgroundColors.primary}`,
          })}
        >
          {renderVitals()}
          {renderSkills()}
        </Grid>
      </Grid>
    );
  }

  function renderActions() {
    if (props.readonly || !props.onSave) {
      return null;
    }
    return (
      <DialogActions className={css({ padding: "0" })}>
        <Grid container wrap="nowrap" spacing={2} justify="space-between">
          {!props.readonly && (
            <Grid item>
              <Button
                color="primary"
                variant={advanced ? "contained" : "outlined"}
                type="submit"
                startIcon={<CreateIcon />}
                onClick={onAdvanced}
              >
                {t("character-dialog.advanced")}
              </Button>
            </Grid>
          )}
          {props.onSave && (
            <Grid item>
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
      </DialogActions>
    );
  }

  function renderName() {
    return (
      <>
        <Box>
          <Grid container spacing={2} alignItems="flex-end" wrap="nowrap">
            <Grid item className={css({ flex: "0 0 auto" })}>
              <FateLabel>{t("character-dialog.name")}</FateLabel>
            </Grid>
            <Grid item className={css({ flex: "1 1 auto" })}>
              <Box fontSize="1.25rem">
                <ContentEditable
                  border
                  autoFocus
                  readonly={props.readonly}
                  value={characterManager.state.character!.name}
                  onChange={(value) => {
                    characterManager.actions.setName(value);
                  }}
                />
              </Box>
            </Grid>
            {props.dialog && (
              <Grid item>
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>
      </>
    );
  }

  function renderSheetHeader(label: string, onAdd?: () => void) {
    const shouldRenderAddButton = onAdd && advanced;
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
                  onAdd!();
                }}
              >
                <AddIcon htmlColor={headerColor} />
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
          {characterManager.state.character!.aspects.map((aspect, index) => {
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
                          readonly={!advanced}
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
                    {advanced && (
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.removeAspect(index);
                          }}
                        >
                          <RemoveIcon />
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
          {characterManager.state.character!.skills.map((skill, index) => {
            return (
              <Box py=".5rem" key={index}>
                <Grid container spacing={2} alignItems="flex-end" wrap="nowrap">
                  <Grid item xs={1}>
                    <FateLabel display="inline">{"+"}</FateLabel>
                  </Grid>
                  <Grid item xs={2}>
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
                  <Grid item>
                    <FateLabel display="inline">
                      <ContentEditable
                        readonly={!advanced}
                        value={skill.name}
                        onChange={(value) => {
                          characterManager.actions.setSkillName(index, value);
                        }}
                      />
                    </FateLabel>
                  </Grid>
                  {advanced && (
                    <Grid
                      item
                      xs={2}
                      className={css({
                        marginLeft: "auto",
                        display: "flex",
                        justifyContent: "flex-end",
                      })}
                    >
                      <IconButton
                        size="small"
                        className={smallIconButtonStyle}
                        onClick={() => {
                          characterManager.actions.removeSkill(index);
                        }}
                      >
                        <RemoveIcon />
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
          {characterManager.state.character!.stunts.map((stunt, index) => {
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
                          readonly={!advanced}
                          value={stunt.name}
                          onChange={(value) => {
                            characterManager.actions.setStuntName(index, value);
                          }}
                        />
                      </FateLabel>
                    </Grid>
                    {advanced && (
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.removeStunt(index);
                          }}
                        >
                          <RemoveIcon />
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
                  readonly={!advanced}
                  value={characterManager.state.character!.refresh.toString()}
                  onChange={(value, e) => {
                    const intValue = parseInt(value);
                    if (!isNaN(intValue)) {
                      characterManager.actions.udpateRefresh(intValue);
                    }
                  }}
                />
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
        {characterManager.state.character!.stressTracks.map(
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
                        readonly={!advanced}
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
                  {advanced && (
                    <Grid item>
                      <IconButton
                        size="small"
                        onClick={() => {
                          characterManager.actions.removeStressBox(index);
                        }}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  )}
                  {advanced && (
                    <Grid item>
                      <IconButton
                        size="small"
                        onClick={() => {
                          characterManager.actions.addStressBox(index);
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  )}
                  {advanced && (
                    <Grid item>
                      <IconButton
                        size="small"
                        onClick={() => {
                          characterManager.actions.removeStressTrack(index);
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>

                <Grid container justify="flex-start" spacing={2}>
                  {stressTrack.value.map((stressBox, boxIndex) => {
                    return (
                      <Grid item key={boxIndex}>
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
                              readonly={!advanced}
                              value={stressBox.label}
                              onChange={(value) => {
                                characterManager.actions.setStressBoxLabel(
                                  index,
                                  boxIndex,
                                  value
                                );
                              }}
                            />
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
        {characterManager.state.character!.consequences.map(
          (consequence, index) => {
            return (
              <Box py=".5rem" key={index}>
                <Box pb=".5rem" key={index}>
                  <Grid container justify="space-between" wrap="nowrap">
                    <Grid item xs={10}>
                      {" "}
                      <FateLabel display="inline">
                        <ContentEditable
                          readonly={!advanced}
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
                    {advanced && (
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.removeConsequence(index);
                          }}
                        >
                          <RemoveIcon />
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
