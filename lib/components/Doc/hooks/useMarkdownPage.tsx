import truncate from "lodash/truncate";
import { useMemo } from "react";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";

export type IPage = {
  label: string;
  id: string;
  url: string;
};

export enum MarkdownDocMode {
  H1sArePages,
  H1sAndH2sArePages,
}
export function useMarkdownPage(props: {
  url: string;
  page: string | undefined;
  subPage: string | undefined;
  section: string | undefined;
  dom: HTMLDivElement | undefined;
  docMode: MarkdownDocMode;
}) {
  const logger = useLogger();

  return useMemo(() => {
    const pageSelector =
      props.docMode === MarkdownDocMode.H1sArePages ? "h1" : "h1,h2";
    const pageElements =
      props.dom?.querySelectorAll(pageSelector) ??
      (([] as unknown) as NodeListOf<Element>);

    if (!!props.dom && pageElements.length === 0) {
      logger.error("useMarkdownPage: no H1s or H2s in the markdown document");
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
        currentPage: makePageFromH1OrH2(pageElements[0], props.url),
        previousPage: undefined,
        nextPage: makePageFromH1OrH2(pageElements[1], props.url),
        title: title.trim(),
        description: description.trim(),
      };
    }

    let previousPage: IPage | undefined;
    let nextPage: IPage | undefined;

    pageElements.forEach((h, index) => {
      if (h.id === currentPageElement.id) {
        previousPage = makePageFromH1OrH2(pageElements[index - 1], props.url);
        nextPage = makePageFromH1OrH2(pageElements[index + 1], props.url);
      }
    });

    const allDomElementsInPage = getAllNextSiblingUntilId(
      currentPageElement,
      `${nextPage?.id}`
    );
    const newDom = getNewDom(currentPageElement, allDomElementsInPage);

    return {
      html: newDom?.innerHTML,
      currentPage: makePageFromH1OrH2(currentPageElement, props.url),
      previousPage: previousPage,
      nextPage: nextPage,
      title: title.trim(),
      description: description.trim(),
    };
  }, [props.url, props.dom, props.page, props.subPage, props.section]);
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
