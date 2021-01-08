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

    if (allH1s.length === 0) {
      logger.error("useMarkdownPage: no H1 in markdown document");
    }

    const currentH1 = dom?.querySelector(`#${page}`) ?? allH1s[0];
    const firstParagraph = dom?.querySelector(`p`)?.textContent ?? "";
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

    const allElementsInPage = nextSiblingUntil(currentH1, `#${nextH1?.id}`);

    const newDom = document.createElement("div");
    newDom.append(currentH1?.cloneNode(true)!);
    allElementsInPage.forEach((e) => {
      newDom.append(e.cloneNode(true));
    });

    return {
      html: newDom?.innerHTML,
      currentH1,
      previousH1,
      nextH1,
      description,
    };
  }, [page, dom]);
}

function nextSiblingUntil(
  elem: Element | undefined | null,
  selector: string,
  filter?: string
) {
  const siblings: Array<Element> = [];

  let currentElement = elem?.nextElementSibling;

  while (currentElement) {
    if (currentElement.matches(selector)) break;

    if (filter && !currentElement.matches(filter)) {
      currentElement = currentElement.nextElementSibling;
      continue;
    }

    siblings.push(currentElement);

    currentElement = currentElement.nextElementSibling;
  }

  return siblings;
}
