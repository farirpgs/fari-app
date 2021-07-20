import { useMemo } from "react";
import { IDoceSideBarOptions, IDocSidebar, ISideBarItems } from "../Doc";
import { IDocumentIndexes } from "../domains/DocumentProcessor";

const MISC_SECTION_NAME = "Misc";

export type IUseDocNavigation = ReturnType<typeof useDocNavigation>;

export function useDocNavigation(props: {
  currentPageId: string | undefined;
  docSideBar: IDocSidebar | undefined;
  doceSideBarOptions: IDoceSideBarOptions | undefined;
  defaultSideBarCategory?: string;
  markdownIndexes: IDocumentIndexes;
}) {
  const miscSectionName =
    props.doceSideBarOptions?.miscSectionTitle ?? MISC_SECTION_NAME;
  const defaultSideBar = useMemo(() => {
    return {
      [props.defaultSideBarCategory ?? "Fari"]: props.markdownIndexes.tree.map(
        (i) => i.id
      ),
    };
  }, [props.markdownIndexes.tree]);

  const sideBar = props.docSideBar ?? defaultSideBar;

  const navigation = useMemo(() => {
    const { allMappedPageIds, defaultOpenedCategories } = parseSideBar(sideBar);
    const currentPageId = props.currentPageId ?? "";
    const pageIdsWithoutCategories: Array<string> = [];

    for (const index of props.markdownIndexes.tree) {
      if (!allMappedPageIds.includes(index.id)) {
        pageIdsWithoutCategories.push(index.id);
      }
    }

    const highlightedItems = getTableOfContentsHighlightedItems(
      props.currentPageId,
      sideBar
    );
    const isInsideMiscSection =
      pageIdsWithoutCategories.includes(currentPageId);
    if (isInsideMiscSection) {
      highlightedItems.push(miscSectionName, currentPageId);
    }

    if (pageIdsWithoutCategories.length > 0) {
      defaultOpenedCategories.push(miscSectionName);
    }

    const allPageIds = [...allMappedPageIds, ...pageIdsWithoutCategories];
    const currentPageIndex = allPageIds.indexOf(currentPageId);
    const previousPageId = allPageIds[currentPageIndex - 1] ?? undefined;
    const nextPageId = allPageIds[currentPageIndex + 1] ?? undefined;

    return {
      highlightedItems,
      defaultOpenedCategories,
      previousPageId,
      nextPageId,
      pageIdsWithoutCategories,
    };
  }, [props.currentPageId, sideBar, props.markdownIndexes.flat]);

  const sideBarPossiblyWithMissingItems = useMemo(() => {
    if (navigation.pageIdsWithoutCategories.length === 0) {
      return sideBar;
    } else {
      return {
        ...sideBar,
        [miscSectionName]: navigation.pageIdsWithoutCategories,
      };
    }
  }, [sideBar, navigation.pageIdsWithoutCategories]);

  return { navigation, sideBar: sideBarPossiblyWithMissingItems };
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
    allMappedPageIds: allItems,
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
