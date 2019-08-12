import React from "react";
import { Route, Switch } from "react-router-dom";
import { Characters } from "./routes/Characters";
import { CreateCharacter } from "./routes/CreateCharacter";
import { Dices } from "./routes/Dices";
import { Games } from "./routes/Games";
import { NotFoundRoute } from "./routes/NotFoundRoute";
import { PlayCharacter } from "./routes/PlayCharacter";

export const AppRouter = () => (
  <Switch>
    <Route exact path={"/"} component={Games} />
    <Route exact path={"/g/:gameSlug"} component={Characters} />
    <Route exact path={"/g/:gameSlug/create"} component={CreateCharacter} />
    <Route exact path={"/dices"} component={Dices} />
    <Route
      exact
      path={"/g/:gameSlug/play/:characterId"}
      component={PlayCharacter}
    />
    <Route path="*" component={NotFoundRoute} status={404} />
  </Switch>
);
