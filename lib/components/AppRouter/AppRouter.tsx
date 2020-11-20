import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
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

export const LoadingRoute: React.FC = (props) => {
  const [fadeIn, setFadeIn] = useState(false);
  const timeout = useRef<any | undefined>(undefined);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setFadeIn(true);
    }, 300);

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
