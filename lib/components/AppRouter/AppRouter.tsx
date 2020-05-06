import React from "react";
import { Route, Switch } from "react-router-dom";
import { AboutRoute } from "../../routes/About/AboutRoute";
import { Characters } from "../../routes/Characters/Characters";
import { CreateCharacter } from "../../routes/CreateCharacter/CreateCharacter";
import { DiceRoute } from "../../routes/Dice/DiceRoute";
import { Games } from "../../routes/Games/Games";
import { HomeRoute } from "../../routes/Home/HomeRoute";
import { NotFoundRoute } from "../../routes/NotFound/NotFoundRoute";
import { PlayOfflineRoute } from "../../routes/Play/PlayOfflineRoute";
import { PlayRoute } from "../../routes/Play/PlayRoute";

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
      path={"/games"}
      render={(props) => {
        return <Games />;
      }}
    />
    <Route
      exact
      path={"/game/:gameSlug"}
      render={(props) => {
        return <Characters />;
      }}
    />
    <Route
      exact
      path={"/game/:gameSlug/create"}
      render={(props) => {
        return <CreateCharacter />;
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
      path={"/about"}
      render={(props) => {
        return <AboutRoute />;
      }}
    />
    <Route
      path="*"
      render={(props) => {
        return <NotFoundRoute {...props} />;
      }}
    />
  </Switch>
);
