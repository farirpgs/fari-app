import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import { ThemeProvider } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import ExposureIcon from "@material-ui/icons/Exposure";
import Filter1Icon from "@material-ui/icons/Filter1";
import FlipToBackIcon from "@material-ui/icons/FlipToBack";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import HelpIcon from "@material-ui/icons/Help";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RemoveIcon from "@material-ui/icons/Remove";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import SaveIcon from "@material-ui/icons/Save";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useContext, useState } from "react";
import { Prompt } from "react-router";
import {
  ContentEditable,
  sanitizeContentEditable,
} from "../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../components/FateLabel/FateLabel";
import { CharacterCard } from "../../../components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { SlideUpTransition } from "../../../components/SlideUpTransition/SlideUpTransition";
import { CharactersContext } from "../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";
import { CharacterType } from "../../../domains/character/CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPage,
  IPointCounterBlock,
  IRichTextBlock,
  ISection,
  ISkillBlock,
  ISlotTrackerBlock,
  ITextBlock,
  Position,
} from "../../../domains/character/types";
import { getDayJSFrom } from "../../../domains/dayjs/getDayJS";
import {
  IDiceRollWithBonus,
  IRollDiceOptions,
} from "../../../domains/dice/Dice";
import { Font } from "../../../domains/font/Font";
import { useButtonTheme } from "../../../hooks/useButtonTheme/useButtonTheme";
import { useQuery } from "../../../hooks/useQuery/useQuery";
import { useTextColors } from "../../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { RichTextEditor } from "../../../molecules/RichTextEditor/RichTextEditor";
import { IPossibleTranslationKeys } from "../../../services/internationalization/IPossibleTranslationKeys";
import { useCharacter } from "../hooks/useCharacter";
import { BetterDnd } from "./BetterDnd";
import { FateSkillsDescriptions } from "./domains/FateSkillsDescriptions";

