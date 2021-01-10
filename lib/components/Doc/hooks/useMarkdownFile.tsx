import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { showdownConverter } from "../../../constants/showdownConverter";

export type ILoadFunction = () => Promise<string>;

export type ITableOfContent = Record<
  string,
  {
    page: IMarkdownHeader;
    children: Array<IMarkdownHeader>;
  }
>;

export type IMarkdownHeader = {
  id: string;
  label: string;
  level: number;
  parent: IMarkdownHeader | undefined;
};

export function useMarkdownFile(loadFunction: ILoadFunction) {
  const [html, setHtml] = useState<string | undefined>();
  const [toc, setToc] = useState<ITableOfContent>({});
  const [dom, setDom] = useState<HTMLDivElement>();
  const [allHeaders, setAllHeaders] = useState<Array<IMarkdownHeader>>([]);
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

          let newToc: ITableOfContent = {};
          let latestH1: IMarkdownHeader | undefined = undefined;
          const headers: Array<IMarkdownHeader> = [];

          dom.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((e) => {
            // prepare TOC
            const level = parseInt(e.tagName.replace("H", ""));
            const tocElement: IMarkdownHeader = {
              id: e.id,
              label: e.textContent ?? "",
              level: level,
              parent: latestH1,
            };

            if (level === 1) {
              latestH1 = tocElement;
              newToc = {
                ...newToc,
                [e.id]: { page: tocElement, children: [] },
              };
            }
            if (latestH1 && level === 2) {
              newToc[latestH1.id].children.push(tocElement);
            }

            headers.push(tocElement);

            // add anchor on header
            const anchor = document.createElement("a");
            anchor.className = "anchor";
            anchor.href = `#${e.id}`;
            e.append(anchor);
          });

          setHtml(dom.innerHTML);
          setToc(newToc);
          setDom(dom);
          setAllHeaders(headers);
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
  }, [html, location.hash]);

  return { html, toc, dom, allHeaders };
}
