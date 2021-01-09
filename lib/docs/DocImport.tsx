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
  SeelieSquire: () => {
    return import("./seelie-squire.md");
  },
  FateStunts: () => {
    return import("./fate-stunts.md");
  },
  TheBigListOfRpgPlots: () => {
    return import("./the-big-list-of-rpg-plots.md");
  },
  Changelog: () => {
    return import("../../CHANGELOG.md");
  },
};
