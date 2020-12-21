import { arraySort } from "../arraySort";

describe("arraySort", () => {
  it("should sort numbers ASC", () => {
    // GIVEN
    const list = [5, 3, 4, 1, 2];
    // WHEN
    const result = arraySort(list, [(it) => ({ value: it, direction: "asc" })]);
    // THEN
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
  it("should sort numbers DESC", () => {
    // GIVEN
    const list = [5, 3, 4, 1, 2];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual([5, 4, 3, 2, 1]);
  });
  it("should boolean numbers ASC", () => {
    // GIVEN
    const list = [false, false, false, true, false];
    // WHEN
    const result = arraySort(list, [(it) => ({ value: it, direction: "asc" })]);
    // THEN
    expect(result).toEqual([true, false, false, false, false]);
  });
  it("should boolean numbers DESC", () => {
    // GIVEN
    const list = [true, true, true, false, true];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual([false, true, true, true, true]);
  });
  it("should sort strings ASC", () => {
    // GIVEN
    const list = ["J", "A", "C", "J", "G", "R", "Y", "P", "J", "J"];
    // WHEN
    const result = arraySort(list, [(it) => ({ value: it, direction: "asc" })]);
    // THEN
    expect(result).toEqual(["A", "C", "G", "J", "J", "J", "J", "P", "R", "Y"]);
  });
  it("should sort strings DESC", () => {
    // GIVEN
    const list = ["J", "A", "C", "J", "G", "R", "Y", "P", "J", "J"];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual(["Y", "R", "P", "J", "J", "J", "J", "G", "C", "A"]);
  });

  it("should handle having multiple getters for tiebrakers", () => {
    // GIVEN
    const list = [
      { name: "J", age: 10, title: "backend" },
      { name: "A", age: 1, title: "frontend" },
      { name: "C", age: 9, title: "frontend" },
      { name: "J", age: 2, title: "frontend" },
      { name: "G", age: 8, title: "frontend" },
      { name: "R", age: 3, title: "frontend" },
      { name: "Y", age: 7, title: "frontend" },
      { name: "P", age: 4, title: "frontend" },
    ];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it.title, direction: "asc" }),
      (it) => ({ value: it.age, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual([
      { age: 10, name: "J", title: "backend" },
      { age: 9, name: "C", title: "frontend" },
      { age: 8, name: "G", title: "frontend" },
      { age: 7, name: "Y", title: "frontend" },
      { age: 4, name: "P", title: "frontend" },
      { age: 3, name: "R", title: "frontend" },
      { age: 2, name: "J", title: "frontend" },
      { age: 1, name: "A", title: "frontend" },
    ]);
  });
  it("should handle having multiple getters for tiebrakers for booleans than numbers", () => {
    // GIVEN
    const list = [
      { pinned: true, type: 0 },
      { pinned: false, type: 0 },
      { pinned: true, type: 0 },
      { pinned: false, type: 0 },
      { pinned: true, type: 1 },
      { pinned: false, type: 1 },
      { pinned: true, type: 1 },
      { pinned: false, type: 1 },
    ];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it.pinned, direction: "asc" }),
      (it) => ({ value: it.type, direction: "asc" }),
    ]);
    // THEN
    expect(result).toEqual([
      { pinned: true, type: 0 },
      { pinned: true, type: 0 },
      { pinned: true, type: 1 },
      { pinned: true, type: 1 },
      { pinned: false, type: 0 },
      { pinned: false, type: 0 },
      { pinned: false, type: 1 },
      { pinned: false, type: 1 },
    ]);
  });

  it("should handle undefined values in number sort", () => {
    // GIVEN
    const list = [1, 2, undefined, 4];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual([4, 2, 1, undefined]);
  });

  it("should handle undefined values in string sort", () => {
    // GIVEN
    const list = ["a", "b", undefined, "c"];
    // WHEN
    const result = arraySort(list, [
      (it) => ({ value: it, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual(["c", "b", "a", undefined]);
  });

  it("should handle getters that return undefined for arrays of numbers", () => {
    // GIVEN
    const list = [1, 2, undefined, 3];
    // WHEN
    //@ts-expect-error
    const result = arraySort(list, [() => undefined]);
    // THEN
    expect(result).toEqual([1, 2, 3, undefined]);
  });

  it("should handle getters that return undefined for arrays of strings", () => {
    // GIVEN
    const list = ["a", "b", undefined, "c"];
    // WHEN
    //@ts-expect-error
    const result = arraySort(list, [() => undefined]);
    // THEN
    expect(result).toEqual(["a", "b", "c", undefined]);
  });

  it("should handle undefined getters", () => {
    // GIVEN
    const list = ["a", "b", undefined, "c"];
    // WHEN
    //@ts-expect-error
    const result = arraySort(list, [undefined]);
    // THEN
    expect(result).toEqual(["a", "b", "c", undefined]);
  });
  it("should handle undefined array", () => {
    // GIVEN
    const list = undefined;
    // WHEN
    //@ts-expect-error
    const result = arraySort(list, [
      (it) => ({ value: it, direction: "desc" }),
    ]);
    // THEN
    expect(result).toEqual(list);
  });
});
