import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container, { ContainerProps } from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import FavoriteIcon from "@material-ui/icons/Favorite";
import HelpIcon from "@material-ui/icons/Help";
import Rating from "@material-ui/lab/Rating";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/blue/app.png";
import { RouterLink } from "../../components/AppLink/AppLink";
import { ConditionalWrapper } from "../../components/ConditionalWrapper/ConditionalWrapper";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Heading } from "../../components/Heading/Heading";
import { Kofi } from "../../components/Kofi/Kofi";
import { ManagerMode } from "../../components/Manager/Manager";
import { FariToolbarMaxWidth, Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Patreon } from "../../components/Patreon/Patreon";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { useHighlight } from "../../hooks/useHighlight/useHighlight";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import { isWebRTCSupported } from "../../hooks/usePeerJS/usePeerJS";
import { useThemeFromColor } from "../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { MiscellaneousItems, WikiItems } from "../SrdsRoute/SrdsRoute";

const Patrons = [
  "James Micu",
  "Randy Oest",
  "Ryan Singer",
  "Aeife O'Brien",
  "GhostDM",
  "Fluffydumplin",
  "Ty Prunty",
];

const sectionGridItem = css({
  display: "flex",
  justifyContent: "center",
  // flex: "1 0 auto",
});

type IHomeRouteCard = {
  label: string;
  description: string;
  ctaLabel: string;
  icon: React.ElementType;
  to?: string;
  onClick?: () => void;
};

const sectionsSeparator = "4rem";

