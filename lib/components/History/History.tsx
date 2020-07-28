import { useContext, useEffect } from "react";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { googleAnalyticsService } from "../../services/injections";

ReactGA.initialize("UA-150306816-1");

export let routerHistory = {} as any;

declare const window: Window & { ga: Function };

export const History = withRouter(function HistoryComponent(props) {
  const charactersManager = useContext(CharactersContext);
  const scenesManager = useContext(ScenesContext);

  const {
    history,
    location: { pathname },
  } = props;
  useEffect(() => {
    routerHistory = history;
    googleAnalyticsService.sendPageView();
    charactersManager.actions.clearSelected();
    scenesManager.actions.clearSelected();
  }, [pathname]);
  return null;
});
