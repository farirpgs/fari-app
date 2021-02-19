import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CreateIcon from "@material-ui/icons/Create";
import HelpIcon from "@material-ui/icons/Help";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import MovieIcon from "@material-ui/icons/Movie";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import appIcon from "../../../images/blue/app.png";
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
import { makeIcon } from "../../domains/Icons/makeIcon";
import { isWebRTCSupported } from "../../hooks/usePeerJS/usePeerJS";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { MiscellaneousItems, WikiItems } from "../SrdsRoute/SrdsRoute";

const Patrons = ["James Micu", "Randy Oest", "Ryan Singer"];

const sectionGridItem = css({
  display: "flex",
  justifyContent: "center",
  // flex: "1 0 auto",
});

export const HomeRoute: React.FC<{}> = (props) => {
  const history = useHistory();
  const { t } = useTranslate();
  const logger = useLogger();
  const scenesManager = useContext(ScenesContext);
  const charactersManager = useContext(CharactersContext);

  useEffect(() => {
    logger.info("Route:Home");
  }, []);

  function renderSupport() {
    return (
      <Container maxWidth="sm">
        <Box mb="1rem">
          <FateLabel variant="h5" align="center" color="primary">
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
      </Container>
    );
  }

  function renderPatrons() {
    return (
      <Container maxWidth="sm">
        <Box py="1rem" textAlign="center">
          <Box mb="1rem">
            <FateLabel variant="h5" align="center" color="primary">
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
      </Container>
    );
  }

  function renderHeadingIcon(
    Icon: ReturnType<typeof makeIcon> | React.ElementType
  ) {
    return (
      <Box display="flex" justifyContent="center">
        <Icon className={css({ fontSize: "3rem" })} color="primary" />
      </Box>
    );
  }

  function renderPlayButtons() {
    return (
      <Container maxWidth="lg">
        <Box my="1rem">
          <Grid container justify="center" spacing={6}>
            {isWebRTCSupported() && (
              <Grid item xs={12} md={4} className={sectionGridItem}>
                <Box height="100%" display="flex" flexDirection="column">
                  <Box mb="1rem">
                    <Link to="/play">
                      <FateLabel
                        variant="h5"
                        align="center"
                        color="primary"
                        underline
                      >
                        {t("home-route.play-online.title")}
                      </FateLabel>
                    </Link>
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
                  <Link to="/play-offline">
                    <FateLabel
                      variant="h5"
                      align="center"
                      color="primary"
                      underline
                    >
                      {t("home-route.play-offline.title")}
                    </FateLabel>
                  </Link>
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
      </Container>
    );
  }

  function renderSectionsButtons() {
    return (
      <Container maxWidth="md">
        <Box my="3rem">
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
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
                  >
                    {"SRDs"}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box my="3rem">
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link to="/blog">
                  {renderHeadingIcon(CreateIcon)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
                  >
                    {"Blog"}
                  </FateLabel>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4} className={sectionGridItem}>
              <Box height="100%" display="flex" flexDirection="column">
                <Link to="/dice">
                  {renderHeadingIcon(Icons.DiceGameIcon)}
                  <FateLabel
                    variant="h5"
                    align="center"
                    color="primary"
                    underline
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
                  >
                    {"Oracle"}
                  </FateLabel>
                </Box>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  function renderHeading() {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center">
          <FateLabel variant="h4" color="primary" as="h1">
            {"Fari"}
          </FateLabel>
        </Box>
        <Box pb=".5rem" textAlign="center">
          <img alt="Fari" width="125px" src={appIcon} />
        </Box>
        <Box pb="2rem" textAlign="center">
          <FateLabel variant="h6" color="secondary" as="h2">
            {t("home-route.heading")}
          </FateLabel>
        </Box>
      </Container>
    );
  }

  return (
    <Page displayDonation={false}>
      <PageMeta
        title={t("home-route.meta.title")}
        description={t("home-route.meta.description")}
      />
      <Box>
        {renderHeading()}
        {renderPlayButtons()}
        {renderSectionsButtons()}
        <Container maxWidth="lg">
          <Box py="1.5rem">
            <Divider />
          </Box>
        </Container>
        <Container maxWidth="md">
          <Box pb="2rem">
            <Heading icon={HelpIcon} title={"Wikis & Resources"} />
            <WikiItems />
            <Box pt="2rem" />
            <Heading icon={HelpIcon} title={"Miscellaneous"} />
            <MiscellaneousItems />
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Box py="1.5rem">
            <Divider />
          </Box>
        </Container>
        {renderSupport()}
        <Container maxWidth="sm">
          <Box py="1.5rem">
            <Divider />
          </Box>
        </Container>
        {renderPatrons()}
      </Box>
    </Page>
  );
};

HomeRoute.displayName = "HomeRoute";
export default HomeRoute;
