import { useEffect } from "react";
import { withRouter } from "react-router-dom";

export let routerHistory = {} as any;

declare const window: Window & { ga: Function };

export const History = withRouter(props => {
  const {
    history,
    children,
    location: { pathname }
  } = props;
  // tslint:disable-next-line: react-hooks-nesting
  useEffect(() => {
    routerHistory = history;
    try {
      window.ga("set", "page", location.pathname + location.search);
      window.ga("send", "pageview");
    } catch (error) {
      // ...
    }
  }, [pathname]);
  return null;
});
