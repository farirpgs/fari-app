import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";

declare const window: Window & { ga: Function; gtag: Function };

export const AppAnalytics = withRouter(function HistoryComponent(props) {
  const {
    location: { pathname },
  } = props;
  const logger = useLogger();

  useEffect(() => {
    const page = window.location.pathname + window.location.search;

    if (window.gtag) {
      window.gtag("config", "UA-150306816-1", { page_path: page });
    }
    logger.info(`Navigate:${location.pathname}`, {
      referrer: document.referrer,
      pathname: location.pathname,
    });
  }, [pathname]);

  useEffect(() => {
    logger.info("Session", {
      referrer: document.referrer,
      pathname: location.pathname,
    });
    if (document.referrer) {
      logger.info(`Referrer:${document.referrer}`, {
        referrer: document.referrer,
      });
    }
  }, []);
  return null;
});
