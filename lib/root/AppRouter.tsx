import React from "react";
import { Route, Switch } from "react-router-dom";
import { Characters } from "../routes/Characters";
import { CreateCharacter } from "../routes/CreateCharacter";
import { Dices } from "../routes/Dices";
import { Games } from "../routes/Games";
import { Home } from "../routes/Home";
import { NotFoundRoute } from "../routes/NotFoundRoute";
import { PlayCharacter } from "../routes/PlayCharacter";
import { Scene } from "../routes/Scene";
import { Scenes } from "../routes/Scenes";
export interface IScene {
  _id: string;
  _rev: string;
  name: string;
  images: string;
  postIts?: Array<string>;
}

export const AppRouter = () => (
  <Switch>
    <Route exact path={"/"} component={Games} />
    <Route exact path={"/home"} component={Home} />
    <Route exact path={"/games"} component={Games} />
    <Route exact path={"/game/:gameSlug"} component={Characters} />
    <Route exact path={"/game/:gameSlug/create"} component={CreateCharacter} />
    <Route exact path={"/dices"} component={Dices} />
    <Route exact path={"/scenes"} component={Scenes} />
    <Route exact path={"/scenes/:sceneId"} component={Scene} />
    <Route
      exact
      path={"/game/:gameSlug/play/:characterId"}
      component={PlayCharacter}
    />
    <Route path="*" component={NotFoundRoute} status={404} />
  </Switch>
);
