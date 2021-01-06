export const SrdImport = {
  Condensed: () => {
    return import("../../../srds/Fate-Condensed-SRD-CC-BY.md");
  },
  Core: () => {
    return import("../../../srds/fate-core.md");
  },
  Accelerated: () => {
    return import("../../../srds/fate-accelerated-SRD.md");
  },
};
