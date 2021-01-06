import { useMemo } from "react";
import { nextUntil } from "../SrdRoute";

export function useMarkdownPage(
  page: string | undefined,
  dom: HTMLDivElement | undefined
) {
  return useMemo(() => {
    const allH1 =
      dom?.querySelectorAll(`h1`) ?? (([] as unknown) as NodeListOf<Element>);

    const currentH1 = dom?.querySelector(`#${page}`) ?? allH1[0];

    if (!currentH1) {
      return {
        html: "",
        currentH1: allH1[0],
        previousH1: undefined,
        nextH1: allH1[1],
      };
    }

    let previousH1: Element | undefined;
    let nextH1: Element | undefined;

    allH1.forEach((h1, index) => {
      if (h1.id === currentH1.id) {
        previousH1 = allH1[index - 1];
        nextH1 = allH1[index + 1];
      }
    });

    const arrayElement = nextUntil(currentH1, `#${nextH1?.id}`);

    const newDom = document.createElement("div");
    newDom.append(currentH1?.cloneNode(true)!);
    arrayElement.forEach((e) => {
      newDom.append(e.cloneNode(true));
    });

    return { html: newDom?.innerHTML, currentH1, previousH1, nextH1 };
  }, [page, dom]);
}
