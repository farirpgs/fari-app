"use client";

import FavoriteIcon from "@mui/icons-material/Favorite";
import GitHubIcon from "@mui/icons-material/GitHub";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {
  Box,
  BoxProps,
  Button,
  Container,
  ContainerProps,
  Divider,
  Grid,
  Rating,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import discord from "../../../images/services/discord.png";
import lokalise from "../../../images/services/lokalise.png";
import { AppButtonLink, RouterLink } from "../../components/AppLink/AppLink";
import { ConditionalWrapper } from "../../components/ConditionalWrapper/ConditionalWrapper";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Kofi } from "../../components/Kofi/Kofi";
import { FariToolbarMaxWidth, Page } from "../../components/Page/Page";
import { Patreon } from "../../components/Patreon/Patreon";
import { Images } from "../../constants/Images";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { useHighlight } from "../../hooks/useHighlight/useHighlight";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const Patrons = [
  "James Micu",
  "Randy Oest",
  "Ryan Singer",
  "Aeife O'Brien",
  "David Haslem",
  "Fluffydumplin",
  "Lynn Jones",
  "Krister Svanlund",
];

const Sponsors: Array<{ image: string; name: string; link: string }> = [
  {
    name: "Netlify",
    image: "https://www.netlify.com/img/global/badges/netlify-color-accent.svg",
    link: "https://www.netlify.com",
  },
  {
    name: "Lokalise",
    image: lokalise.src,
    link: "https://lokalise.com/",
  },
  {
    name: "Liveblocks",
    image: "https://gyazo.com/195675f9a76d92c013c6cd33330e6e6b.png",
    link: "https://liveblocks.io/",
  },
];

type IHomeRouteCard = {
  label: string;
  description: string;
  ctaLabel: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
};

const sectionsSeparator = "4rem";

