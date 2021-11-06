/**
 * @jest-environment jsdom
 */
/* eslint-disable react/display-name */

import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { InjectionsContext } from "../../../../contexts/InjectionsContext/InjectionsContext";
import { useMarkdownFile } from "../useMarkdownFile";
import { useMarkdownPage } from "../useMarkdownPage";

jest.mock("../../../../constants/env.ts");
jest.mock("axios");
jest.mock("@sentry/react");
jest.mock("@sentry/browser");

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

describe("Given I want use the autocomplete indexes", () => {
  it("should give me good indexes", async () => {
    const view = renderHook(
      () => {
        return useMarkdownFile({
          loadFunction: aWiki,
          prefix: "/prefix",
        });
      },
      {
        wrapper: wrapper,
      }
    );

    await view.waitForNextUpdate();

    expect(
      view.result.current.markdownIndexes.flat.map((i) => {
        return {
          label: i.label,
          url: i.url,
        };
      })
    ).toEqual([
      { label: "Wiki", url: "/prefix/wiki" },
      { label: "FAQ", url: "/prefix/faq" },
      { label: "Question 1", url: "/prefix/faq?goTo=question-1" },
      { label: "Question 2", url: "/prefix/faq?goTo=question-2" },
      { label: "Question 3", url: "/prefix/faq?goTo=question-3" },
      {
        label: "Question 3 Explanation",
        url: "/prefix/faq?goTo=question-3-explanation",
      },
      { label: "Tips and Tricks", url: "/prefix/tips-and-tricks" },
      { label: "Tip 1", url: "/prefix/tips-and-tricks?goTo=tip-1" },
      { label: "Tip 2", url: "/prefix/tips-and-tricks?goTo=tip-2" },
      { label: "Tip 3", url: "/prefix/tips-and-tricks?goTo=tip-3" },
      {
        label: "Question 3 Explanation",
        url: "/prefix/tips-and-tricks?goTo=question-3-explanation-1",
      },
    ]);
  });
});

describe("useMarkdownFile", () => {
  describe("Given I have an undefined markdown file", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: anUndefinedMarkdownFile,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );

      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.markdownIndexes.flat).toEqual([]);
      expect(view.result.current.markdownIndexes.tree).toEqual([]);
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I dont have a load function", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: undefined as any,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );

      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.markdownIndexes.flat).toEqual([]);
      expect(view.result.current.markdownIndexes.tree).toEqual([]);
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I have an empty markdown file", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: anEmptyMarkdownFile,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );

      expect(view.result.current.html).toEqual(undefined);
      expect(view.result.current.markdownIndexes.flat).toEqual([]);
      expect(view.result.current.markdownIndexes.tree).toEqual([]);
      expect(view.result.current.dom).toEqual(undefined);
    });
  });
  describe("Given I have a markdown file without h1", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: aMarkdownFileWithoutAHeader1,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );
      await view.waitForValueToChange(() => view.result.current.html);

      expect(view.result.current.html).toMatchSnapshot();
      expect(view.result.current.markdownIndexes.flat).toEqual([]);
      expect(view.result.current.markdownIndexes.tree).toEqual([]);
      expect(view.result.current.dom).toMatchSnapshot();
    });
  });
  describe("Given I have a markdown file with a dynamic anchor tag", () => {
    it("should add an anchor at the tag matching the id", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: aMarkdownFileWithADynamicAnchor,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForValueToChange(() => view.result.current.html);
      expect(view.result.current.html).toMatchSnapshot();
      expect(
        view.result.current.dom
          ?.querySelector("#something-important .anchor")
          ?.getAttribute("href")
      ).toEqual("#something-important");
    });
  });
  describe("Given I have a markdown file with a dynamic table of contents element", () => {
    it("should add a table of contents", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: aMarkdownFileWithADynamicTableOfContents,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForValueToChange(() => view.result.current.html);
      expect(view.result.current.dom?.querySelector(".toc")).toMatchSnapshot();
    });
  });
  describe("Given I properly formatted markdown file", () => {
    it("should return an good state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: aComplexeMarkdownFile,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );
      await view.waitForValueToChange(() => view.result.current.html);

      expect(view.result.current.html).toMatchSnapshot();
      expect(view.result.current.dom).toMatchSnapshot();
    });
  });
  describe("Given I hierarchy formatted markdown file", () => {
    it("should return an good state", async () => {
      const view = renderHook(
        () => {
          return useMarkdownFile({
            loadFunction: aMarkdownFileInHierarchy,
            prefix: "/test-doc",
          });
        },
        {
          wrapper: wrapper,
        }
      );
      await view.waitForValueToChange(() => view.result.current.html);

      expect(view.result.current.html).toMatchSnapshot();
      expect(view.result.current.dom).toMatchSnapshot();
      expect(view.result.current.markdownIndexes.flat).toMatchSnapshot(
        "markdownIndexes.flat"
      );
      expect(view.result.current.markdownIndexes.tree).toMatchSnapshot(
        "markdownIndexes.tree"
      );
    });
  });
});

