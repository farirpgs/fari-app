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
  grouping: string;
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
          const {
            dom,
            headers,
            tableOfContent: newTableOfContent,
          } = new Markdown().process(markdown);

          setDom(dom);
          setHtml(dom.innerHTML);
          setAllHeaders(headers);
          setTableOfContent(newTableOfContent);
        }
      }
    }
  }, [loadFunction]);

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

  return { html, tableOfContent, dom, allHeaders };
}

export const scrollMarginTop = 16;

class Markdown {
  public process(markdown: string) {
    const html = showdownConverter.makeHtml(markdown);
    const dom = document.createElement("div");
    dom.innerHTML = html;

    let tableOfContent: ITableOfContent = {};
    const headers: Array<IMarkdownHeader> = [];

    let latestH1: IMarkdownHeader = (undefined as unknown) as IMarkdownHeader;
    const allHeaders = dom.querySelectorAll("h1,h2,h3,h4,h5,h6");

    allHeaders.forEach((element) => {
      const elementLevel = this.getElementLevel(element);
      const label = element.textContent ?? "";
      const nextElement = element.nextElementSibling;

      const canPreviewNextElement = this.isElementHeader(nextElement);
      const preview = canPreviewNextElement
        ? nextElement?.textContent ?? ""
        : "";

      if (elementLevel === 1) {
        const header1: IMarkdownHeader = {
          id: element.id,
          label: label,
          preview: preview,
          level: elementLevel,
          page: undefined,
          grouping: label,
        };

        latestH1 = header1;
        tableOfContent = {
          ...tableOfContent,
          [element.id]: { page: header1, children: [] },
        };
        headers.push(header1);
      } else {
        const header: IMarkdownHeader = {
          id: element.id,
          label: label,
          preview: preview,
          level: elementLevel,
          page: latestH1,
          grouping: latestH1?.label,
        };

        headers.push(header);

        if (elementLevel === 2) {
          tableOfContent[latestH1.id].children.push(header);
        }
      }

      const anchor = this.makeHeaderAnchor(element);
      element.append(anchor);
    });

    return { dom, tableOfContent, headers };
  }

  private makeHeaderAnchor(element: Element) {
    const anchor = document.createElement("a");
    anchor.className = "anchor";
    anchor.href = `#${element.id}`;
    return anchor;
  }

  private isElementHeader(nextElement: Element | null) {
    return !nextElement?.tagName.startsWith("H");
  }

  private getElementLevel(element: Element) {
    return parseInt(element.tagName.replace("H", ""));
  }
}
