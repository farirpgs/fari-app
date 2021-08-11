import { css, cx } from "@emotion/css";
import Alert from "@material-ui/core/Alert";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/core/Autocomplete";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid, { GridSize } from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ExportIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import UndoIcon from "@material-ui/icons/Undo";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import startCase from "lodash/startCase";
import React, { useContext, useEffect, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../components/FateLabel/FateLabel";
import { CharacterCard } from "../../../../components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { SlideUpTransition } from "../../../../components/SlideUpTransition/SlideUpTransition";
import { CharactersContext } from "../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import {
  CharacterTemplates,
  CharacterTemplatesWithGroups,
} from "../../../../domains/character/CharacterType";
import {
  ICharacter,
  IPage,
  IPageSectionPosition,
  ISection,
} from "../../../../domains/character/types";
import { getDayJSFrom } from "../../../../domains/dayjs/getDayJS";
import { IDiceRollResult } from "../../../../domains/dice/Dice";
import { LazyState } from "../../../../hooks/useLazyState/useLazyState";
import { useQuery } from "../../../../hooks/useQuery/useQuery";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useThemeFromColor } from "../../../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { ITranslationKeys } from "../../../../locale";
import { useCharacter } from "../../hooks/useCharacter";
import { BetterDnd } from "../BetterDnD/BetterDnd";
import { AddBlock } from "./components/AddBlock";
import { AddSection } from "./components/AddSection";
import { BlockByType } from "./components/BlockByType";
import { SheetHeader } from "./components/SheetHeader";

export const smallIconButtonStyle = css({
  label: "CharacterDialog-small-icon-button",
  padding: "0",
});

