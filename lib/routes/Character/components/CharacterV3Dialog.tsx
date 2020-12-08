import { css } from "@emotion/css";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
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
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useContext, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../../components/ContentEditable/ContentEditable";
import { DiceBox } from "../../../components/DiceBox/DiceBox";
import { FateLabel } from "../../../components/FateLabel/FateLabel";
import { SlideUpTransition } from "../../../components/SlideUpTransition/SlideUpTransition";
import {
  CharactersContext,
  CharacterType,
  CheckboxesFieldValue,
  ICharacter,
  ISection,
  Position,
  SectionType,
} from "../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";
import { getDayJSFrom } from "../../../domains/dayjs/getDayJS";
import { IRollDiceOptions } from "../../../domains/dice/Dice";
import { IDiceRoll } from "../../../domains/dice/IDiceRoll";
import { useTextColors } from "../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../../services/internationalization/IPossibleTranslationKeys";
import { useCharacter } from "../hooks/useCharacter";

export const CharacterV3Dialog: React.FC<{
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
  const date = getDayJSFrom(characterManager.state.character?.lastUpdated);

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
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
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
                data-cy="character-dialog.template"
                value={template}
                onChange={(event) =>
                  onTemplateChange(event.target.value as CharacterType)
                }
              >
                {Object.keys(CharacterType).map((type) => {
                  return (
                    <MenuItem
                      key={type}
                      data-cy={`character-dialog.template.${type}`}
                      value={type}
                    >
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
                data-cy="character-dialog.load-template"
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

  function renderSections(
    sections: Array<ISection> | undefined,
    predicate: (section: ISection) => boolean
  ) {
    return (
      <>
        {sections?.map((s, sectionIndex) => {
          if (!predicate(s)) {
            return null;
          }
          return (
            <Box key={sectionIndex + s.label}>
              {renderSheetHeader(
                s.label,
                (newLabel) => {
                  characterManager.actions.renameSection(
                    sectionIndex,
                    newLabel
                  );
                },
                () => {
                  characterManager.actions.addSectionField(sectionIndex);
                }
              )}
              {s.type === SectionType.Text && renderTextFields(sectionIndex, s)}
              {s.type === SectionType.Number &&
                renderNumberFields(sectionIndex, s)}
              {s.type === SectionType.Checkboxes &&
                renderCheckboxesFields(sectionIndex, s)}
            </Box>
          );
        })}
      </>
    );
  }

  function renderContent() {
    return (
      <Box>
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            className={css({
              border: `2px solid ${headerBackgroundColors.primary}`,
            })}
          >
            {renderSections(
              characterManager.state.character?.sections,
              (s) => s.position === Position.Left
            )}
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
            {renderSections(
              characterManager.state.character?.sections,
              (s) => s.position === Position.Right
            )}
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item>
            <Box pt=".5rem">
              <Typography>{date.format("lll")}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
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
              data-cy="character-dialog.toggle-advanced"
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
              data-cy="character-dialog.save"
              data-cy-dirty={characterManager.state.dirty}
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
          <Grid container>
            <Grid
              item
              container
              sm={12}
              md={6}
              spacing={2}
              alignItems="flex-end"
            >
              <Grid item className={css({ flex: "0 0 auto" })}>
                <FateLabel>{t("character-dialog.name")}</FateLabel>
              </Grid>
              <Grid item xs>
                <Box fontSize="1rem">
                  <ContentEditable
                    border
                    autoFocus
                    data-cy="character-dialog.name"
                    readonly={props.readonly}
                    value={characterManager.state.character!.name}
                    onChange={(value) => {
                      characterManager.actions.setName(value);
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={12}
              md={6}
              spacing={2}
              alignItems="flex-end"
            >
              <Grid item className={css({ flex: "0 0 auto" })}>
                <FateLabel>{t("character-dialog.group")}</FateLabel>
              </Grid>
              <Grid item xs>
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
                      data-cy={`character-dialog.group`}
                      disabled={props.readonly}
                      className={css({
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {props.dialog && (
              <IconButton
                size="small"
                data-cy="character-dialog.close"
                className={css({
                  position: "absolute",
                  padding: ".5rem",
                  top: ".5rem",
                  right: ".5rem",
                })}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
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

  function renderTextFields(sectionIndex: number, section: ISection<string>) {
    return (
      <>
        <Box
          className={css(sheetContentStyle, {
            padding: section.fields.length === 0 ? "0" : undefined,
          })}
        >
          {section.fields.map((field, fieldIndex) => {
            return (
              <Box key={fieldIndex} py=".5rem">
                <Box pb=".5rem">
                  <Grid
                    container
                    spacing={1}
                    justify="space-between"
                    wrap="nowrap"
                  >
                    <Grid item xs>
                      <FateLabel display="inline">
                        <ContentEditable
                          readonly={!advanced}
                          border={advanced}
                          data-cy={`character-dialog.${section.label}.${field.label}.label`}
                          value={field.label}
                          onChange={(value) => {
                            characterManager.actions.renameSectionField(
                              sectionIndex,
                              fieldIndex,
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
                            data-cy={`character-dialog.${section.label}.${field.label}.move-down`}
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveSectionField(
                                sectionIndex,
                                fieldIndex,
                                "down"
                              );
                            }}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            data-cy={`character-dialog.${section.label}.${field.label}.move-up`}
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.moveSectionField(
                                sectionIndex,
                                fieldIndex,
                                "up"
                              );
                            }}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            data-cy={`character-dialog.${section.label}.${field.label}.remove`}
                            size="small"
                            className={smallIconButtonStyle}
                            onClick={() => {
                              characterManager.actions.removeSectionField(
                                sectionIndex,
                                fieldIndex
                              );
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
                      data-cy={`character-dialog.${section.label}.${field.label}.value`}
                      readonly={props.readonly}
                      value={field.value}
                      onChange={(value) => {
                        characterManager.actions.setSectionFieldValue(
                          sectionIndex,
                          fieldIndex,
                          value
                        );
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

  function renderNumberFields(sectionIndex: number, section: ISection<string>) {
    return (
      <>
        <Box
          className={css(sheetContentStyle, {
            padding: section.fields.length === 0 ? "0" : undefined,
          })}
        >
          {section.fields.map((field, fieldIndex) => {
            const skillLabel = (
              <FateLabel
                display="inline"
                className={css({
                  borderBottom: !advanced
                    ? `1px solid ${theme.palette.text.primary}`
                    : undefined,
                })}
              >
                <ContentEditable
                  data-cy={`character-dialog.${section.label}.${field.label}.label`}
                  readonly={!advanced}
                  border={advanced}
                  value={field.label}
                  onClick={() => {
                    const bonus = parseInt(field.value) || 0;
                    props.onRoll?.({ bonus, bonusLabel: field.label });
                  }}
                  onChange={(value) => {
                    characterManager.actions.setSectionFieldLabel(
                      sectionIndex,
                      fieldIndex,
                      value
                    );
                  }}
                />
              </FateLabel>
            );
            return (
              <Box py=".5rem" key={fieldIndex}>
                <Grid container spacing={1} alignItems="flex-end" wrap="nowrap">
                  <Grid item xs={1}>
                    <FateLabel display="inline">{"•"}</FateLabel>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography align="center">
                      <ContentEditable
                        data-cy={`character-dialog.section.label.${field.label}.value`}
                        border
                        readonly={props.readonly}
                        value={field.value}
                        onChange={(value) => {
                          characterManager.actions.setSectionFieldValue(
                            sectionIndex,
                            fieldIndex,
                            value
                          );
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item className={css({ flex: "1 0 auto" })}>
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
                          data-cy={`character-dialog.section.label.${field.label}.move-down`}
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.moveSectionField(
                              sectionIndex,
                              fieldIndex,
                              "down"
                            );
                          }}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          data-cy={`character-dialog.section.label.${field.label}.move-up`}
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.moveSectionField(
                              sectionIndex,
                              fieldIndex,
                              "up"
                            );
                          }}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          data-cy={`character-dialog.section.label.${field.label}.remove`}
                          size="small"
                          className={smallIconButtonStyle}
                          onClick={() => {
                            characterManager.actions.removeSectionField(
                              sectionIndex,
                              fieldIndex
                            );
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

  function renderRefresh() {
    return (
      <>
        {/* {renderSheetHeader(
          characterManager.state.character?.refreshLabel ??
            t("character-dialog.refresh"),
          characterManager.actions.setRefreshLabel
        )} */}
        <Box className={css(sheetContentStyle)}>
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
                  data-cy={`character-dialog.refresh`}
                  readonly={!advanced}
                  border={advanced}
                  value={characterManager.state.character!.refresh.toString()}
                  onChange={(value, e) => {
                    const intValue = parseInt(value);
                    if (!isNaN(intValue)) {
                      characterManager.actions.updateRefresh(intValue);
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
              <Box py="1rem">
                <DiceBox
                  rolls={props.rolls ?? []}
                  showDetails
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

  function renderCheckboxesFields(
    sectionIndex: number,
    section: ISection<CheckboxesFieldValue>
  ) {
    return (
      <Box p=".5rem 1.5rem">
        {section.fields.map((field, fieldIndex) => {
          return (
            <Box pb=".5rem" key={fieldIndex}>
              <Grid container justify="space-between" wrap="nowrap" spacing={1}>
                <Grid item className={css({ flex: "1 1 auto" })}>
                  <FateLabel display="inline">
                    <ContentEditable
                      data-cy={`character-dialog.${section.label}.${field.label}.label`}
                      readonly={!advanced}
                      border={advanced}
                      value={field.label}
                      onChange={(value) => {
                        characterManager.actions.setSectionFieldLabel(
                          sectionIndex,
                          fieldIndex,
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
                        data-cy={`character-dialog.${section.label}.${field.label}.remove-box`}
                        onClick={() => {
                          characterManager.actions.removeCheckboxFieldValue(
                            sectionIndex,
                            fieldIndex
                          );
                        }}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        data-cy={`character-dialog.${section.label}.${field.label}.add-box`}
                        size="small"
                        onClick={() => {
                          characterManager.actions.addCheckboxFieldValue(
                            sectionIndex,
                            fieldIndex
                          );
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        data-cy={`character-dialog.${section.label}.${field.label}.move-down`}
                        size="small"
                        className={smallIconButtonStyle}
                        onClick={() => {
                          characterManager.actions.moveSectionField(
                            sectionIndex,
                            fieldIndex,
                            "down"
                          );
                        }}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        data-cy={`character-dialog.${section.label}.${field.label}.move-up`}
                        size="small"
                        className={smallIconButtonStyle}
                        onClick={() => {
                          characterManager.actions.moveSectionField(
                            sectionIndex,
                            fieldIndex,
                            "up"
                          );
                        }}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        data-cy={`character-dialog.${section.label}.${field.label}.remove`}
                        size="small"
                        onClick={() => {
                          characterManager.actions.removeSectionField(
                            sectionIndex,
                            fieldIndex
                          );
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </>
                )}
              </Grid>

              <Grid container justify="flex-start" spacing={2}>
                {field.value.map((stressBox, boxIndex) => {
                  return (
                    <Grid item key={boxIndex}>
                      <Box
                        className={css({
                          display: "flex",
                          justifyContent: "center",
                        })}
                      >
                        <Checkbox
                          data-cy={`character-dialog.${section.label}.${field.label}.box.${boxIndex}.value`}
                          color="default"
                          size="small"
                          checked={stressBox.checked}
                          onChange={(event) => {
                            if (props.readonly) {
                              return;
                            }
                            characterManager.actions.toggleCheckboxFieldValue(
                              sectionIndex,
                              fieldIndex,
                              boxIndex
                            );
                          }}
                        />
                      </Box>
                      <Box>
                        <FateLabel className={css({ textAlign: "center" })}>
                          <ContentEditable
                            data-cy={`character-dialog.${section.label}.${field.label}.box.${boxIndex}.label`}
                            readonly={!advanced}
                            border={advanced}
                            value={stressBox.label}
                            onChange={(value) => {
                              characterManager.actions.renameCheckboxFieldValue(
                                sectionIndex,
                                fieldIndex,
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
        })}
      </Box>
    );
  }
};
CharacterV3Dialog.displayName = "CharacterV3Dialog";
