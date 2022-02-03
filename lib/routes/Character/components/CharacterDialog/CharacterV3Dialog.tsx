import { css } from "@emotion/css";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ExportIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import RedoIcon from "@mui/icons-material/Redo";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import UndoIcon from "@mui/icons-material/Undo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Alert from "@mui/material/Alert";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid, { GridSize } from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../components/FateLabel/FateLabel";
import { CharacterCard } from "../../../../components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { env } from "../../../../constants/env";
import { CharactersContext } from "../../../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../../../contexts/InjectionsContext/hooks/useLogger";
import { SettingsContext } from "../../../../contexts/SettingsContext/SettingsContext";
import {
  CharacterTemplates,
  ICharacterTemplate,
} from "../../../../domains/character/CharacterType";
import {
  ICharacter,
  IPage,
  ISection,
} from "../../../../domains/character/types";
import { getDayJSFrom } from "../../../../domains/dayjs/getDayJS";
import { IDiceRollResult } from "../../../../domains/dice/Dice";
import { LazyState } from "../../../../hooks/useLazyState/useLazyState";
import { useQuery } from "../../../../hooks/useQuery/useQuery";
import { useTextColors } from "../../../../hooks/useTextColors/useTextColors";
import { useThemeFromColor } from "../../../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { useCharacter } from "../../hooks/useCharacter";
import { AddBlock } from "./components/AddBlock";
import { AddSection } from "./components/AddSection";
import { BlockByType } from "./components/BlockByType";
import { SheetHeader } from "./components/SheetHeader";

export const smallIconButtonStyle = css({
  label: "CharacterDialog-small-icon-button",
  padding: "0",
});

const ZoomOptions = [
  {
    label: "Full",
    value: 1,
  },
  {
    label: "Large",
    value: 0.9,
  },
  {
    label: "Medium",
    value: 0.8,
  },
  {
    label: "Small",
    value: 0.7,
  },
  {
    label: "Extra Small",
    value: 0.6,
  },
];