export const CharacterV3Dialog: React.FC<{
  open: boolean;
  character: ICharacter | undefined;
  readonly?: boolean;
  dialog: boolean;

  synced?: boolean;

  onClose?(): void;
  onSave?(newCharacter: ICharacter): void;
  onToggleSync?(): void;
  onRoll(diceRollResult: IDiceRollResult): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const blackButtonTheme = useThemeFromColor(theme.palette.text.primary);
  const query = useQuery<"card" | "advanced">();
  const showCharacterCard = query.get("card") === "true";
  const defaultAdvanced = query.get("advanced") === "true";
  const logger = useLogger();
  const characterManager = useCharacter(props.character);
  const [advanced, setAdvanced] = useState(defaultAdvanced);
  const [savedSnack, setSavedSnack] = useState(false);
  const charactersManager = useContext(CharactersContext);
  const date = getDayJSFrom(characterManager.state.character?.lastUpdated);

  const headerColor = theme.palette.background.paper;
  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;

  const [tab, setTab] = useState<string>("0");
  const currentPageIndex = parseInt(tab);

  function getTemplateName(template: string | undefined = "") {
    const label = t(
      `character-dialog.template.${template}` as ITranslationKeys,
      {},
      true
    );

    if (!!label) {
      return label;
    }
    const formatted = template
      .split("_")
      .map((word) => startCase(word))
      .join(" - ");
    return formatted;
  }

  function onSave() {
    const updatedCharacter =
      characterManager.actions.getCharacterWithNewTimestamp();
    props.onSave?.(updatedCharacter!);
    setSavedSnack(true);
    logger.info(`CharacterDialog:onSave`);
  }

  function handleOnToggleAdvancedMode() {
    setAdvanced((prev) => !prev);
    logger.info(`CharacterDialog:onToggleAdvanced`);
  }

  function onLoadTemplate(newTemplate: CharacterTemplates) {
    const confirmKey = t("character-dialog.load-template-confirmation");
    const confirmed = confirm(confirmKey);

    if (confirmed) {
      setTab("0");
      characterManager.actions.loadTemplate(newTemplate);
      setAdvanced(false);
      logger.info(
        `CharacterDialog:onLoadTemplate:${CharacterTemplates[newTemplate]}`
      );
    }
  }

  function onClose() {
    if (characterManager.state.dirty && !props.readonly) {
      const confirmKey = t("character-dialog.close-confirmation");
      const confirmed = confirm(confirmKey);
      if (confirmed) {
        props.onClose?.();
        setAdvanced(false);
      }
    } else {
      props.onClose?.();
      setAdvanced(false);
    }
  }

  const dialogSheetContentStyle = css({
    label: "CharacterDialog-sheet-content",
    width: "100%",
    padding: ".5rem 1rem",
  });
  const fullScreenSheetContentStyle = css({
    label: "CharacterDialog-sheet-content",
    width: "100%",
    padding: ".5rem 1rem",
  });

  useEffect(
    function disableAdvancedOnNewCharacterLoad() {
      const isDifferentCharacter =
        props.character?.id !== characterManager.state.character?.id;

      if (isDifferentCharacter) {
        setAdvanced(defaultAdvanced);
        setTab("0");
      }
    },
    [props.character]
  );

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
        autoHideDuration={2000}
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
    const maxWidth = characterManager.state.character?.wide ? "lg" : "md";

    if (props.dialog && characterManager.state.character) {
      return (
        <Dialog
          open={props.open}
          fullWidth
          keepMounted={false}
          maxWidth={maxWidth}
          scroll="paper"
          onClose={onClose}
          classes={{
            paper: css({ height: "100%" }),
          }}
          TransitionComponent={SlideUpTransition}
        >
          <DialogTitle
            className={css({
              label: "CharacterDialog-dialog-wrapper",
              padding: "0",
            })}
          >
            <Container maxWidth={maxWidth}>
              <Box className={dialogSheetContentStyle}>
                {renderNameAndGroup()}
              </Box>
            </Container>
          </DialogTitle>
          <DialogContent
            className={css({
              label: "CharacterDialog-dialog-wrapper",
              padding: "0",
            })}
            dividers
          >
            <Container maxWidth={maxWidth}>
              <Box className={dialogSheetContentStyle}>
                {renderPages(characterManager.state.character.pages)}
              </Box>
            </Container>
          </DialogContent>
          <DialogActions
            className={css({
              label: "CharacterDialog-dialog-wrapper",
              padding: "0",
            })}
          >
            <Container
              maxWidth={maxWidth}
              className={css({ padding: ".5rem" })}
            >
              <Box className={dialogSheetContentStyle}>
                {renderTopLevelActions()}
              </Box>
            </Container>
          </DialogActions>
        </Dialog>
      );
    }

    return (
      <Container maxWidth={maxWidth}>
        <Box className={fullScreenSheetContentStyle}>
          {renderTopLevelActions()}
        </Box>

        <Box className={fullScreenSheetContentStyle}>
          {renderNameAndGroup()}
        </Box>
        <Box className={fullScreenSheetContentStyle}>
          {renderPages(characterManager.state.character?.pages)}
        </Box>
      </Container>
    );
  }

  function renderLoadTemplate() {
    return (
      <Box>
        <Grid
          container
          wrap="nowrap"
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <InputLabel> {t("character-dialog.load-template")}</InputLabel>
          </Grid>
          <Grid item>
            <Autocomplete
              size="small"
              autoHighlight
              filterOptions={createFilterOptions({
                limit: 100,
                stringify: (option) => {
                  const templateName = getTemplateName(option.template);
                  const groupName = option.group;
                  return `${templateName} ${groupName}`;
                },
              })}
              options={CharacterTemplatesWithGroups}
              className={css({ width: "300px" })}
              getOptionLabel={(option) => {
                return getTemplateName(option.template);
              }}
              groupBy={(option) => option.group}
              onChange={(event, newValue) => {
                if (newValue?.template) {
                  onLoadTemplate(newValue?.template);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Template"
                  variant="outlined"
                  data-cy={`character-dialog.template-input`}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderPages(pages: Array<IPage> | undefined) {
    if (!pages) {
      return null;
    }
    const numberOfSections = pages.flatMap((p) => [
      ...p.sections.left,
      ...p.sections.right,
    ]).length;
    const doesntHaveSections = numberOfSections === 0;
    const shouldRenderLoadTemplate = doesntHaveSections || advanced;

    return (
      <Box>
        <Collapse in={shouldRenderLoadTemplate}>
          <Box mb="1rem">
            <Grid container justifyContent="center">
              <Grid item>{renderLoadTemplate()}</Grid>
            </Grid>
          </Box>
        </Collapse>
        <Box mb="1rem">
          <Grid
            container
            alignItems="center"
            wrap="nowrap"
            justifyContent="flex-start"
          >
            <Grid item xs={advanced ? 11 : 12}>
              <Tabs
                value={tab}
                variant="scrollable"
                scrollButtons="auto"
                classes={{
                  flexContainer: css({
                    borderBottom: `3px solid ${headerBackgroundColor}`,
                  }),
                }}
                onChange={(e, newValue) => {
                  setTab(newValue);
                }}
              >
                {pages?.map((page, pageIndex) => {
                  return (
                    <Tab
                      disableRipple
                      key={page.id}
                      className={css({
                        background: headerBackgroundColor,
                        color: `${headerColor} !important`,
                        marginRight: ".5rem",
                        // Pentagone
                        // https://bennettfeely.com/clippy/
                        clipPath:
                          "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
                      })}
                      value={pageIndex.toString()}
                      label={
                        <FateLabel
                          className={css({
                            fontSize: "1.2rem",
                            width: "100%",
                          })}
                        >
                          <ContentEditable
                            clickable
                            className={css({ width: "100%" })}
                            value={page.label}
                            readonly={!advanced}
                            border={advanced}
                            borderColor={headerColor}
                            onChange={(newValue) => {
                              characterManager.actions.renamePage(
                                pageIndex,
                                newValue
                              );
                            }}
                          />
                        </FateLabel>
                      }
                    />
                  );
                })}
              </Tabs>
            </Grid>
            {advanced && (
              <Grid item>
                <IconButton
                  onClick={() => {
                    characterManager.actions.addPage();
                    const newTab =
                      characterManager.state.character?.pages.length ?? 0;
                    setTab(newTab.toString());
                  }}
                  size="large"
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>
        <Collapse in={advanced}>
          <Box mb=".5rem">
            <Grid container justifyContent="space-around" alignItems="center">
              <Grid item>
                <IconButton
                  disabled={currentPageIndex === 0}
                  onClick={() => {
                    characterManager.actions.movePage(currentPageIndex, "up");
                    setTab((currentPageIndex - 1).toString());
                  }}
                  size="large"
                >
                  <UndoIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => {
                    characterManager.actions.duplicatePage(currentPageIndex);
                    setTab((currentPageIndex + 1).toString());
                  }}
                  size="large"
                >
                  <FileCopyIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  disabled={
                    characterManager.state.character?.pages.length === 1
                  }
                  onClick={() => {
                    const confirmed = confirm(
                      t("character-dialog.remove-page-confirmation")
                    );
                    if (confirmed) {
                      characterManager.actions.removePage(currentPageIndex);
                    }
                    setTab("0");
                  }}
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  disabled={currentPageIndex === pages?.length - 1}
                  onClick={() => {
                    characterManager.actions.movePage(currentPageIndex, "down");
                    setTab((currentPageIndex + 1).toString());
                  }}
                  size="large"
                >
                  <RedoIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <TabContext value={tab}>
          {pages?.map((page, pageIndex) => {
            const sectionStyle = css({
              label: "CharacterDialog-grid-section",
            });
            return (
              <TabPanel
                key={page.id}
                value={pageIndex.toString()}
                className={css({
                  label: "CharacterDialog-tab-panel",
                  padding: "0",
                })}
              >
                <Box position="relative" mb="2rem">
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} className={sectionStyle}>
                      {renderSections(
                        page,
                        pageIndex,
                        page.sections.left,
                        "left"
                      )}
                    </Grid>
                    <Grid item xs={12} md={6} className={sectionStyle}>
                      {renderSections(
                        page,
                        pageIndex,
                        page.sections.right,
                        "right"
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            );
          })}
        </TabContext>

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box pt=".5rem">
              <Typography>
                {date.format("lll")} / {"v"}
                {characterManager.state.character?.version} /{" "}
                {characterManager.state.character?.id.slice(0, 5)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {showCharacterCard && (
          <Grid container justifyContent="center">
            <Grid item xs>
              <Box pt=".5rem" ml="-.5rem">
                <CharacterCard
                  playerName=""
                  width="350px"
                  readonly={false}
                  characterSheet={characterManager.state.character}
                  onCharacterDialogOpen={() => undefined}
                  onRoll={props.onRoll}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }

  function renderSections(
    page: IPage,
    pageIndex: number,
    sections: Array<ISection> | undefined,
    sectionLocation: IPageSectionPosition
  ) {
    const numberOfSections = sections?.length ?? 0;
    const shouldRenderAddSectionButton = advanced && numberOfSections === 0;

    return (
      <>
        <Box py={numberOfSections === 0 ? "1rem" : undefined}>
          {sections?.map((section, sectionIndex) => {
            return (
              <Box key={section.id}>
                <SheetHeader
                  label={section.label}
                  currentPageIndex={currentPageIndex}
                  pages={characterManager.state.character?.pages}
                  sectionLocation={sectionLocation}
                  advanced={advanced}
                  visibleOnCard={section.visibleOnCard}
                  canMoveUp={sectionIndex !== 0}
                  canMoveDown={sectionIndex !== sections.length - 1}
                  onReposition={() => {
                    characterManager.actions.repositionSection(
                      pageIndex,
                      sectionLocation,
                      sectionIndex
                    );
                  }}
                  onMoveToPage={(newPageIndex) => {
                    characterManager.actions.moveSectionInPage(
                      pageIndex,
                      sectionLocation,
                      sectionIndex,
                      newPageIndex
                    );
                  }}
                  onToggleVisibleOnCard={() => {
                    characterManager.actions.toggleSectionVisibleOnCard(
                      pageIndex,
                      sectionLocation,
                      sectionIndex
                    );
                  }}
                  onDuplicateSection={() => {
                    characterManager.actions.duplicateSection(
                      pageIndex,
                      sectionLocation,
                      sectionIndex
                    );
                  }}
                  onLabelChange={(newLabel) => {
                    characterManager.actions.renameSection(
                      pageIndex,
                      sectionLocation,
                      sectionIndex,
                      newLabel
                    );
                  }}
                  onMoveDown={() => {
                    characterManager.actions.moveSection(
                      pageIndex,
                      sectionLocation,
                      sectionIndex,
                      "down"
                    );
                  }}
                  onMoveUp={() => {
                    characterManager.actions.moveSection(
                      pageIndex,
                      sectionLocation,
                      sectionIndex,
                      "up"
                    );
                  }}
                  onRemove={() => {
                    const confirmed = confirm(
                      t("character-dialog.remove-section-confirmation")
                    );
                    if (confirmed) {
                      characterManager.actions.removeSection(
                        pageIndex,
                        sectionLocation,
                        sectionIndex
                      );
                    }
                  }}
                />
                {renderSectionBlocks(
                  page,
                  pageIndex,
                  section,
                  sectionLocation,
                  sectionIndex
                )}

                {advanced && (
                  <Box p=".5rem" mb=".5rem">
                    <ThemeProvider theme={blackButtonTheme}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item>
                          <AddBlock
                            variant="button"
                            onAddBlock={(blockType) => {
                              characterManager.actions.addBlock(
                                pageIndex,
                                sectionLocation,
                                sectionIndex,
                                blockType
                              );
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <AddSection
                            onAddSection={() => {
                              characterManager.actions.addSection(
                                pageIndex,
                                sectionIndex,
                                sectionLocation
                              );
                            }}
                          />
                        </Grid>
                      </Grid>
                    </ThemeProvider>
                  </Box>
                )}
              </Box>
            );
          })}

          {shouldRenderAddSectionButton && (
            <Box>
              <ThemeProvider theme={blackButtonTheme}>
                <AddSection
                  onAddSection={() => {
                    characterManager.actions.addSection(
                      pageIndex,
                      0,
                      sectionLocation
                    );
                  }}
                />
              </ThemeProvider>
            </Box>
          )}
        </Box>
      </>
    );
  }

  function renderTopLevelActions() {
    if (props.readonly || !props.onSave) {
      return null;
    }

    return (
      <>
        <Grid
          container
          wrap="nowrap"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          {!props.readonly && (
            <Grid item container xs={12} sm={6}>
              <Grid item>
                <FormControlLabel
                  label={t("character-dialog.control.advanced-mode")}
                  control={
                    <Switch
                      color="primary"
                      data-cy="character-dialog.toggle-advanced"
                      checked={advanced}
                      onChange={handleOnToggleAdvancedMode}
                    />
                  }
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  label={t("character-dialog.control.wide-mode")}
                  control={
                    <Switch
                      color="primary"
                      data-cy="character-dialog.toggle-wide"
                      checked={characterManager.state.character?.wide ?? false}
                      onChange={() => {
                        characterManager.actions.toggleWideMode();
                      }}
                    />
                  }
                />
              </Grid>
              <Grid item>
                {props.onToggleSync && (
                  <Grid item>
                    <FormControlLabel
                      label={t("character-dialog.control.stored")}
                      control={
                        <Switch
                          color="primary"
                          checked={props.synced ?? false}
                          readOnly={props.synced}
                          onChange={props.onToggleSync}
                        />
                      }
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sm={6}
            container
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            {!props.dialog && (
              <Grid item>
                <Tooltip title={t("character-dialog.print")}>
                  <IconButton
                    color="default"
                    data-cy="character-dialog.print"
                    size="small"
                    onClick={() => {
                      window.open(`/characters/${props.character?.id}/print`);
                    }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            {!props.dialog && (
              <>
                <Grid item>
                  <Tooltip title={t("character-dialog.export")}>
                    <IconButton
                      color="default"
                      data-cy="character-dialog.print"
                      size="small"
                      onClick={() => {
                        charactersManager.actions.exportEntity(
                          characterManager.state.character as ICharacter
                        );
                      }}
                    >
                      <ExportIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("character-dialog.export-as-template")}>
                    <IconButton
                      color="default"
                      data-cy="character-dialog.print"
                      size="small"
                      onClick={() => {
                        charactersManager.actions.exportEntityAsTemplate(
                          characterManager.state.character as ICharacter
                        );
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </>
            )}
            <Grid item>
              <Button
                color="primary"
                data-cy="character-dialog.save"
                data-cy-dirty={characterManager.state.dirty}
                variant={
                  characterManager.state.dirty ? "contained" : "outlined"
                }
                type="submit"
                endIcon={<SaveIcon />}
                onClick={onSave}
              >
                {t("character-dialog.save")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  function renderNameAndGroup() {
    return (
      <>
        <Box mb="1rem">
          <Grid container>
            <Grid
              item
              container
              sm={12}
              md={6}
              spacing={2}
              alignItems="flex-end"
            >
              <Grid
                item
                className={css({
                  label: "CharacterDialog-name",
                  flex: "0 0 auto",
                })}
              >
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
              <Grid
                item
                className={css({
                  label: "CharacterDialog-group",
                  flex: "0 0 auto",
                })}
              >
                <FateLabel>{t("character-dialog.group")}</FateLabel>
              </Grid>
              <Grid item xs>
                <LazyState
                  value={characterManager.state.character?.group}
                  delay={750}
                  onChange={(newGroup) => {
                    characterManager.actions.setGroup(newGroup);
                  }}
                  render={([lazyGroup, setLazyGroup]) => {
                    return (
                      <Autocomplete
                        freeSolo
                        options={charactersManager.state.groups.filter((g) => {
                          const currentGroup = lazyGroup?.toLowerCase() ?? "";
                          return g.toLowerCase().includes(currentGroup);
                        })}
                        value={lazyGroup ?? ""}
                        onChange={(event, newInputValue) => {
                          setLazyGroup(newInputValue || undefined);
                        }}
                        inputValue={lazyGroup ?? ""}
                        onInputChange={(event, newInputValue) => {
                          setLazyGroup(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                              classes: {
                                input: css({ paddingBottom: "0 !important" }),
                              },
                            }}
                            data-cy={`character-dialog.group`}
                            disabled={props.readonly}
                            className={css({
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            })}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>

            {props.dialog && (
              <IconButton
                size="small"
                data-cy="character-dialog.close"
                className={css({
                  label: "CharacterDialog-dialog-close",
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

  function renderSectionBlocks(
    page: IPage,
    pageIndex: number,
    section: ISection,
    sectionLocation: IPageSectionPosition,
    sectionIndex: number
  ) {
    const dragAndDropKey = `${page.label}.${pageIndex}.${section.label}.${sectionIndex}`;
    return (
      <>
        <Box
          className={css({
            marginTop: section.blocks.length === 0 ? "2rem" : ".5rem",
            marginBottom: section.blocks.length === 0 ? "2rem" : ".5rem",
          })}
        >
          <Grid container>
            {section.blocks.map((block, blockIndex) => {
              const width: GridSize = !!block.meta.width
                ? (Math.round(block.meta.width * 12) as GridSize)
                : 12;
              return (
                <Grid key={block.id} item xs={width}>
                  <BetterDnd
                    direction="vertical"
                    index={blockIndex}
                    type={dragAndDropKey}
                    className={css({
                      label: "CharacterDialog-block-dnd",
                      marginLeft: ".5rem",
                      marginRight: ".5rem",
                    })}
                    onMove={(dragIndex, hoverIndex) => {
                      characterManager.actions.moveDnDBlock(
                        pageIndex,
                        sectionLocation,
                        sectionIndex,
                        dragIndex,
                        hoverIndex
                      );
                    }}
                    render={(dndRenderProps) => {
                      return (
                        <Box>
                          <Grid container wrap="nowrap">
                            {advanced && (
                              <Grid item>
                                <div ref={dndRenderProps.drag}>
                                  <Tooltip
                                    title={t("character-dialog.control.move")}
                                  >
                                    <IconButton size="small">
                                      <DragIndicatorIcon
                                        className={css({
                                          transition: theme.transitions.create([
                                            "color",
                                          ]),
                                          display: dndRenderProps.isDragging
                                            ? "none"
                                            : "block",
                                          cursor: "move",
                                        })}
                                        htmlColor={
                                          dndRenderProps.isOver
                                            ? theme.palette.text.primary
                                            : theme.palette.text.secondary
                                        }
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                                <Box display="flex" justifyContent="center">
                                  <Tooltip
                                    title={t(
                                      "character-dialog.control.duplicate"
                                    )}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        characterManager.actions.duplicateBlock(
                                          pageIndex,
                                          sectionLocation,
                                          sectionIndex,
                                          blockIndex
                                        );
                                      }}
                                    >
                                      <FileCopyIcon
                                        className={css({
                                          width: "1rem",
                                          height: "1rem",
                                          transition: theme.transitions.create([
                                            "color",
                                          ]),
                                        })}
                                        htmlColor={
                                          dndRenderProps.isOver
                                            ? theme.palette.text.primary
                                            : theme.palette.text.secondary
                                        }
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Box>

                                <Box display="flex" justifyContent="center">
                                  <Tooltip
                                    title={t(
                                      "character-dialog.control.remove-block"
                                    )}
                                  >
                                    <IconButton
                                      size="small"
                                      data-cy={`character-dialog.${section.label}.${block.label}.remove`}
                                      onClick={() => {
                                        characterManager.actions.removeBlock(
                                          pageIndex,
                                          sectionLocation,
                                          sectionIndex,
                                          blockIndex
                                        );
                                      }}
                                    >
                                      <DeleteIcon
                                        className={css({
                                          width: "1rem",
                                          height: "1rem",
                                          transition: theme.transitions.create([
                                            "color",
                                          ]),
                                        })}
                                        htmlColor={
                                          dndRenderProps.isOver
                                            ? theme.palette.text.primary
                                            : theme.palette.text.secondary
                                        }
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Grid>
                            )}
                            <Grid item xs>
                              <Box
                                className={cx(
                                  css({
                                    label: "CharacterDialog-block",
                                    marginTop: "4px",
                                    marginBottom: "4px",
                                    marginLeft: ".5rem",
                                    marginRight: ".5rem",
                                  }),
                                  advanced &&
                                    css({
                                      padding: ".5rem",
                                      transition: theme.transitions.create([
                                        "border",
                                      ]),
                                      border: `1px solid ${
                                        dndRenderProps.isOver
                                          ? theme.palette.text.secondary
                                          : theme.palette.divider
                                      }`,
                                      borderRadius: "4px",
                                    })
                                )}
                              >
                                <BlockByType
                                  advanced={advanced}
                                  readonly={props.readonly}
                                  dataCy={`character-dialog.${section.label}.${block.label}`}
                                  block={block}
                                  onChange={(newBlock) => {
                                    characterManager.actions.setBlock(
                                      pageIndex,
                                      sectionLocation,
                                      sectionIndex,
                                      blockIndex,
                                      newBlock
                                    );
                                  }}
                                  onToggleSplit={() => {
                                    const shouldUseHalfWidth =
                                      block.meta.width == null ||
                                      block.meta.width === 1;
                                    const newWidth = shouldUseHalfWidth
                                      ? 0.5
                                      : 1;

                                    characterManager.actions.setBlockMeta(
                                      pageIndex,
                                      sectionLocation,
                                      sectionIndex,
                                      blockIndex,
                                      {
                                        ...block.meta,
                                        width: newWidth,
                                      }
                                    );
                                  }}
                                  onMainPointCounterChange={() => {
                                    characterManager.actions.toggleBlockMainPointCounter(
                                      block.id
                                    );
                                  }}
                                  onRoll={(diceRollResult) => {
                                    props.onRoll(diceRollResult);
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </>
    );
  }
};
CharacterV3Dialog.displayName = "CharacterV3Dialog";
