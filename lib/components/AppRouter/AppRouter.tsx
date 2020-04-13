import React from "react";
import { Route, Switch } from "react-router-dom";
import { About } from "../../routes/About/About";
import { Characters } from "../../routes/Characters/Characters";
import { CreateCharacter } from "../../routes/CreateCharacter/CreateCharacter";
import { Dice } from "../../routes/Dice/Dice";
import { Games } from "../../routes/Games/Games";
import { Home } from "../../routes/Home/Home";
import { NotFoundRoute } from "../../routes/NotFoundRoute/NotFoundRoute";
import { Play } from "../../routes/Play/Play";

export const AppRouter = () => (
  <Switch>
    <Route exact path={"/"} component={Home} />
    <Route exact path={"/games"} component={Games} />
    <Route exact path={"/game/:gameSlug"} component={Characters} />
    <Route exact path={"/game/:gameSlug/create"} component={CreateCharacter} />
    <Route exact path={"/dice"} component={Dice} />
    <Route exact path={"/play"} component={Play} />
    <Route exact path={"/play/:id"} component={Play} />

    <Route exact path={"/about"} component={About} />

    <Route path="*" component={NotFoundRoute} status={404} />
  </Switch>
);
