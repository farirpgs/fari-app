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
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import { ThemeProvider } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Filter1Icon from "@material-ui/icons/Filter1";
import HelpIcon from "@material-ui/icons/Help";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import SaveIcon from "@material-ui/icons/Save";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TextFieldsIcon from "@material-ui/icons/TextFields";
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
  CheckboxesFieldValue,
  ICharacter,
  IPage,
  ISection,
} from "../../../contexts/CharactersContext/CharactersContext";
import { CharacterType } from "../../../contexts/CharactersContext/CharacterType";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";
import {
  Position,
  SectionType,
} from "../../../domains/character/CharacterFactory";
import { getDayJSFrom } from "../../../domains/dayjs/getDayJS";
import {
  IDiceRollWithBonus,
  IRollDiceOptions,
} from "../../../domains/dice/Dice";
import { useButtonTheme } from "../../../hooks/useButtonTheme/useButtonTheme";
import { useTextColors } from "../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../../services/internationalization/IPossibleTranslationKeys";
import { useCharacter } from "../hooks/useCharacter";
import { BetterDnd } from "./BetterDnd";
import { FateSkillsDescriptions } from "./domains/FateSkillsDescriptions";

const smallIconButtonStyle = css({
  padding: "0",
});

const HeaderHelpLinks: Record<string, string> = {
  "Aspects": "/srds/condensed/getting-started#aspects",
  "Stunts & Extras": "/srds/condensed/getting-started#stunts",
  "Refresh": "/srds/condensed/getting-started#refresh",
  "Stress": "/srds/condensed/challenges-conflicts-and-contests#stress",
  "Consequences":
    "/srds/condensed/challenges-conflicts-and-contests#consequences-1",
  "Skills": "/srds/condensed/getting-started#skill-list",
  "Dice":
    "/srds/condensed/taking-action-rolling-the-dice#taking-action-rolling-the-dice",
};
const FooterHelpLinks: Record<string, { label: string; link: string }> = {
  "Stunts & Extras": { label: "", link: "" },
};

