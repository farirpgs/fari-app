import { css } from "@emotion/css";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ReplayIcon from "@mui/icons-material/Replay";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { lighten, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Heading } from "../../components/Heading/Heading";
import { IndexCardColor } from "../../components/IndexCard/IndexCardColor";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Images } from "../../constants/Images";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { Tags } from "./hooks/Tags";
import { useDecks } from "./hooks/useDecks";
import { useRandomFromList } from "./hooks/useRandomFromList";

function Text(props: { children: JSX.Element }) {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mb=".5rem">
        <Typography variant="subtitle1">{props.children}</Typography>
      </Box>
    </Container>
  );
}

export function StoryBuilderRoute() {
  const theme = useTheme();
  const decksManager = useDecks();
  const { t } = useTranslate();

  return (
    <Page>
      <PageMeta
        title={t("story-builder-route.meta.title")}
        description={t("story-builder-route.meta.description")}
      />

      <Heading
        title={t("story-builder-route.meta.title")}
        icon={LocalLibraryIcon}
      >
        <>
          <Text>
            <>
              Below, you will find cards that you can flip by simply clicking on
              them. Once flipped, the card will reveal an important detail about
              your story. Use that to create interesting characters and worlds
              <br />
              <br />
              Before you start, you can help the <b>Story Builder</b> by
              selecting specific <b>Tags</b>.
            </>
          </Text>
          <Text>
            <>
              <StoryDeckTags decksManager={decksManager} />
            </>
          </Text>
          <Text>
            <>Now {"let's"} write a great story!</>
          </Text>
        </>
      </Heading>

      <Container maxWidth="xl">
        <Box px="16">
          <Box pb="2rem">
            <Heading title={"Who is the story about ?"} />
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <GeneratorCard
                  color={theme.palette.primary.main}
                  label={"It is about"}
                  list={decksManager.state.decks.archetypes}
                />
              </Grid>
            </Grid>
          </Box>
          <Box pb="2rem">
            <Heading title={"Background"}>
              <Text>
                <>
                  Next, we need to know to origins of that character. Where they
                  come from and what is their background.
                </>
              </Text>
            </Heading>
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.darkBlue}
                  label={"They come from"}
                  list={decksManager.state.decks.places}
                />
              </Grid>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.darkBlue}
                  label={"And they are"}
                  list={decksManager.state.decks.backgrounds}
                />
              </Grid>
            </Grid>
          </Box>
          <Box pb="2rem">
            <Heading title={"Faces"}>
              <Text>
                <>
                  Now, let us look are key people (or <b>Faces</b>) in the life
                  our character.
                </>
              </Text>
            </Heading>
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.orange}
                  label={"Meaningful relationship with"}
                  list={decksManager.state.decks.faces}
                />
              </Grid>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.orange}
                  label={"Which revolves around"}
                  list={decksManager.state.decks.events}
                />
              </Grid>
            </Grid>
            <Text>
              <Box my="3rem">
                Now we will repeat this exercice a second time
              </Box>
            </Text>
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.yellow}
                  label={"Also has a meaningful relationship with"}
                  list={decksManager.state.decks.faces}
                />
              </Grid>
              <Grid item>
                <Grid item>
                  <GeneratorCard
                    color={IndexCardColor.yellow}
                    label={"Which revolves around"}
                    list={decksManager.state.decks.events}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box pb="2rem">
            <Heading title={"The Past"}>
              <Text>
                <>
                  We will now refine the past of our character.
                  <br />
                  <br />
                  Let us declare an event (the <b>What</b>), linked to someone
                  (the <b>Who</b>) that happened at a certain location (the{" "}
                  <b>Where</b>
                  ).
                </>
              </Text>
            </Heading>
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.brown}
                  label={"Something about"}
                  list={decksManager.state.decks.events}
                />
              </Grid>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.brown}
                  label={"Related to"}
                  list={decksManager.state.decks.faces}
                />
              </Grid>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.brown}
                  label={"Which happened around"}
                  list={decksManager.state.decks.places}
                />
              </Grid>
            </Grid>
          </Box>
          <Box pb="2rem">
            <Heading title={"Impending Issue"}>
              <Text>
                <>
                  Now there is the future. What challenges await our character
                  and will they be able to face them.
                  <br />
                  So, let us create another event!
                </>
              </Text>
            </Heading>
            <Grid container justifyContent="center" spacing={4}>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.teal}
                  label={"Something about"}
                  list={decksManager.state.decks.events}
                />
              </Grid>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.teal}
                  label={"Related to"}
                  list={decksManager.state.decks.faces}
                />
              </Grid>
              <Grid item>
                <GeneratorCard
                  color={IndexCardColor.teal}
                  label={"It will happen around"}
                  list={decksManager.state.decks.places}
                />
              </Grid>
            </Grid>
          </Box>
          <Box pb="2rem">
            <Heading title={"More"}>
              <Text>
                <>
                  Maybe you still have a couple of questions about your
                  character. Perhaps you want to add more details about their
                  past, or add another important relationship.
                  <br />
                  <br />
                  So, here are all of deck of cards that Fari has so that you
                  can answer all those questions easily.
                  <br />
                  Draw as many as you like, it is free as in beer!
                </>
              </Text>
            </Heading>
            <StoryDecks decksManager={decksManager} />
          </Box>
        </Box>
      </Container>
    </Page>
  );
}

