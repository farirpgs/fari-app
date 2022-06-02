import { css } from "@emotion/css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import Masonry from "@mui/lab/Masonry";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import produce from "immer";
import isEqual from "lodash/isEqual";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import {
  ContentEditable,
  previewContentEditable,
} from "../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { IndexCard } from "../../components/IndexCard/IndexCard";
import { MasonryResizer } from "../../components/MasonryResizer/MasonryResizer";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { IndexCardCollectionsContext } from "../../contexts/IndexCardCollectionsContext/IndexCardCollectionsContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { IIndexCardCollection } from "../../domains/index-card-collection/IndexCardCollectionFactory";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { useResponsiveValue } from "../../hooks/useResponsiveValue/useResponsiveValue";
import { IIndexCard } from "../../hooks/useScene/IScene";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

function useCardCollection(props: {
  cardCollection: IIndexCardCollection | undefined;
}) {
  const [cardCollection, setCardCollection] = useState<
    IIndexCardCollection | undefined
  >(undefined);

  const dirty = useMemo(() => {
    if (!props.cardCollection) {
      return false;
    }

    return !isEqual(cardCollection, props.cardCollection);
  }, [cardCollection, props.cardCollection]);

  useEffect(() => {
    if (props.cardCollection) {
      setCardCollection(props.cardCollection);
    }
  }, [props.cardCollection]);

  function setName(name: string) {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.name = name;
      })
    );
  }

  function addCard() {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.indexCards.push(SceneFactory.makeIndexCard());
      })
    );
  }

  function removeIndexCard(indexCardId: string) {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const index = draft.indexCards.findIndex((c) => c.id === indexCardId);
        draft.indexCards.splice(index, 1);
      })
    );
  }

  function duplicateIndexCard(indexCard: IIndexCard) {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const index = draft.indexCards.findIndex((c) => c.id === indexCard.id);
        const copy = SceneFactory.duplicateIndexCard(indexCard);
        draft.indexCards.splice(index, 0, copy);
      })
    );
  }

  function updateIndexCard(updatedIndexCard: IIndexCard) {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const index = draft.indexCards.findIndex(
          (c) => c.id === updatedIndexCard.id
        );
        draft.indexCards[index] = updatedIndexCard;
      })
    );
  }

  function moveIndexCard(dragId: string, hoverId: string) {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }
        if (!draft) {
          return;
        }

        if (dragId === undefined || hoverId === undefined) {
          return;
        }

        const dragIndex = draft.indexCards.findIndex((c) => c.id === dragId);
        const hoverIndex = draft.indexCards.findIndex((c) => c.id === hoverId);

        const dragItem = draft.indexCards[dragIndex];

        draft.indexCards.splice(dragIndex, 1);
        draft.indexCards.splice(hoverIndex, 0, dragItem);
      })
    );
  }

  function moveIndexCardTo(
    idOfIndexCardToMove: string,
    idOfIndexCardToMoveTo: string
  ) {
    setCardCollection(
      produce((draft) => {
        if (!draft) {
          return;
        }

        const indexCards = draft.indexCards;
        const indexCardToMove = removeIndexCardFromCurrentPosition();
        addIndexCardToNewPosition(indexCardToMove);

        function removeIndexCardFromCurrentPosition() {
          for (const [index, card] of indexCards.entries()) {
            if (card.id === idOfIndexCardToMove) {
              return indexCards.splice(index, 1)[0];
            }
            for (const [subCardIndex, subCard] of card.subCards.entries()) {
              if (subCard.id === idOfIndexCardToMove) {
                return card.subCards.splice(subCardIndex, 1)[0];
              }
            }
          }
        }

        function addIndexCardToNewPosition(cardToAdd: IIndexCard | undefined) {
          if (!cardToAdd) {
            return;
          }

          for (const card of indexCards) {
            if (card.id === idOfIndexCardToMoveTo) {
              card.subCards.push(cardToAdd);
              return;
            }
          }
        }
      })
    );
  }

  return {
    state: {
      cardCollection: cardCollection,
      dirty,
    },
    actions: {
      setName,
      setCardCollection: setCardCollection,
      addCard,
      removeIndexCard,
      duplicateIndexCard,
      moveIndexCard,
      moveIndexCardTo,
      updateIndexCard,
    },
  };
}

