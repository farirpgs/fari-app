import { useMemo } from "react";
import { IDocSidebar, ISideBarItems } from "../Doc";
import { IMarkdownIndexes, IPage } from "../domains/Markdown";

export type IUseDocNavigation = ReturnType<typeof useDocNavigation>;

export function useDocNavigation(props: {
  currentPage: IPage | undefined;
  docSideBar: IDocSidebar | undefined;
  markdownIndexes: IMarkdownIndexes;
}) {
  const defaultSideBar = useMemo(() => {
    return {
      ["Sections"]: props.markdownIndexes.tree.map((i) => i.id),
    };
  }, [props.markdownIndexes.tree]);

  const sideBar = props.docSideBar ?? defaultSideBar;

  const navigation = useMemo(() => {
    const highlightedItems = getTableOfContentsHighlightedItems(
      props.currentPage?.id,
      sideBar
    );
    const { allPageIds: allPageIds, defaultOpenedCategories } = parseSideBar(
      sideBar
    );
    const currentPageId = props.currentPage?.id ?? "";
    const currentPageIndex = allPageIds.indexOf(currentPageId);
    const previousPageId = allPageIds[currentPageIndex - 1] ?? undefined;
    const nextPageId = allPageIds[currentPageIndex + 1] ?? undefined;
    return {
      highlightedItems,
      defaultOpenedCategories,
      previousPageId,
      nextPageId,
    };
  }, [props.currentPage, sideBar]);

  return { navigation, sideBar };
}

function getTableOfContentsHighlightedItems(
  pageId: string | undefined,
  sideBar: IDocSidebar
) {
  const selectedItems: Array<string> = [];

  for (const categoryName of Object.keys(sideBar)) {
    const categoryItems = sideBar[categoryName];
    const isTopCategorySelected = checkChildren(pageId, categoryItems);
    if (isTopCategorySelected) {
      selectedItems.push(categoryName);
    }
  }

  return selectedItems;

  function checkChildren(id: string | undefined, items: ISideBarItems) {
    if (!id) {
      return false;
    }

    for (const item of items) {
      const stringItem =
        typeof item === "string" ? (item as string) : undefined;
      const sideBarItem =
        typeof item !== "string" ? (item as IDocSidebar) : undefined;

      if (stringItem && item === id) {
        selectedItems.push(item);
        return true;
      }

      if (sideBarItem) {
        const categories = Object.keys(sideBarItem);
        for (const category of categories) {
          const categoryItems = sideBarItem[category];

          const doesCategoryContainSelected = checkChildren(id, categoryItems);
          if (doesCategoryContainSelected) {
            selectedItems.push(category);
            return true;
          }
        }
      }
    }

    return false;
  }
}

type IParsedSideBar = ReturnType<typeof parseSideBar>;

function parseSideBar(sideBar: IDocSidebar) {
  const defaultOpenedCategories: Array<string> = [];
  const allItems: Array<string> = [];

  for (const categoryName of Object.keys(sideBar)) {
    if (categoryName.startsWith("+")) {
      defaultOpenedCategories.push(categoryName);
    }
    const categoryItems = sideBar[categoryName];
    checkChildren(categoryItems);
  }

  return {
    defaultOpenedCategories: defaultOpenedCategories,
    allPageIds: allItems,
  };

  function checkChildren(items: ISideBarItems) {
    for (const item of items) {
      const stringItem =
        typeof item === "string" ? (item as string) : undefined;

      const sideBarItem =
        typeof item !== "string" ? (item as IDocSidebar) : undefined;

      if (stringItem) {
        allItems.push(stringItem);
      }

      if (sideBarItem) {
        const categories = Object.keys(sideBarItem);

        for (const category of categories) {
          if (category.startsWith("+")) {
            defaultOpenedCategories.push(category);
          }
          const categoryItems = sideBarItem[category];

          checkChildren(categoryItems);
        }
      }
    }

    return false;
  }
}
