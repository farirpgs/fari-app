import { useEffect } from "react";
import { useLocation } from "react-router";
import { scrollMarginTop } from "./useMarkdownFile";

export function useScrollOnHtmlLoad(html: string | undefined) {
  const location = useLocation();

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    scrollToHeaderOnLoad();
    function scrollToHeaderOnLoad() {
      if (html && location.hash) {
        timeout = setTimeout(() => {
          const element = document.querySelector(location.hash);
          const elementTop = element?.getBoundingClientRect().top ?? 0;
          const topPos = elementTop + window.pageYOffset;
          window.scrollTo({
            top: topPos - scrollMarginTop,
            behavior: "smooth",
          });
        }, 300);
      }
    }
    return () => {
      clearTimeout(timeout as NodeJS.Timeout);
    };
  }, [html, location.hash]);
}
