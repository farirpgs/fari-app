import kebabCase from "lodash/kebabCase";
import { useEffect, useState } from "react";
import { showdownConverter } from "../../../constants/showdownConverter";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";

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
  const logger = useLogger();

  useEffect(() => {
    load();
    async function load() {
      if (loadFunction) {
        try {
          const markdown = await loadFunction();

          if (markdown) {
            const {
              dom,
              headers,
              tableOfContent: newTableOfContent,
            } = Markdown.process(markdown);
            setDom(dom);
            setHtml(dom.innerHTML);
            setAllHeaders(headers);
            setTableOfContent(newTableOfContent);
          }
        } catch (error) {
          logger.error("useMarkdownFile:error", error);
        }
      }
    }
  }, [loadFunction]);

  return { html, tableOfContent, dom, allHeaders };
}

export const scrollMarginTop = 16;
class Markdown {
  public static process(markdown: string) {
    const html = showdownConverter.makeHtml(markdown);
    const dom = document.createElement("div");
    dom.innerHTML = html;

    let tableOfContent: ITableOfContent = {};
    const headers: Array<IMarkdownHeader> = [];

    let latestH1:
      | IMarkdownHeader
      | undefined = (undefined as unknown) as IMarkdownHeader;
    const allHeaders = dom.querySelectorAll("h1,h2,h3,h4,h5,h6");

    for (let i = 0; i < allHeaders.length; i++) {
      const element = allHeaders[i];

      const elementLevel = this.getElementLevel(element);

      if (i === 0 && elementLevel !== 1) {
        throw "Missing top level <h1/> tag";
      }

      const label = element.textContent ?? "";
      const nextElement = element.nextElementSibling;

      const canPreviewNextElement = this.isElementHeader(nextElement);
      const preview = canPreviewNextElement
        ? nextElement?.textContent?.trim() ?? ""
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
    }

    // dynamic anchors
    const allElementsWithDynamicAnchor = dom.querySelectorAll(".with-anchor");
    allElementsWithDynamicAnchor.forEach((element) => {
      element.id = kebabCase(element.textContent ?? "");
      const anchor = this.makeHeaderAnchor(element);
      element.append(anchor);
    });

    // dynamic table of content
    const tocElements = dom.querySelectorAll("toc");
    tocElements.forEach((element) => {
      const [, ...pages] = Object.keys(tableOfContent);
      const listItems = pages
        .map((t) => {
          const to = tableOfContent[t];
          return `<li><a href="${to.page.id}">${to.page.label}</a></li>`;
        })
        .join("");
      element.innerHTML = `<ul>${listItems}</ul>`;
    });

    return { dom, tableOfContent, headers };
  }

  private static makeHeaderAnchor(element: Element) {
    const anchor = document.createElement("a");
    anchor.className = "anchor";
    anchor.href = `#${element.id}`;
    return anchor;
  }

  private static isElementHeader(nextElement: Element | null) {
    return !nextElement?.tagName.startsWith("H");
  }

  private static getElementLevel(element: Element) {
    return parseInt(element.tagName.replace("H", ""));
  }
}