export const HomeRoute: React.FC<{}> = (props) => {
  const history = useHistory();
  const { t } = useTranslate();
  const logger = useLogger();
  const theme = useTheme();
  const scenesManager = useContext(ScenesContext);
  const charactersManager = useContext(CharactersContext);
  const inverted = useThemeFromColor(
    theme.palette.getContrastText(theme.palette.text.primary)
  );

  useEffect(() => {
    logger.info("Route:Home");
  }, []);

  return (
    <Page hideHeaderLogo maxWidth="100vw">
      <PageMeta
        title={t("home-route.meta.title")}
        description={t("home-route.meta.description")}
      />
      <Box>
        <DarkBox px="2rem" pb="1rem" mt="-2rem" textAlign="left" linear>
          <Box
            className={css({ maxWidth: FariToolbarMaxWidth, margin: "0 auto" })}
          >
            <Grid container justify="center" alignItems="center" spacing={3}>
              <Grid item>
                <img alt="Fari" width="70px" src={appIcon} />
              </Grid>
              <Grid item>
                <FateLabel
                  variant="h3"
                  align="center"
                  color="primary"
                  uppercase={false}
                >
                  {"Fari"}
                </FateLabel>
              </Grid>
            </Grid>
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
                mb={sectionsSeparator}
                imageSrcs={[
                  "https://gyazo.com/8bfd3d59844728d5ee749ffe48196f23.png",
                  "https://gyazo.com/cc7519a58190e6d12504f9d06908d518.png",
                ]}
              >
                {renderHeading()}
              </LightBox>
            </Box>
          </Box>
        </DarkBox>
        <LightBox maxWidth="lg" mb={sectionsSeparator}>
          {renderPlayButtons()}
        </LightBox>

        <LightBox
          title="Getting Started"
          subTitle="Playing TTRPG online should not be complicated. Get started now."
          maxWidth="lg"
          px="2rem"
          mb={sectionsSeparator}
          py="2rem"
        >
          {renderFirstActionCards()}
        </LightBox>
        <DarkBox
          title="Join the Community"
          subTitle="Have a say in the future of the app."
          px="2rem"
          py="5rem"
          mb={sectionsSeparator}
          maxWidth="sm"
        >
          {renderDiscord()}
        </DarkBox>
        <LightBox
          title="Essential Tools"
          px="2rem"
          py="2rem"
          mb={sectionsSeparator}
          maxWidth="lg"
        >
          {renderSecondActionCards()}
        </LightBox>
        <DarkBox
          px="2rem"
          py="5rem"
          mb={sectionsSeparator}
          title="Special thanks to those fine folks"
          maxWidth="sm"
        >
          {renderPatrons()}
        </DarkBox>
        <LightBox px="2rem" mb={sectionsSeparator} maxWidth="lg">
          {renderThirdActionCards()}
        </LightBox>
        <LightBox px="2rem" mb={sectionsSeparator} maxWidth="md">
          <>
            <Heading icon={HelpIcon} title={"Wikis & Resources"} />
            <WikiItems />
            <Box pt="2rem" />
            <Heading icon={HelpIcon} title={"Miscellaneous"} />
            <MiscellaneousItems />
          </>
        </LightBox>
        <DarkBox px="2rem" py="5rem" maxWidth="sm" mb={sectionsSeparator}>
          {renderSupport()}
        </DarkBox>
      </Box>
    </Page>
  );

  function renderSupport() {
    return (
      <Box>
        <Box mb="1rem">
          <FateLabel variant="h4" align="center" color="primary">
            {t("home-route.support-fari.title")}
          </FateLabel>
        </Box>
        <Typography
          variant="body1"
          align="center"
          className={css({ whiteSpace: "pre-line" })}
        >
          {t("home-route.support-fari.description")}
        </Typography>
        <Box py="1rem">
          <Grid container justify="center" spacing={2} alignItems="center">
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
        <Box my=".5rem">
          <Grid container spacing={1} justify="center">
            {Patrons.map((patron, i) => {
              const isLast = i === Patrons.length - 1;
              const dot = !isLast ? "•" : undefined;
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
        <Box my="1rem">
          <Grid container item justify="center">
            <Patreon />
          </Grid>
        </Box>
      </Box>
    );
  }

  function renderPlayButtons() {
    return (
      <Box>
        <Grid container justify="center" spacing={8} alignItems="flex-start">
          {isWebRTCSupported() && (
            <Grid item xs={12} md={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Box mb="2rem">
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    size="large"
                    className={css({ height: "3rem" })}
                    onClick={() => {
                      history.push("/play");
                      logger.info("HomeRoute:onStartOnlineGame");
                    }}
                  >
                    {t("home-route.play-online.button")}
                  </Button>
                </Box>
                <Box py="1rem" textAlign="center">
                  <Typography variant="h5" align="center">
                    {t("home-route.play-online.description")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Hidden smDown>
            <Divider
              orientation="vertical"
              flexItem
              className={css({
                margin: "5rem 2rem",
                height: "3rem",
              })}
            />
          </Hidden>

          <Grid item xs={12} md={4} className={sectionGridItem}>
            <Box height="100%" display="flex" flexDirection="column">
              <Box mb="2rem">
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  size="large"
                  className={css({ height: "3rem" })}
                  data-cy="home.play-offline"
                  onClick={() => {
                    history.push("/play-offline");
                    logger.info("HomeRoute:onStartOfflineGame");
                  }}
                >
                  {t("home-route.play-offline.button")}
                </Button>
              </Box>

              <Box py="1rem" textAlign="center">
                <Typography variant="h5" align="center">
                  {t("home-route.play-offline.description")}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderFirstActionCards() {
    const cards: Array<IHomeRouteCard> = [
      {
        label: "Scenes",
        description:
          "Prepare your Scenes in advance and load them while you play.",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/alps.png"
          />
        ),
        ctaLabel: "Write a new Scene",
        onClick: () => {
          scenesManager.actions.openManager(ManagerMode.Manage);
        },
      },
      {
        label: "Characters",
        description: "Flexible character sheets that support any TTRPG system.",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/wizard.png"
          />
        ),
        ctaLabel: "Create your first Character",
        onClick: () => {
          charactersManager.actions.openManager(ManagerMode.Manage);
        },
      },

      {
        label: "SRDs",
        description:
          "Game System Reference Documents, conveniently available here.",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/bookmark--v1.png"
          />
        ),
        ctaLabel: "Read Now",
        to: "/srds",
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
        label: "Dice Roller",
        description:
          "From Fate dice to d20, we've got you covered with our fair dice roller.",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/dice.png"
          />
        ),
        ctaLabel: "Roll some dice",
        to: "/dice",
      },
      {
        label: "Dice Pool",
        description: "Using Dice Pools? Check-out our Dice Pool Roller.",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/box.png"
          />
        ),
        ctaLabel: "Assemble your Dice Pool",
        to: "/dice-pool",
      },
      {
        label: "Play Solo",
        description:
          "Use the Oracle to find out what your next adventure has in store for you.",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/crystal-ball.png"
          />
        ),
        ctaLabel: "Consult the Oracle",
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
        label: "Blog",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/comments.png"
          />
        ),
        description:
          "Check-out the team's blog to know about the latest features.",
        ctaLabel: "Read Now",
        to: "/blog",
      },

      {
        label: "Fari Wiki",
        icon: (props: { className: string }) => (
          // https://icons8.com/icons/plasticine
          <img
            className={props.className}
            src="https://img.icons8.com/plasticine/100/000000/contract.png"
          />
        ),
        description: "Everything you need to become a Fari power-user.",
        ctaLabel: "Read",
        to: "/fari-wiki",
      },
    ];
    return (
      <Box>
        <HomeRouteCards cards={cards} />
      </Box>
    );
  }

  function renderDiscord() {
    return (
      <Box>
        <Button
          color="primary"
          variant="outlined"
          component="a"
          href="https://discord.gg/vMAJFjUraA"
          target="_blank"
          rel="noreferrer"
        >
          {"Join the Discord Server"}
        </Button>
      </Box>
    );
  }

  function renderHeading() {
    return (
      <Box display="flex" flexDirection="column" height="100%">
        <Typography
          variant="h4"
          className={css({
            label: "LightBox-title",
            marginBottom: ".5rem",
            textAlign: "left",
            fontWeight: theme.typography.fontWeightBold,
          })}
        >
          <>
            {"Play Table-Top RPGs Online"}{" "}
            <span className={css({ textDecoration: "underline" })}>
              {"without the headache"}.
            </span>
          </>
        </Typography>
        <Typography
          variant="subtitle1"
          className={css({
            label: "LightBox-subtitle",
            marginBottom: "2rem",
            textAlign: "left",
          })}
        >
          {"Start a new game, send a link to your friends and play now."}
        </Typography>
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
              {t("home-route-believable")}
            </Typography>
          </Box>
          {/* <Box mb="2rem">
            <Grid container>
              <Grid item xs={12} lg={8}>
                <Button
                  className={css({ height: "3rem" })}
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    history.push("/play");
                    logger.info("HomeRoute:onStartOnlineGame");
                  }}
                  fullWidth
                >
                  {"Play Now"}
                </Button>
              </Grid>
            </Grid>
          </Box> */}
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
          variant="h4"
          className={css({
            label: "LightBox-title",
            marginBottom: subTitle ? ".5rem" : "2rem",
            textAlign: textAlign ?? "center",
            fontWeight: theme.typography.fontWeightBold,
          })}
        >
          {title}
        </Typography>
      )}
      {subTitle && (
        <Typography
          variant="subtitle1"
          className={css({
            label: "LightBox-subtitle",
            marginBottom: "2rem",
            textAlign: textAlign ?? "center",
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
            label: "DarkBox",
            background: linear
              ? highlight.linearBackground
              : highlight.radialBackground,
            textAlign: "center",
            color: highlight.color,
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
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Grid container justify="center" spacing={6}>
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
                      color="primary"
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
                      color="primary"
                      variant="outlined"
                      component={RouterLink}
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
