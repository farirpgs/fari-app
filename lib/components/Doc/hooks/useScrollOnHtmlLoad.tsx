import { useEffect } from "react";
import { scrollMarginTop } from "./useMarkdownFile";

export function useScrollOnHtmlLoad(
  html: string | undefined,
  section: string | undefined
) {
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    scrollToHeaderOnLoad();
    function scrollToHeaderOnLoad() {
      if (html && section) {
        timeout = setTimeout(() => {
          const element = document.querySelector(`#${section}`);
          const elementTop = element?.getBoundingClientRect().top ?? 0;
          const topPos = elementTop + window.pageYOffset;
          window.scrollTo({
            top: topPos - scrollMarginTop,
            behavior: "smooth",
          });
        }, 0);
      }
    }
    return () => {
      clearTimeout(timeout as NodeJS.Timeout);
    };
  }, [html, section]);
}
