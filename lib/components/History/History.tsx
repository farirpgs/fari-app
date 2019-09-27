import { useEffect } from "react";
import { withRouter } from "react-router-dom";

export let routerHistory = {} as any;

export const History = withRouter(props => {
  const {
    history,
    children,
    location: { pathname }
  } = props;
  // tslint:disable-next-line: react-hooks-nesting
  useEffect(() => {
    routerHistory = history;
  }, [pathname]);
  return null;
});
