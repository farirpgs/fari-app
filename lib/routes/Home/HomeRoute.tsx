import { css, cx } from "@emotion/css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GitHubIcon from "@mui/icons-material/GitHub";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container, { ContainerProps } from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import discord from "../../../images/services/discord.png";
import lokalise from "../../../images/services/lokalise.png";
import { AppButtonLink, RouterLink } from "../../components/AppLink/AppLink";
import { ConditionalWrapper } from "../../components/ConditionalWrapper/ConditionalWrapper";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Kofi } from "../../components/Kofi/Kofi";
import { FariToolbarMaxWidth, Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
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
    image: lokalise,
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
  to?: string;
  onClick?: () => void;
};

const sectionsSeparator = "4rem";

export const HomeRoute: React.FC<{}> = () => {
  const history = useHistory();
  const { t } = useTranslate();
  const logger = useLogger();
  const lightBackground = useLightBackground();
  const theme = useTheme();
  const myBinderManager = useContext(MyBinderContext);

  useEffect(() => {
    logger.track("view_home");
  }, []);

  return (
    <Page hideHeaderLogo maxWidth="100vw">
      <PageMeta
        title={undefined}
        description={t("home-route.meta.description")}
      />
      <Box>
        <DarkBox px="2rem" mt="-2rem" textAlign="left" linear>
          <Box
            className={css({ maxWidth: FariToolbarMaxWidth, margin: "0 auto" })}
          >
            <img
              alt="Fari"
              className={css({
                maxWidth: "100%",
                width: "600px",
              })}
              src={Images.logoTextWhite}
            />
          </Box>
        </DarkBox>
        <DarkBox linear px="2rem">
          <Box
            className={css({ maxWidth: FariToolbarMaxWidth, margin: "0 auto" })}
          >
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
            align="center"
            className={css({ whiteSpace: "pre-line" })}
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
        className={css({
          background: lightBackground,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {Sponsors.map((sponsor, i) => {
              return (
                <Grid item key={i}>
                  <a href={sponsor.link} target="_blank" rel="noreferrer">
                    <img
                      className={css({ width: "auto", height: "50px" })}
                      src={sponsor.image}
                      title={sponsor.name}
                    />
                  </a>
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
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/alps.png"
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
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/wizard.png"
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
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/dice.png"
          />
        ),
        to: "/dice",
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
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/cloud-backup-restore.png"
          />
        ),
        to: "/data",
      },
      {
        label: t("home-route.cards.dice-pool.title"),
        description: t("home-route.cards.dice-pool.description"),
        ctaLabel: t("home-route.cards.dice-pool.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/box.png"
          />
        ),
        to: "/dice-pool",
      },
      {
        label: t("home-route.cards.play-solo.title"),
        description: t("home-route.cards.play-solo.description"),
        ctaLabel: t("home-route.cards.play-solo.cta"),

        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/crystal-ball.png"
          />
        ),
        to: "/oracle",
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
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/comments.png"
          />
        ),
        to: "https://fari.canny.io/changelog",
      },
      {
        label: t("home-route.cards.wiki.title"),
        description: t("home-route.cards.wiki.description"),
        ctaLabel: t("home-route.cards.wiki.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/contract.png"
          />
        ),
        to: "https://fari.games/en/resources/fari-rpgs/fari-app-wiki",
      },
      {
        label: t("home-route.cards.fari-games.title"),
        description: t("home-route.cards.fari-games.description"),
        ctaLabel: t("home-route.cards.fari-games.cta"),
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/bookmark--v1.png"
          />
        ),
        to: "https://fari.games",
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
              className={css({
                width: "50px",
                height: "auto",
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              component={RouterLink}
              to={"/feature-requests"}
            >
              {t("home-route.sections.request-a-feature.cta")}
            </Button>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} container justifyContent="center" spacing={2}>
          <Grid item xs={12}>
            <img
              src={discord}
              className={css({
                width: "50px",
                height: "auto",
              })}
            />
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
          <a
            href="https://github.com/fariapp/fari"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className={css({ width: "5rem", height: "5rem" })} />
          </a>
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
          className={css({
            marginBottom: ".5rem",
            textAlign: "left",
            fontWeight: theme.typography.fontWeightBold,
            letterSpacing: "-0.035em",
          })}
        >
          <>{t("home-route.header.title")}</>
        </Typography>
        <Typography
          variant="subtitle1"
          component="h2"
          className={css({
            marginBottom: "2rem",
            textAlign: "left",
          })}
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
                className={css({ height: "3rem" })}
                onClick={() => {
                  history.push("/play");
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
                className={css({ height: "3rem" })}
                onClick={() => {
                  history.push("/play-offline");
                  logger.track("home.start_offline_game");
                }}
              >
                {t("home-route.play-offline.button")}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            flex: "1 0 auto",
          })}
        >
          <Box>
            <Rating
              defaultValue={5}
              readOnly
              size="large"
              icon={
                <FavoriteIcon
                  className={css({ fontSize: "inherit", color: "#ff6d75" })}
                />
              }
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              className={css({
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              {t("home-route.header.stats")}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
};

HomeRoute.displayName = "HomeRoute";
export default HomeRoute;

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
    className,
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
          component="h3"
          className={css({
            marginBottom: subTitle ? "1rem" : "3rem",
            textAlign: (textAlign as any) ?? "center",
            fontWeight: theme.typography.fontWeightBold,
            letterSpacing: "-0.035em",
          })}
        >
          {title}
        </Typography>
      )}
      {subTitle && (
        <Typography
          variant="h5"
          className={css({
            marginBottom: "3rem",
            textAlign: (textAlign as any) ?? "center",
            color: theme.palette.text.secondary,
          })}
        >
          {subTitle}
        </Typography>
      )}
      {children}
    </>
  );
  return (
    <Box
      className={cx(
        css({
          label: "LightBox",
        }),
        className
      )}
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
                        className={css({
                          background: `url(${img})`,
                          borderRadius: "4px",
                          boxShadow: theme.shadows[4],
                          backgroundSize: "cover",
                          minHeight: "300px",
                          width: "100%",
                          height: "100%",
                        })}
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
  const { children, className, linear, ...rest } = props;
  const highlight = useHighlight();

  return (
    <ThemeProvider theme={highlight.highlightTheme}>
      <LightBox
        className={cx(
          css({
            "label": "DarkBox",
            "background": linear
              ? highlight.linearBackground
              : highlight.radialBackground,
            "textAlign": "center",
            "color": highlight.highlightTheme.palette.text.primary,
            "& a": {
              color: highlight.highlightTheme.palette.text.primary,
            },
          }),
          className
        )}
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
                className={css({
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
                })}
              >
                <Box display="flex" justifyContent="center" mb="1rem">
                  <card.icon
                    className={css({
                      width: "4rem",
                      height: "4rem",
                    })}
                  />
                </Box>
                <Box mb="1rem">
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="textPrimary"
                    uppercase={false}
                  >
                    {card.label}
                  </FateLabel>
                </Box>
                <Box>
                  <Typography className={css({ textAlign: "center" })}>
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
                  {card.to && (
                    <Button
                      color="secondary"
                      variant="outlined"
                      size="large"
                      component={AppButtonLink}
                      to={card.to}
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