describe("useMarkdownPage", () => {
  describe("Given an empty page", () => {
    it("should default to first h1", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: anEmptyMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: "",
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      expect(view.result.current.title).toEqual("");
      expect(view.result.current.description).toEqual("");
    });
  });
  describe("Given an undefined page for an undefined markdown file", () => {
    it("should default to first h1", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: anUndefinedMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: undefined,
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      expect(view.result.current.title).toEqual("");
      expect(view.result.current.description).toEqual("");
    });
  });
  describe("Given I have a markdown file without h1", () => {
    it("should return an undefined state", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: aMarkdownFileWithoutAHeader1,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: undefined,
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForValueToChange(
        () => view.result.current.pageDom?.innerHTML
      );
      expect(fakeLogger.error).toHaveBeenCalledWith(
        "useMarkdownPage:error",
        'DocumentProcessor: no "h1" in the document'
      );
      expect(view.result.current.title).toEqual("Error");
      expect(view.result.current.description).toEqual("Document Error");
      expect(view.result.current.pageDom?.innerHTML).toEqual(
        `<h1>Error</h1><p>There was an error processing this document</p>`
      );
    });
  });

  describe("Given an undefined page with a good markdown page", () => {
    it("should default to first h1", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: aComplexeMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: undefined,
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("header-1");
      expect(view.result.current.description).toEqual("[header-1.text]");
    });
  });
  describe("Given the first page page", () => {
    it("should go to first h1", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: aComplexeMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: "header-1",
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("header-1");
      expect(view.result.current.description).toEqual("[header-1.text]");
    });
  });
  describe("Given the second page", () => {
    it("should go to second h1", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: aComplexeMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: "header-2",
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("header-2");
      expect(view.result.current.description).toEqual("[header-2.text]");
    });
  });
  describe("Given the third page", () => {
    it("should go to third h1", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: aComplexeMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: "header-3",
            section: "",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("header-3");
      expect(view.result.current.description).toEqual("[header-3.text]");
    });
  });
  describe("Given the third page and there is a section", () => {
    it("should go to third h1 and have the right title and description", async () => {
      const view = renderHook(
        () => {
          const { dom } = useMarkdownFile({
            loadFunction: aComplexeMarkdownFile,
            prefix: "/test-doc",
          });

          return useMarkdownPage({
            page: "header-3",
            section: "rage",
            url: "test-doc",
            dom: dom,
          });
        },
        {
          wrapper: wrapper,
        }
      );

      await view.waitForNextUpdate();
      expect(view.result.current.title).toEqual("Rage");
      expect(view.result.current.description).toEqual(
        "Berserk Rage. When you suffer a physical consequence, you can invoke that consequence for free on your next attack. If you suffer multiple physical cons..."
      );
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
const aComplexeMarkdownFile = makeLoadFunction(`<h1>header-1</h1>
<p>[header-1.text]</p>
<h2>header-1-1</h2>
<p>[header-1-2.text]</p>
<h2>header-1-2</h2>
<p>[header-1-2.text]</p>
<h3>header-1-2-1</h3>
<h3>header-1-2-2</h3>
<h3>header-1-2-3</h3>
<h1>header-2</h1>
<p>[header-2.text]</p>
<h1>header-3</h1>
<p>[header-3.text]</p>
<ul>
<li>bullet 1</li>
<li>bullet 2</li>
</ul>
<h2>Rage</h2>
<ul>
<li><strong>Berserk Rage</strong>. When you suffer a physical consequence, you can invoke that consequence for free on your next attack. If you suffer multiple physical consequences, you get a free invocation for each. (Fate System Toolkit, p.34)</li>
</ul>
`);

const aMarkdownFileInHierarchy = makeLoadFunction(`<h1>header-1</h1>
<h2>header-2</h2>
<h3>header-3</h3>
<h4>header-4</h4>
<h5>header-5</h5>
<h6>header-6</h6>

<h1>again_1</h1>
<h2>again_2</h2>
<h2>again_2</h2>
<h3>again_3</h3>
<h3>again_3</h3>
<h4>again_4</h4>
<h4>again_4</h4>
<h5>again_5</h5>
<h5>again_5</h5>
<h6>again_6</h6>
<h6>again_6</h6>

`);

const aMarkdownFileWithoutAHeader1 = makeLoadFunction(`<h2>Header 2</h2>
<p>Header 2 details</p>
`);

const aMarkdownFileWithADynamicAnchor = makeLoadFunction(`<h1>Header 1</h1>
<p class="with-anchor">something important</p>
`);

const aMarkdownFileWithADynamicTableOfContents = makeLoadFunction(`
<h1>1</h1>
<toc></toc>
<h2>1.1</h2>
<h2>1.2</h2>
<h2>1.3</h2>
<h1>2</h1>
<h2>2.1</h2>
<h2>2.2</h2>
<h2>2.3</h2>
<h1>3</h1>
<h1>4</h1>

`);

const aWiki = makeLoadFunction(`
<h1>Wiki</h1>

<h1>FAQ</h1>

<h2>Question 1</h2>

<h2>Question 2</h2>

<h2>Question 3</h2>

<h3>Question 3 Explanation</h3>

<h1>Tips and Tricks</h1>

<h2>Tip 1</h2>

<h2>Tip 2</h2>

<h2>Tip 3</h2>

<h3>Question 3 Explanation</h3>

`);
