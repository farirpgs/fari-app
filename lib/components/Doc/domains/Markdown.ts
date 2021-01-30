import kebabCase from "lodash/kebabCase";
import truncate from "lodash/truncate";
import marked from "marked";

export type IMarkdownIndexes = {
  tree: Array<IMarkdownIndex>;
  flat: Array<IMarkdownIndex>;
};
export type IPage = {
  label: string;
  id: string;
  url: string;
  level: number;
};

export type IMarkdownIndex = {
  id: string;
  label: string;
  preview: string;
  level: number;
  url: string | undefined;
  pageLabel: string | undefined;
  children: Array<IMarkdownIndex>;
};

export enum MarkdownDocMode {
  H1sArePages,
  H1sAndH2sArePages,
}

export const Markdown = {
  process(props: {
    markdown: string;
    prefix: string;
    docMode: MarkdownDocMode;
  }): { dom: HTMLDivElement; markdownIndexes: IMarkdownIndexes } {
    const html = marked(props.markdown);
    const dom = document.createElement("div");
    dom.innerHTML = html;

    const allHeaders = dom.querySelectorAll("h1,h2,h3,h4,h5,h6");

    const treeReferences: Array<IMarkdownIndex> = [];
    const flatReferences: Array<IMarkdownIndex> = [];

    let latestH1: IMarkdownIndex | undefined;
    let latestH2: IMarkdownIndex | undefined;
    let latestParent: IMarkdownIndex | undefined;

    try {
      allHeaders.forEach((element, index) => {
        const currentNode: IMarkdownIndex = getNode({
          element: element,
          prefix: props.prefix,
          latestH1: latestH1,
          latestH2: latestH2,
          docMode: props.docMode,
        });

        if (index === 0 && currentNode.level !== 1) {
          throw "Document doesn't start with an H1";
        }

        flatReferences.push(currentNode);

        const isHigherLevel = !flatReferences.some(
          (n) => n.level < currentNode.level
        );
        if (isHigherLevel) {
          treeReferences.push(currentNode);
          latestParent = undefined;
        }

        if (!!latestParent) {
          const isNodeHigherInHierarchy =
            latestParent.level >= currentNode.level;
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
        if (currentNode.level === 2) {
          latestH2 = currentNode;
        }

        const anchor = makeHeaderAnchor(element);
        element.append(anchor);
      });
    } catch (error) {
      return {
        dom: document.createElement("div"),
        markdownIndexes: {
          flat: [],
          tree: [],
        },
      };
    }

    // dynamic anchors
    const allElementsWithDynamicAnchor = dom.querySelectorAll(".with-anchor");
    allElementsWithDynamicAnchor.forEach((element) => {
      element.id = kebabCase(element.textContent ?? "");
      const anchor = makeHeaderAnchor(element);
      element.append(anchor);
    });

    // dynamic table of content
    const tocElements = dom.querySelectorAll("toc");
    tocElements.forEach((element) => {
      const h1s = treeReferences
        .map((h1) => {
          const h2s = h1.children
            .map(
              (h2) =>
                `<li><a href="${props.prefix}/${h1.id}/${h2.id}">${h2.label}</a></li>`
            )
            .join("");

          return `<li data-toc-id="${h1.id}"><a href="${props.prefix}/${h1.id}">${h1.label}</a><ul class="sub-toc">${h2s}</ul></li>`;
        })
        .join("");
      element.innerHTML = `<ul class="toc">${h1s}</ul>`;
    });

    const markdownIndexes: IMarkdownIndexes = {
      tree: treeReferences,
      flat: flatReferences.map((i) => ({
        ...i,
        children: [],
      })),
    };
    return { dom, markdownIndexes };
  },
  getPage(props: {
    prefix: string;
    dom: HTMLDivElement | undefined;
    page: string | undefined;
    subPage: string | undefined;
    section: string | undefined | null;
    docMode: MarkdownDocMode;
  }) {
    const pageSelector =
      props.docMode === MarkdownDocMode.H1sArePages ? "h1" : "h1,h2";
    const pageElements =
      props.dom?.querySelectorAll(pageSelector) ??
      (([] as unknown) as NodeListOf<Element>);

    if (!!props.dom && pageElements.length === 0) {
      throw `useMarkdownPage: no "${pageSelector}" in the markdown document`;
    }

    const currentPageSelector =
      props.docMode === MarkdownDocMode.H1sArePages
        ? `[id='${props.page}']`
        : `[id='${props.subPage || props.page}']`;

    const currentPageElement =
      props.dom?.querySelector(currentPageSelector) ?? pageElements[0];

    const textAfterCurrentPage = getFirstMatchAfterElement(
      currentPageElement,
      "p,ul"
    );

    const currentSectionElement =
      props.dom?.querySelector(`[id='${props.section}']`) ?? undefined;
    const textAfterCurrentSection = getFirstMatchAfterElement(
      currentSectionElement,
      "p,ul"
    );

    const title =
      currentSectionElement?.textContent ??
      currentPageElement?.textContent ??
      "";
    const firstParagraph =
      textAfterCurrentSection?.textContent ??
      textAfterCurrentPage?.textContent ??
      "";

    const description = truncate(firstParagraph, { length: 155 });

    if (!currentPageElement) {
      return {
        html: "",
        currentPage: makePageFromH1OrH2(pageElements[0], props.prefix),
        previousPage: undefined,
        nextPage: makePageFromH1OrH2(pageElements[1], props.prefix),
        title: title.trim(),
        description: description.trim(),
      };
    }

    let previousPage: IPage | undefined;
    let nextPage: IPage | undefined;

    pageElements.forEach((h, index) => {
      if (h.id === currentPageElement.id) {
        previousPage = makePageFromH1OrH2(
          pageElements[index - 1],
          props.prefix
        );
        nextPage = makePageFromH1OrH2(pageElements[index + 1], props.prefix);
      }
    });

    const allDomElementsInPage = getAllNextSiblingUntilId(
      currentPageElement,
      `${nextPage?.id}`
    );
    const newDom = getNewDom(currentPageElement, allDomElementsInPage);

    return {
      html: newDom?.innerHTML,
      currentPage: makePageFromH1OrH2(currentPageElement, props.prefix),
      previousPage: previousPage,
      nextPage: nextPage,
      title: title.trim(),
      description: description.trim(),
    };
  },
};

function getNode(props: {
  element: Element;
  prefix: string;
  latestH1: IMarkdownIndex | undefined;
  latestH2: IMarkdownIndex | undefined;
  docMode: MarkdownDocMode;
}) {
  const level = getElementLevel(props.element);
  const label = props.element.textContent ?? "";
  const nextElement = props.element.nextElementSibling;
  const canPreviewNextElement = isElementHeader(nextElement);
  const preview = canPreviewNextElement
    ? nextElement?.textContent?.trim() ?? ""
    : "";

  const url = getNodeUrl(props);

  const currentNode: IMarkdownIndex = {
    id: props.element.id,
    label: label,
    preview: preview,
    level: level,
    url: url,
    pageLabel: level !== 1 ? props.latestH1?.label : undefined,
    children: [],
  };
  return currentNode;
}

function getNodeUrl(props: {
  element: Element;
  prefix: string;
  latestH1: IMarkdownIndex | undefined;
  latestH2: IMarkdownIndex | undefined;
  docMode: MarkdownDocMode;
}) {
  const level = getElementLevel(props.element);
  const id = props.element.id;

  if (level === 1) {
    return `${props.prefix}/${id}`;
  }

  if (level === 2) {
    if (props.docMode === MarkdownDocMode.H1sArePages) {
      return `${props.prefix}/${props.latestH1?.id}?goTo=${id}`;
    } else {
      return `${props.prefix}/${props.latestH1?.id}/${id}`;
    }
  }

  if (props.docMode === MarkdownDocMode.H1sArePages) {
    return `${props.prefix}/${props.latestH1?.id}?goTo=${id}`;
  } else {
    return `${props.prefix}/${props.latestH1?.id}/${props.latestH2?.id}?goTo=${id}`;
  }
}

function makeHeaderAnchor(element: Element) {
  const anchor = document.createElement("a");
  anchor.className = "anchor";
  anchor.href = `#${element.id}`;
  return anchor;
}

function isElementHeader(nextElement: Element | null) {
  return !nextElement?.tagName.startsWith("H");
}

function getElementLevel(element: Element) {
  return parseInt(element.tagName.replace("H", ""));
}

function makePageFromH1OrH2(
  element: Element | undefined,
  url: string
): IPage | undefined {
  if (!element) {
    return undefined;
  }

  const level = parseInt(element.tagName.replace("H", ""));
  const previousH1 = getFirstMatchBeforeElement(element, "h1");

  if (level === 1) {
    return {
      label: element.textContent ?? "",
      id: element.id,
      level: level,
      url: `${url}/${element.id}`,
    };
  }

  return {
    label: element.textContent ?? "",
    id: element.id,
    level: level,
    url: `${url}/${previousH1?.id}/${element.id}`,
  };
}

function getNewDom(currentH1: Element, allElementsInPage: Element[]) {
  const newDom = document.createElement("div");
  newDom.append(currentH1?.cloneNode(true)!);
  allElementsInPage.forEach((e) => {
    newDom.append(e.cloneNode(true));
  });
  return newDom;
}

function getAllNextSiblingUntilId(
  elem: Element | undefined | null,
  id: string
) {
  return getAllNextSiblingUntilSelector(elem, `[id='${id}']`);
}

function getAllNextSiblingUntilSelector(
  elem: Element | undefined | null,
  selector: string
) {
  const siblings: Array<Element> = [];

  let currentElement = elem?.nextElementSibling;

  while (currentElement) {
    if (currentElement.matches(selector)) break;

    siblings.push(currentElement);

    currentElement = currentElement.nextElementSibling;
  }

  return siblings;
}

function getFirstMatchAfterElement(
  elem: Element | undefined | null,
  selector: string
): Element | undefined {
  let currentElement = elem?.nextElementSibling;

  while (currentElement) {
    if (currentElement.matches(selector)) {
      return currentElement;
    }

    currentElement = currentElement.nextElementSibling;
  }
}

function getFirstMatchBeforeElement(
  elem: Element | undefined | null,
  selector: string
): Element | undefined {
  let currentElement = elem?.previousElementSibling;

  while (currentElement) {
    if (currentElement.matches(selector)) {
      return currentElement;
    }

    currentElement = currentElement.previousElementSibling;
  }
}