export const CardCollectionRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const indexCardCollectionsManager = useContext(IndexCardCollectionsContext);
  const [selectedCardCollection, setSelectedCardCollection] = useState<
    IIndexCardCollection | undefined
  >(undefined);

  const indexCardCollectionManager = useCardCollection({
    cardCollection: selectedCardCollection,
  });
  const pageTitle = previewContentEditable({
    value: indexCardCollectionManager.state.cardCollection?.name,
  });
  const numberOfColumnsForCards = useResponsiveValue({
    xl: 4,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1,
  });

  const { t } = useTranslate();
  const theme = useTheme();
  const history = useHistory();
  const logger = useLogger();
  const myBinderManager = useContext(MyBinderContext);

  useEffect(() => {
    logger.track("card_collection.view");
  }, []);

  useEffect(() => {
    const cardToLoad =
      indexCardCollectionsManager.state.indexCardCollections.find(
        (s) => s.id === props.match.params.id
      );

    if (cardToLoad) {
      setSelectedCardCollection(cardToLoad);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "index-card-collections" });
    }
  }, [
    props.match.params.id,
    indexCardCollectionsManager.state.indexCardCollections,
  ]);

  return (
    <>
      <PageMeta title={pageTitle} />
      <Page maxWidth="none">
        <Container maxWidth="md">
          <Box mb=".5rem">
            <Alert severity="info">
              <Typography variant="body1">
                Use Card Collections to create templates that you will be able
                to pull easily inside scenes during a game session.
              </Typography>
            </Alert>
          </Box>

          <Box mb="1rem">
            <FateLabel
              variant="h4"
              uppercase={false}
              className={css({
                borderBottom: `1px solid ${theme.palette.divider}`,
                textAlign: "center",
              })}
            >
              <ContentEditable
                autoFocus
                value={
                  indexCardCollectionManager.state.cardCollection?.name || ""
                }
                onChange={(newValue) => {
                  indexCardCollectionManager.actions.setName(newValue);
                }}
              />
            </FateLabel>

            <FormHelperText className={css({ textAlign: "right" })}>
              {t("card-collection-route.card-collection-name")}
            </FormHelperText>
          </Box>
          <Box mb="2rem">
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Button
                  color="secondary"
                  data-cy="scene.save"
                  endIcon={<SaveIcon />}
                  variant={
                    indexCardCollectionManager.state.dirty
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    indexCardCollectionsManager.actions.upsert(
                      indexCardCollectionManager.state.cardCollection
                    );
                  }}
                >
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => {
                    indexCardCollectionManager.actions.addCard();
                  }}
                  endIcon={<AddCircleOutlineIcon />}
                >
                  Add Card
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Container maxWidth="xl">
          <Box mb="1rem">{renderIndexCards()}</Box>
        </Container>
      </Page>
    </>
  );

  function renderIndexCards() {
    const cardsWithSubCards =
      indexCardCollectionManager.state.cardCollection?.indexCards.filter(
        (card) => card.subCards.length > 0
      );
    const cardsWithoutSubCards =
      indexCardCollectionManager.state.cardCollection?.indexCards.filter(
        (card) => card.subCards.length === 0
      );

    return (
      <Box>
        <MasonryResizer
          deps={[indexCardCollectionManager.state.cardCollection]}
        />
        {renderIndexCardsMasonry({
          cards: cardsWithSubCards,
          columns: 1,
        })}
        {renderIndexCardsMasonry({
          cards: cardsWithoutSubCards,
          columns: numberOfColumnsForCards,
        })}
      </Box>
    );
  }

  function renderIndexCardsMasonry(renderProps: {
    cards: IIndexCard[] | undefined;
    columns: number;
  }) {
    if (!renderProps.cards?.length) {
      return;
    }
    return (
      <Masonry
        columns={renderProps.columns}
        sx={{
          alignContent: "flex-start",
        }}
      >
        {renderProps.cards.map((indexCard, index) => {
          return (
            <Box key={indexCard.id}>
              <IndexCard
                type={"public"}
                allCards={
                  indexCardCollectionManager.state.cardCollection?.indexCards ??
                  []
                }
                isGM={true}
                canMove={indexCard.subCards.length === 0}
                key={indexCard.id}
                dataCy={`card-collection.card.${index}`}
                id={`index-card-${indexCard.id}`}
                indexCard={indexCard}
                onRoll={() => {}}
                onPoolClick={() => {}}
                onMoveTo={(
                  idOfIndexCardToMove: string,
                  idOfIndexCardToMoveTo: string
                ) => {
                  indexCardCollectionManager.actions.moveIndexCardTo(
                    idOfIndexCardToMove,
                    idOfIndexCardToMoveTo
                  );
                }}
                onMove={(dragId, hoverId) => {
                  indexCardCollectionManager.actions.moveIndexCard(
                    dragId,
                    hoverId
                  );
                }}
                onChange={(newIndexCard) => {
                  indexCardCollectionManager.actions.updateIndexCard(
                    newIndexCard
                  );
                }}
                onDuplicate={() => {
                  indexCardCollectionManager.actions.duplicateIndexCard(
                    indexCard
                  );
                }}
                onRemove={() => {
                  indexCardCollectionManager.actions.removeIndexCard(
                    indexCard.id
                  );
                }}
              />
            </Box>
          );
        })}
      </Masonry>
    );
  }
};

CardCollectionRoute.displayName = "CardCollectionRoute";
export default CardCollectionRoute;
