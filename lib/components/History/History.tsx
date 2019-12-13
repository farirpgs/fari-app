import { useEffect } from "react";
import { withRouter } from "react-router-dom";

import ReactGA from "react-ga";
import { useStoreContext } from "../../context/store";
ReactGA.initialize("UA-150306816-1");

export let routerHistory = {} as any;

declare const window: Window & { ga: Function };

export const History = withRouter(function HistoryComponent(props) {
  const {
    history,
    location: { pathname }
  } = props;
  const store = useStoreContext();
  useEffect(() => {
    routerHistory = history;
    store.location.setPathname(history.location.pathname);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [pathname]);
  return null;
});
