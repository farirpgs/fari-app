import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { DocRoutes } from "../../domains/documents/DocRoutes";
import { SrdsRoute } from "../../routes/SrdsRoute/SrdsRoute";
import { Doc } from "../Doc/Doc";
import { Page } from "../Page/Page";

const HomeRoute = React.lazy(() => import("../../routes/Home/HomeRoute"));

const CharacterRoute = React.lazy(
  () => import("../../routes/Character/CharacterRoute")
);
const CharacterPrintRoute = React.lazy(
  () => import("../../routes/CharacterPrint/CharacterPrintRoute")
);
const DiceRoute = React.lazy(() => import("../../routes/Dice/DiceRoute"));
const FeatureRequestsRoute = React.lazy(
  () => import("../../routes/FeatureRequests/FeatureRequestsRoute")
);
const BugsRoute = React.lazy(() => import("../../routes/Bugs/BugsRoute"));
const DataRoute = React.lazy(() => import("../../routes/Data/DataRoute"));
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
const SeelieSquireRoute = React.lazy(
  () => import("../../routes/SeelieSquire/SeelieSquireRoute")
);

export const LoadingRoute: React.FC<{ hideHeaderLogo: boolean }> = (props) => {
  const location = useLocation();
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
    <Page hideHeaderLogo={location.pathname === "/"}>
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
  const location = useLocation();
  const hideHeaderLogo = location.pathname === "/";

  return (
    <Suspense fallback={<LoadingRoute hideHeaderLogo={hideHeaderLogo} />}>
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
          path={"/characters/:id/print"}
          render={(props) => {
            return <CharacterPrintRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/dice"}
          render={(props) => {
            return <DiceRoute pool={false} key="dice" />;
          }}
        />
        <Route
          exact
          path={"/dice-pool"}
          render={(props) => {
            return <DiceRoute pool={true} key="dice-pool" />;
          }}
        />
        <Route
          exact
          path={"/data"}
          render={(props) => {
            return <DataRoute />;
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

        {DocRoutes.map((docRoute) => (
          <Route
            exact
            key={docRoute.url}
            path={`${docRoute.url}/:page?`}
            render={(props) => (
              <Doc
                key={docRoute.url}
                page={props.match.params.page}
                url={docRoute.url}
                parent={docRoute.parent}
                title={docRoute.title}
                imageUrl={docRoute.imageUrl}
                loadFunction={docRoute.loadFunction}
                author={docRoute.author}
                gitHubLink={docRoute.gitHubLink}
                sideBar={docRoute.sideBar}
                sideBarOptions={docRoute.sideBarOptions}
                defaultSideBarCategory={docRoute.defaultSideBarCategory}
              />
            )}
          />
        ))}

        <Route
          exact
          path={"/seeliesquire/:page?"}
          render={(props) => (
            <SeelieSquireRoute page={props.match.params.page} />
          )}
        />

        <Route
          exact
          path={["/feature-requests", "/feature-requests/*"]}
          render={(props) => {
            return <FeatureRequestsRoute />;
          }}
        />

        <Route
          exact
          path={["/bugs", "/bugs/*"]}
          render={() => {
            return <BugsRoute />;
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
