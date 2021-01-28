import kebabCase from "lodash/kebabCase";
import { useEffect, useState } from "react";
import { showdownConverter } from "../../../constants/showdownConverter";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";

export type ILoadFunction = () => Promise<string>;

export type IMarkdownIndexes = {
  tree: Array<IMarkdownIndex>;
  flat: Array<IMarkdownIndex>;
};

export type IMarkdownIndex = {
  id: string;
  label: string;
  preview: string;
  level: number;
  pageId: string | undefined;
  pageLabel: string | undefined;
  children: Array<IMarkdownIndex>;
};

export function useMarkdownFile(loadFunction: ILoadFunction, prefix: string) {
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
      if (loadFunction) {
        try {
          const markdown = await loadFunction();

          if (markdown) {
            const { dom, markdownIndexes } = Markdown.process(markdown, prefix);
            setDom(dom);
            setHtml(dom.innerHTML);
            setMarkdownIndexes(markdownIndexes);
          }
        } catch (error) {
          logger.error("useMarkdownFile:error", error);
        }
      }
    }
  }, [loadFunction]);

  return { dom, html, markdownIndexes };
}

export const scrollMarginTop = 16;

class Markdown {
  public static process(markdown: string, prefix: string) {
    const html = showdownConverter.makeHtml(markdown);
    const dom = document.createElement("div");
    dom.innerHTML = html;

    const allHeaders = dom.querySelectorAll("h1,h2,h3,h4,h5,h6");

    const treeReferences: Array<IMarkdownIndex> = [];
    const flatReferences: Array<IMarkdownIndex> = [];

    let latestH1: IMarkdownIndex | undefined;
    let latestParent: IMarkdownIndex | undefined;

    allHeaders.forEach((element) => {
      const currentNode: IMarkdownIndex = Markdown.getNode(element, latestH1);

      flatReferences.push(currentNode);

      const isHigherLevel = !flatReferences.some(
        (n) => n.level < currentNode.level
      );
      if (isHigherLevel) {
        treeReferences.push(currentNode);
        latestParent = undefined;
      }

      if (!!latestParent) {
        const isNodeHigherInHierarchy = latestParent.level >= currentNode.level;
        if (isNodeHigherInHierarchy) {
          const indexWithHigherLevelFromEnd = [...flatReferences]
            .reverse()
            .find((i) => i.level < currentNode.level);
          latestParent = indexWithHigherLevelFromEnd;
        }
        latestParent?.children.push(currentNode);
      }
      latestParent = currentNode;

      if (currentNode.level === 1) {
        latestH1 = currentNode;
      }

      const anchor = this.makeHeaderAnchor(element);
      element.append(anchor);
    });

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
      const h1 = treeReferences
        .map((h1) => {
          const h2s = h1.children
            .map(
              (h2) =>
                `<li><a href="${prefix}/${h1.id}/${h2.id}">${h2.label}</a></li>`
            )
            .join("");

          return `<li><a href="${prefix}/${h1.id}">${h1.label}</a><ul class="toc">${h2s}</ul></li>`;
        })
        .join("");
      element.innerHTML = `<ul class="toc">${h1}</ul>`;
    });

    const markdownIndexes: IMarkdownIndexes = {
      tree: treeReferences,
      flat: flatReferences.map((i) => ({
        ...i,
        children: [],
      })),
    };
    return { dom, markdownIndexes };
  }

  private static getNode(
    element: Element,
    latestH1: IMarkdownIndex | undefined
  ) {
    const elementLevel = this.getElementLevel(element);
    const label = element.textContent ?? "";
    const nextElement = element.nextElementSibling;
    const canPreviewNextElement = this.isElementHeader(nextElement);
    const preview = canPreviewNextElement
      ? nextElement?.textContent?.trim() ?? ""
      : "";
    const currentNode: IMarkdownIndex = {
      id: element.id,
      label: label,
      preview: preview,
      level: elementLevel,
      pageId: elementLevel !== 1 ? latestH1?.id : undefined,
      pageLabel: elementLevel !== 1 ? latestH1?.label : undefined,
      children: [],
    };
    return currentNode;
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
