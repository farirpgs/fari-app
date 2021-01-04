import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { showdownConverter } from "../../../constants/showdownConverter";

export type ILoadFunction = () => Promise<string>;

export type IToc = Record<
  string,
  {
    info: ITocElement;
    level2: Array<ITocElement>;
  }
>;

export type ITocElement = {
  label: string;
  level: number;
  id: string;
};
export function useMarkdownFile(loadFunction: ILoadFunction) {
  const [html, setHtml] = useState<string | undefined>();
  const [toc, setToc] = useState<IToc>({});
  const [dom, setDom] = useState<HTMLDivElement>();
  const location = useLocation();

  useEffect(() => {
    load();
    async function load() {
      if (loadFunction) {
        const markdown = await loadFunction();

        if (markdown) {
          const html = showdownConverter.makeHtml(markdown);
          const dom = document.createElement("div");
          dom.innerHTML = html;

          type IToc = Record<
            string,
            {
              info: ITocElement;
              level2: Array<ITocElement>;
            }
          >;

          let newToc: IToc = {};

          let latestH1Id: string | undefined = undefined;
          dom.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((e) => {
            // prepare TOC
            const level = parseInt(e.tagName.replace("H", ""));
            if (level === 1) {
              latestH1Id = e.id;
              newToc = {
                ...newToc,
                [e.id]: {
                  info: {
                    id: e.id,
                    label: e.textContent ?? "",
                    level: level,
                  },
                  level2: [],
                },
              };
            }
            if (latestH1Id && level === 2) {
              newToc[latestH1Id].level2.push({
                id: e.id,
                label: e.textContent ?? "",
                level: level,
              });
            }

            // add anchor on header
            const anchor = document.createElement("a");
            anchor.className = "anchor";
            anchor.href = `#${e.id}`;
            e.append(anchor);
          });

          setHtml(dom.innerHTML);
          setToc(newToc);
          setDom(dom);
        }
      }
    }
  }, [loadFunction]);

  useEffect(() => {
    scrollToHeaderOnLoad();
    function scrollToHeaderOnLoad() {
      if (html && location.hash) {
        setTimeout(() => {
          const element = document.querySelector(location.hash);
          const elementTop = element?.getBoundingClientRect().top ?? 0;
          const topPos = elementTop + window.pageYOffset;
          window.scrollTo({
            top: topPos,
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }, [html]);

  return { html, toc, dom };
}
