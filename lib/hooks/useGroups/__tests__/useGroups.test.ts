import { renderHook } from "@testing-library/react-hooks";
import { useGroups } from "../useGroups";

describe("useGroups", () => {
  const getter = (item: string | undefined) => item;

  describe("Given an empty array", () => {
    const list: Array<string | undefined> = [];
    it("should return an empty list", () => {
      const view = renderHook(() => {
        return useGroups(list, getter);
      });

      expect(view.result.current).toEqual([]);
    });
  });
  describe("Given an array with undefined elements", () => {
    const list: Array<string | undefined> = ["1", undefined, "3"];
    it("should return filtered out groups", () => {
      const view = renderHook(() => {
        return useGroups(list, getter);
      });

      expect(view.result.current).toEqual(["1", "3"]);
    });
  });
  describe("Given an array with duplicates", () => {
    const list: Array<string | undefined> = [
      "1",
      undefined,
      "3",
      "1",
      "5",
      "avatar: the last airbender",
      "avatar: the last airbender",
      "Delibuddies",
      "Delibuddies",
    ];
    it("should return unique groups", () => {
      const view = renderHook(() => {
        return useGroups(list, getter);
      });

      expect(view.result.current).toEqual([
        "1",
        "3",
        "5",
        "avatar: the last airbender",
        "Delibuddies",
      ]);
    });
  });
});
