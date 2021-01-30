import { useMemo } from "react";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";
import { Markdown, MarkdownDocMode } from "../domains/Markdown";

export function useMarkdownPage(props: {
  url: string;
  page: string | undefined;
  subPage: string | undefined;
  section: string | undefined | null;
  dom: HTMLDivElement | undefined;
  docMode: MarkdownDocMode;
}): ReturnType<typeof Markdown["getPage"]> {
  const logger = useLogger();

  return useMemo(() => {
    try {
      const result = Markdown.getPage({
        prefix: props.url,
        dom: props.dom,
        page: props.page,
        subPage: props.subPage,
        section: props.section,
        docMode: props.docMode,
      });
      return result;
    } catch (error) {
      logger.error(error);
      return {
        title: "",
        description: "",
        html: "",
        currentPage: undefined,
        previousPage: undefined,
        nextPage: undefined,
      };
    }
  }, [props.url, props.dom, props.page, props.subPage, props.section]);
}
