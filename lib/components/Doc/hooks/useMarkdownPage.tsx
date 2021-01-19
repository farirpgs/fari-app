import truncate from "lodash/truncate";
import { useMemo } from "react";
import { useLogger } from "../../../contexts/InjectionsContext/hooks/useLogger";

export function useMarkdownPage(
  page: string | undefined,
  dom: HTMLDivElement | undefined
) {
  const logger = useLogger();
  return useMemo(() => {
    const allH1s =
      dom?.querySelectorAll(`h1`) ?? (([] as unknown) as NodeListOf<Element>);

    if (!!dom && allH1s.length === 0) {
      logger.error("useMarkdownPage: no H1 in markdown document");
    }

    const currentH1 = dom?.querySelector(`[id='${page}']`) ?? allH1s[0];
    const firstParagraphAfterCurrentH1 = getFirstMatchFromElement(
      currentH1,
      "p"
    );
    const firstParagraph = firstParagraphAfterCurrentH1?.textContent ?? "";
    const description = truncate(firstParagraph, { length: 155 });

    if (!currentH1) {
      return {
        html: "",
        currentH1: allH1s[0],
        previousH1: undefined,
        nextH1: allH1s[1],
      };
    }

    let previousH1: Element | undefined;
    let nextH1: Element | undefined;

    allH1s.forEach((h1, index) => {
      if (h1.id === currentH1.id) {
        previousH1 = allH1s[index - 1];
        nextH1 = allH1s[index + 1];
      }
    });

    const allElementsInPage = getAllNextSiblingUntilId(
      currentH1,
      `${nextH1?.id}`
    );
    const newDom = getNewDom(currentH1, allElementsInPage);

    return {
      html: newDom?.innerHTML,
      currentH1,
      previousH1,
      nextH1,
      description,
    };
  }, [page, dom]);
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

function getFirstMatchFromElement(
  elem: Element | undefined | null,
  selector: string
): Element | undefined {
  const siblings: Array<Element> = [];

  let currentElement = elem?.nextElementSibling;

  while (currentElement) {
    if (currentElement.matches(selector)) {
      return currentElement;
    }

    currentElement = currentElement.nextElementSibling;
  }
}
