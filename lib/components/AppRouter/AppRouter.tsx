import React from "react";
import { Route, Switch } from "react-router-dom";
import { AboutRoute } from "../../routes/About/AboutRoute";
import { ChangelogRoute } from "../../routes/ChangeLog/ChangeLogRoute";
import { CharacterRoute } from "../../routes/Character/CharacterRoute";
import { DiceRoute } from "../../routes/Dice/DiceRoute";
import { DrawRoute } from "../../routes/Draw/DrawRoute";
import { HomeRoute } from "../../routes/Home/HomeRoute";
import { NotFoundRoute } from "../../routes/NotFound/NotFoundRoute";
import { PlayOfflineRoute } from "../../routes/Play/PlayOfflineRoute";
import { PlayRoute } from "../../routes/Play/PlayRoute";
import { SceneRoute } from "../../routes/Scene/SceneRoute";

export const AppRouter = () => (
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
);
