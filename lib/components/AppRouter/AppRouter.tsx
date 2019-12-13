import React from "react";
import { Route, Switch } from "react-router-dom";
import { About } from "../../routes/About/About";
import { Characters } from "../../routes/Characters/Characters";
import { CreateCharacter } from "../../routes/CreateCharacter/CreateCharacter";
import { Dice } from "../../routes/Dice/Dice";
import { Games } from "../../routes/Games/Games";
import { Home } from "../../routes/Home/Home";
import { NotFoundRoute } from "../../routes/NotFoundRoute/NotFoundRoute";
import { PlayCharacter } from "../../routes/PlayCharacter/PlayCharacter";
import { Scene } from "../../routes/Scene/Scene";
import { Scenes } from "../../routes/Scenes/Scenes";
import { Session } from "../../routes/Session/Session";

export const AppRouter = () => (
  <Switch>
    <Route exact path={"/"} component={Home} />
    <Route exact path={"/games"} component={Games} />
    <Route exact path={"/game/:gameSlug"} component={Characters} />
    <Route exact path={"/game/:gameSlug/create"} component={CreateCharacter} />
    <Route exact path={"/dice"} component={Dice} />
    <Route exact path={"/scenes"} component={Scenes} />
    <Route exact path={"/scenes/create"} component={Scene} />
    <Route exact path={"/scenes/:sceneId"} component={Scene} />
    <Route exact path={"/session/gm/:sceneId"} component={Session} />
    <Route
      exact
      path={"/session/player/:sceneId/:peerId"}
      component={Session}
    />
    <Route exact path={"/about"} component={About} />

    <Route
      exact
      path={"/game/:gameSlug/play/:characterId"}
      component={PlayCharacter}
    />
    <Route path="*" component={NotFoundRoute} status={404} />
  </Switch>
);
