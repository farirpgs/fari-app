import { useContext, useEffect } from "react";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";
import { InjectionsContext } from "../../contexts/InjectionsContext/InjectionsContext";

ReactGA.initialize("UA-150306816-1");

export let routerHistory = {} as any;

declare const window: Window & { ga: Function };

export const History = withRouter(function HistoryComponent(props) {
  const { googleAnalyticsService } = useContext(InjectionsContext);
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
