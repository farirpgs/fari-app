import { useEffect } from "react";
import { withRouter } from "react-router-dom";

declare const window: Window & { ga: Function; gtag: Function };

export const History = withRouter(function HistoryComponent(props) {
  const {
    history,
    location: { pathname },
  } = props;

  useEffect(() => {
    const page = window.location.pathname + window.location.search;

    if (window.gtag) {
      window.gtag("config", "UA-150306816-1", { page_path: page });
    }
  }, [pathname]);
  return null;
});
