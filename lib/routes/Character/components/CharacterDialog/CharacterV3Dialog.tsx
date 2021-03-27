import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";
import Switch from "@material-ui/core/Switch";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import PrintIcon from "@material-ui/icons/Print";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import Alert from "@material-ui/lab/Alert";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useContext, useEffect, useState } from "react";
import { Prompt } from "react-router";
import { AppLink } from "../../../../components/AppLink/AppLink";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../components/FateLabel/FateLabel";
import { CharacterCard } from "../../../../components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { SlideUpTransition } from "../../../../components/SlideUpTransition/SlideUpTransition";
import { CharactersContext } from "../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import {
  CharacterTemplates,
  CharacterTemplatesWithGroups,
  getTemplateInfo,
} from "../../../../domains/character/CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPage,
  ISection,
  Position,
} from "../../../../domains/character/types";
import { getDayJSFrom } from "../../../../domains/dayjs/getDayJS";
import { useQuery } from "../../../../hooks/useQuery/useQuery";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { ITranslationKeys } from "../../../../locale";
import { useCharacter } from "../../hooks/useCharacter";
import { BetterDnd } from "../BetterDnD/BetterDnd";
import { AddBlock } from "./components/AddBlock";
import { AddSection } from "./components/AddSection";
import {
  BlockDicePool,
  BlockDicePoolActions,
  IDicePool,
  IDicePoolElement,
} from "./components/blocks/BlockDicePool";
import {
  BlockNumeric,
  BlockNumericActions,
} from "./components/blocks/BlockNumeric";
import {
  BlockPointCounter,
  BlockPointCounterActions,
} from "./components/blocks/BlockPointCounter";
import { BlockSkill, BlockSkillActions } from "./components/blocks/BlockSkill";
import { BlockSlotTracker } from "./components/blocks/BlockSlotTracker";
import { BlockText, BlockTextActions } from "./components/blocks/BlockText";
import { SheetHeader } from "./components/SheetHeader";

export const smallIconButtonStyle = css({
  label: "CharacterDialog-small-icon-button",
  padding: "0",
});

const HeaderHelpLinks: Record<string, string> = {
  "aspects": "/srds/condensed/getting-started?goTo=aspects",
  "stunts & extras": "/srds/condensed/getting-started?goTo=stunts",
  "stunts": "/srds/condensed/getting-started?goTo=stunts",
  "approaches":
    "/srds/accelerated/how-to-do-stuff-outcomes-actions-and-approaches?goTo=choose-your-approach",
  "refresh": "/srds/condensed/getting-started?goTo=refresh",
  "stress": "/srds/condensed/challenges-conflicts-and-contests?goTo=stress",
  "consequences":
    "/srds/condensed/challenges-conflicts-and-contests?goTo=consequences-1",
  "skills": "/srds/condensed/getting-started?goTo=skill-list",
  "fate points":
    "/srds/condensed/aspects-and-fate-points?goTo=aspects-and-fate-points",
};

