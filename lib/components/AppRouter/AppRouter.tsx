import { LiveObject } from "@liveblocks/client";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import React, { useContext } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { InjectionsContext } from "../../contexts/InjectionsContext/InjectionsContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { LIVEBLOCKS_PUBLIC_KEY } from "../../services/liveblocks/makeLiveBlocksClient";
import { StoryBuilderRoute } from "../../routes/StoryBuilder/StoryBuilderRoute";
import StoryDiceRoute from "../../routes/StoryDice/StoryDiceRoute";
import { ExternalRedirect } from "../ExternalRedirect/ExternalRedirect";
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
const DiceRoute = React.lazy(() => import("../../routes/DiceRoute/DiceRoute"));
// const FeatureRequestsRoute = React.lazy(
//   () => import("../../routes/FeatureRequests/FeatureRequestsRoute")
// );
// const BugsRoute = React.lazy(() => import("../../routes/Bugs/BugsRoute"));
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

const initialStorage = {
  scene: new LiveObject(),
  characters: new LiveObject(),
  session: new LiveObject(),
  chat: new LiveObject(),
};

export const AppRouter = () => {
  const location = useLocation();
  const settingsManager = useContext(SettingsContext);
  const injections = useContext(InjectionsContext);
  const userId = settingsManager.state.userId;

  return (
    <React.Suspense fallback={<LoadingRoute pathname={location.pathname} />}>
      <Routes>
        <Route path={"/"} element={<HomeRoute />} />
        <Route
          path={"/characters/new/:category/:name"}
          element={<NewCharacterRoute />}
        />
        <Route path={"/characters/:id"} element={<CharacterRoute />} />
        <Route
          path={"/characters/:id/print"}
          element={<CharacterPrintRoute />}
        />
        <Route path={"dice"} element={<DiceRoute key="dice" />} />
        <Route path={"/data"} element={<DataRoute />} />
        <Route path={"/oracle"} element={<OracleRoute />} />
        <Route path={"/draw"} element={<DrawRoute />} />
        <Route
          path={"play"}
          element={
            <Params
              render={(params: { id: string }) => {
                const sessionId = params.id || userId;
                return (
                  <LiveblocksProvider publicApiKey={LIVEBLOCKS_PUBLIC_KEY}>
                    <RoomProvider
                      id={sessionId}
                      initialStorage={initialStorage}
                      initialPresence={{}}
                    >
                      <PlayRoute />
                    </RoomProvider>
                  </LiveblocksProvider>
                );
              }}
            />
          }
        />
        <Route
          path={"play/:id"}
          element={
            <Params
              render={(params: { id: string }) => {
                const sessionId = params.id || userId;
                return (
                  <LiveblocksProvider publicApiKey={LIVEBLOCKS_PUBLIC_KEY}>
                    <RoomProvider id={sessionId}>
                      <PlayRoute />
                    </RoomProvider>
                  </LiveblocksProvider>
                );
              }}
            />
          }
        />
        <Route
          path={"/play/join/:id"}
          element={
            <Params
              render={(params: { id: string }) => {
                const sessionId = params.id || userId;
                return (
                  <LiveblocksProvider publicApiKey={LIVEBLOCKS_PUBLIC_KEY}>
                    <RoomProvider id={sessionId}>
                      <JoinAGameRoute />
                    </RoomProvider>
                  </LiveblocksProvider>
                );
              }}
            />
          }
        />
        <Route path={"/play-offline"} element={<PlayOfflineRoute />} />
        <Route path={"/scenes/:id"} element={<SceneRoute />} />
        <Route path={"/cards/:id"} element={<CardCollection />} />
        <Route
          path="/srds/condensed"
          element={
            <ExternalRedirect url="https://fari.games/en/resources/fari-rpgs/fari-app-wiki" />
          }
        />
        <Route
          path="/srds/condensed"
          element={
            <ExternalRedirect url="https://fari.games/en/srds/evilhat/fate-condensed" />
          }
        />
        <Route
          path="/srds/accelerated"
          element={
            <ExternalRedirect url="https://fari.games/en/srds/evilhat/fate-accelerated" />
          }
        />
        <Route
          path="/srds/system-toolkit"
          element={
            <ExternalRedirect url="https://fari.games/en/srds/evilhat/fate-system-toolkit" />
          }
        />
        <Route
          path="/srds/adversary-toolkit"
          element={
            <ExternalRedirect url="https://fari.games/en/srds/evilhat/fate-adversary-toolkit" />
          }
        />
        <Route
          path="/fate-stunts"
          element={
            <ExternalRedirect url="https://fari.games/en/resources/fari-rpgs/fate-stunts" />
          }
        />
        <Route
          path="/fari-wiki"
          element={
            <ExternalRedirect url="https://fari.games/en/resources/fari-rpgs/fari-app-wiki" />
          }
        />
        <Route
          path="/seelie-squire"
          element={
            <ExternalRedirect url="https://fari.games/en/resources/seelie-squire/book-of-monsters" />
          }
        />
        <Route
          path="/success-with-style"
          element={
            <ExternalRedirect url="https://fari.games/en/resources/fari-rpgs/success-with-style" />
          }
        />
        <Route
          path="/blog/moments-in-fate"
          element={
            <ExternalRedirect url="https://fari.games/en/srds/fari-rpgs/success-with-style/moments-in-fate" />
          }
        />
        <Route
          path="/changelog"
          element={<ExternalRedirect url="https://fari.canny.io/changelog/" />}
        />
        {/* <Route path={"/feature-requests"} element={<FeatureRequestsRoute />} />
        <Route
          path={"/feature-requests/*"}
          element={<FeatureRequestsRoute />}
        /> */}
        {/* <Route path={"/bugs"} element={<BugsRoute />} />
        <Route path={"/bugs/*"} element={<BugsRoute />} /> */}
        <Route path={"/story-builder"} element={<StoryBuilderRoute />} />
        <Route path={"/story-dice"} element={<StoryDiceRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </React.Suspense>
  );
};

function Params(props: { render: (params: any) => JSX.Element }) {
  const params = useParams();
  return props.render(params);
}
