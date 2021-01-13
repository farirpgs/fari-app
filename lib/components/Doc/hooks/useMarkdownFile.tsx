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
  preview: string;
  level: number;
  page: IMarkdownHeader | undefined;
};

export function useMarkdownFile(loadFunction: ILoadFunction) {
  const [dom, setDom] = useState<HTMLDivElement>();
  const [html, setHtml] = useState<string | undefined>();
  const [tableOfContent, setTableOfContent] = useState<ITableOfContent>({});
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
          const headers: Array<IMarkdownHeader> = [];

          let latestH1: IMarkdownHeader | undefined = undefined;
          dom.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((element) => {
            const elementLevel = parseInt(element.tagName.replace("H", ""));
            const label = element.textContent ?? "";
            const nextElement = element.nextElementSibling;

            const canPreviewNextElement = !nextElement?.tagName.startsWith("H");
            const preview = canPreviewNextElement
              ? nextElement?.textContent ?? ""
              : "";

            const tocElement: IMarkdownHeader = {
              id: element.id,
              label: label,
              preview: preview,
              level: elementLevel,
              page: latestH1,
            };

            // prepare TOC
            if (elementLevel === 1) {
              latestH1 = tocElement;
              newToc = {
                ...newToc,
                [element.id]: { page: tocElement, children: [] },
              };
            }
            if (latestH1 && elementLevel === 2) {
              newToc[latestH1.id].children.push(tocElement);
            }

            headers.push(tocElement);

            // add anchor on header
            const anchor = document.createElement("a");
            anchor.className = "anchor";
            anchor.href = `#${element.id}`;
            element.append(anchor);
          });

          setHtml(dom.innerHTML);
          setTableOfContent(newToc);
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
            top: topPos - scrollMarginTop,
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }, [html, location.hash]);

  return { html, tableOfContent, dom, allHeaders };
}

export const scrollMarginTop = 16;
