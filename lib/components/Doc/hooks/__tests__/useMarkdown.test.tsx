/**
 * @jest-environment jsdom
 */
/* eslint-disable react/display-name */

import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { InjectionsContext } from "../../../../contexts/InjectionsContext/InjectionsContext";
import { useMarkdownFile } from "../useMarkdownFile";
import { useMarkdownPage } from "../useMarkdownPage";

const fakeLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

beforeEach(() => {
  fakeLogger.debug.mockReset();
  fakeLogger.info.mockReset();
  fakeLogger.warn.mockReset();
  fakeLogger.error.mockReset();
});

describe("useMarkdownFile", () => {
  describe("Given I have an undefined markdown file", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(() => {
        return useMarkdownFile(anUndefinedMarkdownFile);
      });

      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.allHeaders).toEqual([]);
      expect(view.result.current.tableOfContent).toEqual({});
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I dont have a load function", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(() => {
        return useMarkdownFile(undefined as any);
      });

      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.allHeaders).toEqual([]);
      expect(view.result.current.tableOfContent).toEqual({});
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I have an empty markdown file", () => {
    it("should return an undefined state", () => {
      const view = renderHook(() => {
        return useMarkdownFile(anEmptyMarkdownFile);
      });

      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.allHeaders).toEqual([]);
      expect(view.result.current.tableOfContent).toEqual({});
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I have a markdown file without h1", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile(aMarkdownFileWithoutAHeader1);
        },
        {
          wrapper: wrapper,
        }
      );

      view.waitFor(() => {
        expect(fakeLogger.error).toHaveBeenCalledWith("");
      });
      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.allHeaders).toEqual([]);
      expect(view.result.current.tableOfContent).toEqual({});
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I properly formatted markdown file", () => {
    it("should return an good state", async () => {
      const view = renderHook(() => {
        return useMarkdownFile(aGoodMarkdownFile);
      });
      await view.waitForValueToChange(() => view.result.current.html);

      expect(view.result.current.html).toMatchSnapshot();
      expect(view.result.current.dom).toMatchSnapshot();
      expect(view.result.current.allHeaders).toEqual([
        {
          grouping: "Page 1",
          id: "page1",
          label: "Page 1",
          level: 1,
          page: undefined,
          preview: "Page 1 introduction",
        },
        {
          grouping: "Page 1",
          id: "header2",
          label: "Header 2",
          level: 2,
          page: {
            grouping: "Page 1",
            id: "page1",
            label: "Page 1",
            level: 1,
            page: undefined,
            preview: "Page 1 introduction",
          },
          preview: "Header 2 details",
        },
        {
          grouping: "Page 2",
          id: "page2",
          label: "Page 2",
          level: 1,
          page: undefined,
          preview: "Page 2 introduction",
        },
        {
          grouping: "Page 3",
          id: "page3",
          label: "Page 3",
          level: 1,
          page: undefined,
          preview: "Page 3 introduction",
        },
        {
          grouping: "Page 3",
          id: "rage",
          label: "Rage",
          level: 2,
          page: {
            grouping: "Page 3",
            id: "page3",
            label: "Page 3",
            level: 1,
            page: undefined,
            preview: "Page 3 introduction",
          },
          preview:
            "Berserk Rage. When you suffer a physical consequence, you can invoke that consequence for free on your next attack. If you suffer multiple physical consequences, you get a free invocation for each. (Fate System Toolkit, p.34)",
        },
      ]);
      expect(view.result.current.tableOfContent).toEqual({
        page1: {
          children: [
            {
              grouping: "Page 1",
              id: "header2",
              label: "Header 2",
              level: 2,
              page: {
                grouping: "Page 1",
                id: "page1",
                label: "Page 1",
                level: 1,
                page: undefined,
                preview: "Page 1 introduction",
              },
              preview: "Header 2 details",
            },
          ],
          page: {
            grouping: "Page 1",
            id: "page1",
            label: "Page 1",
            level: 1,
            page: undefined,
            preview: "Page 1 introduction",
          },
        },
        page2: {
          children: [],
          page: {
            grouping: "Page 2",
            id: "page2",
            label: "Page 2",
            level: 1,
            page: undefined,
            preview: "Page 2 introduction",
          },
        },
        page3: {
          children: [
            {
              grouping: "Page 3",
              id: "rage",
              label: "Rage",
              level: 2,
              page: {
                grouping: "Page 3",
                id: "page3",
                label: "Page 3",
                level: 1,
                page: undefined,
                preview: "Page 3 introduction",
              },
              preview:
                "Berserk Rage. When you suffer a physical consequence, you can invoke that consequence for free on your next attack. If you suffer multiple physical consequences, you get a free invocation for each. (Fate System Toolkit, p.34)",
            },
          ],
          page: {
            grouping: "Page 3",
            id: "page3",
            label: "Page 3",
            level: 1,
            page: undefined,
            preview: "Page 3 introduction",
          },
        },
      });
    });
  });
});

