import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Images } from "../../constants/Images";
import { DocImport as DocImport } from "../../docs/DocImport";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { SrdsRoute } from "../../routes/SrdsRoute/SrdsRoute";
import { Doc } from "../Doc/Doc";
import { Page } from "../Page/Page";

const HomeRoute = React.lazy(() => import("../../routes/Home/HomeRoute"));

const AboutRoute = React.lazy(() => import("../../routes/About/AboutRoute"));
const BlogPostRoute = React.lazy(
  () => import("../../routes/BlogPost/BlogPostRoute")
);
const BlogPostsRoute = React.lazy(
  () => import("../../routes/BlogPosts/BlogPostsRoute")
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
  const { t } = useTranslate();
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
              url="/srds/condensed"
              title="Fate Condensed"
              imageUrl={Images.condensed}
              loadFunction={DocImport.FateCondensed}
            />
          )}
        />
        <Route
          exact
          path={"/changelog/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/changelog"
              parent={{ title: "Fari", url: "/" }}
              title="Changelog"
              loadFunction={DocImport.Changelog}
            />
          )}
        />
        <Route
          exact
          path={"/fate-stunts/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/fate-stunts"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate Stunts"
              imageUrl={Images.book}
              loadFunction={DocImport.FateStunts}
            />
          )}
        />
        <Route
          exact
          path={"/seelie-squire/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/seelie-squire"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Seelie Squire's Book Of Creatures"
              imageUrl={Images.seelieSquire}
              loadFunction={DocImport.SeelieSquire}
              links={{
                title: "Seelie Squire",
                items: [
                  {
                    label: "Patreon",
                    url: "https://www.patreon.com/seeliesquire",
                  },
                  {
                    label: "Discord",
                    url: "https://discord.com/invite/8u3VVZd",
                  },
                  {
                    label: "Reddit",
                    url: "https://www.reddit.com/r/seeliesquire/",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/srds/core/:page?"}
          render={(props) => (
            <SrdRoute
              {...props}
              url="/srds/core"
              title="Fate Core"
              imageUrl={Images.core}
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
              url="/srds/accelerated"
              title="Fate Accelerated"
              imageUrl={Images.accelerated}
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
          path="*"
          render={(props) => {
            return <NotFoundRoute />;
          }}
        />
      </Switch>
    </Suspense>
  );
};