export const CharacterV3Dialog: React.FC<{
  open: boolean;
  character: ICharacter | undefined;
  readonly?: boolean;
  dialog: boolean;
  pool: IDicePool;

  synced?: boolean;

  onPoolClick(element: IDicePoolElement): void;
  onClose?(): void;
  onSave?(newCharacter: ICharacter): void;
  onToggleSync?(): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const query = useQuery<"card">();
  const showCharacterCard = query.get("card") === "true";
  const logger = useLogger();
  const characterManager = useCharacter(props.character);
  const [advanced, setAdvanced] = useState(false);
  const [savedSnack, setSavedSnack] = useState(false);
  const charactersManager = useContext(CharactersContext);
  const date = getDayJSFrom(characterManager.state.character?.lastUpdated);

  const headerColor = theme.palette.background.paper;
  const headerBackgroundColor = useTextColors(theme.palette.background.paper)
    .primary;

  const [tab, setTab] = useState<string>("0");
  const currentPageIndex = parseInt(tab);

  const characterTemplateInfo = getTemplateInfo(
    characterManager.state.character?.template
  );

  function onSave() {
    const updatedCharacter = characterManager.actions.getCharacterWithNewTimestamp();
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
        setAdvanced(false);
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
    if (props.dialog && characterManager.state.character) {
      return (
        <Dialog
          open={props.open}
          fullWidth
          keepMounted={false}
          maxWidth="md"
          scroll="paper"
          onClose={onClose}
          TransitionComponent={SlideUpTransition}
        >
          <DialogTitle
            className={css({
              label: "CharacterDialog-dialog-wrapper",
              padding: "0",
            })}
          >
            <Container maxWidth="md">
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
            <Container maxWidth="md">
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
            <Container maxWidth="md" className={css({ padding: ".5rem" })}>
              <Box className={dialogSheetContentStyle}>
                {renderTopLevelActions()}
              </Box>
            </Container>
          </DialogActions>
        </Dialog>
      );
    }

    return (
      <Container maxWidth="md">
        <Box className={fullScreenSheetContentStyle}>
          {renderTopLevelActions()}
        </Box>
        <Box className={fullScreenSheetContentStyle}>
          {renderManagementActions()}
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

  function renderManagementActions() {
    return (
      <Collapse in={advanced}>
        <Box>
          <Grid
            container
            wrap="nowrap"
            spacing={2}
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <InputLabel> {t("character-dialog.load-template")}</InputLabel>
            </Grid>
            <Grid item>
              <Autocomplete
                size="small"
                autoHighlight
                filterOptions={createFilterOptions({ limit: 100 })}
                options={CharacterTemplatesWithGroups}
                className={css({ width: "300px" })}
                getOptionLabel={(option) =>
                  t(
                    `character-dialog.template.${option.template}` as ITranslationKeys
                  )
                }
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
                    data-cy={`character-dialog.template`}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    );
  }

  function renderPages(pages: Array<IPage> | undefined) {
    if (!pages) {
      return null;
    }

    return (
      <Box>
        <Box mb="1rem">
          <Grid
            container
            alignItems="center"
            wrap="nowrap"
            justify="flex-start"
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
                        color: headerColor,
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
                    characterManager.actions.addPage(currentPageIndex);
                    const newTab =
                      characterManager.state.character?.pages.length ?? 0;
                    setTab(newTab.toString());
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>
        <Collapse in={advanced}>
          <Box mb=".5rem">
            <Grid container justify="space-around" alignItems="center">
              <Grid item>
                <IconButton
                  disabled={currentPageIndex === 0}
                  onClick={() => {
                    characterManager.actions.movePage(currentPageIndex, "up");
                    setTab((currentPageIndex - 1).toString());
                  }}
                >
                  <UndoIcon />
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
                <Box position="relative" mb="3rem">
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} className={sectionStyle}>
                      {renderSections(pageIndex, page.sections, Position.Left)}
                    </Grid>
                    <Grid item xs={12} md={6} className={sectionStyle}>
                      {renderSections(pageIndex, page.sections, Position.Right)}
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            );
          })}
        </TabContext>

        <Grid container justify="space-between" alignItems="center">
          {characterTemplateInfo?.author && (
            <Grid item>
              <Box pt=".5rem">
                <AppLink
                  to={characterTemplateInfo.author?.link}
                  target="_blank"
                >
                  {t(
                    `character-dialog.template.${characterManager.state.character?.template}` as ITranslationKeys
                  )}{" "}
                  ({characterTemplateInfo.author?.name})
                </AppLink>
              </Box>
            </Grid>
          )}
          <Grid item>
            <Box pt=".5rem">
              <Typography>{date.format("lll")}</Typography>
            </Box>
          </Grid>
        </Grid>
        {showCharacterCard && (
          <Grid container justify="center">
            <Grid item xs>
              <Box pt=".5rem" ml="-.5rem">
                <CharacterCard
                  playerName=""
                  width="350px"
                  readonly={false}
                  characterSheet={characterManager.state.character}
                  onCharacterDialogOpen={() => undefined}
                  pool={props.pool}
                  onPoolClick={props.onPoolClick}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }

  function renderSections(
    pageIndex: number,
    sections: Array<ISection> | undefined,
    position: Position
  ) {
    const numberOfSections =
      sections?.filter((s) => s.position === position).length ?? 0;
    const shouldRenderAddSectionButton = advanced && numberOfSections === 0;

    return (
      <>
        <Box py={numberOfSections === 0 ? "1rem" : undefined}>
          {sections?.map((section, sectionIndex) => {
            if (section.position !== position) {
              return null;
            }

            const helpLink = characterTemplateInfo?.isFate
              ? HeaderHelpLinks[section.label.toLowerCase()]
              : undefined;

            return (
              <Box key={section.id}>
                <SheetHeader
                  label={section.label}
                  currentPageIndex={currentPageIndex}
                  pages={characterManager.state.character?.pages}
                  position={section.position}
                  helpLink={helpLink}
                  advanced={advanced}
                  visibleOnCard={section.visibleOnCard}
                  onReposition={(newPosition) => {
                    characterManager.actions.repositionSection(
                      pageIndex,
                      sectionIndex,
                      newPosition
                    );
                  }}
                  onMoveToPage={(newPageIndex) => {
                    characterManager.actions.moveSectionInPage(
                      pageIndex,
                      sectionIndex,
                      newPageIndex
                    );
                  }}
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
                    const confirmed = confirm(
                      t("character-dialog.remove-section-confirmation")
                    );
                    if (confirmed) {
                      characterManager.actions.removeSection(
                        pageIndex,
                        sectionIndex
                      );
                    }
                  }}
                />
                {renderSectionBlocks(pageIndex, sectionIndex, section)}

                {advanced && (
                  <Box p=".5rem" mb=".5rem">
                    <Grid container justify="center" alignItems="center">
                      <Grid item>
                        <AddBlock
                          onAddBlock={(blockType) => {
                            characterManager.actions.addBlock(
                              pageIndex,
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
                              position
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            );
          })}

          {shouldRenderAddSectionButton && (
            <Box>
              <AddSection
                onAddSection={() => {
                  characterManager.actions.addSection(pageIndex, 0, position);
                }}
              />
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
          justify="space-between"
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
                {props.onToggleSync && (
                  <Grid item>
                    <FormControlLabel
                      label={t("character-dialog.control.sync")}
                      control={
                        <Switch
                          color="primary"
                          checked={props.synced ?? false}
                          disabled={props.synced}
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
            justify="flex-end"
            spacing={2}
          >
            {!props.dialog && (
              <Grid item>
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
              </Grid>
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
    pageIndex: number,
    sectionIndex: number,
    section: ISection
  ) {
    return (
      <>
        <Box
          className={css({
            label: "CharacterDialog-sections",
            marginTop: section.blocks.length === 0 ? "2rem" : ".5rem",
            marginBottom: section.blocks.length === 0 ? "2rem" : ".5rem",
          })}
        >
          {section.blocks.map((block, blockIndex) => {
            return (
              <Box key={block.id}>
                <BetterDnd
                  index={blockIndex}
                  type={section.label}
                  readonly={!advanced}
                  className={css({
                    label: "CharacterDialog-block-dnd",
                    marginLeft: ".5rem",
                    marginRight: ".5rem",
                  })}
                  dragIndicatorClassName={css({
                    label: "CharacterDialog-block-dnd-drag",
                    marginTop: ".5rem",
                  })}
                  onMove={(dragIndex, hoverIndex) => {
                    characterManager.actions.moveDnDBlock(
                      pageIndex,
                      sectionIndex,
                      dragIndex,
                      hoverIndex
                    );
                  }}
                >
                  <Box
                    className={css({
                      label: "CharacterDialog-block",
                      marginTop: ".2rem",
                      marginBottom: ".2rem",
                      marginLeft: ".5rem",
                      marginRight: ".5rem",
                    })}
                  >
                    {block.type === BlockType.Text && (
                      <BlockText
                        advanced={advanced}
                        readonly={props.readonly}
                        pageIndex={pageIndex}
                        sectionIndex={sectionIndex}
                        section={section}
                        block={block}
                        blockIndex={blockIndex}
                        onLabelChange={(value) => {
                          characterManager.actions.setBlockLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onValueChange={(value) => {
                          characterManager.actions.setBlockValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onMetaChange={(meta) => {
                          characterManager.actions.setBlockMeta(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            meta
                          );
                        }}
                      />
                    )}
                    {block.type === BlockType.Numeric && (
                      <BlockNumeric
                        advanced={advanced}
                        readonly={props.readonly}
                        pageIndex={pageIndex}
                        sectionIndex={sectionIndex}
                        section={section}
                        block={block}
                        blockIndex={blockIndex}
                        onLabelChange={(value) => {
                          characterManager.actions.setBlockLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onValueChange={(value) => {
                          characterManager.actions.setBlockValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onMetaChange={(meta) => {
                          characterManager.actions.setBlockMeta(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            meta
                          );
                        }}
                      />
                    )}
                    {block.type === BlockType.Skill && (
                      <BlockSkill
                        advanced={advanced}
                        readonly={props.readonly}
                        pageIndex={pageIndex}
                        sectionIndex={sectionIndex}
                        section={section}
                        block={block}
                        blockIndex={blockIndex}
                        onLabelChange={(value) => {
                          characterManager.actions.setBlockLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onValueChange={(value) => {
                          characterManager.actions.setBlockValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onMetaChange={(meta) => {
                          characterManager.actions.setBlockMeta(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            meta
                          );
                        }}
                        pool={props.pool}
                        onPoolClick={(element) => {
                          props.onPoolClick(element);
                        }}
                      />
                    )}
                    {block.type === BlockType.DicePool && (
                      <BlockDicePool
                        advanced={advanced}
                        readonly={props.readonly}
                        pageIndex={pageIndex}
                        sectionIndex={sectionIndex}
                        section={section}
                        block={block}
                        blockIndex={blockIndex}
                        onLabelChange={(value) => {
                          characterManager.actions.setBlockLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onValueChange={(value) => {
                          characterManager.actions.setBlockValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onMetaChange={(meta) => {
                          characterManager.actions.setBlockMeta(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            meta
                          );
                        }}
                        pool={props.pool}
                        onPoolClick={(element) => {
                          props.onPoolClick(element);
                        }}
                      />
                    )}
                    {block.type === BlockType.PointCounter && (
                      <BlockPointCounter
                        advanced={advanced}
                        readonly={props.readonly}
                        pageIndex={pageIndex}
                        sectionIndex={sectionIndex}
                        section={section}
                        block={block}
                        blockIndex={blockIndex}
                        onLabelChange={(value) => {
                          characterManager.actions.setBlockLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onValueChange={(value) => {
                          characterManager.actions.setBlockValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onMetaChange={(meta) => {
                          characterManager.actions.setBlockMeta(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            meta
                          );
                        }}
                      />
                    )}

                    {block.type === BlockType.SlotTracker && (
                      <BlockSlotTracker
                        advanced={advanced}
                        readonly={props.readonly}
                        pageIndex={pageIndex}
                        sectionIndex={sectionIndex}
                        section={section}
                        block={block}
                        blockIndex={blockIndex}
                        onLabelChange={(value) => {
                          characterManager.actions.setBlockLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onValueChange={(value) => {
                          characterManager.actions.setBlockValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            value
                          );
                        }}
                        onMetaChange={(meta) => {
                          characterManager.actions.setBlockMeta(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            meta
                          );
                        }}
                        onAddBox={() => {
                          characterManager.actions.addBlockBox(
                            pageIndex,
                            sectionIndex,
                            blockIndex
                          );
                        }}
                        onRemoveBox={() => {
                          characterManager.actions.removeBlockBox(
                            pageIndex,
                            sectionIndex,
                            blockIndex
                          );
                        }}
                        onToggleBox={(boxIndex) => {
                          characterManager.actions.toggleCheckboxFieldValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            boxIndex
                          );
                        }}
                        onBoxLabelChange={(boxIndex, value) => {
                          characterManager.actions.setBlockBoxLabel(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
                            boxIndex,
                            value
                          );
                        }}
                      />
                    )}
                    {advanced &&
                      renderBlockAdvancedOptions(
                        pageIndex,
                        sectionIndex,
                        section,
                        block,
                        blockIndex
                      )}
                    {renderBlockHelpText(
                      pageIndex,
                      sectionIndex,
                      section,
                      block,
                      blockIndex
                    )}
                  </Box>
                </BetterDnd>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }

  function renderBlockAdvancedOptions(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock,
    blockIndex: number
  ) {
    return (
      <Grid container justify="flex-end" spacing={1}>
        {block.type === BlockType.PointCounter && (
          <BlockPointCounterActions
            pageIndex={pageIndex}
            sectionIndex={sectionIndex}
            section={section}
            block={block}
            blockIndex={blockIndex}
            onMetaChange={(meta) => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                meta
              );
            }}
            toggleBlockMainPointCounter={() => {
              characterManager.actions.toggleBlockMainPointCounter(block.id);
            }}
          />
        )}
        {block.type === BlockType.Text && (
          <BlockTextActions
            pageIndex={pageIndex}
            sectionIndex={sectionIndex}
            section={section}
            block={block}
            blockIndex={blockIndex}
            onMetaChange={(meta) => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                meta
              );
            }}
          />
        )}
        {block.type === BlockType.Numeric && (
          <BlockNumericActions
            pageIndex={pageIndex}
            sectionIndex={sectionIndex}
            section={section}
            block={block}
            blockIndex={blockIndex}
            onMetaChange={(meta) => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                meta
              );
            }}
          />
        )}

        {block.type === BlockType.Skill && (
          <BlockSkillActions
            pageIndex={pageIndex}
            sectionIndex={sectionIndex}
            section={section}
            block={block}
            blockIndex={blockIndex}
            onMetaChange={(meta) => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                meta
              );
            }}
          />
        )}
        {block.type === BlockType.DicePool && (
          <BlockDicePoolActions
            pageIndex={pageIndex}
            sectionIndex={sectionIndex}
            section={section}
            block={block}
            blockIndex={blockIndex}
            onMetaChange={(meta) => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                meta
              );
            }}
          />
        )}

        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              label: "CharacterDialog-duplicate",
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              characterManager.actions.duplicateBlock(
                pageIndex,
                sectionIndex,
                block,
                blockIndex
              );
            }}
          >
            {t("character-dialog.control.duplicate")}
          </Link>
        </Grid>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              label: "CharacterDialog-remove",
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              characterManager.actions.removeBlock(
                pageIndex,
                sectionIndex,
                blockIndex
              );
            }}
          >
            {t("character-dialog.control.remove-block")}
          </Link>
        </Grid>
      </Grid>
    );
  }

  function renderBlockHelpText(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock,
    blockIndex: number
  ) {
    if (!advanced && !block.meta.helperText) {
      return null;
    }
    return (
      <Box>
        <Grid container alignItems="flex-start" wrap="nowrap">
          {advanced && (
            <Grid item>
              <FormHelperText className={css({ paddingRight: ".2rem" })}>
                {t("character-dialog.helper-text.help")}
              </FormHelperText>
            </Grid>
          )}

          <Grid item xs>
            {" "}
            <FormHelperText>
              <ContentEditable
                readonly={!advanced}
                border={advanced}
                data-cy={`character-dialog.${section.label}.${block.label}.helper-text`}
                value={block.meta.helperText ?? ""}
                onChange={(newHelpText) => {
                  characterManager.actions.setBlockMeta(
                    pageIndex,
                    sectionIndex,
                    blockIndex,
                    { ...block.meta, helperText: newHelpText }
                  );
                }}
              />
            </FormHelperText>
          </Grid>
        </Grid>
      </Box>
    );
  }
};
CharacterV3Dialog.displayName = "CharacterV3Dialog";
