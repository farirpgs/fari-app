import { css } from "@emotion/css";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ExportIcon from "@mui/icons-material/GetApp";
import PaletteIcon from "@mui/icons-material/Palette";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid, { GridSize } from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Slider from "@mui/material/Slider";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { BoxProps } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { Prompt } from "react-router";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { IndexCardColorPicker } from "../../../../components/IndexCard/IndexCard";
import { CharacterCard } from "../../../../components/Scene/components/PlayerRow/CharacterCard/CharacterCard";
import { Delays } from "../../../../constants/Delays";
import { env } from "../../../../constants/env";
import { FontFamily } from "../../../../constants/FontFamily";
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
import { useTranslate } from "../../../../hooks/useTranslate/useTranslate";
import { useCharacter } from "../../hooks/useCharacter";
import { AddBlock } from "./components/AddBlock";
import { AddSection } from "./components/AddSection";
import { BlockByType } from "./components/BlockByType";
import { SheetHeader } from "./components/SheetHeader";
import { ThemedLabel } from "./components/ThemedLabel";
import { MiniThemeContext, useMiniTheme } from "./MiniThemeContext";

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

export const CharacterV3Dialog: React.FC<{
  open: boolean;
  character: ICharacter | undefined;
  readonly?: boolean;
  dialog: boolean;

  synced?: boolean;

  onClose?(): void;
  onSave?(newCharacter: ICharacter): void;
  onToggleSync?(): void;
  onRoll?(diceRollResult: IDiceRollResult): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const query = useQuery<"card" | "advanced">();
  const showCharacterCard = query.get("card") === "true";
  const defaultAdvanced = query.get("advanced") === "true";
  const logger = useLogger();
  const characterManager = useCharacter(props.character);
  const settingsManager = useContext(SettingsContext);
  const [advanced, setAdvanced] = useState(defaultAdvanced);
  const [themeEditorVisible, setThemeEditorVisible] = useState(false);
  const [savedSnack, setSavedSnack] = useState(false);
  const charactersManager = useContext(CharactersContext);
  const date = getDayJSFrom(characterManager.state.character?.lastUpdated);
  const miniTheme = useMiniTheme({
    character: characterManager.state.character,
  });

  const hasMiniTheme = !!characterManager.state.character?.theme;

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
      <style>{miniTheme.style}</style>
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
      <MiniThemeContext.Provider value={miniTheme}>
        {renderSheet()}
        <Drawer
          anchor={"left"}
          classes={{
            paper: css({
              marginTop: "5.5rem",
              height: "calc(100vh - 5.5rem)",
            }),
          }}
          BackdropProps={{
            className: css({
              background: "rgba(0, 0, 0, 0.4)",
            }),
          }}
          open={themeEditorVisible}
          onClose={() => {
            setThemeEditorVisible(false);
          }}
        >
          {renderThemeEditor()}
        </Drawer>
      </MiniThemeContext.Provider>
    </>
  );

  function renderSheet() {
    const shouldUseWideMode = characterManager.state.character?.wide;
    const maxWidth = shouldUseWideMode ? "lg" : "md";

    if (props.dialog && characterManager.state.character) {
      return (
        <ThemeProvider theme={miniTheme.muiTheme}>
          <Dialog
            disableEnforceFocus
            open={props.open}
            fullWidth
            keepMounted={false}
            maxWidth={maxWidth}
            scroll="paper"
            onClose={onClose}
            classes={{
              paper: css({
                height: "100%",
                background: miniTheme.backgroundColor,
              }),
            }}
          >
            <DialogTitle
              className={css({
                label: "CharacterDialog-dialog-wrapper",
                padding: "0",
              })}
            >
              <Container maxWidth={maxWidth}>
                <Box
                  className={css({
                    width: "100%",
                    padding: "1rem 1rem",
                  })}
                >
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
                <Box
                  className={css({
                    width: "100%",
                    padding: ".5rem 1rem",
                  })}
                >
                  {renderPages(characterManager.state.character.pages)}
                </Box>
              </Container>
            </DialogContent>
            {!props.readonly && (
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
                  <Box
                    className={css({
                      width: "100%",
                      padding: ".5rem 1rem",
                    })}
                  >
                    {renderSheetActions()}
                  </Box>
                </Container>
              </DialogActions>
            )}
          </Dialog>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={miniTheme.muiTheme}>
        <Box
          className={css({
            color: miniTheme.textPrimary,
            backgroundColor: miniTheme.backgroundColor,
          })}
        >
          <Container maxWidth={maxWidth}>
            {!props.readonly && (
              <Box
                className={css({
                  width: "100%",
                  padding: ".5rem 1rem",
                })}
              >
                <Box>{renderSheetActions()}</Box>
              </Box>
            )}

            <Box
              className={css({
                width: "100%",
                padding: "1rem 1rem",
              })}
            >
              {renderNameAndGroup()}
            </Box>
            <Box
              className={css({
                width: "100%",
                padding: ".5rem 1rem",
              })}
            >
              {renderPages(characterManager.state.character?.pages)}
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
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
              className={css({
                width: "300px",
                color: "red !important",
              })}
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
        <Box>
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
                    borderBottom: `1px solid ${miniTheme.borderColor}`,
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
                        marginRight: ".5rem",
                        color: `${
                          true // miniTheme.hideTabBackground
                            ? miniTheme.textPrimary
                            : miniTheme.textPrimaryInverted
                        } !important`,
                        background: true // miniTheme.hideTabBackground
                          ? undefined
                          : miniTheme.textPrimary,
                        transition: "border linear 200ms",
                        borderBottom: `4px solid ${
                          isCurrentTab
                            ? true // miniTheme.hideTabBackground
                              ? miniTheme.textPrimary
                              : miniTheme.textPrimaryInverted
                            : "transparent"
                        }`,
                        marginBottom: `-2px`,
                      })}
                      value={pageIndex.toString()}
                      label={
                        <Typography
                          className={css({
                            fontFamily: miniTheme.pageHeadingFontFamily,
                            fontSize: `${miniTheme.pageHeadingFontSize}rem`,
                            fontWeight: miniTheme.pageHeadingFontWeight,
                            textTransform: "none",
                            width: "100%",
                          })}
                        >
                          <ContentEditable
                            clickable
                            className={css({ width: "100%" })}
                            value={page.label}
                            readonly={!advanced}
                            border={advanced}
                            borderColor={
                              miniTheme.hideTabBackground
                                ? miniTheme.textPrimaryInverted
                                : miniTheme.textPrimary
                            }
                            onChange={(newValue) => {
                              characterManager.actions.renamePage(
                                pageIndex,
                                newValue
                              );
                            }}
                          />
                        </Typography>
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
          <Box>
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
                    >
                      <ArrowBackIcon />
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
                    >
                      <ArrowForwardIcon />
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
                  background: miniTheme.backgroundColor,
                })}
              >
                <Box
                  position="relative"
                  className={css({
                    background: miniTheme.backgroundColor,
                    color: miniTheme.textPrimary,
                    paddingTop: ".5rem",
                  })}
                >
                  {page.rows.map((row, rowIndex) => {
                    const columnSize = Math.floor(12 / row.columns.length);
                    const canMoveRowUp = rowIndex === 0;
                    const canMoveRowDown = rowIndex === page.rows.length - 1;
                    const isLastRow = rowIndex === page.rows.length - 1;
                    return (
                      <ManagerBox
                        key={rowIndex}
                        readonly={!advanced}
                        advancedBoxProps={{
                          padding: ".5rem",
                          bgcolor: miniTheme.boxBackgroundColor,
                        }}
                        label={<>Row #{rowIndex + 1}</>}
                        rightActions={
                          row.columns.length !== 4 && (
                            <>
                              <Grid container>
                                <Grid item>
                                  {renderAddColumnButton({
                                    pageIndex,
                                    rowIndex,
                                    columnIndex: row.columns.length,
                                  })}
                                </Grid>
                              </Grid>
                            </>
                          )
                        }
                        topActions={
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
                                        htmlColor={miniTheme.textSecondary}
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
                            </Grid>
                          </>
                        }
                        bottomActions={
                          <>
                            {!isLastRow && (
                              <Box my=".5rem">
                                {renderAddRowButton({
                                  pageIndex: currentPageIndex,
                                  rowIndex: rowIndex,
                                })}
                              </Box>
                            )}
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
                                return (
                                  <Grid
                                    item
                                    key={columnIndex}
                                    xs={12}
                                    md={columnSize as GridSize}
                                  >
                                    <ManagerBox
                                      readonly={!advanced}
                                      advancedBoxProps={{
                                        padding: ".5rem",
                                        height: "100%",
                                        bgcolor: miniTheme.box2BackgroundColor,
                                      }}
                                      label={<>Column #{columnIndex + 1}</>}
                                      topActions={
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
                                                    disabled={columnIndex === 0}
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
                  {advanced && (
                    <Box my=".5rem">
                      {renderAddRowButton({
                        pageIndex: currentPageIndex,
                        rowIndex: page.rows.length,
                      })}
                    </Box>
                  )}
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
            <Box p=".5rem">
              <Typography variant="caption" color={miniTheme.textSecondary}>
                {date.format("lll")}
                {" / "}
                {"v"}
                {characterManager.state.character?.version}
                {" / "}
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
                  onRoll={(newRollResult) => {
                    props.onRoll?.(newRollResult);
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }

  function renderAddRowButton(renderProps: {
    pageIndex: number;
    rowIndex: number;
  }) {
    return (
      <Grid container justifyContent="center">
        <Grid item>
          <Tooltip title={t("character-dialog.control.add-row")}>
            <span>
              <IconButton
                onClick={() => {
                  characterManager.actions.addRow({
                    pageIndex: renderProps.pageIndex,
                    rowIndex: renderProps.rowIndex,
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
    );
  }

  function renderAddColumnButton(renderProps: {
    pageIndex: number;
    rowIndex: number;
    columnIndex: number;
  }) {
    // row.columns.length === 4
    return (
      <Box p=".125rem">
        <Grid container justifyContent="center" spacing={1}>
          <Grid item>
            <Tooltip title={t("character-dialog.control.add-column")}>
              <span>
                <IconButton
                  onClick={() => {
                    characterManager.actions.addColumn({
                      pageIndex: renderProps.pageIndex,
                      rowIndex: renderProps.rowIndex,
                      columnIndex: renderProps.columnIndex,
                    });
                  }}
                  // size="large"
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
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
        <Box p={numberOfSections === 0 ? ".5rem" : undefined}>
          {sections?.map((section, sectionIndex) => {
            const canMoveSectionUp = !(sectionIndex === 0);
            const canMoveSectionDown = !(sectionIndex === sections.length - 1);
            return (
              <Box key={section.id}>
                <>
                  <SheetHeader
                    index={sectionIndex}
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
                                  htmlColor={
                                    miniTheme.hideSectionBackground
                                      ? miniTheme.textPrimary
                                      : miniTheme.textPrimaryInverted
                                  }
                                  className={css({
                                    fontSize: "1rem",
                                  })}
                                />
                              ) : (
                                <VisibilityOffIcon
                                  htmlColor={
                                    miniTheme.hideSectionBackground
                                      ? miniTheme.textPrimary
                                      : miniTheme.textPrimaryInverted
                                  }
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
                                    miniTheme.hideSectionBackground
                                      ? miniTheme.textPrimary
                                      : miniTheme.textPrimaryInverted
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
                                    miniTheme.hideSectionBackground
                                      ? miniTheme.textPrimary
                                      : miniTheme.textPrimaryInverted
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
                                htmlColor={
                                  miniTheme.hideSectionBackground
                                    ? miniTheme.textPrimary
                                    : miniTheme.textPrimaryInverted
                                }
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
                                htmlColor={
                                  miniTheme.hideSectionBackground
                                    ? miniTheme.textPrimary
                                    : miniTheme.textPrimaryInverted
                                }
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
                    <Box p="1rem .5rem">
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
                              title={t("character-dialog.control.paste-blocks")}
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
                    </Box>
                  )}
                </>
              </Box>
            );
          })}

          {shouldRenderAddSectionButton && (
            <Box>
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
      <Box py=".5rem">
        <Grid
          container
          // wrap="nowrap"
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
                    <PrintIcon htmlColor={miniTheme.textPrimary} />
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
                  <DeleteIcon htmlColor={miniTheme.textPrimary} />
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
                  <ExportIcon htmlColor={miniTheme.textPrimary} />
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
                      <ShareIcon htmlColor={miniTheme.textPrimary} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </>
            )}

            {!props.dialog && (
              <Grid item>
                <Tooltip title={t("character-dialog.open-theme-editor")}>
                  <IconButton
                    color="default"
                    data-cy="character-dialog.open-theme-editor"
                    size="small"
                    onClick={() => {
                      setThemeEditorVisible(true);
                    }}
                  >
                    <PaletteIcon htmlColor={miniTheme.textPrimary} />
                  </IconButton>
                </Tooltip>
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
      </Box>
    );
  }

  function renderThemeEditor() {
    return (
      <>
        <Box
          p="2rem"
          sx={{
            width: {
              sm: "70vw",
              md: "30vw",
            },
          }}
        >
          <Grid container wrap="nowrap" justifyContent={"space-between"}>
            <Grid item>
              <Typography variant="h5">Theme settings</Typography>
            </Grid>
            <Grid item>
              <Switch
                color="primary"
                data-cy="character-dialog.toggle-advanced"
                checked={hasMiniTheme}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMiniTheme) {
                    characterManager.actions.removeTheme();
                  } else {
                    characterManager.actions.setTheme();
                  }
                }}
              />
            </Grid>
          </Grid>

          <Typography gutterBottom variant="h6">
            Basics
          </Typography>

          {renderBasicThemeEditorControls()}

          <Typography gutterBottom variant="h6">
            Fonts
          </Typography>

          {renderFontThemeEditorControls({
            label: "Pages",
            initialFontSize: 1.25,
            fontFamily:
              characterManager.state.character?.theme?.pageHeadingFontFamily,
            fontSize:
              characterManager.state.character?.theme?.pageHeadingFontSize,
            fontWeight:
              characterManager.state.character?.theme?.pageHeadingFontWeight,
            onFontFamilyChange: (fontFamily) => {
              characterManager.actions.setTheme((theme) => {
                theme.pageHeadingFontFamily = fontFamily;
              });
            },
            onFontSizeChange: (fontSize) => {
              characterManager.actions.setTheme((theme) => {
                theme.pageHeadingFontSize = fontSize;
              });
            },
            onFontWeightChange: (fontWeight) => {
              characterManager.actions.setTheme((theme) => {
                theme.pageHeadingFontWeight = fontWeight;
              });
            },
          })}
          {renderFontThemeEditorControls({
            label: "Sections",
            initialFontSize: 1,
            fontFamily:
              characterManager.state.character?.theme?.sectionHeadingFontFamily,
            fontSize:
              characterManager.state.character?.theme?.sectionHeadingFontSize,
            fontWeight:
              characterManager.state.character?.theme?.sectionHeadingFontWeight,
            onFontFamilyChange: (fontFamily) => {
              characterManager.actions.setTheme((theme) => {
                theme.sectionHeadingFontFamily = fontFamily;
              });
            },
            onFontSizeChange: (fontSize) => {
              characterManager.actions.setTheme((theme) => {
                theme.sectionHeadingFontSize = fontSize;
              });
            },
            onFontWeightChange: (fontWeight) => {
              characterManager.actions.setTheme((theme) => {
                theme.sectionHeadingFontWeight = fontWeight;
              });
            },
          })}
          {renderFontThemeEditorControls({
            label: "Labels",
            initialFontSize: 1,
            fontFamily:
              characterManager.state.character?.theme?.labelFontFamily,
            fontSize: characterManager.state.character?.theme?.labelFontSize,
            fontWeight:
              characterManager.state.character?.theme?.labelFontWeight,

            onFontFamilyChange: (fontFamily) => {
              characterManager.actions.setTheme((theme) => {
                theme.labelFontFamily = fontFamily;
              });
            },
            onFontSizeChange: (fontSize) => {
              characterManager.actions.setTheme((theme) => {
                theme.labelFontSize = fontSize;
              });
            },
            onFontWeightChange: (fontWeight) => {
              characterManager.actions.setTheme((theme) => {
                theme.labelFontWeight = fontWeight;
              });
            },
          })}
          {renderFontThemeEditorControls({
            label: "Text",
            initialFontSize: 1,
            fontFamily: characterManager.state.character?.theme?.textFontFamily,
            fontSize: characterManager.state.character?.theme?.textFontSize,
            fontWeight: characterManager.state.character?.theme?.textFontWeight,
            onFontFamilyChange: (fontFamily) => {
              characterManager.actions.setTheme((theme) => {
                theme.textFontFamily = fontFamily;
              });
            },
            onFontSizeChange: (fontSize) => {
              characterManager.actions.setTheme((theme) => {
                theme.textFontSize = fontSize;
              });
            },
            onFontWeightChange: (fontWeight) => {
              characterManager.actions.setTheme((theme) => {
                theme.textFontWeight = fontWeight;
              });
            },
          })}
          {renderFontThemeEditorControls({
            label: "Info Text",
            initialFontSize: 1,
            fontFamily:
              characterManager.state.character?.theme?.infoTextFontFamily,
            fontSize: characterManager.state.character?.theme?.infoTextFontSize,
            fontWeight:
              characterManager.state.character?.theme?.infoTextFontWeight,
            onFontFamilyChange: (fontFamily) => {
              characterManager.actions.setTheme((theme) => {
                theme.infoTextFontFamily = fontFamily;
              });
            },
            onFontSizeChange: (fontSize) => {
              characterManager.actions.setTheme((theme) => {
                theme.infoTextFontSize = fontSize;
              });
            },
            onFontWeightChange: (fontWeight) => {
              characterManager.actions.setTheme((theme) => {
                theme.infoTextFontWeight = fontWeight;
              });
            },
          })}
          {renderFontThemeEditorControls({
            label: "Help Text",
            initialFontSize: 0.75,
            fontFamily:
              characterManager.state.character?.theme?.helperTextFontFamily,
            fontSize:
              characterManager.state.character?.theme?.helperTextFontSize,
            fontWeight:
              characterManager.state.character?.theme?.helperTextFontWeight,
            onFontFamilyChange: (fontFamily) => {
              characterManager.actions.setTheme((theme) => {
                theme.helperTextFontFamily = fontFamily;
              });
            },
            onFontSizeChange: (fontSize) => {
              characterManager.actions.setTheme((theme) => {
                theme.helperTextFontSize = fontSize;
              });
            },
            onFontWeightChange: (fontWeight) => {
              characterManager.actions.setTheme((theme) => {
                theme.helperTextFontWeight = fontWeight;
              });
            },
          })}
        </Box>
      </>
    );
  }

  function renderBasicThemeEditorControls() {
    return (
      <>
        <Box mb="1rem">
          <Grid container spacing={2} wrap="nowrap">
            <Grid item xs>
              <LazyState
                delay={Delays.field}
                value={characterManager.state.character?.theme?.backgroundColor}
                onChange={(value) => {
                  characterManager.actions.setTheme((theme) => {
                    theme.backgroundColor = value;
                  });
                }}
                render={([value, setValue]) => {
                  return (
                    <>
                      <FormHelperText>Background Color</FormHelperText>
                      <IndexCardColorPicker
                        color={value}
                        onChange={(newColor) => {
                          setValue(newColor);
                        }}
                        hidePastils
                        render={(renderProps) => {
                          return (
                            <CircleIcon
                              className={css({
                                border: `2px solid ${theme.palette.text.secondary}`,
                                borderRadius: "50%",
                                cursor: "pointer",
                                width: "3rem",
                                height: "3rem",
                              })}
                              htmlColor={value}
                              ref={renderProps.ref}
                              onClick={() => {
                                renderProps.setColorPickerOpen(true);
                              }}
                            />
                          );
                        }}
                      />
                    </>
                  );
                }}
              />
            </Grid>
            {false && (
              <Grid item xs>
                <LazyState
                  delay={Delays.field}
                  value={characterManager.state.character?.theme?.primaryColor}
                  onChange={(value) => {
                    characterManager.actions.setTheme((theme) => {
                      theme.primaryColor = value;
                    });
                  }}
                  render={([value, setValue]) => {
                    return (
                      <>
                        <FormHelperText>Primary Color</FormHelperText>
                        <IndexCardColorPicker
                          color={value}
                          hidePastils
                          onChange={(newColor) => {
                            setValue(newColor);
                          }}
                          render={(renderProps) => {
                            return (
                              <CircleIcon
                                className={css({
                                  border: `2px solid ${theme.palette.text.secondary}`,
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  width: "3rem",
                                  height: "3rem",
                                })}
                                htmlColor={value}
                                ref={renderProps.ref}
                                onClick={() => {
                                  renderProps.setColorPickerOpen(true);
                                }}
                              />
                            );
                          }}
                        />
                      </>
                    );
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>

        <Box mb="1rem">
          <LazyState
            delay={Delays.field}
            value={characterManager.state.character?.theme?.style}
            onChange={(value) => {
              characterManager.actions.setTheme((theme) => {
                theme.style = value;
              });
            }}
            render={([value, setValue]) => {
              return (
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!hasMiniTheme}
                  label="Font @import"
                  placeholder="@import url('https://fonts.googleapis.com/css2?family="
                  fullWidth
                  multiline
                  variant="standard"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              );
            }}
          />
        </Box>
        <Box mb="1rem">
          <Grid container wrap="nowrap">
            {/* <Grid item>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        !characterManager.state.character?.theme
                          ?.hideTabBackground
                      }
                      onClick={() => {
                        characterManager.actions.setTheme((theme) => {
                          theme.hideTabBackground = !theme.hideTabBackground;
                        });
                      }}
                    />
                  }
                  label="Display Tab Background"
                />
              </FormGroup>
            </Grid> */}
            <Grid item>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        !characterManager.state.character?.theme
                          ?.hideSectionBackground
                      }
                      onClick={() => {
                        characterManager.actions.setTheme((theme) => {
                          theme.hideSectionBackground =
                            !theme.hideSectionBackground;
                        });
                      }}
                    />
                  }
                  label="Display Section Background"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  function renderFontThemeEditorControls(renderProps: {
    label: string;
    initialFontSize: number;
    fontFamily: string | undefined;
    fontSize: number | undefined;
    fontWeight: any | undefined;
    onFontFamilyChange: (value: string | undefined) => void;
    onFontSizeChange: (value: number | undefined) => void;
    onFontWeightChange: (value: any | undefined) => void;
  }) {
    const fontWeights = [
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "bold",
      "bolder",
      "inherit",
      "initial",
      "lighter",
      "normal",
      "revert",
      "unset",
    ];
    return (
      <>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {renderProps.label}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {/* ... */}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb="1rem">
              <Box mb="1rem">
                <Grid
                  container
                  spacing={2}
                  wrap="nowrap"
                  alignItems="flex-start"
                >
                  <Grid item xs>
                    <LazyState
                      delay={Delays.field}
                      value={renderProps.fontFamily}
                      onChange={(value) => {
                        renderProps.onFontFamilyChange(value);
                      }}
                      render={([value, setValue]) => {
                        return (
                          <TextField
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={!hasMiniTheme}
                            label={`Font Family`}
                            placeholder={FontFamily.Default.split(",").join(
                              ", "
                            )}
                            fullWidth
                            multiline
                            value={value}
                            onChange={(e) => {
                              setValue(e.target.value);
                            }}
                          />
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid
                  container
                  spacing={2}
                  wrap="nowrap"
                  alignItems="flex-start"
                >
                  <Grid item xs>
                    <FormControl fullWidth>
                      <InputLabel shrink variant="standard">
                        Font Weight
                      </InputLabel>
                      <NativeSelect
                        // defaultValue=""
                        value={renderProps.fontWeight || ""}
                        onChange={(event) => {
                          renderProps.onFontWeightChange(event.target.value);
                        }}
                      >
                        <option value="">None</option>
                        {fontWeights.map((fw) => {
                          return (
                            <option key={fw} value={fw}>
                              {fw}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <LazyState
                      delay={Delays.field}
                      value={renderProps.fontSize}
                      onChange={(value) => {
                        renderProps.onFontSizeChange(value);
                      }}
                      render={([value, setValue]) => {
                        return (
                          <>
                            <InputLabel shrink>{`Font Size`}</InputLabel>
                            <Slider
                              defaultValue={renderProps.initialFontSize}
                              disabled={!hasMiniTheme}
                              step={0.125}
                              min={0.5}
                              max={3}
                              valueLabelDisplay="auto"
                              value={value}
                              onChange={(e, value) => {
                                setValue(value as number);
                              }}
                            />
                          </>
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </>
    );
  }

  function renderNameAndGroup() {
    return (
      <>
        <Box px=".5rem">
          <Grid container>
            <Grid
              item
              container
              sm={12}
              md={6}
              spacing={1}
              alignItems="flex-end"
            >
              <Grid
                item
                className={css({
                  label: "CharacterDialog-name",
                  flex: "0 0 auto",
                })}
              >
                <ThemedLabel>{t("character-dialog.name")}</ThemedLabel>
              </Grid>
              <Grid item xs>
                <Typography
                  className={css({
                    fontFamily: miniTheme.textFontFamily,
                    fontSize: `${miniTheme.textFontSize}rem`,
                    fontWeight: miniTheme.textFontWeight,
                  })}
                >
                  <ContentEditable
                    border
                    data-cy="character-dialog.name"
                    readonly={props.readonly}
                    value={characterManager.state.character!.name}
                    onChange={(value) => {
                      characterManager.actions.setName(value);
                    }}
                  />
                </Typography>
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
                <ThemedLabel>{t("character-dialog.group")}</ThemedLabel>
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
                                input: css({
                                  paddingBottom: "0 !important",
                                  fontFamily: miniTheme.textFontFamily,
                                  fontSize: `${miniTheme.textFontSize}rem`,
                                  fontWeight: miniTheme.textFontWeight,
                                }),
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
    const hasBlock = section.blocks.length > 0;
    if (!hasBlock) {
      return null;
    }
    return (
      <>
        <Box>
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
                  <ManagerBox
                    label={<>Block #{blockIndex + 1}</>}
                    viewBoxProps={{
                      padding: "0 .5rem .5rem .5rem",
                    }}
                    advancedBoxProps={{
                      padding: ".5rem",
                      bgcolor: miniTheme.backgroundColor,
                    }}
                    readonly={!advanced}
                    topActions={
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
                              title={t(
                                "character-dialog.control.duplicate-block"
                              )}
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  characterManager.actions.duplicateBlock({
                                    pageIndex: indexes.pageIndex,
                                    rowIndex: indexes.rowIndex,
                                    columnIndex: indexes.columnIndex,
                                    sectionIndex: indexes.sectionIndex,
                                    blockIndex: blockIndex,
                                  });
                                }}
                              >
                                <ContentCopyIcon
                                  className={css({
                                    fontSize: "1rem",
                                  })}
                                />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip
                              title={t("character-dialog.control.copy-block")}
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  settingsManager.actions.setBlocksInClipboard([
                                    block,
                                  ]);
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
                              title={t("character-dialog.control.delete-block")}
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
                        props.onRoll?.(diceRollResult);
                      }}
                    />
                  </ManagerBox>
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
  topActions?: React.ReactNode;
  children: React.ReactNode;
  bottomActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  readonly?: boolean;
  viewBoxProps?: BoxProps;
  advancedBoxProps?: BoxProps;
}) {
  const viewBoxProps = props.viewBoxProps || {};
  const advancedBoxProps = props.advancedBoxProps || {};
  const theme = useTheme();

  if (props.readonly) {
    return <Box {...viewBoxProps}>{props.children}</Box>;
  }

  return (
    <Box {...advancedBoxProps}>
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
          {props.topActions && <Grid item>{props.topActions}</Grid>}
        </Grid>
      </Box>
      <Grid container wrap="nowrap" spacing={1}>
        <Grid item xs>
          {props.children}
        </Grid>
        {props.rightActions && (
          <Grid item className={css({ display: "flex", alignItems: "center" })}>
            {props.rightActions}
          </Grid>
        )}
      </Grid>
      {props.bottomActions}
    </Box>
  );
}
