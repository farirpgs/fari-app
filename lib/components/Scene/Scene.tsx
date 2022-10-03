import { css } from "@emotion/css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import Masonry from "@mui/lab/Masonry";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useContext, useRef, useState } from "react";
import { IndexCardCollectionsContext } from "../../contexts/IndexCardCollectionsContext/IndexCardCollectionsContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { IArraySortGetter } from "../../domains/array/arraySort";
import { IDicePoolResult } from "../../domains/dice/Dice";
import { useElementWidth } from "../../hooks/useElementWidth/useElementWidth";
import { LazyState } from "../../hooks/useLazyState/useLazyState";
import {
  IIndexCard,
  IIndexCardType,
  IScene,
} from "../../hooks/useScene/IScene";
import { useScene } from "../../hooks/useScene/useScene";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

import {
  ContentEditable,
  previewContentEditable,
} from "../ContentEditable/ContentEditable";
import { FateLabel } from "../FateLabel/FateLabel";
import { IndexCard, IndexCardMinWidth } from "../IndexCard/IndexCard";
import { MasonryResizer } from "../MasonryResizer/MasonryResizer";
import { SplitButton } from "../SplitButton/SplitButton";
import { useHiddenIndexCardRecord } from "./hooks/useHiddenIndexCardRecord";

export enum SceneMode {
  PlayOnline,
  PlayOffline,
  Manage,
}

enum SortMode {
  None = "Custom",
  GroupFirst = "GroupFirst",
  PinnedFirst = "PinnedFirst",
}