export const HomeRoute: React.FC<{}> = () => {
  const { t } = useTranslate();
  const logger = useLogger();
  const lightBackground = useLightBackground();
  const theme = useTheme();
  const myBinderManager = useContext(MyBinderContext);
  const router = useRouter();
  useEffect(() => {
    logger.track("view_home");
  }, []);

  return (
    <Page hideHeaderLogo maxWidth="100vw" sx={{ paddingTop: "2rem" }}>
      <Box>
        <DarkBox px="2rem" mt="-2rem" textAlign="left" linear>
          <Box sx={{ maxWidth: FariToolbarMaxWidth, margin: "0 auto" }}>
            <Box
              component="img"
              alt="Fari"
              sx={{
                maxWidth: "100%",
                width: "600px",
              }}
              src={Images.logoTextWhite}
            />
          </Box>
        </DarkBox>
        <DarkBox linear px="2rem">
          <Box sx={{ maxWidth: FariToolbarMaxWidth, margin: "0 auto" }}>
            <Box>
              <LightBox
                textAlign="left"
                py="2rem"
                imageSrcs={[
                  "https://gyazo.com/697a63e5e97d9384310d87e7c0b462e1.png",
                  "https://gyazo.com/cc7519a58190e6d12504f9d06908d518.png",
                ]}
              >
                {renderHeading()}
              </LightBox>
            </Box>
          </Box>
        </DarkBox>
        <LightBox
          subTitle={t("home-route.sections.getting-started.sub-title")}
          maxWidth="lg"
          px="2rem"
          py="2rem"
        >
          {renderFirstActionCards()}
        </LightBox>
        <DarkBox
          title={t("home-route.sections.join-community.title")}
          subTitle={t("home-route.sections.join-community.sub-title")}
          px="2rem"
          py="5rem"
          maxWidth="sm"
        >
          {renderCommunity()}
        </DarkBox>
        <LightBox
          title={t("home-route.sections.tools.title")}
          px="2rem"
          py="2rem"
          maxWidth="lg"
        >
          {renderSecondActionCards()}
        </LightBox>
        <DarkBox
          title={t("home-route.sections.patreon.title")}
          px="2rem"
          py="5rem"
          maxWidth="sm"
        >
          {renderPatrons()}
        </DarkBox>
        {renderSponsors()}
        <LightBox px="2rem" maxWidth="lg" pt="2rem" pb="5rem">
          {renderThirdActionCards()}
        </LightBox>
        <DarkBox
          title={t("home-route.sections.open-source.title")}
          subTitle={t("home-route.sections.open-source.sub-title")}
          px="2rem"
          py="5rem"
          maxWidth="sm"
        >
          {renderOpenSource()}
        </DarkBox>

        <LightBox
          px="2rem"
          py="5rem"
          maxWidth="sm"
          title={t("home-route.support-fari.title")}
        >
          {renderSupport()}
        </LightBox>
      </Box>
    </Page>
  );

  function renderSupport() {
    return (
      <Box>
        <Box mb="2rem">
          <Typography
            variant="subtitle1"
            component={"p"}
            align="center"
            sx={{ whiteSpace: "pre-line" }}
          >
            {t("home-route.support-fari.description")}
          </Typography>
        </Box>
        <Box mb="1rem">
          <Grid
            container
            justifyContent="center"
            spacing={2}
            alignItems="center"
          >
            <Grid item>
              <Kofi />
            </Grid>
            <Grid item>
              <Patreon />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderPatrons() {
    return (
      <Box textAlign="center">
        <Box mb="2rem">
          <Grid container spacing={1} justifyContent="center">
            {Patrons.map((patron, i) => {
              const isLast = i === Patrons.length - 1;

              return (
                <React.Fragment key={i}>
                  <Grid item>
                    <FateLabel>{patron}</FateLabel>
                  </Grid>
                  {!isLast && (
                    <Grid item>
                      <FateLabel>{"•"}</FateLabel>
                    </Grid>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
        </Box>
        <Box mb="2rem">
          <Grid container item justifyContent="center">
            <Patreon />
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderSponsors() {
    return (
      <Box
        px="2rem"
        py="4rem"
        mb={sectionsSeparator}
        sx={{
          background: lightBackground,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {Sponsors.map((sponsor, i) => {
              return (
                <Grid item key={i}>
                  <Link href={sponsor.link} target="_blank" rel="noreferrer">
                    <Box
                      component="img"
                      sx={{ width: "auto", height: "50px" }}
                      src={sponsor.image}
                      title={sponsor.name}
                    />
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    );
  }

  function renderFirstActionCards() {
    const cards: Array<IHomeRouteCard> = [
      {
        label: t("home-route.cards.scenes.title"),
        description: t("home-route.cards.scenes.description"),
        ctaLabel: t("home-route.cards.scenes.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/alps.png"
            alt="scenes"
          />
        ),
        onClick: () => {
          myBinderManager.actions.open({ folder: "scenes" });
        },
      },
      {
        label: t("home-route.cards.characters.title"),
        description: t("home-route.cards.characters.description"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/wizard.png"
            alt="characters"
          />
        ),
        ctaLabel: t("home-route.cards.characters.cta"),
        onClick: () => {
          myBinderManager.actions.open({ folder: "characters" });
        },
      },
      {
        label: t("home-route.cards.dice-roller.title"),
        description: t("home-route.cards.dice-roller.description"),
        ctaLabel: t("home-route.cards.dice-roller.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/dice.png"
            alt="dice-roller"
          />
        ),
        href: "/dice",
      },
    ];
    return (
      <Box>
        <HomeRouteCards cards={cards} />
      </Box>
    );
  }
  function renderSecondActionCards() {
    const cards: Array<IHomeRouteCard> = [
      {
        label: t("home-route.cards.data.title"),
        description: t("home-route.cards.data.description"),
        ctaLabel: t("home-route.cards.data.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/cloud-backup-restore.png"
            alt="data"
          />
        ),
        href: "/data",
      },

      {
        label: t("home-route.cards.play-solo.title"),
        description: t("home-route.cards.play-solo.description"),
        ctaLabel: t("home-route.cards.play-solo.cta"),

        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/crystal-ball.png"
            alt="play-solo"
          />
        ),
        href: "/oracle",
      },
    ];
    return (
      <Box>
        <HomeRouteCards cards={cards} />
      </Box>
    );
  }

  function renderThirdActionCards() {
    const cards: Array<IHomeRouteCard> = [
      {
        label: t("home-route.cards.changelog.title"),
        description: t("home-route.cards.changelog.description"),
        ctaLabel: t("home-route.cards.changelog.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            alt="changelog"
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/comments.png"
          />
        ),
        href: "https://fari.canny.io/changelog",
      },
      {
        label: t("home-route.cards.wiki.title"),
        description: t("home-route.cards.wiki.description"),
        ctaLabel: t("home-route.cards.wiki.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            alt="wiki"
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/contract.png"
          />
        ),
        href: "https://fari.community/creators/fari-rpgs/projects/fari-app-wiki",
      },
      {
        label: t("home-route.cards.fari-games.title"),
        description: t("home-route.cards.fari-games.description"),
        ctaLabel: t("home-route.cards.fari-games.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <Image
            className={props.className}
            alt="fari-games"
            width={100}
            height={100}
            src="https://img.icons8.com/plasticine/100/000000/bookmark--v1.png"
          />
        ),
        href: "https://fari.community",
      },
    ];
    return (
      <Box>
        <HomeRouteCards cards={cards} />
      </Box>
    );
  }

  function renderCommunity() {
    return (
      <Grid container justifyContent="center" alignItems="baseline" spacing={2}>
        <Grid item md={6} xs={12} container justifyContent="center" spacing={2}>
          <Grid item xs={12}>
            <QuestionAnswerIcon
              sx={{
                width: "50px",
                height: "auto",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              LinkComponent={RouterLink}
              href={"/feature-requests"}
            >
              {t("home-route.sections.request-a-feature.cta")}
            </Button>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} container justifyContent="center" spacing={2}>
          <Grid item xs={12}>
            <Image src={discord.src} alt="Discord" />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              component="a"
              href="https://farirpgs.com/discord"
              target="_blank"
              rel="noreferrer"
            >
              {t("home-route.sections.join-community.cta")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  function renderOpenSource() {
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Typography>
            {t("home-route.sections.open-source.description")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Link
            href="https://github.com/fariapp/fari"
            target="_blank"
            rel="noreferrer"
            title="Github"
          >
            <GitHubIcon sx={{ width: "5rem", height: "5rem" }} />
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="outlined"
            component="a"
            href="https://github.com/fariapp/fari"
            target="_blank"
            rel="noreferrer"
          >
            {t("home-route.sections.open-source.cta")}
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderHeading() {
    return (
      <Box display="flex" flexDirection="column" height="100%">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            marginBottom: ".5rem",
            textAlign: "left",
            fontWeight: theme.typography.fontWeightBold,
            letterSpacing: "-0.035em",
          }}
        >
          <>{t("home-route.header.title")}</>
        </Typography>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          {t("home-route.header.subtitle")}
        </Typography>
        <Box mb="1rem" display="flex">
          <Grid container spacing={2} alignItems="center">
            <Grid item lg={6} xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ height: "3rem" }}
                onClick={() => {
                  router.push("/play");
                  logger.track("home.start_online_game");
                }}
              >
                {t("home-route.header.cta")}
              </Button>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                data-cy="home.play-offline"
                sx={{ height: "3rem" }}
                onClick={() => {
                  router.push("/play-offline");
                  logger.track("home.start_offline_game");
                }}
              >
                {t("home-route.play-offline.button")}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            flex: "1 0 auto",
          }}
        >
          <Box>
            <Rating
              defaultValue={5}
              readOnly
              size="large"
              icon={
                <FavoriteIcon sx={{ fontSize: "inherit", color: "#ff6d75" }} />
              }
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              component={"p"}
              sx={{
                fontWeight: theme.typography.fontWeightBold,
              }}
            >
              {t("home-route.header.stats")}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
};

type ILightBoxProps = {
  children: JSX.Element;
  title?: JSX.Element | string;
  subTitle?: JSX.Element | string;
  imageSrcs?: Array<string>;
  textAlign?: string;
  maxWidth?: ContainerProps["maxWidth"];
} & Omit<BoxProps, "maxWidth" | "title">;

function LightBox(props: ILightBoxProps) {
  const {
    children,
    sx,
    maxWidth,
    title,
    subTitle,
    imageSrcs,
    textAlign,
    ...boxProps
  } = props;
  const theme = useTheme();

  const content = (
    <>
      {title && (
        <Typography
          variant="h3"
          component="p"
          sx={{
            marginBottom: subTitle ? "1rem" : "3rem",
            textAlign: (textAlign as any) ?? "center",
            fontWeight: theme.typography.fontWeightBold,
            letterSpacing: "-0.035em",
          }}
        >
          {title}
        </Typography>
      )}
      {subTitle && (
        <Typography
          variant="h5"
          component="p"
          sx={{
            marginBottom: "3rem",
            textAlign: (textAlign as any) ?? "center",
            color: theme.palette.text.secondary,
          }}
        >
          {subTitle}
        </Typography>
      )}
      {children}
    </>
  );
  return (
    <Box
      sx={{
        label: "LightBox",
        ...sx,
      }}
    >
      <Box {...boxProps}>
        <ConditionalWrapper
          condition={maxWidth !== undefined}
          wrapper={(children) => {
            return (
              <Container maxWidth={maxWidth}>
                <>{children}</>
              </Container>
            );
          }}
        >
          {imageSrcs ? (
            <Grid container spacing={4}>
              <Grid item sm={12} lg={6}>
                {content}
              </Grid>
              <Grid item sm={12} lg={6} container spacing={2}>
                {imageSrcs.map((img) => {
                  return (
                    <Grid key={img} item xs={12} sm>
                      <Box
                        sx={{
                          background: `url(${img})`,
                          borderRadius: "4px",
                          boxShadow: theme.shadows[4],
                          backgroundSize: "cover",
                          minHeight: "300px",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          ) : (
            content
          )}
        </ConditionalWrapper>
      </Box>
    </Box>
  );
}

function DarkBox(props: ILightBoxProps & { linear?: boolean }) {
  const { children, sx, linear, ...rest } = props;
  const highlight = useHighlight();

  return (
    <ThemeProvider theme={highlight.highlightTheme}>
      <LightBox
        sx={{
          ...sx,
          "label": "DarkBox",
          "background": linear
            ? highlight.linearBackground
            : highlight.radialBackground,
          "textAlign": "center",
          "color": highlight.highlightTheme.palette.text.primary,
          "& a": {
            color: highlight.highlightTheme.palette.text.primary,
          },
        }}
        {...rest}
      >
        {children}
      </LightBox>
    </ThemeProvider>
  );
}

function HomeRouteCards(props: { cards: Array<IHomeRouteCard> }) {
  const theme = useTheme();
  const lightBackground = useLightBackground();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Grid container justifyContent="center" spacing={3}>
        {props.cards.map((card, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  "label": "HomeRouteCards-card",
                  "padding": "2.5rem",
                  "height": "100%",
                  "borderRadius": "4px",
                  "background": lightBackground,
                  "border": `1px solid ${theme.palette.divider}`,
                  "width": "100%",
                  "transition": theme.transitions.create([
                    "transform",
                    "box-shadow",
                  ]),
                  "&:hover": {
                    transform: isSmall ? undefined : "scale(1.005)",
                    boxShadow: isSmall ? undefined : theme.shadows[1],
                  },
                }}
              >
                <Box display="flex" justifyContent="center" mb="1rem">
                  <card.icon
                    sx={{
                      width: "4rem",
                      height: "4rem",
                    }}
                  />
                </Box>
                <Box mb="1rem">
                  <FateLabel
                    variant="h5"
                    component={"p"}
                    align="center"
                    color="textPrimary"
                    uppercase={false}
                  >
                    {card.label}
                  </FateLabel>
                </Box>
                <Box>
                  <Typography sx={{ textAlign: "center" }}>
                    {card.description}
                  </Typography>
                </Box>
                <Box my="2rem">
                  <Divider light />
                </Box>
                <Box display="flex" justifyContent="center">
                  {card.onClick && (
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={(e) => {
                        e.preventDefault;
                        card.onClick?.();
                      }}
                    >
                      {card.ctaLabel}
                    </Button>
                  )}
                  {card.href && (
                    <Button
                      color="secondary"
                      variant="outlined"
                      size="large"
                      LinkComponent={AppButtonLink}
                      href={card.href}
                    >
                      {card.ctaLabel}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
