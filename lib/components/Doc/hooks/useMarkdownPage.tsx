import truncate from "lodash/truncate";
import { useMemo } from "react";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";

export type IPage = {
  label: string;
  id: string;
  url: string;
};

export function useMarkdownPage(options: {
  url: string;
  page: string | undefined;
  subPage: string | undefined;
  section: string | undefined;
  dom: HTMLDivElement | undefined;
}) {
  const { url, page, subPage, dom, section } = options;
  const logger = useLogger();

  return useMemo(() => {
    const allH1sAndH2s =
      dom?.querySelectorAll(`h1,h2`) ??
      // dom?.querySelectorAll(`h1`) ?? (([] as unknown) as NodeListOf<Element>);

    if (!!dom && allH1sAndH2s.length === 0) {
      logger.error("useMarkdownPage: no H1s or H2s in the markdown document");
    }

    const currentPageElement =
      dom?.querySelector(`[id='${subPage || page}']`) ?? allH1sAndH2s[0];
      // dom?.querySelector(`[id='${page}']`) ?? allH1sAndH2s[0];
    const textAfterCurrentPage = getFirstMatchAfterElement(
      currentPageElement,
      "p,ul"
    );

    const currentSectionElement =
      dom?.querySelector(`[id='${section}']`) ?? undefined;
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
        currentPage: makePageFromH1OrH2(allH1sAndH2s[0], url),
        previousPage: undefined,
        nextPage: makePageFromH1OrH2(allH1sAndH2s[1], url),
        title: title.trim(),
        description: description.trim(),
      };
    }

    let previousPage: IPage | undefined;
    let nextPage: IPage | undefined;

    allH1sAndH2s.forEach((h, index) => {
      if (h.id === currentPageElement.id) {
        previousPage = makePageFromH1OrH2(allH1sAndH2s[index - 1], url);
        nextPage = makePageFromH1OrH2(allH1sAndH2s[index + 1], url);
      }
    });

    const allDomElementsInPage = getAllNextSiblingUntilId(
      currentPageElement,
      `${nextPage?.id}`
    );
    const newDom = getNewDom(currentPageElement, allDomElementsInPage);

    return {
      html: newDom?.innerHTML,
      currentPage: makePageFromH1OrH2(currentPageElement, url),
      previousPage: previousPage,
      nextPage: nextPage,
      title: title.trim(),
      description: description.trim(),
    };
  }, [url, dom, page, subPage, section]);
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
      url: `${url}/${element.id}`,
    };
  }

  return {
    label: element.textContent ?? "",
    id: element.id,
    url: `${url}/${previousH1!.id}/${element!.id}`,
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
