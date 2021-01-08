import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { DocImport as DocImport } from "../../constants/DocImport";
import { SrdsRoute } from "../../routes/SrdsRoute/SrdsRoute";
import { AppLink } from "../AppLink/AppLink";
import { Doc } from "../Doc/Doc";
import { FateLabel } from "../FateLabel/FateLabel";
import { Page } from "../Page/Page";

const HomeRoute = React.lazy(() => import("../../routes/Home/HomeRoute"));

const AboutRoute = React.lazy(() => import("../../routes/About/AboutRoute"));
const BlogPostRoute = React.lazy(
  () => import("../../routes/BlogPost/BlogPostRoute")
);
const BlogPostsRoute = React.lazy(
  () => import("../../routes/BlogPosts/BlogPostsRoute")
);
const ChangelogRoute = React.lazy(
  () => import("../../routes/ChangeLog/ChangeLogRoute")
);
const CharacterRoute = React.lazy(
  () => import("../../routes/Character/CharacterRoute")
);
const DiceRoute = React.lazy(() => import("../../routes/Dice/DiceRoute"));
const DrawRoute = React.lazy(() => import("../../routes/Draw/DrawRoute"));
const NotFoundRoute = React.lazy(
  () => import("../../routes/NotFound/NotFoundRoute")
);
const PlayOfflineRoute = React.lazy(
  () => import("../../routes/Play/PlayOfflineRoute")
);
const PlayRoute = React.lazy(() => import("../../routes/Play/PlayRoute"));
const SceneRoute = React.lazy(() => import("../../routes/Scene/SceneRoute"));
const OracleRoute = React.lazy(() => import("../../routes/Oracle/OracleRoute"));
const SrdRoute = React.lazy(() => import("../../routes/SrdRoute/SrdRoute"));

export const LoadingRoute: React.FC = (props) => {
  const [fadeIn, setFadeIn] = useState(false);
  const timeout = useRef<any | undefined>(undefined);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setFadeIn(true);
    }, 400);

    return () => {
      clearTimeout(timeout.current);
    };
  });

  return (
    <Page displayDonation={false}>
      <Fade in={fadeIn}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Container>
      </Fade>
    </Page>
  );
};

export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingRoute />}>
      <Switch>
        <Route
          exact
          path={"/"}
          render={(props) => {
            return <HomeRoute />;
          }}
        />
        <Route
          exact
          path={"/characters/:id"}
          render={(props) => {
            return <CharacterRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/dice"}
          render={(props) => {
            return <DiceRoute />;
          }}
        />
        <Route
          exact
          path={"/oracle"}
          render={(props) => {
            return <OracleRoute />;
          }}
        />
        <Route
          exact
          path={"/draw"}
          render={(props) => {
            return <DrawRoute />;
          }}
        />
        <Route
          exact
          path={"/play"}
          render={(props) => {
            return <PlayRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/play/:id"}
          render={(props) => {
            return <PlayRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/play-offline"}
          render={(props) => <PlayOfflineRoute {...props} />}
        />
        <Route
          exact
          path={"/scenes/:id"}
          render={(props) => <SceneRoute {...props} />}
        />
        <Route exact path={"/srds"} render={(props) => <SrdsRoute />} />
        <Route
          exact
          path={"/srds/condensed/:page?"}
          render={(props) => (
            <SrdRoute
              {...props}
              prefix="/srds/condensed"
              title="Fate Condensed"
              loadFunction={DocImport.FateCondensed}
            />
          )}
        />
        <Route
          exact
          path={"/seelie-squire/:page?"}
          render={(props) => (
            <Doc
              currentPageId={props.match.params.page}
              prefix="/seelie-squire"
              parentTitle="SRDs"
              parentUrl="/srds"
              docTitle="Seely Squire's Book Of Creatures"
              loadFunction={DocImport.SeelieSquire}
            >
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Typography variant="body2">Seely Squire:</Typography>
                </Grid>
                <Grid item>
                  <AppLink
                    to="https://www.patreon.com/seeliesquire"
                    target="_blank"
                  >
                    Patreon
                  </AppLink>
                </Grid>

                <Grid item>
                  <FateLabel color="secondary">{"•"}</FateLabel>
                </Grid>
                <Grid item>
                  <AppLink
                    to="https://discord.com/invite/8u3VVZd"
                    target="_blank"
                  >
                    Discord
                  </AppLink>
                </Grid>
                <Grid item>
                  <FateLabel color="secondary">{"•"}</FateLabel>
                </Grid>
                <Grid item>
                  <AppLink
                    to="https://www.reddit.com/r/seeliesquire/"
                    target="_blank"
                  >
                    Reddit
                  </AppLink>
                </Grid>
              </Grid>
            </Doc>
          )}
        />
        <Route
          exact
          path={"/srds/core/:page?"}
          render={(props) => (
            <SrdRoute
              {...props}
              prefix="/srds/core"
              title="Fate Core"
              loadFunction={DocImport.FateCore}
            />
          )}
        />
        <Route
          exact
          path={"/srds/accelerated/:page?"}
          render={(props) => (
            <SrdRoute
              {...props}
              prefix="/srds/accelerated"
              title="Fate Accelerated"
              loadFunction={DocImport.FateAccelerated}
            />
          )}
        />
        <Route
          exact
          path={"/about"}
          render={(props) => {
            return <AboutRoute />;
          }}
        />
        <Route
          exact
          path={"/blog"}
          render={(props) => {
            return <BlogPostsRoute />;
          }}
        />
        <Route
          exact
          path={"/blog/:slug"}
          render={(props) => {
            return <BlogPostRoute slug={props.match.params.slug} />;
          }}
        />
        <Route
          exact
          path={"/changelog"}
          render={(props) => {
            return <ChangelogRoute />;
          }}
        />
        <Route
          path="*"
          render={(props) => {
            return <NotFoundRoute />;
          }}
        />
      </Switch>
    </Suspense>
  );
};
