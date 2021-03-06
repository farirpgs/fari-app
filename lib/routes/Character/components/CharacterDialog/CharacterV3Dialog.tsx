import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useContext, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../components/FateLabel/FateLabel";
import { CharacterCard } from "../../../../components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { SlideUpTransition } from "../../../../components/SlideUpTransition/SlideUpTransition";
import { CharactersContext } from "../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterType } from "../../../../domains/character/CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPage,
  IPointCounterBlock,
  ISection,
  ISkillBlock,
  ITextBlock,
  Position,
} from "../../../../domains/character/types";
import { getDayJSFrom } from "../../../../domains/dayjs/getDayJS";
import {
  IDiceCommandNames,
  IDiceRollWithBonus,
  IRollDiceOptions,
} from "../../../../domains/dice/Dice";
import { useQuery } from "../../../../hooks/useQuery/useQuery";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { IPossibleTranslationKeys } from "../../../../services/internationalization/IPossibleTranslationKeys";
import { useCharacter } from "../../hooks/useCharacter";
import { BetterDnd } from "../BetterDnD/BetterDnd";
import { AddBlock } from "./components/AddBlock";
import { AddSection } from "./components/AddSection";
import { BlockPointCounter } from "./components/blocks/BlockPointCounter";
import { BlockRichText } from "./components/blocks/BlockRichText";
import { BlockSkill } from "./components/blocks/BlockSkill";
import { BlockSlotTracker } from "./components/blocks/BlockSlotTracker";
import { BlockText } from "./components/blocks/BlockText";
import { DiceMenuForCharacterSheet } from "./components/DiceMenuForCharacterSheet";
import { SheetHeader } from "./components/SheetHeader";

export const smallIconButtonStyle = css({
  padding: "0",
});

