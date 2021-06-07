import { useEffect } from "react";
import { scrollMarginTop } from "./useMarkdownFile";

export function useScrollOnHtmlLoad(
  html: string | undefined,
  section: string | undefined | null
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
        }, DELAY_FOR_IMAGES_TO_LOAD);
      }
    }
    return () => {
      clearTimeout(timeout as NodeJS.Timeout);
    };
  }, [html, section]);
}

const DELAY_FOR_IMAGES_TO_LOAD = 500;
