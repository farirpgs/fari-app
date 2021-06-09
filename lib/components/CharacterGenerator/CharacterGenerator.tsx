import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { lighten, useTheme } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";
import React, { useEffect, useState } from "react";
import { Images } from "../../constants/Images";
import { FateLabel } from "../FateLabel/FateLabel";
import { Heading } from "../Heading/Heading";
import { IndexCardColor } from "../IndexCard/IndexCardColor";
import { Page } from "../Page/Page";

function useRandomFromList<T extends { label: string }>(list: Array<T>) {
  const [state, setState] = useState<T>();

  function pick() {
    const newElement = getRandomFromList(list);
    if (newElement) {
      setState(newElement);
    }
  }

  function getRandomFromList(list: Array<T>): T {
    const listWithoutCurrentElement = list.filter(
      (l) => l.label !== state?.label
    );
    const length = listWithoutCurrentElement.length;
    const index = Math.trunc(Math.random() * length);
    const newPick = listWithoutCurrentElement[index];
    return newPick;
  }

  return [state, pick] as const;
}

export function CharacterGenerator() {
  /**
   * ORIGIN (place) / BACKGROUND (backgrounds)
   * RELATIONSHIP (people) / CHARACTER (archetype) / RELATIONSHIP (people)
   * PAST (event) / FUTURE (event)
   *
   */

  type Card = { label: string; icon?: string };

  const archetypes: Array<Card> = [
    { label: "Rogue" },
    { label: "Warrior" },
    // { label: "Brother" },
  ];
  const backgrounds: Array<Card> = [];
  const faces: Array<Card> = [
    { label: "Mother" },
    { label: "Father" },
    { label: "Brother" },
    { label: "Sister" },
    { label: "Uncle" },
    { label: "Aunt" },
    { label: "Master" },
    { label: "Apprentice" },
  ];
  const places: Array<Card> = [
    { label: "River" },
    // {label:"Mountain"},
  ];
  const events: Array<Card> = [];

  const theme = useTheme();

  const [archetype, pickArchetype] = useRandomFromList(archetypes);
  const [origin, pickOrigin] = useRandomFromList(places);
  const [lastAdventure, setLastAdventure] = useRandomFromList(backgrounds);
  const [firstRelationship, pickFirstRelationship] = useRandomFromList(faces);
  const [firstRelationshipEvent, pickFirstRelationshipEvent] =
    useRandomFromList(events);
  const [secondRelationship, pickSecondRelationship] = useRandomFromList(faces);
  const [secondRelationshipEvent, pickSecondRelationshipEvent] =
    useRandomFromList(events);

  return (
    <Page>
      <Container maxWidth="xl">
        <Box pb="4rem">
          <Heading title={"Who you are"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <Card
                onFlip={() => {
                  pickArchetype();
                }}
                background={theme.palette.primary.main}
                back={<>{renderCardContent("Archetype")}</>}
                front={<>{renderCardContent(archetype?.label, "Archetype")}</>}
              />
            </Grid>
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Where You Come From"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <Card
                onFlip={() => {
                  pickOrigin();
                }}
                background={IndexCardColor.darkBlue}
                back={<>{renderCardContent("Origin")}</>}
                front={<>{renderCardContent(origin?.label, "Origin")}</>}
              />
            </Grid>
            <Grid item>
              <Card
                onFlip={() => {
                  setLastAdventure();
                }}
                background={IndexCardColor.darkBlue}
                back={<>{renderCardContent("Last Adventure")}</>}
                front={
                  <>
                    {renderCardContent(lastAdventure?.label, "Last Adventure")}
                  </>
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Faces"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <Card
                onFlip={() => {
                  pickFirstRelationshipEvent();
                }}
                background={IndexCardColor.orange}
                back={<>{renderCardContent("Event")}</>}
                front={
                  <>
                    {renderCardContent(firstRelationshipEvent?.label, "Event")}
                  </>
                }
              />
            </Grid>
            <Grid item>
              <Card
                onFlip={() => {
                  pickFirstRelationship();
                }}
                background={IndexCardColor.orange}
                back={<>{renderCardContent("Relationship")}</>}
                front={
                  <>
                    {renderCardContent(
                      firstRelationship?.label,
                      "Relationship"
                    )}
                  </>
                }
              />
            </Grid>
            <Grid item>
              <Card
                onFlip={() => {
                  pickSecondRelationship();
                }}
                background={IndexCardColor.purple}
                back={<>{renderCardContent("Relationship")}</>}
                front={
                  <>
                    {renderCardContent(
                      secondRelationship?.label,
                      "Relationship"
                    )}
                  </>
                }
              />
            </Grid>
            <Grid item>
              <Card
                onFlip={() => {
                  pickSecondRelationshipEvent();
                }}
                background={IndexCardColor.purple}
                back={<>{renderCardContent("Event")}</>}
                front={
                  <>
                    {renderCardContent(secondRelationshipEvent?.label, "Event")}
                  </>
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );

  function renderCardContent(
    title: JSX.Element | string | undefined,
    subTitle?: JSX.Element | string
  ) {
    const isBack = !subTitle;
    const isFront = !!subTitle;
    return (
      <Box p="2rem" height="100%">
        <Box
          display="flex"
          height="100%"
          flexDirection="column"
          justifyContent="center"
        >
          {isBack && (
            <Box display="flex" justifyContent="center" mb="2rem">
              <img
                src={Images.app}
                className={css({
                  width: "100px",
                })}
              />
            </Box>
          )}
          {isFront && (
            <Box>
              <FateLabel
                align="center"
                variant="subtitle1"
                className={css({ overflowWrap: "break-word" })}
              >
                {subTitle}
              </FateLabel>
            </Box>
          )}
          <Box>
            <FateLabel
              align="center"
              variant="h5"
              className={css({ overflowWrap: "break-word" })}
            >
              {title}
            </FateLabel>
          </Box>
          {isFront && (
            <Box display="flex" justifyContent="center" mt="3rem">
              <ReplayIcon
                className={css({
                  width: "2rem",
                  height: "2rem",
                })}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

function Card(props: {
  front: JSX.Element;
  back: JSX.Element;
  onFlip?(): void;
  background: string;
}) {
  const [flip, setFlip] = useState(false);
  const theme = useTheme();
  const backBackground = props.background;
  const backColor = theme.palette.getContrastText(backBackground);
  const frontBackground = lighten(props.background, 0.7);
  const frontColor = theme.palette.getContrastText(frontBackground);

  useEffect(() => {
    if (flip) {
      props.onFlip?.();
    }
  }, [flip]);

  return (
    <div
      onClick={() => {
        setFlip((f) => {
          const isFlipped = f;
          return !isFlipped;
        });
      }}
      className={css({
        label: "card",
        width: "300px",
        height: "400px",
        perspective: "1000px", // 3d effect
        cursor: "pointer",
      })}
    >
      <div
        className={css({
          label: "card-inner",
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.8s",
          transformStyle: "preserve-3d",
          border: `8px double ${backBackground}`,
          borderRadius: "8px",
          boxShadow: theme.shadows[2],
          transform: !flip ? "rotateY(180deg)" : undefined,
        })}
      >
        <div
          className={css({
            label: "card-front",
            position: "absolute",
            width: "100%",
            height: "100%",
            overfloww: "hidden",
            backfaceVisibility: "hidden",
            background: frontBackground,
            color: frontColor,
          })}
        >
          {props.front}
        </div>
        <div
          className={css({
            label: "card-back",
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: backBackground,
            color: backColor,
          })}
        >
          {props.back}
        </div>
      </div>
    </div>
  );
}
