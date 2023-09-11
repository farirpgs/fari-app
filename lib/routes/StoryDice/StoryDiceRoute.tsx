"use client";

import {
  Box,
  BoxProps,
  Button,
  ButtonBase,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { StoryDiceIcons } from "../../domains/Icons/StoryDiceIcons/StoryDiceIcons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

function Text(props: { children: JSX.Element }) {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mb=".5rem">
        <Typography variant="subtitle1">{props.children}</Typography>
      </Box>
    </Container>
  );
}

export function StoryDiceRoute() {
  const { t } = useTranslate();
  return (
    <Page sx={{ paddingTop: "2rem" }}>
      <Heading title={t("story-dice-route.meta.title")}>
        <>
          <Text>
            <>{t("story-dice-route.meta.description")}</>
          </Text>
          <Container maxWidth="md">
            <StoryDice />
          </Container>
        </>
      </Heading>
    </Page>
  );
}

export function StoryDice() {
  const [diceNameAndIcon, setDiceNameAndIcon] = useState<
    Record<string, string>
  >({});

  function handleRoll(diceName: string, sideName: string) {
    const icons = (StoryDiceIcons as any)[diceName];
    const possibleIconNames = Object.keys(icons).filter(
      (iconName) => iconName !== sideName,
    );
    const index = Math.trunc(Math.random() * possibleIconNames.length);

    setDiceNameAndIcon((prev) => {
      return {
        ...prev,
        [diceName]: possibleIconNames[index],
      };
    });
  }

  function handleRollAll() {
    Object.keys(StoryDiceIcons).forEach((diceName) => {
      const currentSide = diceNameAndIcon[diceName];
      handleRoll(diceName, currentSide);
    });
  }

  return (
    <Box>
      <Box mb="2rem">
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleRollAll}
            >
              Roll All
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {Object.keys(StoryDiceIcons).map((diceName) => {
          const currentSide = diceNameAndIcon[diceName];
          return (
            <Grid item key={diceName}>
              <StoryDie
                diceName={diceName}
                sideName={currentSide}
                onDieClick={() => {
                  handleRoll(diceName, currentSide);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export function StoryDie(props: {
  diceName: string;
  sideName: string;
  onDieClick?(): void;
}) {
  const rollingAnimationTime = 1000;
  const [rolling, setRolling] = useState(false);
  const theme = useTheme();
  const icons = (StoryDiceIcons as any)[props.diceName];
  const Icon = icons[props.sideName];
  const showFinalResult = Icon && !rolling;

  const diceRollingAnimationStyle: BoxProps["sx"] = {
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  };

  const firstUpdate = useRef(true);

  useEffect(
    function animateOnSideChange() {
      let timeout: any;
      if (props.diceName && props.sideName && !firstUpdate.current) {
        setRolling(true);

        timeout = setTimeout(() => {
          setRolling(false);
        }, rollingAnimationTime);
      }
      return () => {
        clearTimeout(timeout);
      };
    },
    [props.diceName, props.sideName],
  );

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  }, []);

  return (
    <ButtonBase
      onClick={() => {
        props.onDieClick?.();
      }}
    >
      <Box
        sx={{
          background: !showFinalResult
            ? theme.palette.background.paper
            : theme.palette.primary.main,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          borderRadius: "4px",
          padding: ".5rem",
          border: `1px dashed ${theme.palette.primary.main}`,
          cursor: "pointer",
          boxShadow: theme.shadows[2],
          transition: theme.transitions.create(["background"], {
            duration: theme.transitions.duration.shortest,
          }),
          ...(rolling && diceRollingAnimationStyle),
        }}
      >
        {showFinalResult ? (
          <Icon
            sx={{
              display: "flex",
              width: "4rem",
              height: "4rem",
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "4rem",
              height: "4rem",
            }}
          />
        )}
      </Box>
    </ButtonBase>
  );
}
