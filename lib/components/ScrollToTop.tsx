import { useEffect } from "react";
import { withRouter } from "react-router";

export const ScrollToTop = withRouter((({
  children,
  location: { pathname }
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children || null;
}) as any);
