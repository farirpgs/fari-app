import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { lighten, useTheme } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";
import React, { useEffect, useState } from "react";
import { Images } from "../../constants/Images";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { FateLabel } from "../FateLabel/FateLabel";
import { Heading } from "../Heading/Heading";
import { IndexCardColor } from "../IndexCard/IndexCardColor";
import { Page } from "../Page/Page";
import { Tags, useCards } from "./hooks/useCards";
import { useRandomFromList } from "./hooks/useRandomFromList";

export function CharacterGenerator() {
  const theme = useTheme();
  const cardManager = useCards();

  return (
    <Page>
      <Container maxWidth="xl">
        <Box>
          <Grid container justify="center" spacing={2}>
            {Object.keys(Tags).map((tag) => {
              return (
                <Grid item key={tag}>
                  <Chip
                    variant={
                      cardManager.state.tags.includes(tag as unknown as Tags)
                        ? "default"
                        : "outlined"
                    }
                    color="primary"
                    label={tag}
                    onClick={() => {
                      cardManager.actions.toggle(tag as unknown as Tags);
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Who you are"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <GeneratorCard
                color={theme.palette.primary.main}
                label={"Archetype"}
                list={cardManager.state.archetypes}
              />
            </Grid>
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Where You Come From"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.darkBlue}
                label={"Origin"}
                list={cardManager.state.places}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.darkBlue}
                label={"story"}
                list={cardManager.state.backgrounds}
              />
            </Grid>
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Faces"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.orange}
                label={"Event"}
                list={cardManager.state.events}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.orange}
                label={"Relationship"}
                list={cardManager.state.faces}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.yellow}
                label={"Relationship"}
                list={cardManager.state.faces}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.yellow}
                label={"Event"}
                list={cardManager.state.events}
              />
            </Grid>
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Past Issue"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.brown}
                label={"What"}
                list={cardManager.state.events}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.brown}
                label={"Who"}
                list={cardManager.state.faces}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.brown}
                label={"Where"}
                list={cardManager.state.places}
              />
            </Grid>
          </Grid>
        </Box>
        <Box pb="4rem">
          <Heading title={"Impending Issue"} />
          <Grid container justify="center" spacing={8}>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.teal}
                label={"What"}
                list={cardManager.state.events}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.teal}
                label={"Who"}
                list={cardManager.state.faces}
              />
            </Grid>
            <Grid item>
              <GeneratorCard
                color={IndexCardColor.teal}
                label={"Where"}
                list={cardManager.state.places}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}

function GeneratorCard<T extends { label: string }>(props: {
  list: Array<T>;
  color: string;
  label: JSX.Element | string;
}) {
  const [state, pick] = useRandomFromList(props.list);

  function renderCardContent(renderProps: {
    title: JSX.Element | string | undefined;
    subTitle?: JSX.Element | string;
    colors: ReturnType<typeof useTextColors>;
  }) {
    const isBack = !renderProps.subTitle;
    const isFront = !!renderProps.subTitle;
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
            <Box mb="1rem">
              <FateLabel
                align="center"
                variant="subtitle1"
                className={css({
                  overflowWrap: "break-word",
                  color: renderProps.colors.secondary,
                })}
              >
                {renderProps.subTitle}
              </FateLabel>
            </Box>
          )}
          <Box>
            <FateLabel
              align="center"
              variant="h5"
              className={css({ overflowWrap: "break-word" })}
            >
              {renderProps.title}
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

  return (
    <Card
      onFlip={() => {
        pick();
      }}
      disabled={props.list.length === 0}
      background={props.color}
      renderBack={(renderProps) => (
        <>
          {renderCardContent({
            title: props.label,
            colors: renderProps.colors,
          })}
        </>
      )}
      renderFront={(renderProps) => (
        <>
          {renderCardContent({
            title: state?.label,
            subTitle: props.label,
            colors: renderProps.colors,
          })}
        </>
      )}
    />
  );
}

function Card(props: {
  renderFront(renderProps: {
    colors: ReturnType<typeof useTextColors>;
  }): JSX.Element;
  renderBack(renderProps: {
    colors: ReturnType<typeof useTextColors>;
  }): JSX.Element;

  disabled?: boolean;
  onFlip?(): void;
  background: string;
}) {
  const [flip, setFlip] = useState(false);
  const theme = useTheme();

  const backColors = useTextColors(props.background);
  const frontColors = useTextColors(lighten(props.background, 0.7));

  useEffect(() => {
    if (flip) {
      props.onFlip?.();
    }
  }, [flip]);

  return (
    <div
      onClick={() => {
        if (props.disabled) {
          return;
        }
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
        cursor: props.disabled ? "default" : "pointer",
        filter: props.disabled ? "grayscale(100%)" : undefined,
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
          border: `8px double ${backColors.bgColor}`,
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
            background: frontColors.bgColor,
            color: frontColors.primary,
          })}
        >
          {props.renderFront({ colors: frontColors })}
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
            background: backColors.bgColor,
            color: backColors.primary,
          })}
        >
          {props.renderBack({ colors: backColors })}
        </div>
      </div>
    </div>
  );
}