const HeaderHelpLinks: Record<string, string> = {
  "Aspects": "/srds/condensed/getting-started?goTo=aspects",
  "Stunts & Extras": "/srds/condensed/getting-started?goTo=stunts",
  "Refresh": "/srds/condensed/getting-started?goTo=refresh",
  "Stress": "/srds/condensed/challenges-conflicts-and-contests?goTo=stress",
  "Consequences":
    "/srds/condensed/challenges-conflicts-and-contests?goTo=consequences-1",
  "Skills": "/srds/condensed/getting-started?goTo=skill-list",
  "Dice":
    "/srds/condensed/taking-action-rolling-the-dice?goTo=taking-action-rolling-the-dice",
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
  onSkillClick(
    options: IRollDiceOptions,
    commands: Array<IDiceCommandNames> | undefined
  ): void;
  onClose?(): void;
  onSave?(newCharacter: ICharacter): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const query = useQuery<"card">();
  const showCharacterCard = query.get("card") === "true";
  const logger = useLogger();
  const characterManager = useCharacter(props.character);
  const [advanced, setAdvanced] = useState(false);
  const [savedSnack, setSavedSnack] = useState(false);
  const [template, setTemplate] = useState(CharacterType.CoreCondensed);
  const charactersManager = useContext(CharactersContext);
  const date = getDayJSFrom(characterManager.state.character?.lastUpdated);

  const headerBackgroundColors = useTextColors(theme.palette.background.paper);

  const [tab, setTab] = useState<string>("0");
  const currentPageIndex = parseInt(tab);

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
      setAdvanced(false);
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
    padding: ".5rem 1.5rem",
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
        <Box className={sheetContentStyle}>{renderActions()}</Box>
        <Box className={sheetContentStyle}>{renderManagementActions()}</Box>
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
          <Grid container wrap="nowrap" spacing={2} justify="flex-start">
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
    if (!pages) {
      return null;
    }
    return (
      <Box>
        <Box mb="1rem">
          <Grid container alignItems="center" wrap="nowrap">
            <Grid item xs>
              <Tabs
                value={tab}
                variant="scrollable"
                scrollButtons="auto"
                classes={{
                  root: css({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }),
                  indicator: css({
                    background: theme.palette.primary.main,
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
                      value={pageIndex.toString()}
                      label={
                        <ContentEditable
                          clickable
                          value={page.label}
                          readonly={!advanced}
                          border={advanced}
                          onChange={(newValue) => {
                            characterManager.actions.renamePage(
                              pageIndex,
                              newValue
                            );
                          }}
                        />
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
                    characterManager.actions.removePage(currentPageIndex);
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
              borderTop: `2px solid ${headerBackgroundColors.primary}`,
              borderLeft: `2px solid ${headerBackgroundColors.primary}`,
              borderRight: `2px solid ${headerBackgroundColors.primary}`,
              borderBottom: `2px solid ${headerBackgroundColors.primary}`,
            });
            return (
              <TabPanel
                key={page.id}
                value={pageIndex.toString()}
                className={css({ padding: "0" })}
              >
                <Box position="relative" mb="3rem">
                  <Grid container>
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

        <Grid container justify="center">
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
                  isMe={false}
                  playerName="..."
                  width="350px"
                  readonly={false}
                  characterSheet={characterManager.state.character}
                  onCharacterDialogOpen={() => undefined}
                  onRoll={() => undefined}
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
    const numberOfSections = sections?.filter((s) => s.position === position)
      .length;
    const shouldRenderAddSectionButton = advanced && numberOfSections === 0;

    return (
      <>
        {sections?.map((section, sectionIndex) => {
          if (section.position !== position) {
            return null;
          }

          const helpLink = HeaderHelpLinks[section.label];

          return (
            <Box key={section.id} py={!sections?.length ? ".5rem" : undefined}>
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
                  characterManager.actions.removeSection(
                    pageIndex,
                    sectionIndex
                  );
                }}
              />
              {renderSectionBlocks(pageIndex, sectionIndex, section)}

              <Collapse in={advanced}>
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
              </Collapse>
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
      </Grid>
    );
  }

  function renderName() {
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

  function renderSectionBlocks(
    pageIndex: number,
    sectionIndex: number,
    section: ISection
  ) {
    return (
      <>
        <Box
          className={css(sheetContentStyle, {
            padding: section.blocks.length === 0 ? "0" : undefined,
          })}
        >
          {section.blocks.map((block, blockIndex) => {
            return (
              <BetterDnd
                key={block.id}
                index={blockIndex}
                type={section.label}
                readonly={!advanced}
                onMove={(dragIndex, hoverIndex) => {
                  characterManager.actions.moveDnDBlock(
                    pageIndex,
                    sectionIndex,
                    dragIndex,
                    hoverIndex
                  );
                }}
              >
                <Box py=".5rem">
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
                  {block.type === BlockType.RichText && (
                    <BlockRichText
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
                      onSkillClick={(options, commands) => {
                        props.onSkillClick(options, commands);
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
                  {advanced && (
                    <Grid container justify="flex-end" spacing={1}>
                      {block.type === BlockType.PointCounter &&
                        renderPointCounterAdvancedMenu(
                          pageIndex,
                          sectionIndex,
                          section,
                          block,
                          blockIndex
                        )}
                      {block.type === BlockType.Text &&
                        renderTextAdvancedMenu(
                          pageIndex,
                          sectionIndex,
                          section,
                          block,
                          blockIndex
                        )}
                      {block.type === BlockType.Skill &&
                        renderSkillAdvancedMenu(
                          pageIndex,
                          sectionIndex,
                          section,
                          block,
                          blockIndex
                        )}
                      <Grid item>
                        <Link
                          component="button"
                          variant="caption"
                          className={css({
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
                          {"Duplicate"}
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link
                          component="button"
                          variant="caption"
                          className={css({
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
                          {t("character-dialog.control.remove-field")}
                        </Link>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </BetterDnd>
            );
          })}
        </Box>
      </>
    );
  }

  function renderPointCounterAdvancedMenu(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & IPointCounterBlock,
    blockIndex: number
  ) {
    return (
      <>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                {
                  ...block.meta,
                  isMainPointCounter: !block.meta.isMainPointCounter,
                } as IPointCounterBlock["meta"]
              );
            }}
          >
            {block.meta.isMainPointCounter ? "Unstar" : "Star"}
          </Link>
        </Grid>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                {
                  ...block.meta,
                  max: block.meta.max === undefined ? "1" : undefined,
                } as IPointCounterBlock["meta"]
              );
            }}
          >
            {block.meta.max === undefined ? "With Max" : "Without Max"}
          </Link>
        </Grid>
      </>
    );
  }

  function renderTextAdvancedMenu(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & ITextBlock,
    blockIndex: number
  ) {
    return (
      <>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                {
                  ...block.meta,
                  checked: block.meta.checked === undefined ? false : undefined,
                } as ITextBlock["meta"]
              );
            }}
          >
            {block.meta.checked === undefined ? "Add Toggle" : "Remove Toggle"}
          </Link>
        </Grid>
      </>
    );
  }

  function renderSkillAdvancedMenu(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & ISkillBlock,
    blockIndex: number
  ) {
    return (
      <>
        <Grid item>
          <DiceMenuForCharacterSheet
            commandIds={block.meta.commands || []}
            onChange={(newCommandIds) => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                {
                  ...block.meta,
                  commands: newCommandIds,
                } as ISkillBlock["meta"]
              );
            }}
          />
        </Grid>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            className={css({
              color: theme.palette.primary.main,
            })}
            onClick={() => {
              characterManager.actions.setBlockMeta(
                pageIndex,
                sectionIndex,
                blockIndex,
                {
                  ...block.meta,
                  checked: block.meta.checked === undefined ? false : undefined,
                } as ISkillBlock["meta"]
              );
            }}
          >
            {block.meta.checked === undefined ? "Add Toggle" : "Remove Toggle"}
          </Link>
        </Grid>
      </>
    );
  }
};
CharacterV3Dialog.displayName = "CharacterV3Dialog";