describe("useMarkdownPage", () => {
  describe("Given an empty page", () => {
    it("should default to first h1", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(anEmptyMarkdownFile);

        return useMarkdownPage({ page: "", section: "", dom: dom });
      });

      expect(view.result.current.title).toEqual("");
      expect(view.result.current.description).toEqual("");
      expect(view.result.current.currentH1).toEqual(undefined);
      expect(view.result.current.previousH1).toEqual(undefined);
      expect(view.result.current.nextH1).toEqual(undefined);
    });
  });
  describe("Given an undefined page", () => {
    it("should default to first h1", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(anUndefinedMarkdownFile);

        return useMarkdownPage({ page: undefined, section: "", dom: dom });
      });

      expect(view.result.current.title).toEqual("");
      expect(view.result.current.description).toEqual("");
      expect(view.result.current.currentH1).toEqual(undefined);
      expect(view.result.current.previousH1).toEqual(undefined);
      expect(view.result.current.nextH1).toEqual(undefined);
    });
  });
  describe("Given an undefined page", () => {
    it("should default to first h1", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(aGoodMarkdownFile);

        return useMarkdownPage({ page: undefined, section: "", dom: dom });
      });

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("Page 1");
      expect(view.result.current.description).toEqual("Page 1 introduction");
      expect(view.result.current.currentH1.textContent).toEqual("Page 1");
      expect(view.result.current.previousH1).toEqual(undefined);
      expect(view.result.current.nextH1?.textContent).toEqual("Page 2");
    });
  });
  describe("Given the first page page", () => {
    it("should go to first h1", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(aGoodMarkdownFile);

        return useMarkdownPage({ page: undefined, section: "", dom: dom });
      });

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("Page 1");
      expect(view.result.current.description).toEqual("Page 1 introduction");
      expect(view.result.current.currentH1.textContent).toEqual("Page 1");
      expect(view.result.current.previousH1).toEqual(undefined);
      expect(view.result.current.nextH1?.textContent).toEqual("Page 2");
    });
  });
  describe("Given the second page", () => {
    it("should go to second h1", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(aGoodMarkdownFile);

        return useMarkdownPage({ page: "page2", section: "", dom });
      });

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("Page 2");
      expect(view.result.current.description).toEqual("Page 2 introduction");
      expect(view.result.current.currentH1.textContent).toEqual("Page 2");
      expect(view.result.current.previousH1?.textContent).toEqual("Page 1");
      expect(view.result.current.nextH1?.textContent).toEqual("Page 3");
    });
  });
  describe("Given the third page", () => {
    it("should go to third h1", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(aGoodMarkdownFile);

        return useMarkdownPage({ page: "page3", section: "", dom });
      });

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("Page 3");
      expect(view.result.current.description).toEqual("Page 3 introduction");
      expect(view.result.current.currentH1.textContent).toEqual("Page 3");
      expect(view.result.current.previousH1?.textContent).toEqual("Page 2");
      expect(view.result.current.nextH1).toEqual(undefined);
    });
  });
  describe("Given the third page and there is a hash", () => {
    it("should go to third h1 and have the right title and description", async () => {
      const view = renderHook(() => {
        const { dom } = useMarkdownFile(aGoodMarkdownFile);

        return useMarkdownPage({ page: "page3", section: "#rage", dom });
      });

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("Rage");
      expect(view.result.current.description).toEqual(
        "Berserk Rage. When you suffer a physical consequence, you can invoke that consequence for free on your next attack. If you suffer multiple physical con..."
      );
      expect(view.result.current.currentH1.textContent).toEqual("Page 3");
      expect(view.result.current.previousH1?.textContent).toEqual("Page 2");
      expect(view.result.current.nextH1).toEqual(undefined);
    });
  });
});

const wrapper = (props: { children?: React.ReactNode }): JSX.Element => {
  return (
    <InjectionsContext.Provider value={{ logger: fakeLogger } as any}>
      {props.children}
    </InjectionsContext.Provider>
  );
};

function makeLoadFunction(markdownFile: string | undefined) {
  return async () => new Promise<string>((r) => r(markdownFile as string));
}

const anUndefinedMarkdownFile = makeLoadFunction(undefined);
const anEmptyMarkdownFile = makeLoadFunction("");
const aGoodMarkdownFile = makeLoadFunction(`
# Page 1

Page 1 introduction

## Header 2

Header 2 details

# Page 2

Page 2 introduction

# Page 3

Page 3 introduction

- bullet 1
- bullet 2


## Rage

- **Berserk Rage**. When you suffer a physical consequence, you can invoke that consequence for free on your next attack. If you suffer multiple physical consequences, you get a free invocation for each. (Fate System Toolkit, p.34)

`);

const aMarkdownFileWithoutAHeader1 = makeLoadFunction(`
## Header 2

Header 2 details
`);
