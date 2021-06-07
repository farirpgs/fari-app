import { CannyPost } from "../CannyPost";

describe("FeatureRequestPostTitle.getTitle", () => {
  it("should return empty if there is no sub path", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("");
  });
  it("should return empty if there is just a trailing slash", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("");
  });
  it("should return empty if there is just a trailing slash with a p", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("");
  });
  it("should return empty if there is no post", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p/",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("");
  });
  it("should format if theres a post", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p/enhance-scenecharacter-drawer",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("Enhance Scenecharacter Drawer");
  });
  it("should format if theres a post", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p/enhance-scenecharacter-drawer",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("Enhance Scenecharacter Drawer");
  });
  it("should format if theres a post", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p/dont-close-character-sheet-after-saving",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("Dont Close Character Sheet After Saving");
  });
  it("should format if theres a post", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p/make-index-cards-flow-from-left-to-right",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("Make Index Cards Flow From Left To Right");
  });
  it("should format if theres a post", () => {
    const result = CannyPost.getTitle({
      pathName: "/feature-requests/p/x-card-and-similars",
      basePath: "/feature-requests",
    });
    expect(result).toEqual("X Card And Similars");
  });
});
