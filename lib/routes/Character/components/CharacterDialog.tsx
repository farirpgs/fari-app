import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import SaveIcon from "@material-ui/icons/Save";
import { Alert, Autocomplete } from "@material-ui/lab";
import { css } from "emotion";
import React, { useContext, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { DiceBox } from "../../../components/DiceBox/DiceBox";
import { FateLabel } from "../../../components/FateLabel/FateLabel";
import { SlideUpTransition } from "../../../components/SlideUpTransition/SlideUpTransition";
import {
  CharactersContext,
  CharacterType,
  ICharacter,
} from "../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";
import { IRollDiceOptions } from "../../../domains/dice/Dice";
import { IDiceRoll } from "../../../domains/dice/IDiceRoll";
import { useTextColors } from "../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../../services/internationalization/IPossibleTranslationKeys";
import { useCharacter } from "../hooks/useCharacter";

export const CharacterDialog: React.FC<{
  open: boolean;
  character: ICharacter | undefined;
  readonly?: boolean;
  dialog: boolean;
  rolls?: Array<IDiceRoll>;
  onRoll?(options: IRollDiceOptions): void;
  onClose?(): void;
  onSave?(newCharacter: ICharacter): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const logger = useLogger();
  const characterManager = useCharacter(props.character);
  const [advanced, setAdvanced] = useState(false);
  const [savedSnack, setSavedSnack] = useState(false);
  const [template, setTemplate] = useState(CharacterType.CoreCondensed);
  const charactersManager = useContext(CharactersContext);

  function onSave() {
    const updatedCharacter = characterManager.actions.sanitizeCharacter();
    props.onSave?.(updatedCharacter!);
    setSavedSnack(true);
    logger.info(`CharacterDialog:onSave`);
  }

  function onToggleAdvanced() {
    setAdvanced((prev) => !prev);
    logger.info(`CharacterDialog:onToggleAdvanced`);
  }

  function onTemplateChange(newTemplate: CharacterType) {
    setTemplate(newTemplate);
    logger.info(
      `CharacterDialog:onTemplateChange:${CharacterType[newTemplate]}`
    );
  }

  function onLoadTemplate() {
    const confirmed = confirm(t("character-dialog.load-template-confirmation"));

    if (confirmed) {
      characterManager.actions.loadTemplate(template);
      logger.info(`CharacterDialog:onLoadTemplate:${CharacterType[template]}`);
    }
  }

  function onClose() {
    if (characterManager.state.dirty && !props.readonly) {
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
      <Prompt
        when={characterManager.state.dirty}
        message={t("manager.leave-without-saving")}
      />
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
          keepMounted
          maxWidth="md"
          scroll="paper"
          onClose={onClose}
          TransitionComponent={SlideUpTransition}
        >
          <DialogTitle className={css({ padding: "0" })}>
            <Container maxWidth="md">
              <Box className={sheetContentStyle}>{renderName()}</Box>
            </Container>
          </DialogTitle>
          <DialogContent className={css({ padding: "0" })} dividers>
            <Container maxWidth="md">
              <Box className={sheetContentStyle}>{renderContent()}</Box>
            </Container>
          </DialogContent>
          <DialogActions className={css({ padding: "0" })}>
            <Container maxWidth="md">
              <Box className={sheetContentStyle}>{renderActions()}</Box>
            </Container>
          </DialogActions>
        </Dialog>
      );
    }

    return (
      <Container maxWidth="md">
        <Box className={sheetContentStyle}>{renderManagementActions()}</Box>
        <Box className={sheetContentStyle}>{renderActions()}</Box>
        <Box className={sheetContentStyle}>{renderName()}</Box>
        <Box className={sheetContentStyle}>{renderContent()}</Box>
      </Container>
    );
  }

  function renderManagementActions() {
    return (
      <Collapse in={advanced}>
        <Box>
          <Grid container wrap="nowrap" spacing={2} justify="center">
            <Grid item>
              <Select
                value={template}
                onChange={(event) =>
                  onTemplateChange(event.target.value as CharacterType)
                }
              >
                {Object.keys(CharacterType).map((type) => {
                  return (
                    <MenuItem key={type} value={type}>
                      {t(
                        `character-dialog.template.${type}` as IPossibleTranslationKeys
                      )}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="text"
                endIcon={<AssignmentIndIcon />}
                onClick={onLoadTemplate}
              >
                {t("character-dialog.load-template")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
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
          {renderDice()}
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
      <Grid container wrap="nowrap" spacing={2} justify="space-between">
        {!props.readonly && (
          <Grid item>
            <Button
              color="primary"
              variant={advanced ? "contained" : "outlined"}
              endIcon={<CreateIcon />}
              onClick={onToggleAdvanced}
            >
              {t("character-dialog.advanced")}
            </Button>
          </Grid>
        )}
        {props.onSave && (
          <Grid item>
            <Button
              color="primary"
              variant={characterManager.state.dirty ? "contained" : "outlined"}
              type="submit"
              endIcon={<SaveIcon />}
              onClick={onSave}
            >
              {t("character-dialog.save")}
            </Button>
          </Grid>
        )}
      </Grid>
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
            <Grid item xs>
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
            <Grid item className={css({ flex: "0 0 auto" })}>
              <FateLabel>{t("character-dialog.group")}</FateLabel>
            </Grid>
            <Grid item xs>
              <Box fontSize="1.25rem">
                <Autocomplete
                  freeSolo
                  options={charactersManager.state.groups.filter((g) => {
                    const currentGroup =
                      characterManager.state.character!.group?.toLowerCase() ??
                      "";
                    return g.toLowerCase().includes(currentGroup);
                  })}
                  value={characterManager.state.character!.group ?? ""}
                  onChange={(event, newValue) => {
                    characterManager.actions.setGroup(newValue);
                  }}
                  inputValue={characterManager.state.character!.group ?? ""}
                  onInputChange={(event, newInputValue) => {
                    characterManager.actions.setGroup(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                      disabled={props.readonly}
                      className={css({
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      })}
                    />
                  )}
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

  function renderSheetHeader(
    label: string,
    onLabelChange?: (newLabel: string) => void,
    onAdd?: () => void
  ) {
    const shouldRenderAddButton = onAdd && advanced;
    return (
      <Box className={sheetHeader}>
        <Grid container justify="space-between" wrap="nowrap">
          <Grid
            item
            className={css({
              flex: "1 1 auto",
            })}
          >
            <FateLabel>
              <ContentEditable
                readonly={!advanced}
                value={label}
                onChange={(newLabel) => {
                  onLabelChange?.(newLabel);
                }}
              />
            </FateLabel>
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
          characterManager.state.character?.aspectsLabel ??
            t("character-dialog.aspects"),
          characterManager.actions.setAspectsLabel,
          characterManager.actions.addAspect
        )}

        <Box className={sheetContentStyle}>
          {characterManager.state.character!.aspects.map((aspect, index) => {
            return (
              <Box key={index} py=".5rem">
                <Box pb=".5rem">
                  <Grid
                    container
                    spacing={1}
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
                      <>
                        <Grid item>
                          <IconButton
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveValueInList(
                                "aspects",
                                index,
                                "down"
                              );
                            }}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveValueInList(
                                "aspects",
                                index,
                                "up"
                              );
                            }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                        </Grid>
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
                      </>
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
          characterManager.state.character?.skillsLabel ??
            t("character-dialog.skills"),
          characterManager.actions.setSkillsLabel,
          characterManager.actions.addSkill
        )}

        <Box className={sheetContentStyle}>
          {characterManager.state.character!.skills.map((skill, index) => {
            const skillLabel = (
              <Box pt=".1rem" px=".1rem">
                <FateLabel display="inline">
                  <ContentEditable
                    readonly={!advanced}
                    value={skill.name}
                    onClick={() => {
                      const bonus = parseInt(skill.value) || 0;
                      props.onRoll?.({ bonus, bonusLabel: skill.name });
                    }}
                    onChange={(value) => {
                      characterManager.actions.setSkillName(index, value);
                    }}
                  />
                </FateLabel>
              </Box>
            );
            return (
              <Box py=".5rem" key={index}>
                <Grid container spacing={1} alignItems="flex-end" wrap="nowrap">
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
                    {advanced ? (
                      skillLabel
                    ) : (
                      <ButtonBase>{skillLabel}</ButtonBase>
                    )}
                  </Grid>
                  {advanced && (
                    <>
                      <Grid
                        item
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
                            characterManager.actions.moveValueInList(
                              "skills",
                              index,
                              "down"
                            );
                          }}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.moveValueInList(
                              "skills",
                              index,
                              "up"
                            );
                          }}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.removeSkill(index);
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>{" "}
                    </>
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
          characterManager.state.character?.stuntsLabel ??
            t("character-dialog.stunts-extras"),
          characterManager.actions.setStuntsLabel,
          characterManager.actions.addStunt
        )}
        <Box className={sheetContentStyle}>
          {characterManager.state.character!.stunts.map((stunt, index) => {
            return (
              <Box py=".5rem" key={index}>
                <Box pb=".5rem">
                  <Grid
                    container
                    spacing={1}
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
                      <>
                        <Grid item>
                          <IconButton
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveValueInList(
                                "stunts",
                                index,
                                "down"
                              );
                            }}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveValueInList(
                                "stunts",
                                index,
                                "up"
                              );
                            }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                        </Grid>
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
                      </>
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
        {renderSheetHeader(
          characterManager.state.character?.refreshLabel ??
            t("character-dialog.refresh"),
          characterManager.actions.setRefreshLabel
        )}
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

  function renderDice() {
    return (
      <>
        {renderSheetHeader(t("character-dialog.dice"))}
        <Box className={sheetContentStyle}>
          <Grid container justify="center">
            <Grid item>
              <Box pt="1rem">
                <DiceBox
                  rolls={props.rolls ?? []}
                  size="5rem"
                  fontSize="2rem"
                  borderSize=".2rem"
                  borderColor="#000000"
                  onClick={() => {
                    props.onRoll?.({});
                  }}
                />
              </Box>
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
          characterManager.state.character?.stressTracksLabel ??
            t("character-dialog.stress"),
          characterManager.actions.setStressTracksLabel,
          characterManager.actions.addStressTrack
        )}
        <Box className={sheetContentStyle}>{renderStressTracks()}</Box>
        {renderSheetHeader(
          characterManager.state.character?.consequencesLabel ??
            t("character-dialog.consequences"),
          characterManager.actions.setConsequencesLabel,

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
                  spacing={1}
                >
                  <Grid item className={css({ flex: "1 1 auto" })}>
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
                    <>
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
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.moveValueInList(
                              "stressTracks",
                              index,
                              "down"
                            );
                          }}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.moveValueInList(
                              "stressTracks",
                              index,
                              "up"
                            );
                          }}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </Grid>
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
                    </>
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
                  <Grid
                    container
                    justify="space-between"
                    wrap="nowrap"
                    spacing={1}
                  >
                    <Grid item xs={10}>
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
                      <>
                        <Grid item>
                          <IconButton
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveValueInList(
                                "consequences",
                                index,
                                "down"
                              );
                            }}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveValueInList(
                                "consequences",
                                index,
                                "up"
                              );
                            }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                        </Grid>
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
                      </>
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