export function StoryDecks(props: {
  decksManager: ReturnType<typeof useDecks>;
}) {
  const theme = useTheme();
  return (
    <Grid container justifyContent="center" spacing={4}>
      <Grid item>
        <GeneratorCard
          color={theme.palette.primary.main}
          label={"An Archetype"}
          list={props.decksManager.state.decks.archetypes}
        />
      </Grid>
      <Grid item>
        <GeneratorCard
          color={theme.palette.primary.main}
          label={"An Event"}
          list={props.decksManager.state.decks.events}
        />
      </Grid>
      <Grid item>
        <GeneratorCard
          color={theme.palette.primary.main}
          label={"A Face"}
          list={props.decksManager.state.decks.faces}
        />
      </Grid>
      <Grid item>
        <GeneratorCard
          color={theme.palette.primary.main}
          label={"A Place"}
          list={props.decksManager.state.decks.places}
        />
      </Grid>
    </Grid>
  );
}

export function StoryDeckTags(props: {
  decksManager: ReturnType<typeof useDecks>;
}) {
  return (
    <Grid container justifyContent="center" spacing={2}>
      {Object.keys(Tags).map((tag) => {
        return (
          <Grid item key={tag}>
            <Chip
              variant={
                props.decksManager.state.selectedTags.includes(
                  tag as unknown as Tags
                )
                  ? "filled"
                  : "outlined"
              }
              color="primary"
              label={tag}
              onClick={() => {
                props.decksManager.actions.toggleTag(tag as unknown as Tags);
              }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

function GeneratorCard<T extends { label: string }>(props: {
  list: Array<T>;
  color: string;
  label: string;
}) {
  const [state, pick] = useRandomFromList(props.list);

  function renderCardContent(renderProps: {
    title: string | undefined;
    subTitle?: string;
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
                {"..."}
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
  const animationDelayMs = 500;
  const [flipAfterAnimation, setFlipAfterAnimation] = useState(false);

  useEffect(() => {
    if (flip) {
      props.onFlip?.();
    }
  }, [flip]);

  useEffect(() => {
    let timeout: any;
    if (flipAfterAnimation) {
      timeout = setTimeout(() => {
        handleFlip();
        setFlipAfterAnimation(false);
      }, animationDelayMs);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [flipAfterAnimation]);

  function handleFlip() {
    setFlip((f) => {
      const isFlipped = f;
      return !isFlipped;
    });
  }

  function handleReFlip() {
    handleFlip();
    setFlipAfterAnimation(true);
  }

  const preventClick = props.disabled || flipAfterAnimation;

  return (
    <div
      onClick={() => {
        if (preventClick) {
          return;
        }
        if (!flip) {
          handleFlip();
        } else {
          handleReFlip();
        }
      }}
      className={css({
        label: "card",
        width: "300px",
        height: "400px",
        perspective: "1000px", // 3d effect
        cursor: preventClick ? "default" : "pointer",
        filter: props.disabled ? "grayscale(100%)" : undefined,
      })}
    >
      <div
        className={css({
          label: "card-inner",
          position: "relative",
          width: "100%",
          height: "100%",
          transition: `transform ${animationDelayMs}ms`,
          transformStyle: "preserve-3d",
          border: `8px double ${backColors.bgColor}`,
          borderRadius: "8px",
          boxShadow: theme.shadows[2],
          transform: !flip ? "rotateY(180deg)" : undefined,
        })}
      >
        <div
          className={css({
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backfaceVisibility: "hidden",
            background: frontColors.bgColor,
            color: frontColors.primary,
          })}
        >
          {props.renderFront({ colors: frontColors })}
        </div>
        <div
          className={css({
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
