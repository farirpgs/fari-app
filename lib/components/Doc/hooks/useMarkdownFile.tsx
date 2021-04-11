import axios from "axios";
import { useEffect, useState } from "react";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";
import { IMarkdownIndexes, Markdown } from "../domains/Markdown";

export type ILoadFunction = any;

export function useMarkdownFile(props: {
  loadFunction: ILoadFunction;
  prefix: string;
}) {
  const [dom, setDom] = useState<HTMLDivElement>();
  const [html, setHtml] = useState<string | undefined>();
  const [markdownIndexes, setMarkdownIndexes] = useState<IMarkdownIndexes>({
    tree: [],
    flat: [],
  });
  const logger = useLogger();

  useEffect(() => {
    load();
    async function load() {
      if (props.loadFunction) {
        try {
          const markdown = await (await axios.get(props.loadFunction)).data;
          debugger;
          if (markdown) {
            const { dom, markdownIndexes } = Markdown.process({
              markdown: markdown,
              prefix: props.prefix,
            });
            setDom(dom);
            setHtml(dom.innerHTML);
            setMarkdownIndexes(markdownIndexes);
          }
        } catch (error) {
          logger.error("useMarkdownFile:error", error);
        }
      }
    }
  }, [props.loadFunction]);

  return { dom, html, markdownIndexes };
}

export const scrollMarginTop = 16;
