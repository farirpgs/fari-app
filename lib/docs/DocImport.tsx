export const DocImport = {
  FateCondensed: () => {
    return import("./fate-condensed-cc-by.md");
  },
  FateCore: () => {
    return import("./fate-core.md");
  },
  FateAccelerated: () => {
    return import("./fate-accelerated.md");
  },
  FateAdversaryToolkit: () => {
    return import("./fate-adversary-toolkit.md");
  },
  FateSystemToolkit: () => {
    return import("./fate-system-toolkit.md");
  },
  SeelieSquire: () => {
    return import("./seelie-squire.md");
  },
  FateStunts: () => {
    return import("./fate-stunts.md");
  },
  SceneCheckist: () => {
    return import("./scene-checklist.md");
  },
  CheatSheet: () => {
    return import("./cheat-sheet.md");
  },
  Dials: () => {
    return import("./dials.md");
  },
  Test: () => {
    return import("./test.md");
  },
  Changelog: () => {
    return import("../../CHANGELOG.md");
  },
};
