import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import React, { useContext } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { InjectionsContext } from "../../contexts/InjectionsContext/InjectionsContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { StoryBuilderRoute } from "../../routes/StoryBuilder/StoryBuilderRoute";
import StoryDiceRoute from "../../routes/StoryDice/StoryDiceRoute";
import { LoadingRoute } from "./LoadingRoute";

const HomeRoute = React.lazy(() => import("../../routes/Home/HomeRoute"));

const CharacterRoute = React.lazy(
  () => import("../../routes/Character/CharacterRoute")
);
const NewCharacterRoute = React.lazy(
  () => import("../../routes/NewCharacter/NewCharacterRoute")
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
const JoinAGameRoute = React.lazy(
  () => import("../../routes/Play/JoinAGameRoute")
);
const SceneRoute = React.lazy(() => import("../../routes/Scene/SceneRoute"));
const CardCollection = React.lazy(
  () => import("../../routes/CardCollection/CardCollectionRoute")
);
const OracleRoute = React.lazy(() => import("../../routes/Oracle/OracleRoute"));

export const AppRouter = () => {
  const location = useLocation();
  const settingsManager = useContext(SettingsContext);
  const injections = useContext(InjectionsContext);
  const userId = settingsManager.state.userId;

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
          path={"/characters/new/:category/:name"}
          render={() => {
            return <NewCharacterRoute />;
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
          path={["/play", "/play/:id"]}
          render={(props) => {
            const sessionId = (props.match.params as any).id || userId;

            return (
              <LiveblocksProvider client={injections.liveBlocksClient}>
                <RoomProvider id={sessionId}>
                  <PlayRoute {...props} />;
                </RoomProvider>
              </LiveblocksProvider>
            );
          }}
        />
        <Route
          exact
          path={"/play/join/:id"}
          render={(props) => {
            const sessionId = (props.match.params as any).id;
            return (
              <LiveblocksProvider client={injections.liveBlocksClient}>
                <RoomProvider id={sessionId}>
                  <JoinAGameRoute {...props} />;
                </RoomProvider>
              </LiveblocksProvider>
            );
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
          path={"/cards/:id"}
          render={(props) => <CardCollection {...props} />}
        />

        <Route
          path="/srds/condensed"
          component={() => {
            window.location.href =
              "https://fari.games/en/resources/fari-rpgs/fari-app-wiki";
            return null;
          }}
        />
        <Route
          path="/srds/condensed"
          component={() => {
            window.location.href =
              "https://fari.games/en/srds/evilhat/fate-condensed";
            return null;
          }}
        />
        <Route
          path="/srds/core"
          component={() => {
            window.location.href =
              "https://fari.games/en/srds/evilhat/fate-core";
            return null;
          }}
        />
        <Route
          path="/srds/accelerated"
          component={() => {
            window.location.href =
              "https://fari.games/en/srds/evilhat/fate-accelerated";
            return null;
          }}
        />
        <Route
          path="/srds/system-toolkit"
          component={() => {
            window.location.href =
              "https://fari.games/en/srds/evilhat/fate-system-toolkit";
            return null;
          }}
        />
        <Route
          path="/srds/adversary-toolkit"
          component={() => {
            window.location.href =
              "https://fari.games/en/srds/evilhat/fate-adversary-toolkit";
            return null;
          }}
        />
        <Route
          path="/fate-stunts"
          component={() => {
            window.location.href =
              "https://fari.games/en/resources/fari-rpgs/fate-stunts";
            return null;
          }}
        />
        <Route
          path="/fari-wiki"
          component={() => {
            window.location.href =
              "https://fari.games/en/resources/fari-rpgs/fari-app-wiki";
            return null;
          }}
        />
        <Route
          path="/seelie-squire"
          component={() => {
            window.location.href =
              "https://fari.games/en/resources/seelie-squire/book-of-monsters";
            return null;
          }}
        />
        <Route
          path="/success-with-style"
          component={() => {
            window.location.href =
              "https://fari.games/en/resources/fari-rpgs/success-with-style";
            return null;
          }}
        />
        <Route
          path="/blog/moments-in-fate"
          component={() => {
            window.location.href =
              "https://fari.games/en/srds/fari-rpgs/success-with-style/moments-in-fate";
            return null;
          }}
        />
        <Route
          path="/changelog"
          component={() => {
            window.location.href = "https://fari.canny.io/changelog/";
            return null;
          }}
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