const borderSize = 2;
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
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const logger = useLogger();
  const characterManager = useCharacter(props.character);
  const settingsManager = useContext(SettingsContext);
  const [advanced, setAdvanced] = useState(defaultAdvanced);
  const [savedSnack, setSavedSnack] = useState(false);
  const charactersManager = useContext(CharactersContext);
  const date = getDayJSFrom(characterManager.state.character?.lastUpdated);

  const headerBackgroundColors = useTextColors(theme.palette.background.paper);
  const headerTextColors = useTextColors(headerBackgroundColors.primary);

  const [tab, setTab] = useState<string>("0");
  const currentPageIndex = parseInt(tab);

  function onSave() {
    const updatedCharacter =
      characterManager.actions.getCharacterWithNewTimestamp();
    props.onSave?.(updatedCharacter!);
    setSavedSnack(true);
    logger.track("character.save");
  }

  function handleOnToggleAdvancedMode() {
    setAdvanced((prev) => !prev);
    logger.track("character.toggle_advanced_mode");
  }

  function onLoadTemplate(newTemplate: ICharacterTemplate) {
    const confirmKey = t("character-dialog.load-template-confirmation");
    const confirmed = confirm(confirmKey);

    if (confirmed) {
      setTab("0");
      characterManager.actions.loadTemplate(newTemplate);
      setAdvanced(false);
      logger.track("character.load_template", { template: newTemplate });
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
    const shouldUseWideMode = characterManager.state.character?.wide;
    const maxWidth = shouldUseWideMode ? "lg" : "md";

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
                {renderSheetActions()}
              </Box>
            </Container>
          </DialogActions>
        </Dialog>
      );
    }

    return (
      <Container maxWidth={maxWidth}>
        <Box className={fullScreenSheetContentStyle}>
          {renderSheetActions()}
        </Box>

        <Box className={fullScreenSheetContentStyle}>
          {renderNameAndGroup()}
        </Box>
        <Box className={fullScreenSheetContentStyle}>
          {renderPages(characterManager.state.character?.pages)}
        </Box>

        {/* <Box className={fullScreenSheetContentStyle}>
          {renderSheetActions()}
        </Box> */}
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
            <InputLabel>
              {t("character-dialog.load-template")} ({CharacterTemplates.length}
              )
            </InputLabel>
          </Grid>
          <Grid item>
            <Autocomplete
              size="small"
              autoHighlight
              filterOptions={createFilterOptions({
                limit: 100,
                stringify: (option) => {
                  const templateName = option.fileName;
                  const groupName = option.category;
                  return `${templateName} ${groupName}`;
                },
              })}
              options={CharacterTemplates}
              className={css({ width: "300px" })}
              getOptionLabel={(option) => {
                return option.fileName;
              }}
              groupBy={(option) => option.category}
              onChange={(event, template) => {
                if (template?.importFunction) {
                  onLoadTemplate(template);
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
    const numberOfSections = pages
      .flatMap((p) => p.rows)
      .flatMap((r) => r.columns)
      .flatMap((c) => c.sections).length;
    const doesntHaveSections = numberOfSections === 0;
    const shouldRenderLoadTemplate = doesntHaveSections || advanced;
    const zoom = characterManager.state.character?.zoom ?? 1;

    return (
      <Box
        className={css({
          transform: `scale(${zoom})`,
          transformOrigin: `0 0`,
          width: `calc(100% / ${zoom})`,
        })}
      >
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
                    borderBottom: `4px solid ${headerBackgroundColors.primary}`,
                  }),
                  indicator: css({
                    display: "none",
                  }),
                }}
                onChange={(e, newValue) => {
                  setTab(newValue);
                }}
              >
                {pages?.map((page, pageIndex) => {
                  const isCurrentTab = pageIndex.toString() === tab;
                  return (
                    <Tab
                      disableRipple
                      key={page.id}
                      className={css({
                        background: headerBackgroundColors.primary,
                        color: `${headerTextColors.primary} !important`,
                        marginRight: ".5rem",
                        // Pentagone
                        // https://bennettfeely.com/clippy/
                        clipPath:
                          "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
                        borderBottom: `4px solid ${
                          isCurrentTab
                            ? theme.palette.secondary.main
                            : theme.palette.text.primary
                        }`,
                        transition: "border linear 200ms",
                        marginBottom: "-4px",
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
                            borderColor={headerTextColors.primary}
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
                <Tooltip title={t("character-dialog.control.add-page")}>
                  <span>
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
                  </span>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Box>
        <Collapse in={advanced}>
          <Box mb=".5rem">
            <Grid container justifyContent="space-around" alignItems="center">
              <Grid item>
                <Tooltip title={t("character-dialog.control.move-page-left")}>
                  <span>
                    <IconButton
                      disabled={currentPageIndex === 0}
                      onClick={() => {
                        characterManager.actions.movePage(
                          currentPageIndex,
                          "up"
                        );
                        setTab((currentPageIndex - 1).toString());
                      }}
                      size="large"
                    >
                      <UndoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={t("character-dialog.control.duplicate-page")}>
                  <span>
                    <IconButton
                      onClick={() => {
                        characterManager.actions.duplicatePage(
                          currentPageIndex
                        );
                        setTab((currentPageIndex + 1).toString());
                      }}
                      size="large"
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={t("character-dialog.control.delete-page")}>
                  <span>
                    <IconButton
                      disabled={
                        characterManager.state.character?.pages.length === 1
                      }
                      onClick={() => {
                        const confirmed = confirm(
                          t("character-dialog.remove-page-confirmation")
                        );
                        if (confirmed) {
                          characterManager.actions.deletePage(currentPageIndex);
                        }
                        setTab("0");
                      }}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={t("character-dialog.control.move-page-right")}>
                  <span>
                    <IconButton
                      disabled={currentPageIndex === pages?.length - 1}
                      onClick={() => {
                        characterManager.actions.movePage(
                          currentPageIndex,
                          "down"
                        );
                        setTab((currentPageIndex + 1).toString());
                      }}
                      size="large"
                    >
                      <RedoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title={t("character-dialog.control.add-row")}>
                  <span>
                    <IconButton
                      onClick={() => {
                        characterManager.actions.addRow({
                          pageIndex: currentPageIndex,
                        });
                      }}
                      size="large"
                    >
                      <AddIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <TabContext value={tab}>
          {pages?.map((page, pageIndex) => {
            const numberOfBlocks = page.rows
              .flatMap((row) => row.columns)
              .flatMap((column) => column.sections)
              .flatMap((section) => section.blocks).length;

            return (
              <TabPanel
                key={page.id}
                value={pageIndex.toString()}
                className={css({
                  label: "CharacterDialog-tab-panel",
                  padding: "0",
                })}
              >
                <Box
                  position="relative"
                  className={css({
                    border:
                      advanced || numberOfBlocks === 0
                        ? "none"
                        : `${borderSize}px solid ${headerBackgroundColors.primary}`,
                  })}
                >
                  {page.rows.map((row, rowIndex) => {
                    const columnSize = Math.floor(12 / row.columns.length);
                    const canMoveRowUp = rowIndex === 0;
                    const canMoveRowDown = rowIndex === page.rows.length - 1;

                    return (
                      <ManagerBox
                        key={rowIndex}
                        readonly={!advanced}
                        backgroundColor={theme.palette.action.hover}
                        label={<>Row #{rowIndex + 1}</>}
                        actions={
                          <>
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <Tooltip
                                  title={t(
                                    "character-dialog.control.move-row-up"
                                  )}
                                >
                                  <span>
                                    <IconButton
                                      disabled={canMoveRowUp}
                                      onClick={() => {
                                        characterManager.actions.moveRowUp({
                                          pageIndex,
                                          rowIndex,
                                        });
                                      }}
                                    >
                                      <ArrowUpwardIcon
                                        className={css({
                                          fontSize: "1rem",
                                        })}
                                      />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                              <Grid item>
                                <Tooltip
                                  title={t(
                                    "character-dialog.control.move-row-down"
                                  )}
                                >
                                  <span>
                                    <IconButton
                                      disabled={canMoveRowDown}
                                      onClick={() => {
                                        characterManager.actions.moveRowDown({
                                          pageIndex,
                                          rowIndex,
                                        });
                                      }}
                                    >
                                      <ArrowDownwardIcon
                                        className={css({
                                          fontSize: "1rem",
                                        })}
                                      />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                              <Grid item>
                                <Tooltip
                                  title={t(
                                    "character-dialog.control.delete-row"
                                  )}
                                >
                                  <span>
                                    <IconButton
                                      onClick={() => {
                                        characterManager.actions.deleteRow({
                                          pageIndex: pageIndex,
                                          rowIndex: rowIndex,
                                        });
                                      }}
                                    >
                                      <DeleteIcon
                                        className={css({
                                          fontSize: "1rem",
                                        })}
                                      />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                              <Grid item>
                                <Tooltip
                                  title={t(
                                    "character-dialog.control.add-column"
                                  )}
                                >
                                  <span>
                                    <IconButton
                                      disabled={row.columns.length === 4}
                                      onClick={() => {
                                        characterManager.actions.addColumn({
                                          pageIndex: pageIndex,
                                          rowIndex: rowIndex,
                                        });
                                      }}
                                    >
                                      <AddIcon
                                        className={css({
                                          fontSize: "1rem",
                                        })}
                                      />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </>
                        }
                      >
                        <Box>
                          {(advanced || numberOfBlocks > 0) && (
                            <Grid container>
                              {row.columns.map((column, columnIndex) => {
                                const canMoveColumnLeft = columnIndex === 0;
                                const canMoveColumnRight =
                                  columnIndex === row.columns.length - 1;
                                const hideColumnBorders =
                                  canMoveColumnLeft || advanced || isSmall;
                                return (
                                  <Grid
                                    item
                                    key={columnIndex}
                                    xs={12}
                                    md={columnSize as GridSize}
                                    className={css({
                                      borderLeft: hideColumnBorders
                                        ? "none"
                                        : `${borderSize}px solid ${headerBackgroundColors.primary}`,
                                    })}
                                  >
                                    <ManagerBox
                                      readonly={!advanced}
                                      label={<>Column #{columnIndex + 1}</>}
                                      backgroundColor={
                                        theme.palette.action.selected
                                      }
                                      actions={
                                        <>
                                          <Grid
                                            container
                                            justifyContent="flex-end"
                                          >
                                            <Grid item>
                                              <Tooltip
                                                title={t(
                                                  "character-dialog.control.move-column-left"
                                                )}
                                              >
                                                <span>
                                                  <IconButton
                                                    disabled={canMoveColumnLeft}
                                                    onClick={() => {
                                                      characterManager.actions.moveColumnLeft(
                                                        {
                                                          pageIndex,
                                                          rowIndex,
                                                          columnIndex,
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    <ArrowBackIcon
                                                      className={css({
                                                        fontSize: "1rem",
                                                      })}
                                                    />
                                                  </IconButton>
                                                </span>
                                              </Tooltip>
                                            </Grid>
                                            <Grid item>
                                              <Tooltip
                                                title={t(
                                                  "character-dialog.control.move-column-right"
                                                )}
                                              >
                                                <span>
                                                  <IconButton
                                                    disabled={
                                                      canMoveColumnRight
                                                    }
                                                    onClick={() => {
                                                      characterManager.actions.moveColumnRight(
                                                        {
                                                          pageIndex,
                                                          rowIndex,
                                                          columnIndex,
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    <ArrowForwardIcon
                                                      className={css({
                                                        fontSize: "1rem",
                                                      })}
                                                    />
                                                  </IconButton>
                                                </span>
                                              </Tooltip>
                                            </Grid>

                                            <Grid item>
                                              <Tooltip
                                                title={t(
                                                  "character-dialog.control.delete-column"
                                                )}
                                              >
                                                <span>
                                                  <IconButton
                                                    onClick={() => {
                                                      characterManager.actions.deleteColumn(
                                                        {
                                                          pageIndex: pageIndex,
                                                          rowIndex: rowIndex,
                                                          columnIndex:
                                                            columnIndex,
                                                        }
                                                      );
                                                    }}
                                                  >
                                                    <DeleteIcon
                                                      className={css({
                                                        fontSize: "1rem",
                                                      })}
                                                    />
                                                  </IconButton>
                                                </span>
                                              </Tooltip>
                                            </Grid>
                                          </Grid>
                                        </>
                                      }
                                    >
                                      {renderSections(
                                        {
                                          pageIndex,
                                          rowIndex,
                                          columnIndex,
                                        },
                                        page,
                                        column.sections
                                      )}
                                    </ManagerBox>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          )}
                        </Box>
                      </ManagerBox>
                    );
                  })}
                </Box>
              </TabPanel>
            );
          })}
        </TabContext>

        <Grid container justifyContent="space-between" alignItems="center">
          {advanced && env.isDev && (
            <Grid item>
              <Box pt=".5rem">
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    {t("character-dialog.control.zoom")}
                  </InputLabel>
                  <NativeSelect
                    data-cy="character-dialog.zoom"
                    size="small"
                    value={characterManager.state.character?.zoom ?? 1}
                    onChange={(event) => {
                      const zoom = parseFloat(event.target.value as string);
                      characterManager.actions.setZoom(zoom);
                    }}
                  >
                    {ZoomOptions.map((zoom) => (
                      <option key={zoom.value} value={zoom.value}>
                        {zoom.label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </Box>
            </Grid>
          )}
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
    indexes: { pageIndex: number; rowIndex: number; columnIndex: number },
    page: IPage,
    sections: Array<ISection> | undefined
  ) {
    const numberOfSections = sections?.length ?? 0;
    const shouldRenderAddSectionButton = advanced && numberOfSections === 0;

    return (
      <>
        <Box
          py={numberOfSections === 0 ? "1rem" : undefined}
          className={css({
            border: advanced
              ? `${borderSize}px solid ${headerBackgroundColors.primary}`
              : "none",
          })}
        >
          {sections?.map((section, sectionIndex) => {
            const canMoveSectionUp = !(sectionIndex === 0);
            const canMoveSectionDown = !(sectionIndex === sections.length - 1);
            return (
              <Box key={section.id}>
                <>
                  <SheetHeader
                    label={section.label}
                    advanced={advanced}
                    onLabelChange={(newLabel) => {
                      characterManager.actions.renameSection(
                        {
                          pageIndex: indexes.pageIndex,
                          rowIndex: indexes.rowIndex,
                          columnIndex: indexes.columnIndex,
                          sectionIndex: sectionIndex,
                        },
                        newLabel
                      );
                    }}
                    actions={
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          <Tooltip
                            title={t(
                              "character-dialog.control.visible-on-card"
                            )}
                          >
                            <IconButton
                              data-cy={`character-dialog.${section.label}.visible-on-card`}
                              size="small"
                              onClick={() => {
                                characterManager.actions.toggleSectionVisibleOnCard(
                                  {
                                    pageIndex: indexes.pageIndex,
                                    rowIndex: indexes.rowIndex,
                                    columnIndex: indexes.columnIndex,
                                    sectionIndex: sectionIndex,
                                  }
                                );
                              }}
                            >
                              {section.visibleOnCard ? (
                                <VisibilityIcon
                                  htmlColor={headerTextColors.primary}
                                  className={css({
                                    fontSize: "1rem",
                                  })}
                                />
                              ) : (
                                <VisibilityOffIcon
                                  htmlColor={headerTextColors.primary}
                                  className={css({
                                    fontSize: "1rem",
                                  })}
                                />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Tooltip
                            title={t(
                              "character-dialog.control.move-section-up"
                            )}
                          >
                            <span>
                              <IconButton
                                disabled={!canMoveSectionUp}
                                size="small"
                                data-cy={`character-dialog.${section.label}.move-section-up`}
                                onClick={() => {
                                  characterManager.actions.moveSectionUp({
                                    pageIndex: indexes.pageIndex,
                                    rowIndex: indexes.rowIndex,
                                    columnIndex: indexes.columnIndex,
                                    sectionIndex: sectionIndex,
                                  });
                                }}
                              >
                                <ArrowUpwardIcon
                                  htmlColor={
                                    !canMoveSectionUp
                                      ? headerTextColors.disabled
                                      : headerTextColors.primary
                                  }
                                  className={css({
                                    fontSize: "1rem",
                                  })}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Tooltip
                            title={t(
                              "character-dialog.control.move-section-down"
                            )}
                          >
                            <span>
                              <IconButton
                                disabled={!canMoveSectionDown}
                                size="small"
                                data-cy={`character-dialog.${section.label}.move-section-down`}
                                onClick={() => {
                                  characterManager.actions.moveSectionDown({
                                    pageIndex: indexes.pageIndex,
                                    rowIndex: indexes.rowIndex,
                                    columnIndex: indexes.columnIndex,
                                    sectionIndex: sectionIndex,
                                  });
                                }}
                              >
                                <ArrowDownwardIcon
                                  htmlColor={
                                    !canMoveSectionDown
                                      ? headerTextColors.disabled
                                      : headerTextColors.primary
                                  }
                                  className={css({
                                    fontSize: "1rem",
                                  })}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Tooltip
                            title={t(
                              "character-dialog.control.copy-section-blocks"
                            )}
                          >
                            <IconButton
                              size="small"
                              onClick={() => {
                                settingsManager.actions.setBlocksInClipboard(
                                  section.blocks
                                );
                              }}
                            >
                              <FileCopyIcon
                                htmlColor={headerTextColors.primary}
                                className={css({
                                  fontSize: "1rem",
                                })}
                              />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Tooltip
                            title={t("character-dialog.control.delete-section")}
                          >
                            <IconButton
                              data-cy={`character-dialog.${section.label}.delete`}
                              size="small"
                              onClick={() => {
                                const confirmed = confirm(
                                  t(
                                    "character-dialog.delete-section-confirmation"
                                  )
                                );
                                if (confirmed) {
                                  characterManager.actions.deleteSection({
                                    pageIndex: indexes.pageIndex,
                                    rowIndex: indexes.rowIndex,
                                    columnIndex: indexes.columnIndex,
                                    sectionIndex: sectionIndex,
                                  });
                                }
                              }}
                            >
                              <DeleteIcon
                                htmlColor={headerTextColors.primary}
                                className={css({
                                  fontSize: "1rem",
                                })}
                              />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    }
                  />
                  {renderSectionBlocks(page, section, {
                    pageIndex: indexes.pageIndex,
                    rowIndex: indexes.rowIndex,
                    columnIndex: indexes.columnIndex,
                    sectionIndex: sectionIndex,
                  })}

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
                                  {
                                    pageIndex: indexes.pageIndex,
                                    rowIndex: indexes.rowIndex,
                                    columnIndex: indexes.columnIndex,
                                    sectionIndex: sectionIndex,
                                  },
                                  blockType
                                );
                              }}
                            />
                          </Grid>
                          {settingsManager.computed.hasBlocksInClipboard && (
                            <Grid item>
                              <Tooltip
                                title={t(
                                  "character-dialog.control.paste-blocks"
                                )}
                              >
                                <span>
                                  <IconButton
                                    onClick={() => {
                                      characterManager.actions.pasteBlocks(
                                        {
                                          pageIndex: indexes.pageIndex,
                                          rowIndex: indexes.rowIndex,
                                          columnIndex: indexes.columnIndex,
                                          sectionIndex: sectionIndex,
                                        },
                                        settingsManager.state.blocksInClipboard
                                      );
                                    }}
                                  >
                                    <ContentPasteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>
                          )}
                          <Grid item>
                            <AddSection
                              onAddSection={() => {
                                characterManager.actions.addSection({
                                  pageIndex: indexes.pageIndex,
                                  rowIndex: indexes.rowIndex,
                                  columnIndex: indexes.columnIndex,
                                  sectionIndex: sectionIndex,
                                });
                              }}
                            />
                          </Grid>
                        </Grid>
                      </ThemeProvider>
                    </Box>
                  )}
                </>
              </Box>
            );
          })}

          {shouldRenderAddSectionButton && (
            <Box>
              <ThemeProvider theme={blackButtonTheme}>
                <AddSection
                  onAddSection={() => {
                    characterManager.actions.addSection({
                      pageIndex: indexes.pageIndex,
                      rowIndex: indexes.rowIndex,
                      columnIndex: indexes.columnIndex,
                      sectionIndex: numberOfSections,
                    });
                  }}
                />
              </ThemeProvider>
            </Box>
          )}
        </Box>
      </>
    );
  }

  function renderSheetActions() {
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
            <Grid item>
              <Tooltip title={t("character-dialog.delete")}>
                <IconButton
                  color="default"
                  data-cy="character-dialog.delete"
                  size="small"
                  onClick={() => {
                    const confirm = window.confirm(
                      t("character-dialog.delete-confirmation")
                    );

                    if (confirm) {
                      charactersManager.actions.remove(
                        characterManager.state?.character?.id
                      );
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
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

            {!props.dialog && (
              <>
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
    section: ISection,
    indexes: {
      pageIndex: number;
      rowIndex: number;
      columnIndex: number;
      sectionIndex: number;
    }
  ) {
    return (
      <>
        <Box
          className={css({
            marginTop: section.blocks.length === 0 ? ".5rem" : ".5rem",
            marginBottom: section.blocks.length === 0 ? ".5rem" : ".5rem",
          })}
        >
          <Grid container>
            {section.blocks.map((block, blockIndex) => {
              const canMoveBlockUp = !(blockIndex === 0);
              const canMoveBlockDown = !(
                blockIndex ===
                section.blocks.length - 1
              );
              const width: GridSize = !!block.meta.width
                ? (Math.round(block.meta.width * 12) as GridSize)
                : 12;
              return (
                <Grid key={block.id} item xs={width}>
                  <Box mb=".5rem" px=".5rem">
                    <ManagerBox
                      label={<>Bloc #{blockIndex + 1}</>}
                      readonly={!advanced}
                      backgroundColor={theme.palette.background.paper}
                      actions={
                        <>
                          <Grid container justifyContent="flex-end">
                            <Grid item>
                              <Tooltip
                                title={t(
                                  "character-dialog.control.move-section-up"
                                )}
                              >
                                <span>
                                  <IconButton
                                    disabled={!canMoveBlockUp}
                                    size="small"
                                    onClick={() => {
                                      characterManager.actions.moveBlockUp({
                                        pageIndex: indexes.pageIndex,
                                        rowIndex: indexes.rowIndex,
                                        columnIndex: indexes.columnIndex,
                                        sectionIndex: indexes.sectionIndex,
                                        blockIndex: blockIndex,
                                      });
                                    }}
                                  >
                                    <ArrowUpwardIcon
                                      className={css({
                                        fontSize: "1rem",
                                      })}
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Tooltip
                                title={t(
                                  "character-dialog.control.move-section-down"
                                )}
                              >
                                <span>
                                  <IconButton
                                    disabled={!canMoveBlockDown}
                                    size="small"
                                    onClick={() => {
                                      characterManager.actions.moveBlockDown({
                                        pageIndex: indexes.pageIndex,
                                        rowIndex: indexes.rowIndex,
                                        columnIndex: indexes.columnIndex,
                                        sectionIndex: indexes.sectionIndex,
                                        blockIndex: blockIndex,
                                      });
                                    }}
                                  >
                                    <ArrowDownwardIcon
                                      className={css({
                                        fontSize: "1rem",
                                      })}
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>

                            <Grid item>
                              <Tooltip
                                title={t("character-dialog.control.copy-block")}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    settingsManager.actions.setBlocksInClipboard(
                                      [block]
                                    );
                                  }}
                                >
                                  <FileCopyIcon
                                    className={css({
                                      fontSize: "1rem",
                                    })}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Grid>

                            <Grid item>
                              <Tooltip
                                title={t(
                                  "character-dialog.control.delete-block"
                                )}
                              >
                                <IconButton
                                  size="small"
                                  data-cy={`character-dialog.${section.label}.${block.label}.delete`}
                                  onClick={() => {
                                    characterManager.actions.deleteBlock({
                                      pageIndex: indexes.pageIndex,
                                      sectionIndex: indexes.sectionIndex,
                                      rowIndex: indexes.rowIndex,
                                      columnIndex: indexes.columnIndex,
                                      blockIndex,
                                    });
                                  }}
                                >
                                  <DeleteIcon
                                    className={css({
                                      fontSize: "1rem",
                                    })}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </>
                      }
                    >
                      <BlockByType
                        advanced={advanced}
                        readonly={props.readonly}
                        dataCy={`character-dialog.${section.label}.${block.label}`}
                        block={block}
                        onChange={(newBlock) => {
                          characterManager.actions.setBlock(
                            {
                              pageIndex: indexes.pageIndex,
                              rowIndex: indexes.rowIndex,
                              columnIndex: indexes.columnIndex,
                              sectionIndex: indexes.sectionIndex,
                              blockIndex,
                            },
                            newBlock
                          );
                        }}
                        onToggleSplit={() => {
                          const shouldUseHalfWidth =
                            block.meta.width == null || block.meta.width === 1;
                          const shouldUseThirdWidth = block.meta.width === 0.5;
                          const newWidth = shouldUseHalfWidth
                            ? 0.5
                            : shouldUseThirdWidth
                            ? 0.33
                            : 1;

                          characterManager.actions.setBlockMeta(
                            {
                              pageIndex: indexes.pageIndex,
                              rowIndex: indexes.rowIndex,
                              columnIndex: indexes.columnIndex,
                              sectionIndex: indexes.sectionIndex,
                              blockIndex,
                            },
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
                    </ManagerBox>
                  </Box>
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

export function ManagerBox(props: {
  label: string | React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  outside?: React.ReactNode;
  backgroundColor?: string;
  readonly?: boolean;
}) {
  const theme = useTheme();
  if (props.readonly) {
    return <>{props.children}</>;
  }
  return (
    <Box p=".5rem" mb=".5rem" height="100%" bgcolor={props.backgroundColor}>
      <Box mb=".5rem">
        <Grid container spacing={1} alignContent="center">
          <Grid
            item
            xs
            className={css({
              display: "flex",
              alignItems: "center",
            })}
          >
            <Typography
              className={css({
                fontSize: ".7rem",
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              {props.label}
            </Typography>
          </Grid>
          {props.actions && <Grid item>{props.actions}</Grid>}
        </Grid>
      </Box>
      {props.children}
      {props.outside}
    </Box>
  );
}
