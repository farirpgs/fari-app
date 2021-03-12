import { css, cx } from "@emotion/css";
import Box, { BoxProps } from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CreateIcon from "@material-ui/icons/Create";
import HelpIcon from "@material-ui/icons/Help";
import MovieIcon from "@material-ui/icons/Movie";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/blue/app.png";
import { RouterLink } from "../../components/AppLink/AppLink";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Heading } from "../../components/Heading/Heading";
import { Kofi } from "../../components/Kofi/Kofi";
import { ManagerMode } from "../../components/Manager/Manager";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Patreon } from "../../components/Patreon/Patreon";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { Icons } from "../../domains/Icons/Icons";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import { isWebRTCSupported } from "../../hooks/usePeerJS/usePeerJS";
import { useThemeFromColor } from "../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { MiscellaneousItems, WikiItems } from "../SrdsRoute/SrdsRoute";

const Patrons = ["James Micu", "Randy Oest", "Ryan Singer", "Aeife O'Brien"];

const sectionGridItem = css({
  display: "flex",
  justifyContent: "center",
  // flex: "1 0 auto",
});

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
  const lightBackground = useLightBackground();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    logger.info("Route:Home");
  }, []);

  return (
    <Page displayDonation={false} maxWidth="100vw">
      <PageMeta
        title={t("home-route.meta.title")}
        description={t("home-route.meta.description")}
      />
      <Box>
        <LightBox>{renderHeading()}</LightBox>

        <LightBox>
          <Container maxWidth="lg">{renderPlayButtons()}</Container>
        </LightBox>
        <LightBox>
          <Container maxWidth="lg">{renderSectionsButtons()}</Container>
        </LightBox>
        <DarkBox p="5rem">
          <Container maxWidth="sm">{renderDiscord()}</Container>
        </DarkBox>

        <LightBox>
          <Container maxWidth="md">
            <Box pb="2rem">
              <Heading icon={HelpIcon} title={"Wikis & Resources"} />
              <WikiItems />
              <Box pt="2rem" />
              <Heading icon={HelpIcon} title={"Miscellaneous"} />
              <MiscellaneousItems />
            </Box>
          </Container>
        </LightBox>
        <DarkBox p="5rem">
          <Container maxWidth="sm">{renderPatrons()}</Container>
        </DarkBox>
        <LightBox p="5rem">
          <Container maxWidth="sm">{renderSupport()}</Container>
        </LightBox>
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
        <Box mb="1rem">
          <FateLabel variant="h4" align="center" color="primary">
            {t("home-route.thanks-some-patrons")}
          </FateLabel>
        </Box>

        <Box py=".5rem">
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
      </Box>
    );
  }

  function renderPlayButtons() {
    return (
      <Box>
        <Grid container justify="center" spacing={6}>
          {isWebRTCSupported() && (
            <Grid item xs={12} md={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Box mb="1rem">
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    uppercase={false}
                  >
                    {t("home-route.play-online.title")}
                  </FateLabel>
                </Box>

                <Typography variant="body1" align="center">
                  {t("home-route.play-online.description")}
                </Typography>
                <Box py="1rem" textAlign="center" marginTop="auto">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      history.push("/play");
                      logger.info("HomeRoute:onStartOnlineGame");
                    }}
                  >
                    {t("home-route.play-online.button")}
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={4} className={sectionGridItem}>
            <Box height="100%" display="flex" flexDirection="column">
              <Box mb="1rem">
                <FateLabel
                  variant="h5"
                  align="center"
                  color="primary"
                  uppercase={false}
                >
                  {t("home-route.play-offline.title")}
                </FateLabel>
              </Box>

              <Typography variant="body1" align="center">
                {t("home-route.play-offline.description")}
              </Typography>
              <Box py="1rem" textAlign="center" marginTop="auto">
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  data-cy="home.play-offline"
                  onClick={() => {
                    history.push("/play-offline");
                    logger.info("HomeRoute:onStartOfflineGame");
                  }}
                >
                  {t("home-route.play-offline.button")}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderSectionsButtons() {
    const cards: Array<{
      label: string;
      description: string;
      ctaLabel: string;
      icon: React.ElementType;
      to?: string;
      onClick?: () => void;
    }> = [
      // function renderHeadingIcon(
      //   {renderHeadingIcon(MovieIcon)}
      //   {renderHeadingIcon(PeopleAltIcon)}
      //   {renderHeadingIcon(MenuBookIcon)}
      //   {renderHeadingIcon(CreateIcon)}
      //   {renderHeadingIcon(Icons.FateDice)}
      //   {renderHeadingIcon(Icons.EyeIcon)}
      {
        label: "Scenes",
        description: "Play without having to worry about maps and grids.",
        icon: MovieIcon,
        ctaLabel: "Write a Scene",
        onClick: () => {
          scenesManager.actions.openManager(ManagerMode.Manage);
        },
      },
      {
        label: "Characters",
        description:
          "Flexible character sheets that will support any house rule you have for your games.",
        icon: PeopleAltIcon,
        ctaLabel: "Create your first Character",
        onClick: () => {
          charactersManager.actions.openManager(ManagerMode.Manage);
        },
      },
      {
        label: "Dice Roller",
        description: "From Fate to d20, we've got you covered.",
        icon: Icons.FateDice,
        ctaLabel: "Roll some dice",
        to: "/dice",
      },
      {
        label: "What does your future hold",
        description:
          "Use the Oracle to play in solo-mode and find out what your next adventure has in store for you.",
        icon: Icons.EyeIcon,
        ctaLabel: "Consult the Oracle",
        to: "/oracle",
      },
      {
        label: "Blog",
        icon: CreateIcon,
        description: "Check-out what's new about Fari.",
        ctaLabel: "Read Now",
        to: "/blog",
      },
    ];
    return (
      <Box>
        <Grid container justify="center" spacing={6}>
          {cards.map((card, index) => {
            return (
              <Grid
                key={index}
                item
                xs={12}
                sm={6}
                md={4}
                className={css({ height: "100%" })}
              >
                <Box
                  className={css({
                    "padding": "2.5rem",
                    "label": "home-page-card",
                    "borderRadius": "4px",
                    "background": lightBackground,
                    "width": "100%",
                    "transition": theme.transitions.create([
                      "transform",
                      "box-shadow",
                    ]),
                    "&:hover": {
                      transform: isSmall ? undefined : "scale(1.005)",
                      boxShadow: isSmall ? undefined : theme.shadows[4],
                    },
                  })}
                >
                  <Box display="flex" justifyContent="center" mb="1rem">
                    <card.icon
                      className={css({
                        color: theme.palette.primary.main,
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
          {/* <Grid item xs={6} sm={4} md={3} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link
                  to=""
                  onClick={(e) => {
                    e.preventDefault();
                    scenesManager.actions.openManager(ManagerMode.Manage);
                  }}
                >
                  {renderHeadingIcon(MovieIcon)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                    uppercase={false}
                  >
                    {t("menu.scenes")}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link
                  to=""
                  onClick={(e) => {
                    e.preventDefault();
                    charactersManager.actions.openManager(ManagerMode.Manage);
                  }}
                >
                  {renderHeadingIcon(PeopleAltIcon)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                    uppercase={false}
                  >
                    {t("menu.characters")}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link to="/srds">
                  {renderHeadingIcon(MenuBookIcon)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                    uppercase={false}
                  >
                    {"SRDs"}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link to="/blog">
                  {renderHeadingIcon(CreateIcon)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                    uppercase={false}
                  >
                    {"Blog"}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link to="/dice">
                  {renderHeadingIcon(Icons.FateDice)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                    uppercase={false}
                  >
                    {"Dice"}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Link to="/oracle">
                <Box height="100%" display="flex" flexDirection="column">
                  {renderHeadingIcon(Icons.EyeIcon)}
                  <FateLabel
                    data-cy="home.oracle"
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                    uppercase={false}
                  >
                    {"Oracle"}
                  </FateLabel>
                </Box> 
              </Link>
            </Grid> */}
        </Grid>
      </Box>
    );
  }

  function renderDiscord() {
    return (
      <Box>
        <Typography
          variant="h4"
          className={css({
            marginBottom: ".5rem",
            fontWeight: theme.typography.fontWeightBold,
          })}
        >
          {"Join the Community"}
        </Typography>
        <Typography
          variant="body1"
          className={css({
            marginBottom: "2rem",
          })}
        >
          {"Have a say in the future of Fari"}
        </Typography>
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
      <Box>
        <>
          <Box textAlign="center">
            <FateLabel variant="h4" color="primary" as="h1">
              {"Fari"}
            </FateLabel>
          </Box>
          <Box pb=".5rem" textAlign="center">
            <img alt="Fari" width="125px" src={appIcon} />
          </Box>
          <Box pb="2rem" textAlign="center">
            <FateLabel variant="h6" color="primary" as="h2">
              {t("home-route.heading")}
            </FateLabel>
          </Box>
        </>
      </Box>
    );
  }
};

HomeRoute.displayName = "HomeRoute";
export default HomeRoute;

function LightBox(props: { children: JSX.Element } & BoxProps) {
  const { children, className, ...rest } = props;
  const theme = useTheme();

  return (
    <Box
      className={cx(
        css({ label: "LightBox", marginBottom: "4rem" }),
        className
      )}
      {...rest}
    >
      {children}
    </Box>
  );
}

function DarkBox(props: { children: JSX.Element } & BoxProps) {
  const { children, className, ...rest } = props;
  const theme = useTheme();
  const inverted = useThemeFromColor(
    theme.palette.getContrastText(theme.palette.text.primary)
  );

  return (
    <ThemeProvider theme={inverted}>
      <Box
        className={cx(
          css({
            label: "DarkBox",
            background: `${theme.palette.primary.main} linear-gradient(45deg,${theme.palette.primary.main},${theme.palette.primary.dark})`,
            textAlign: "center",
            color: inverted.palette.primary.main,
          }),
          className
        )}
        {...rest}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