export const CharacterV3Dialog: React.FC<{
  open: boolean;
  character: ICharacter | undefined;
  readonly?: boolean;
  dialog: boolean;
  rolls?: Array<IDiceRollWithBonus>;
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

  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const blackButtonTheme = useButtonTheme(theme.palette.text.primary);

  const errorTheme = useButtonTheme(theme.palette.error.main);

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

  const sheetContentStyle = css({
    width: "100%",
    padding: ".5rem 1rem",
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
              <Box className={sheetContentStyle}>
                {renderPages(characterManager.state.character.pages)}
              </Box>
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
        <Box className={sheetContentStyle}>
          {renderPages(characterManager.state.character?.pages)}
        </Box>
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

  function renderPages(pages: Array<IPage> | undefined) {
    return (
      <Box>
        <Box>
          {pages?.map((page, pageIndex) => {
            const sectionStyle = css({
              borderTop: `2px solid ${headerBackgroundColors.primary}`,
              borderLeft: `2px solid ${headerBackgroundColors.primary}`,
              borderRight: `2px solid ${headerBackgroundColors.primary}`,
              borderBottom: advanced
                ? "none"
                : `2px solid ${headerBackgroundColors.primary}`,
            });
            return (
              <Box key={page.id} position="relative" mb="3rem">
                <Grid container>
                  <Grid item xs={12} md={6} className={sectionStyle}>
                    {renderSections(pageIndex, page.sections, Position.Left)}
                    {renderDice(pageIndex)}
                    {renderRefresh(pageIndex)}
                  </Grid>
                  <Grid item xs={12} md={6} className={sectionStyle}>
                    {renderSections(pageIndex, page.sections, Position.Right)}
                  </Grid>
                </Grid>
                <Collapse in={advanced}>
                  <Box>
                    <Grid container>
                      <Grid
                        container
                        item
                        xs={12}
                        md={6}
                        justify="center"
                        className={css({
                          borderBottom: `2px solid ${headerBackgroundColors.primary}`,
                          borderLeft: `2px solid ${headerBackgroundColors.primary}`,
                          borderRight: `2px solid ${headerBackgroundColors.primary}`,
                        })}
                      >
                        <AddSection
                          onAddSection={(sectionType) => {
                            characterManager.actions.addSection(
                              pageIndex,
                              sectionType,
                              Position.Left
                            );
                          }}
                        />
                      </Grid>
                      <Grid
                        container
                        item
                        xs={12}
                        md={6}
                        justify="center"
                        className={css({
                          borderBottom: `2px solid ${headerBackgroundColors.primary}`,
                          borderLeft: `2px solid ${headerBackgroundColors.primary}`,
                          borderRight: `2px solid ${headerBackgroundColors.primary}`,
                        })}
                      >
                        <AddSection
                          onAddSection={(sectionType) => {
                            characterManager.actions.addSection(
                              pageIndex,
                              sectionType,
                              Position.Right
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box
                      py="1rem"
                      className={css({
                        borderBottom: `2px solid ${headerBackgroundColors.primary}`,
                        borderLeft: `2px solid ${headerBackgroundColors.primary}`,
                        borderRight: `2px solid ${headerBackgroundColors.primary}`,
                      })}
                    >
                      <Grid container>
                        <Grid item container xs={12} justify="center">
                          <ThemeProvider theme={errorTheme}>
                            <Button
                              variant="outlined"
                              color="primary"
                              endIcon={<DeleteIcon />}
                              onClick={() => {
                                characterManager.actions.removePage(pageIndex);
                              }}
                            >
                              {t("character-dialog.control.remove-page")}
                            </Button>
                          </ThemeProvider>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Collapse>
                {renderAddPage(pageIndex)}
              </Box>
            );
          })}
        </Box>

        {characterManager.state.character?.pages.length === 0 &&
          renderAddPage(0)}

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

  function renderAddPage(pageIndex: number) {
    return (
      <Collapse in={advanced}>
        <Box pt="2rem">
          <Grid
            container
            justify="space-around"
            alignItems="center"
            spacing={2}
            wrap="nowrap"
          >
            <Grid item xs>
              <Divider orientation="horizontal" />
            </Grid>
            <Grid item>
              <ThemeProvider theme={blackButtonTheme}>
                <Button
                  color="primary"
                  variant="outlined"
                  endIcon={<AddIcon />}
                  onClick={(e) => {
                    characterManager.actions.addPage(pageIndex);
                  }}
                >
                  {t("character-dialog.control.add-page")}
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item xs>
              <Divider orientation="horizontal" />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    );
  }

  function renderSections(
    pageIndex: number,
    sections: Array<ISection> | undefined,
    position: Position
  ) {
    return (
      <>
        {sections?.map((section, sectionIndex) => {
          if (section.position !== position) {
            return null;
          }

          const helpLink = HeaderHelpLinks[section.label];

          return (
            <Box key={section.id}>
              <SheetHeader
                label={section.label}
                helpLink={helpLink}
                advanced={advanced}
                visibleOnCard={section.visibleOnCard}
                onToggleVisibleOnCard={() => {
                  characterManager.actions.toggleSectionVisibleOnCard(
                    pageIndex,
                    sectionIndex
                  );
                }}
                onLabelChange={(newLabel) => {
                  characterManager.actions.renameSection(
                    pageIndex,
                    sectionIndex,
                    newLabel
                  );
                }}
                onMoveDown={() => {
                  characterManager.actions.moveSection(
                    pageIndex,
                    sectionIndex,
                    "down"
                  );
                }}
                onMoveUp={() => {
                  characterManager.actions.moveSection(
                    pageIndex,
                    sectionIndex,
                    "up"
                  );
                }}
                onRemove={() => {
                  characterManager.actions.removeSection(
                    pageIndex,
                    sectionIndex
                  );
                }}
              />

              {section.type === SectionType.Text &&
                renderTextFields(pageIndex, sectionIndex, section)}
              {section.type === SectionType.Number &&
                renderNumberFields(pageIndex, sectionIndex, section)}
              {section.type === SectionType.Checkboxes &&
                renderCheckboxesFields(pageIndex, sectionIndex, section)}
              <Collapse in={advanced}>
                <Box
                  p=".5rem"
                  mb=".5rem"
                  justifyContent="center"
                  display="flex"
                >
                  <Button
                    color="default"
                    data-cy={`character-dialog.${section.label}.add-section-field`}
                    variant="outlined"
                    endIcon={<AddIcon />}
                    onClick={() => {
                      characterManager.actions.addSectionField(
                        pageIndex,
                        sectionIndex
                      );
                    }}
                  >
                    {t("character-dialog.control.add-field")}
                  </Button>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </>
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

  function renderTextFields(
    pageIndex: number,
    sectionIndex: number,
    section: ISection<string>
  ) {
    return (
      <>
        <Box
          className={css(sheetContentStyle, {
            padding: section.fields.length === 0 ? "0" : undefined,
          })}
        >
          {section.fields.map((field, fieldIndex) => {
            return (
              <BetterDnd
                key={field.id}
                index={fieldIndex}
                type={section.label}
                readonly={!advanced}
                onMove={(dragIndex, hoverIndex) => {
                  characterManager.actions.moveDnDSectionField(
                    pageIndex,
                    sectionIndex,
                    dragIndex,
                    hoverIndex
                  );
                }}
              >
                <Box py=".5rem">
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
                                pageIndex,
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
                            <Tooltip
                              title={t("character-dialog.control.remove-field")}
                            >
                              <IconButton
                                data-cy={`character-dialog.${section.label}.${field.label}.remove`}
                                size="small"
                                className={smallIconButtonStyle}
                                onClick={() => {
                                  characterManager.actions.removeSectionField(
                                    pageIndex,
                                    sectionIndex,
                                    fieldIndex
                                  );
                                }}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </Tooltip>
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
                            pageIndex,
                            sectionIndex,
                            fieldIndex,
                            value
                          );
                        }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </BetterDnd>
            );
          })}
        </Box>
      </>
    );
  }

  function renderNumberFields(
    pageIndex: number,
    sectionIndex: number,
    section: ISection<string>
  ) {
    return (
      <>
        <Box
          className={css(sheetContentStyle, {
            padding: section.fields.length === 0 ? "0" : undefined,
          })}
        >
          {section.fields.map((field, fieldIndex) => {
            const skillDescription =
              FateSkillsDescriptions[field.label.toLowerCase()] ?? "";
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
                      pageIndex,
                      sectionIndex,
                      fieldIndex,
                      value
                    );
                  }}
                />
              </FateLabel>
            );

            return (
              <BetterDnd
                key={field.id}
                index={fieldIndex}
                type={section.label}
                readonly={!advanced}
                onMove={(dragIndex, hoverIndex) => {
                  characterManager.actions.moveDnDSectionField(
                    pageIndex,
                    sectionIndex,
                    dragIndex,
                    hoverIndex
                  );
                }}
              >
                <Box py=".5rem">
                  <Grid
                    container
                    spacing={1}
                    alignItems="flex-end"
                    wrap="nowrap"
                  >
                    <Grid item xs={1}>
                      <FateLabel display="inline">{"•"}</FateLabel>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography align="center">
                        <ContentEditable
                          data-cy={`character-dialog.${section.label}.${field.label}.value`}
                          border
                          readonly={props.readonly}
                          value={field.value}
                          onChange={(value) => {
                            characterManager.actions.setSectionFieldValue(
                              pageIndex,
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
                        <>
                          <ButtonBase>{skillLabel}</ButtonBase>
                          {skillDescription && (
                            <>
                              <Tooltip
                                placement="right-start"
                                classes={{
                                  tooltip: css({
                                    backgroundColor:
                                      theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    boxShadow: theme.shadows[1],
                                    fontSize: "1rem",
                                  }),
                                }}
                                title={
                                  <>
                                    <Typography
                                      className={css({
                                        fontWeight: "bold",
                                        marginBottom: ".5rem",
                                      })}
                                    >
                                      {skillDescription.quick}
                                    </Typography>
                                    <Typography>
                                      {skillDescription.long}
                                    </Typography>
                                  </>
                                }
                              >
                                <HelpIcon
                                  className={css({
                                    marginLeft: ".5rem",
                                    fontSize: "1rem",
                                  })}
                                />
                              </Tooltip>
                            </>
                          )}
                        </>
                      )}
                    </Grid>
                    {advanced && (
                      <>
                        <Grid item>
                          <Tooltip
                            title={t("character-dialog.control.remove-field")}
                          >
                            <IconButton
                              data-cy={`character-dialog.${section.label}.${field.label}.remove`}
                              size="small"
                              className={smallIconButtonStyle}
                              onClick={() => {
                                characterManager.actions.removeSectionField(
                                  pageIndex,
                                  sectionIndex,
                                  fieldIndex
                                );
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </BetterDnd>
            );
          })}
        </Box>
      </>
    );
  }

  function renderCheckboxesFields(
    pageIndex: number,
    sectionIndex: number,
    section: ISection<CheckboxesFieldValue>
  ) {
    return (
      <Box p=".5rem 1.5rem">
        {section.fields.map((field, fieldIndex) => {
          return (
            <BetterDnd
              key={field.id}
              index={fieldIndex}
              type={section.label}
              readonly={!advanced}
              onMove={(dragIndex, hoverIndex) => {
                characterManager.actions.moveDnDSectionField(
                  pageIndex,
                  sectionIndex,
                  dragIndex,
                  hoverIndex
                );
              }}
            >
              <Box py=".5rem">
                <Grid
                  container
                  justify="space-between"
                  wrap="nowrap"
                  spacing={1}
                >
                  <Grid item className={css({ flex: "1 1 auto" })}>
                    <FateLabel display="inline">
                      <ContentEditable
                        data-cy={`character-dialog.${section.label}.${field.label}.label`}
                        readonly={!advanced}
                        border={advanced}
                        value={field.label}
                        onChange={(value) => {
                          characterManager.actions.setSectionFieldLabel(
                            pageIndex,
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
                        <Tooltip
                          title={t("character-dialog.control.remove-box")}
                        >
                          <IconButton
                            size="small"
                            data-cy={`character-dialog.${section.label}.${field.label}.remove-box`}
                            onClick={() => {
                              characterManager.actions.removeCheckboxFieldValue(
                                pageIndex,
                                sectionIndex,
                                fieldIndex
                              );
                            }}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip title={t("character-dialog.control.add-box")}>
                          <IconButton
                            data-cy={`character-dialog.${section.label}.${field.label}.add-box`}
                            size="small"
                            onClick={() => {
                              characterManager.actions.addCheckboxFieldValue(
                                pageIndex,
                                sectionIndex,
                                fieldIndex
                              );
                            }}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title={t("character-dialog.control.remove-field")}
                        >
                          <IconButton
                            data-cy={`character-dialog.${section.label}.${field.label}.remove`}
                            size="small"
                            onClick={() => {
                              characterManager.actions.removeSectionField(
                                pageIndex,
                                sectionIndex,
                                fieldIndex
                              );
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Tooltip>
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
                                pageIndex,
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
                                  pageIndex,
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
            </BetterDnd>
          );
        })}
      </Box>
    );
  }

  function renderRefresh(pageIndex: number) {
    if (pageIndex !== 0) {
      return null;
    }

    return (
      <>
        <SheetHeader
          label={t("character-dialog.refresh")}
          helpLink={HeaderHelpLinks["Refresh"]}
          advanced={advanced}
        />
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

  function renderDice(pageIndex: number) {
    if (pageIndex !== 0) {
      return null;
    }

    return (
      <>
        <SheetHeader
          label={t("character-dialog.dice")}
          helpLink={HeaderHelpLinks["Dice"]}
          advanced={advanced}
        />
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
};
CharacterV3Dialog.displayName = "CharacterV3Dialog";

export const AddSection: React.FC<{
  onAddSection(section: SectionType): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const blackButtonTheme = useButtonTheme(theme.palette.text.primary);
  const [addSectionAnchorEl, setAddSectionAnchorEl] = React.useState<any>();

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <ThemeProvider theme={blackButtonTheme}>
        <Button
          color="primary"
          variant="contained"
          endIcon={<AddIcon />}
          onClick={(e) => {
            setAddSectionAnchorEl(e.currentTarget);
          }}
        >
          {t("character-dialog.control.add-section")}
        </Button>
        <Menu
          elevation={0}
          anchorEl={addSectionAnchorEl}
          open={!!addSectionAnchorEl}
          onClose={() => {
            setAddSectionAnchorEl(undefined);
          }}
        >
          <MenuItem
            onClick={() => {
              props.onAddSection(SectionType.Text);
              setAddSectionAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <TextFieldsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Text Section" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddSection(SectionType.Checkboxes);
              setAddSectionAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <CheckBoxIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Checkboxes Section" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddSection(SectionType.Number);
              setAddSectionAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <Filter1Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Number Section" />
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </Box>
  );
};
AddSection.displayName = "AddSection";

export const SheetHeader: React.FC<{
  label: string;
  helpLink: string | undefined;
  advanced: boolean;
  onLabelChange?: (newLabel: string) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  visibleOnCard?: boolean;
  onToggleVisibleOnCard?: () => void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const sheetHeader = css({
    background: headerBackgroundColors.primary,
    color: headerColor,
    width: "100%",
    padding: ".5rem 1rem",
  });

  return (
    <Box className={sheetHeader}>
      <Grid container justify="space-between" wrap="nowrap" spacing={1}>
        {props.helpLink && (
          <Grid item>
            <IconButton
              size="small"
              className={smallIconButtonStyle}
              onClick={() => {
                window.open(props.helpLink);
              }}
            >
              <HelpIcon htmlColor={headerColor} />
            </IconButton>
          </Grid>
        )}
        <Grid item xs>
          <FateLabel>
            <ContentEditable
              data-cy={`character-dialog.${props.label}.label`}
              readonly={!props.advanced || !props.onLabelChange}
              border={props.advanced && !!props.onLabelChange}
              borderColor={headerColor}
              value={props.label}
              onChange={(newLabel) => {
                props.onLabelChange?.(newLabel);
              }}
            />
          </FateLabel>
        </Grid>
        {props.advanced && props.onToggleVisibleOnCard && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.visible-on-card")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.visible-on-card`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onToggleVisibleOnCard?.();
                }}
              >
                {props.visibleOnCard ? (
                  <StarIcon htmlColor={headerColor} />
                ) : (
                  <StarBorderIcon htmlColor={headerColor} />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {props.advanced && props.onMoveDown && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.move-down")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.move-down`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onMoveDown?.();
                }}
              >
                <ArrowDownwardIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {props.advanced && props.onMoveUp && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.move-up")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.move-up`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onMoveUp?.();
                }}
              >
                <ArrowUpwardIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {props.advanced && props.onRemove && (
          <Grid item>
            <Tooltip title={t("character-dialog.control.remove-section")}>
              <IconButton
                data-cy={`character-dialog.${props.label}.remove`}
                size="small"
                className={smallIconButtonStyle}
                onClick={() => {
                  props.onRemove?.();
                }}
              >
                <RemoveIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";