const smallIconButtonStyle = css({
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
  onRoll?(options: IRollDiceOptions): void;
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
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <IconButton
                  disabled={currentPageIndex === 0}
                  onClick={() => {
                    characterManager.actions.movePage(currentPageIndex, "up");
                  }}
                >
                  <ArrowForwardIcon
                    className={css({
                      transform: "rotate(180deg)",
                    })}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  disabled={tab === "0"}
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
                  }}
                >
                  <ArrowForwardIcon />
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
                  {block.type === BlockType.Text &&
                    renderBlockText(
                      pageIndex,
                      sectionIndex,
                      section,
                      block,
                      blockIndex
                    )}
                  {block.type === BlockType.RichText &&
                    renderBlockRichText(
                      pageIndex,
                      sectionIndex,
                      section,
                      block,
                      blockIndex
                    )}
                  {block.type === BlockType.Skill &&
                    renderBlockSkill(
                      pageIndex,
                      sectionIndex,
                      section,
                      block,
                      blockIndex
                    )}
                  {block.type === BlockType.PointCounter &&
                    renderBlockPointCounter(
                      pageIndex,
                      sectionIndex,
                      section,
                      block,
                      blockIndex
                    )}
                  {block.type === BlockType.SlotTracker &&
                    renderBlockSlotTracker(
                      pageIndex,
                      sectionIndex,
                      section,
                      block,
                      blockIndex
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
                              block
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
                  isMainPointCounter: !block.meta?.isMainPointCounter,
                } as IPointCounterBlock["meta"]
              );
            }}
          >
            {block.meta?.isMainPointCounter ? "Unstar" : "Star"}
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
                  max: block.meta?.max === undefined ? "1" : undefined,
                } as IPointCounterBlock["meta"]
              );
            }}
          >
            {block.meta?.max === undefined ? "With Max" : "Without Max"}
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
                  checked:
                    block.meta?.checked === undefined ? false : undefined,
                } as ITextBlock["meta"]
              );
            }}
          >
            {block.meta?.checked === undefined ? "Add Toggle" : "Remove Toggle"}
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
                  checked:
                    block.meta?.checked === undefined ? false : undefined,
                } as ISkillBlock["meta"]
              );
            }}
          >
            {block.meta?.checked === undefined ? "Add Toggle" : "Remove Toggle"}
          </Link>
        </Grid>
      </>
    );
  }

  function renderBlockText(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & ITextBlock,
    blockIndex: number
  ) {
    const isLabelVisible = !!sanitizeContentEditable(block.label) || advanced;
    const isSlotTrackerVisible = block.meta?.checked !== undefined;

    return (
      <>
        {isLabelVisible && (
          <Box>
            <Grid container spacing={1} justify="space-between" wrap="nowrap">
              <Grid item xs>
                <FateLabel display="inline">
                  <ContentEditable
                    readonly={!advanced}
                    border={advanced}
                    data-cy={`character-dialog.${section.label}.${block.label}.label`}
                    value={block.label}
                    onChange={(value) => {
                      characterManager.actions.renameBlock(
                        pageIndex,
                        sectionIndex,
                        blockIndex,
                        value
                      );
                    }}
                  />
                </FateLabel>
              </Grid>
              {isSlotTrackerVisible && (
                <Grid item>
                  {renderBlockToggleMeta(
                    pageIndex,
                    sectionIndex,
                    section,
                    block,
                    blockIndex
                  )}
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        <Box>
          <Typography>
            <ContentEditable
              border
              data-cy={`character-dialog.${section.label}.${block.label}.value`}
              readonly={props.readonly}
              value={block.value}
              onChange={(value) => {
                characterManager.actions.setBlockValue(
                  pageIndex,
                  sectionIndex,
                  blockIndex,
                  value
                );
              }}
            />
          </Typography>
        </Box>
      </>
    );
  }

  function renderBlockToggleMeta(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & (ITextBlock | ISkillBlock),
    blockIndex: number
  ) {
    return (
      <Checkbox
        data-cy={`character-dialog.${section.label}.${block.label}.box.${blockIndex}.checked`}
        color="primary"
        size="small"
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon />}
        checked={block.meta?.checked}
        className={css({
          padding: "0",
        })}
        onChange={(event) => {
          if (props.readonly) {
            return;
          }
          characterManager.actions.setBlockMeta(
            pageIndex,
            sectionIndex,
            blockIndex,
            {
              ...block.meta,
              checked: !block.meta?.checked,
            } as ITextBlock["meta"]
          );
        }}
      />
    );
  }

  function renderBlockRichText(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & IRichTextBlock,
    blockIndex: number
  ) {
    return (
      <>
        <Box>
          <Grid container justify="space-between" wrap="nowrap" spacing={1}>
            <Grid item className={css({ flex: "1 1 auto" })}>
              <FateLabel display="inline">
                <ContentEditable
                  data-cy={`character-dialog.${section.label}.${block.label}.label`}
                  readonly={!advanced}
                  border={advanced}
                  value={block.label}
                  onChange={(value) => {
                    characterManager.actions.setBlockLabel(
                      pageIndex,
                      sectionIndex,
                      blockIndex,
                      value
                    );
                  }}
                />
              </FateLabel>
            </Grid>
          </Grid>
          <Box py=".5rem">
            <RichTextEditor
              value={block.value}
              onChange={(value) => {
                characterManager.actions.setBlockValue(
                  pageIndex,
                  sectionIndex,
                  blockIndex,
                  value
                );
              }}
            />
          </Box>
        </Box>
      </>
    );
  }

  function renderBlockSkill(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & ISkillBlock,
    blockIndex: number
  ) {
    const isSlotTrackerVisible = block.meta?.checked !== undefined;
    const skillDescription =
      FateSkillsDescriptions[block.label.toLowerCase()] ?? "";

    const skillLabel = (
      <FateLabel className={css({ display: "inline-block" })}>
        <ContentEditable
          data-cy={`character-dialog.${section.label}.${block.label}.label`}
          readonly={!advanced}
          border={advanced}
          value={block.label}
          onChange={(value) => {
            characterManager.actions.setBlockLabel(
              pageIndex,
              sectionIndex,
              blockIndex,
              value
            );
          }}
        />
      </FateLabel>
    );

    return (
      <>
        <Box>
          <Grid container spacing={1} alignItems="center" wrap="nowrap">
            <Grid item xs={2}>
              <CharacterCircleBox
                fontSize="1.2rem"
                onClick={() => {
                  const bonus = parseInt(block.value) || 0;
                  props.onRoll?.({ bonus, bonusLabel: block.label });
                }}
              >
                <ContentEditable
                  data-cy={`character-dialog.${section.label}.${block.label}.value`}
                  border={advanced}
                  readonly={!advanced}
                  value={block.value}
                  onChange={(value) => {
                    characterManager.actions.setBlockValue(
                      pageIndex,
                      sectionIndex,
                      blockIndex,
                      value
                    );
                  }}
                />
              </CharacterCircleBox>
            </Grid>
            <Grid item className={css({ flex: "1 0 auto" })}>
              {skillLabel}
              {!advanced && (
                <>
                  {skillDescription && (
                    <>
                      <Tooltip
                        placement="right-start"
                        classes={{
                          tooltip: css({
                            backgroundColor: theme.palette.background.paper,
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
                            <Typography>{skillDescription.long}</Typography>
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

            {isSlotTrackerVisible && (
              <Grid item>
                {renderBlockToggleMeta(
                  pageIndex,
                  sectionIndex,
                  section,
                  block,
                  blockIndex
                )}
              </Grid>
            )}
          </Grid>
        </Box>
      </>
    );
  }

  function renderBlockSlotTracker(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & ISlotTrackerBlock,
    blockIndex: number
  ) {
    return (
      <>
        <Box>
          <Grid container justify={"space-between"} wrap="nowrap" spacing={1}>
            <Grid item className={css({ flex: "1 1 auto" })}>
              <FateLabel
                display="inline"
                align={advanced ? "inherit" : "center"}
              >
                <ContentEditable
                  data-cy={`character-dialog.${section.label}.${block.label}.label`}
                  readonly={!advanced}
                  border={advanced}
                  value={block.label}
                  onChange={(value) => {
                    characterManager.actions.setBlockLabel(
                      pageIndex,
                      sectionIndex,
                      blockIndex,
                      value
                    );
                  }}
                />
              </FateLabel>
            </Grid>
            {advanced && (
              <>
                <Grid item>
                  <Tooltip title={t("character-dialog.control.remove-box")}>
                    <IconButton
                      size="small"
                      data-cy={`character-dialog.${section.label}.${block.label}.remove-box`}
                      onClick={() => {
                        characterManager.actions.removeCheckboxFieldValue(
                          pageIndex,
                          sectionIndex,
                          blockIndex
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
                      data-cy={`character-dialog.${section.label}.${block.label}.add-box`}
                      size="small"
                      onClick={() => {
                        characterManager.actions.addCheckboxFieldValue(
                          pageIndex,
                          sectionIndex,
                          blockIndex
                        );
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </>
            )}
          </Grid>

          <Grid container justify="center" spacing={1}>
            {block.value.map((box, boxIndex) => {
              return (
                <Grid item key={boxIndex}>
                  <Box
                    className={css({
                      display: "flex",
                      justifyContent: "center",
                    })}
                  >
                    <Checkbox
                      data-cy={`character-dialog.${section.label}.${block.label}.box.${boxIndex}.value`}
                      color="primary"
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      checked={box.checked}
                      onChange={(event) => {
                        if (props.readonly) {
                          return;
                        }
                        characterManager.actions.toggleCheckboxFieldValue(
                          pageIndex,
                          sectionIndex,
                          blockIndex,
                          boxIndex
                        );
                      }}
                    />
                  </Box>
                  <Box>
                    <FateLabel className={css({ textAlign: "center" })}>
                      <ContentEditable
                        data-cy={`character-dialog.${section.label}.${block.label}.box.${boxIndex}.label`}
                        readonly={!advanced}
                        border={advanced}
                        value={box.label}
                        onChange={(value) => {
                          characterManager.actions.renameCheckboxFieldValue(
                            pageIndex,
                            sectionIndex,
                            blockIndex,
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
      </>
    );
  }

  function renderBlockPointCounter(
    pageIndex: number,
    sectionIndex: number,
    section: ISection,
    block: IBlock & IPointCounterBlock,
    blockIndex: number
  ) {
    return (
      <>
        <Box>
          <Grid container justify={"space-between"} wrap="nowrap" spacing={1}>
            <Grid item className={css({ flex: "1 1 auto" })}>
              <FateLabel
                display="inline"
                className={css({
                  width: "100%",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingBottom: ".5rem",
                  display: "inline-block",
                })}
                align={"center"}
              >
                <ContentEditable
                  data-cy={`character-dialog.${section.label}.${block.label}.label`}
                  readonly={!advanced}
                  border={advanced}
                  value={block.label}
                  onChange={(value) => {
                    characterManager.actions.setBlockLabel(
                      pageIndex,
                      sectionIndex,
                      blockIndex,
                      value
                    );
                  }}
                />
              </FateLabel>
            </Grid>
          </Grid>

          <Grid
            container
            justify="center"
            alignItems="center"
            spacing={2}
            wrap="nowrap"
          >
            <Grid item>
              <IconButton
                onClick={() => {
                  const intValue = parseInt(block.value) || 0;
                  characterManager.actions.setBlockValue(
                    pageIndex,
                    sectionIndex,
                    blockIndex,
                    (intValue - 1).toString()
                  );
                }}
              >
                <RemoveCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <CharacterCircleBox fontSize="1.2rem" minWidth="4rem">
                <ContentEditable
                  data-cy={`character-dialog.${section.label}.${block.label}.value`}
                  value={block.value}
                  border
                  onChange={(current, e) => {
                    characterManager.actions.setBlockValue(
                      pageIndex,
                      sectionIndex,
                      blockIndex,
                      current
                    );
                  }}
                />
              </CharacterCircleBox>
            </Grid>
            {block.meta?.max !== undefined && (
              <>
                <Grid item>
                  <Typography
                    className={css({
                      fontSize: "2rem",
                      color: "#bdbdbd",
                      lineHeight: Font.lineHeight(2),
                    })}
                  >
                    {"/"}
                  </Typography>
                </Grid>
                <Grid item>
                  <CharacterCircleBox fontSize="1.2rem" minWidth="4rem">
                    <ContentEditable
                      data-cy={`character-dialog.${section.label}.${block.label}.value`}
                      value={block.meta?.max ?? ""}
                      border
                      onChange={(max, e) => {
                        characterManager.actions.setBlockMeta(
                          pageIndex,
                          sectionIndex,
                          blockIndex,
                          {
                            ...block.meta,
                            max: max,
                          } as IPointCounterBlock["meta"]
                        );
                      }}
                    />
                  </CharacterCircleBox>
                </Grid>
              </>
            )}
            <Grid item>
              <IconButton
                onClick={() => {
                  const intValue = parseInt(block.value) || 0;
                  characterManager.actions.setBlockValue(
                    pageIndex,
                    sectionIndex,
                    blockIndex,
                    (intValue + 1).toString()
                  );
                }}
              >
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
};
CharacterV3Dialog.displayName = "CharacterV3Dialog";

export const AddSection: React.FC<{
  onAddSection(): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const blackButtonTheme = useButtonTheme(theme.palette.text.primary);

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <ThemeProvider theme={blackButtonTheme}>
        <Button
          color="primary"
          variant="outlined"
          onClick={(e) => {
            props.onAddSection();
          }}
        >
          {t("character-dialog.control.add-section")}
        </Button>
      </ThemeProvider>
    </Box>
  );
};
AddSection.displayName = "AddSection";

export const AddBlock: React.FC<{
  onAddBlock(section: BlockType): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const blackButtonTheme = useButtonTheme(theme.palette.text.primary);
  const [anchorEl, setAnchorEl] = React.useState<any>();

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <ThemeProvider theme={blackButtonTheme}>
        <Button
          color="primary"
          variant="outlined"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          {t("character-dialog.control.add-block")}
        </Button>
        <Menu
          elevation={0}
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => {
            setAnchorEl(undefined);
          }}
        >
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.Text);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <TextFieldsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Text Section" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.RichText);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <FormatBoldIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Rich Text" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.Skill);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <Filter1Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Skill" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.PointCounter);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <ExposureIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Point Counter" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.SlotTracker);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Slot Tracker" />
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </Box>
  );
};
AddBlock.displayName = "AddBlock";

export const SheetHeader: React.FC<{
  label: string;
  currentPageIndex: number;
  position: Position;
  helpLink: string | undefined;
  pages: Array<IPage> | undefined;
  advanced: boolean;
  onLabelChange?: (newLabel: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReposition: (position: Position) => void;
  onMoveToPage: (pageIndex: number) => void;
  visibleOnCard?: boolean;
  onToggleVisibleOnCard?: () => void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const headerColor = theme.palette.background.paper;
  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const sheetHeader = css({
    background: headerBackgroundColors.primary,
    color: headerColor,
    width: "100%",
    padding: ".5rem",
  });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <FateLabel
            className={css({
              fontSize: "1.2rem",
            })}
          >
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
        {props.advanced && (
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

        {props.advanced && (
          <Grid item>
            <Tooltip title={"Move"}>
              <IconButton
                data-cy={`character-dialog.${props.label}.move`}
                size="small"
                className={smallIconButtonStyle}
                onClick={handleClick}
              >
                <FlipToBackIcon htmlColor={headerColor} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {props.advanced && (
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
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            props.onMoveUp();
          }}
        >
          <ListItemIcon>
            <ArrowUpwardIcon />
          </ListItemIcon>
          {"Move Up"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.onMoveDown();
          }}
        >
          {" "}
          <ListItemIcon>
            <ArrowDownwardIcon />
          </ListItemIcon>
          {"Move Down"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            const newPosition =
              props.position === Position.Left ? Position.Right : Position.Left;
            props.onReposition(newPosition);
          }}
        >
          <ListItemIcon>
            <ArrowForwardIcon
              className={css({
                transform:
                  props.position === Position.Left
                    ? undefined
                    : "rotate(180deg)",
              })}
            />
          </ListItemIcon>
          {props.position === Position.Left ? "Move Right" : "Move Left"}
        </MenuItem>
        {props.pages?.map((page, pageIndex) => {
          if (pageIndex === props.currentPageIndex) {
            return null;
          }
          return (
            <MenuItem
              key={page.id}
              onClick={() => {
                handleClose();
                props.onMoveToPage(pageIndex);
              }}
            >
              <ListItemIcon>
                <FlipToBackIcon />
              </ListItemIcon>
              {`Move To Page: ${page.label}`}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
SheetHeader.displayName = "SheetHeader";

export const CharacterCircleBox: React.FC<BoxProps> = (props) => {
  const { className, ...rest } = props;
  const theme = useTheme();
  return (
    <Box
      {...rest}
      className={cx(
        css({
          background: theme.palette.background.paper,
          color: theme.palette.getContrastText(theme.palette.background.paper),
          border: "2px solid #bdbdbd",
          borderRadius: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }),
        className
      )}
    >
      <Box p=".5rem" minWidth="50%" textAlign="center">
        {props.children}
      </Box>
    </Box>
  );
};
