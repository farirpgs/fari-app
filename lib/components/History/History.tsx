import { useEffect } from "react";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";
import { googleAnalyticsService } from "../../services/injections";

ReactGA.initialize("UA-150306816-1");

export let routerHistory = {} as any;

declare const window: Window & { ga: Function };

export const History = withRouter(function HistoryComponent(props) {
  const {
    history,
    location: { pathname },
  } = props;
  useEffect(() => {
    routerHistory = history;
    googleAnalyticsService.sendPageView();
  }, [pathname]);
  return null;
});
