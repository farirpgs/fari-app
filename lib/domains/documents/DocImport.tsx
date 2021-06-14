import axios from "axios";

async function getDoc(getMarkdownPromise: Promise<typeof import("*?url")>) {
  const url = (await getMarkdownPromise).default;
  const docResponse = await axios.get(url);
  return docResponse.data;
}

/**
 * Import HTML documents generated from the original markdown files by `eleventy`
 */
export const DocImport = {
  FateCondensed: () => {
    return getDoc(import("../../../_site/docs/fate-condensed/index.html?url"));
  },
  FateCore: () => {
    return getDoc(import("../../../_site/docs/fate-core/index.html?url"));
  },
  FateAccelerated: () => {
    return getDoc(
      import("../../../_site/docs/fate-accelerated/index.html?url")
    );
  },
  FateAdversaryToolkit: () => {
    return getDoc(
      import("../../../_site/docs/fate-adversary-toolkit/index.html?url")
    );
  },
  FateSystemToolkit: () => {
    return getDoc(
      import("../../../_site/docs/fate-system-toolkit/index.html?url")
    );
  },
  FateStunts: () => {
    return getDoc(import("../../../_site/docs/fate-stunts/index.html?url"));
  },
  SeelieSquire: () => {
    return getDoc(import("../../../_site/docs/seelie-squire/index.html?url"));
  },
  SceneCheckist: () => {
    return getDoc(import("../../../_site/docs/scene-checklist/index.html?url"));
  },
  CheatSheet: () => {
    return getDoc(import("../../../_site/docs/cheat-sheet/index.html?url"));
  },
  Dials: () => {
    return getDoc(import("../../../_site/docs/dials/index.html?url"));
  },
  SuccessWithStyle: () => {
    return getDoc(
      import("../../../_site/docs/success-with-style/index.html?url")
    );
  },
  FariWiki: () => {
    return getDoc(import("../../../_site/docs/fari-wiki/index.html?url"));
  },
  Blog: () => {
    return getDoc(import("../../../_site/docs/blog/index.html?url"));
  },
  Test: () => {
    return getDoc(import("../../../_site/docs/test/index.html?url"));
  },
  TestEmpty: () => {
    return getDoc(import("../../../_site/docs/test-empty/index.html?url"));
  },
  Changelog: () => {
    return getDoc(import("../../../_site/CHANGELOG/index.html?url"));
  },
  FateCondensedPtBr: () => {
    return getDoc(
      import("../../../_site/docs/fate-condensed-pt-br/index.html?url")
    );
  },
};
