import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { DocRoutes } from "../../domains/documents/DocRoutes";
import { SrdsRoute } from "../../routes/SrdsRoute/SrdsRoute";
import { StoryBuilderRoute } from "../../routes/StoryBuilder/StoryBuilderRoute";
import StoryDiceRoute from "../../routes/StoryDice/StoryDiceRoute";
import { Doc } from "../Doc/Doc";
import { LoadingRoute } from "./LoadingRoute";

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

export const AppRouter = () => {
  const location = useLocation();
  return (
    <React.Suspense fallback={<LoadingRoute pathname={location.pathname} />}>
      <Switch>
        <Route
          exact
          path={"/"}
          render={() => {
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
          render={() => {
            return <DiceRoute pool={false} key="dice" />;
          }}
        />
        <Route
          exact
          path={"/dice-pool"}
          render={() => {
            return <DiceRoute pool={true} key="dice-pool" />;
          }}
        />
        <Route
          exact
          path={"/data"}
          render={() => {
            return <DataRoute />;
          }}
        />
        <Route
          exact
          path={"/oracle"}
          render={() => {
            return <OracleRoute />;
          }}
        />
        <Route
          exact
          path={"/draw"}
          render={() => {
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
        <Route exact path={"/srds"} render={() => <SrdsRoute />} />

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
          render={() => {
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
          exact
          path={"/discord"}
          render={() => {
            window.location.href = "https://discord.gg/vMAJFjUraA";
            return null;
          }}
        />

        <Route
          exact
          path={"/story-builder"}
          render={() => {
            return <StoryBuilderRoute />;
          }}
        />
        <Route
          exact
          path={"/story-dice"}
          render={() => {
            return <StoryDiceRoute />;
          }}
        />

        <Route
          path="*"
          render={() => {
            return <NotFoundRoute />;
          }}
        />
      </Switch>
    </React.Suspense>
  );
};