export function Scene(props: {
  sceneManager: ReturnType<typeof useScene>;
  isGM: boolean;
  canLoad: boolean;
  onRoll(diceRollResult: IDicePoolResult): void;
  onPoolClick(element: IDicePoolElement): void;
  onIndexCardUpdate(indexCard: IIndexCard, type: IIndexCardType): void;
  onOpenChat?(): void;
}) {
  const { sceneManager } = props;
  const settingsManager = useContext(SettingsContext);
  const indexCardCollectionsManager = useContext(IndexCardCollectionsContext);
  const selectedIndexCardCollection =
    indexCardCollectionsManager.state.sceneIndexCardCollections.find(
      (i) => i.id === settingsManager.state.gameTemplate
    );

  const theme = useTheme();
  const logger = useLogger();
  const { t } = useTranslate();

  const scenesManager = useContext(ScenesContext);
  const myBinderManager = useContext(MyBinderContext);

  const headerBackgroundColor = useTextColors(
    theme.palette.background.paper
  ).primary;

  const indexCardsContainerRef = useRef<HTMLElement>(null);
  const indexCardsContainerWidth = useElementWidth(indexCardsContainerRef);
  const numberOfColumnsForIndexCardsMasonry = Math.floor(
    indexCardsContainerWidth / IndexCardMinWidth
  );

  const hiddenIndexCardRecord = useHiddenIndexCardRecord(
    sceneManager.state.scene?.indexCards
  );

  const [sort, setSort] = useState<SortMode>(SortMode.None);

  const [savedSnack, setSavedSnack] = useState(false);
  const [sceneTab, setSceneTab] = useState<"public" | "private" | "notes">(
    "public"
  );

  const headerColor = theme.palette.background.paper;
  const hasScene = !!sceneManager.state.scene;

  const handleLoadScene = (newScene: IScene) => {
    sceneManager.actions.loadScene(newScene);
  };

  return (
    <>
      {renderSavedSnackBar()}
      {hasScene ? renderSceneTabsAndContent() : renderNoScene()}
    </>
  );

  function renderSavedSnackBar() {
    return (
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
          {t("play-route.scene-saved")}
        </Alert>
      </Snackbar>
    );
  }

  function renderNoScene() {
    return (
      <Box padding="1rem">
        <Box>
          <Grid container>
            <Grid item>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {"No scene has been loaded yet."}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1}>
            {renderSceneActionGridItems()}
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderSceneActionGridItems() {
    return (
      <>
        {props.canLoad && (
          <Grid item>
            <ButtonGroup
              color="inherit"
              aria-label="outlined primary button group"
            >
              <Button
                color="inherit"
                data-cy="scene.new-scene"
                size="small"
                onClick={() => {
                  const confirmed = sceneManager.state.scene
                    ? confirm(t("play-route.reset-scene-confirmation"))
                    : true;
                  if (confirmed) {
                    sceneManager.actions.addAndSetNewScene();

                    logger.track("session.new_scene");
                  }
                }}
              >
                {t("play-route.new-scene")}
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  myBinderManager.actions.open({
                    folder: "scenes",
                    callback: handleLoadScene,
                  });
                }}
              >
                {t("play-route.load-scene")}
              </Button>
            </ButtonGroup>
          </Grid>
        )}

        {sceneManager.state.scene && props.isGM && (
          <Grid item>
            <Button
              color="secondary"
              data-cy="scene.save"
              endIcon={<SaveIcon />}
              variant={sceneManager.state.dirty ? "contained" : "outlined"}
              onClick={() => {
                scenesManager.actions.upsert(sceneManager.state.scene);
                sceneManager.actions.loadScene(
                  sceneManager.state.scene as IScene
                );
                setSavedSnack(true);
                logger.track("scene.save");
              }}
            >
              {t("play-route.save-scene")}
            </Button>
          </Grid>
        )}
      </>
    );
  }

  function renderSceneTabsAndContent() {
    const tabPanelStyle = css({ padding: "0" });

    return (
      <Box>
        <Box>
          {/* <Box mb="1rem">
            <Grid
              container
              justifyContent={props.canLoad ? "flex-start" : "center"}
              spacing={2}
            >
              
            </Grid>
          </Box> */}
          <Box mb="1rem">
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={12} lg={8}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={8}>
                    {renderSceneName()}
                  </Grid>
                  <Grid item xs={4}>
                    {renderSceneGroup()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} lg={4}>
                <Grid container spacing={2} justifyContent="flex-end">
                  {renderSceneActionGridItems()}
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <TabContext value={sceneTab}>
            {renderSceneTabs()}
            <Box>
              <Box
                py="2rem"
                position="relative"
                sx={{
                  overflowX: "auto",
                }}
              >
                <TabPanel value={"public"} className={tabPanelStyle}>
                  {renderIndexCardsForTab(
                    sceneManager.state.scene?.indexCards.public,
                    "public"
                  )}
                </TabPanel>
                <TabPanel value={"private"} className={tabPanelStyle}>
                  {renderIndexCardsForTab(
                    sceneManager.state.scene?.indexCards.private,
                    "private"
                  )}
                </TabPanel>
                <TabPanel value={"notes"} className={tabPanelStyle}>
                  {renderSceneNotes()}
                </TabPanel>
              </Box>
            </Box>
          </TabContext>
        </Box>
      </Box>
    );
  }

  function renderSceneName() {
    return (
      <>
        <FateLabel
          variant="h4"
          uppercase={false}
          className={css({
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <ContentEditable
            autoFocus
            dataCy="scene.name"
            value={sceneManager.state.scene?.name ?? ""}
            readonly={!props.isGM}
            onChange={(value) => {
              sceneManager.actions.updateName(value);
            }}
          />
        </FateLabel>
        <FormHelperText>{t("play-route.scene-name")}</FormHelperText>
      </>
    );
  }

  function renderSceneGroup() {
    return (
      <>
        <Box>
          <LazyState
            value={sceneManager.state.scene?.group}
            delay={750}
            onChange={(newGroup) => {
              sceneManager.actions.setGroup(newGroup);
            }}
            render={([lazyGroup, setLazyGroup]) => {
              return (
                <Autocomplete
                  freeSolo
                  // multiple
                  options={scenesManager.state.groups.filter((g) => {
                    const currentGroup = lazyGroup ?? "";
                    return g.toLowerCase().includes(currentGroup);
                  })}
                  value={lazyGroup ?? ""}
                  onChange={(event, newValue) => {
                    setLazyGroup(newValue || undefined);
                  }}
                  inputValue={lazyGroup ?? ""}
                  onInputChange={(event, newInputValue) => {
                    setLazyGroup(newInputValue);
                  }}
                  disabled={!props.isGM}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                      data-cy="scene.group"
                      inputProps={{
                        ...params.inputProps,
                        className: css({ padding: "2px" }),
                      }}
                      className={css({
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      })}
                    />
                  )}
                />
              );
            }}
          />
          <FormHelperText>{t("play-route.group")}</FormHelperText>
        </Box>
      </>
    );
  }

  function renderSceneNotes() {
    return (
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Box>
            <Box mb="1rem">
              <FateLabel variant="h6">{t("play-route.gm-notes")}</FateLabel>
            </Box>
            <Box>
              <ContentEditable
                autoFocus
                placeholder={"Scene Notes..."}
                value={sceneManager.state.scene?.notes ?? ""}
                onChange={(newNotes) => {
                  sceneManager.actions.setNotes(newNotes);
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  }

  function renderIndexCardsForTab(
    indexCardsFromTab: Array<IIndexCard> = [],
    type: IIndexCardType
  ) {
    const hasIndexCards = indexCardsFromTab.length > 0;

    return (
      <Box>
        <Box>{renderIndexCardActions(type)}</Box>

        {renderIndexCards(indexCardsFromTab, type)}

        {!hasIndexCards && (
          <Box py="6rem" textAlign="center">
            <Typography
              variant="h6"
              className={css({
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              {t("play-route.no-aspects")}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  function renderIndexCards(
    indexCardsFromTab: Array<IIndexCard>,
    type: IIndexCardType
  ) {
    const sortByPinned: IArraySortGetter<IIndexCard> = (indexCard) => {
      return { value: indexCard.pinned, direction: "asc" };
    };

    const sorters: Array<IArraySortGetter<IIndexCard>> = [];
    if (sort === SortMode.PinnedFirst) {
      sorters.push(sortByPinned);
    }

    const cardsWithChildren = indexCardsFromTab.filter((card) => {
      return card.subCards.length > 0;
    });
    const cardsWithoutChildren = indexCardsFromTab.filter((card) => {
      return card.subCards.length === 0;
    });

    return (
      <Box ref={indexCardsContainerRef}>
        {renderIndexCardMasonry({
          columns: 1,
          allCards: indexCardsFromTab,
          cards: cardsWithChildren,
          type: type,
        })}
        {renderIndexCardMasonry({
          columns: numberOfColumnsForIndexCardsMasonry,
          allCards: indexCardsFromTab,
          cards: cardsWithoutChildren,
          type: type,
        })}
      </Box>
    );
  }

  function renderIndexCardMasonry(renderProps: {
    columns: number;
    cards: Array<IIndexCard>;
    allCards: Array<IIndexCard>;
    type: IIndexCardType;
  }) {
    if (!renderProps.cards.length) {
      return null;
    }
    return (
      <Box>
        <MasonryResizer deps={[props.sceneManager.state.scene]} />
        <Masonry
          columns={renderProps.columns}
          sx={{
            alignContent: "flex-start",
          }}
        >
          {renderProps.cards.map((indexCard, index) => {
            const hasChildren = indexCard.subCards.length > 0;
            return (
              <Box
                key={indexCard.id}
                sx={{
                  padding: ".5rem",
                  width: hasChildren ? "100% !important" : undefined,
                }}
              >
                <IndexCard
                  type={renderProps.type}
                  allCards={renderProps.allCards}
                  canMove={
                    (sort === SortMode.None ||
                      indexCard.subCards.length === 0) &&
                    props.isGM
                  }
                  dataCy={`scene.aspect.${index}`}
                  id={`index-card-${indexCard.id}`}
                  indexCardHiddenRecord={
                    hiddenIndexCardRecord.state.indexCardHiddenRecord
                  }
                  onMove={(oldId, newId) => {
                    sceneManager.actions.moveIndexCard(
                      oldId,
                      newId,
                      renderProps.type
                    );
                  }}
                  onToggleVisibility={(indexCard) => {
                    hiddenIndexCardRecord.actions.toggle(indexCard);
                  }}
                  onTogglePrivate={() => {
                    sceneManager.actions.toggleIndexCardSection(
                      indexCard,
                      renderProps.type
                    );
                  }}
                  onMoveTo={(
                    idOfIndexCardToMove: string,
                    idOfIndexCardToMoveTo: string
                  ) => {
                    sceneManager.actions.moveIndexCardTo(
                      idOfIndexCardToMove,
                      idOfIndexCardToMoveTo,
                      renderProps.type
                    );
                  }}
                  onMoveOut={(idOfIndexCardToMove) => {
                    sceneManager.actions.moveIndexCardOut(
                      idOfIndexCardToMove,
                      renderProps.type
                    );
                  }}
                  isGM={props.isGM}
                  indexCard={indexCard}
                  onRoll={props.onRoll}
                  onPoolClick={props.onPoolClick}
                  onChange={(newIndexCard) => {
                    props.onIndexCardUpdate(newIndexCard, renderProps.type);
                  }}
                  onDuplicate={() => {
                    sceneManager.actions.duplicateIndexCard(
                      indexCard,
                      renderProps.type
                    );
                  }}
                  onRemove={() => {
                    sceneManager.actions.removeIndexCard(
                      indexCard.id,
                      renderProps.type
                    );
                  }}
                />
              </Box>
            );
          })}
        </Masonry>
      </Box>
    );
  }

  function renderSceneTabs() {
    const tabClass = css({
      background: headerBackgroundColor,
      marginRight: ".5rem",
      color: `${headerColor} !important`,
      // Pentagone
      // https://bennettfeely.com/clippy/
      // clipPath: "polygon(0 0, 90% 0, 100% 35%, 100% 100%, 0 100%)",
    });
    const tabLabelClass = css({
      fontSize: ".8rem",
      // width: "100%",
    });

    return (
      <Box>
        <Tabs
          // variant="scrollable"
          // scrollButtons="auto"
          value={sceneTab}
          classes={{
            flexContainer: css({
              borderBottom: `1px solid ${headerBackgroundColor}`,
            }),
            indicator: css({
              height: ".4rem",
              backgroundColor: theme.palette.secondary.main,
            }),
          }}
          onChange={(e, newValue) => {
            setSceneTab(newValue);
          }}
        >
          <Tab
            value="public"
            data-cy="scene.tabs.public"
            label={
              <>
                <FateLabel className={tabLabelClass}>
                  {t("play-route.public")}
                </FateLabel>
              </>
            }
            className={tabClass}
          />
          {props.isGM && (
            <Tab
              value="private"
              data-cy="scene.tabs.private"
              label={
                <>
                  <FateLabel className={tabLabelClass}>
                    {t("play-route.private")}
                  </FateLabel>
                </>
              }
              className={tabClass}
            />
          )}
          {props.isGM && (
            <Tab
              value="notes"
              data-cy="scene.tabs.gm-notes"
              label={
                <>
                  <FateLabel className={tabLabelClass}>
                    {t("play-route.gm-notes")}
                  </FateLabel>
                </>
              }
              className={tabClass}
            />
          )}
        </Tabs>
      </Box>
    );
  }

  function renderIndexCardActions(type: IIndexCardType) {
    return (
      <Box mb="1rem">
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          {props.isGM && (
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <FormControl variant="standard">
                    <Select
                      native
                      inputProps={{
                        "data-cy": "scene.card-collections",
                      }}
                      value={settingsManager.state.gameTemplate}
                      onChange={(e) => {
                        settingsManager.actions.setGameTemplate(e.target.value);
                      }}
                      variant="standard"
                    >
                      <option value={""}>- Collections -</option>
                      {indexCardCollectionsManager.state.sceneIndexCardCollections.map(
                        (indexCardCollection) => (
                          <option
                            key={indexCardCollection.id}
                            value={indexCardCollection.id}
                          >
                            {previewContentEditable({
                              value: indexCardCollection.name,
                            })}
                          </option>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <SplitButton
                    dataCy="scene.add-card"
                    instant
                    color="secondary"
                    options={[
                      {
                        label: t("play-route.add-index-card").toUpperCase(),
                        endIcon: <AddCircleOutlineIcon />,
                        onClick: () => {
                          sceneManager.actions.addIndexCard(type);
                          logger.track("scene.add_index_card");
                        },
                      },
                      ...(selectedIndexCardCollection?.indexCards ?? []).map(
                        (card) => {
                          return {
                            label: previewContentEditable({
                              value: card.titleLabel.toUpperCase(),
                            }),
                            endIcon: <AddCircleOutlineIcon />,
                            onClick: () => {
                              return sceneManager.actions.duplicateIndexCard(
                                card,
                                type
                              );
                            },
                          };
                        }
                      ),
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <FormControl variant="standard">
                  <InputLabel>{t("play-route.sort")}</InputLabel>

                  <Select
                    native
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SortMode);
                    }}
                    variant="standard"
                  >
                    <option value={SortMode.None}>
                      {t("play-route.sort-options.none")}
                    </option>
                    <option value={SortMode.GroupFirst}>
                      {t("play-route.sort-options.groups-first")}
                    </option>
                    <option value={SortMode.PinnedFirst}>
                      {t("play-route.sort-options.pinned-first")}
                    </option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  color="secondary"
                  onClick={() => {
                    hiddenIndexCardRecord.actions.toggleAll();
                  }}
                >
                  {hiddenIndexCardRecord.state.areAllCardsVisible
                    ? t("play-route.collapse-all")
                    : t("play-route.expand-all")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
