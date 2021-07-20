import { renderHook } from "@testing-library/react-hooks";
import { IDocSidebar } from "../../Doc";
import { IDocumentIndex } from "../../domains/DocumentProcessor";
import { useDocNavigation } from "../useDocNavigation";

describe("useDocNavigation", () => {
  it("should handle top level and deep default opened items", () => {
    const { result } = renderHook(() => {
      return useDocNavigation({
        currentPageId: undefined,
        markdownIndexes: {
          flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
        },
        docSideBar: sideBarMock,
        doceSideBarOptions: undefined,
      });
    });
    expect(result.current.navigation.defaultOpenedCategories).toEqual([
      "+Getting Started",
      "+Credits List",
    ]);
  });
  it("should handle top highlighted items", () => {
    const { result } = renderHook(() => {
      return useDocNavigation({
        currentPageId: "welcome",

        markdownIndexes: {
          flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
        },
        docSideBar: sideBarMock,
        doceSideBarOptions: undefined,
      });
    });
    expect(result.current.navigation.highlightedItems).toEqual([
      "welcome",
      "Introduction",
    ]);
  });
  it("should handle deep highlighted items", () => {
    const { result } = renderHook(() => {
      return useDocNavigation({
        currentPageId: "credits-2",
        markdownIndexes: {
          flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
        },
        docSideBar: sideBarMock,
        doceSideBarOptions: undefined,
      });
    });
    expect(result.current.navigation.highlightedItems).toEqual([
      "credits-2",
      "+Credits List",
      "Credits",
    ]);
  });
  describe("previous", () => {
    it("should give me the previous item if it exists", () => {
      const { result } = renderHook(() => {
        return useDocNavigation({
          currentPageId: "chapter-2",
          markdownIndexes: {
            flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
            tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          },
          docSideBar: sideBarMock,
          doceSideBarOptions: undefined,
        });
      });
      expect(result.current.navigation.previousPageId).toEqual("chapter-1");
    });
    it("should return nothing if there is not previous item", () => {
      const { result } = renderHook(() => {
        return useDocNavigation({
          currentPageId: "welcome",
          markdownIndexes: {
            flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
            tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          },
          docSideBar: sideBarMock,
          doceSideBarOptions: undefined,
        });
      });
      expect(result.current.navigation.previousPageId).toEqual(undefined);
    });
  });
  describe("next", () => {
    it("should give me the next item if it exists", () => {
      const { result } = renderHook(() => {
        return useDocNavigation({
          currentPageId: "chapter-2",
          markdownIndexes: {
            flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
            tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          },
          docSideBar: sideBarMock,
          doceSideBarOptions: undefined,
        });
      });
      expect(result.current.navigation.nextPageId).toEqual("chapter-3");
    });
    it("should return nothing if there is not next item", () => {
      const { result } = renderHook(() => {
        return useDocNavigation({
          currentPageId: "credits-2",
          markdownIndexes: {
            flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
            tree: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          },
          docSideBar: sideBarMock,
          doceSideBarOptions: undefined,
        });
      });
      expect(result.current.navigation.nextPageId).toEqual(undefined);
    });
  });
  describe("page ids without categories", () => {
    it("should categorized pages that are not wrapped in a category", () => {
      const { result } = renderHook(() => {
        return useDocNavigation({
          currentPageId: "chapter-2",
          markdownIndexes: {
            flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
            tree: [
              { id: "missing-1", level: 1 },
              { id: "missing-2", level: 1 },
              { id: "missing-3", level: 1 },
            ] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          },
          docSideBar: sideBarMock,
          doceSideBarOptions: undefined,
        });
      });
      expect(result.current.navigation.pageIdsWithoutCategories).toEqual([
        "missing-1",
        "missing-2",
        "missing-3",
      ]);
      expect(result.current.sideBar).toEqual({
        "+Getting Started": [
          { Prerequisites: ["prerequisites"] },
          "chapter-1",
          "chapter-2",
          "chapter-3",
        ],
        "Credits": [
          "thank-you",
          { "+Credits List": ["credits-1", "credits-2"] },
        ],
        "Introduction": ["welcome"],
        "Misc": ["missing-1", "missing-2", "missing-3"],
      });
    });
  });
  describe("no side bar", () => {
    it("should categorized pages in default category if there is no sidebar", () => {
      const { result } = renderHook(() => {
        return useDocNavigation({
          currentPageId: "chapter-2",
          markdownIndexes: {
            flat: [] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
            tree: [
              { id: "missing-1", level: 1 },
              { id: "missing-2", level: 1 },
              { id: "missing-3", level: 1 },
              { id: "fate-condensed", level: 1 },
              { id: "introduction", level: 1 },
              { id: "getting-started", level: 1 },
              { id: "taking-action-rolling-the-dice", level: 1 },
              { id: "aspects-and-fate-points", level: 1 },
              { id: "challenges-conflicts-and-contests", level: 1 },
              { id: "advancement", level: 1 },
              { id: "being-the-game-master", level: 1 },
              { id: "optional-rules", level: 1 },
              { id: "what-version-is-this", level: 1 },
              { id: "credits", level: 1 },
            ] as Array<Partial<IDocumentIndex>> as Array<IDocumentIndex>,
          },
          docSideBar: undefined,
          doceSideBarOptions: undefined,
        });
      });

      expect(result.current.sideBar).toEqual({
        Fari: [
          "missing-1",
          "missing-2",
          "missing-3",
          "fate-condensed",
          "introduction",
          "getting-started",
          "taking-action-rolling-the-dice",
          "aspects-and-fate-points",
          "challenges-conflicts-and-contests",
          "advancement",
          "being-the-game-master",
          "optional-rules",
          "what-version-is-this",
          "credits",
        ],
      });
    });
  });
});

const sideBarMock: IDocSidebar = {
  "Introduction": ["welcome"],
  "+Getting Started": [
    { Prerequisites: ["prerequisites"] },
    "chapter-1",
    "chapter-2",
    "chapter-3",
  ],
  "Credits": ["thank-you", { "+Credits List": ["credits-1", "credits-2"] }],
};
