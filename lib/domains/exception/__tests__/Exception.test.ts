import { Exception } from "../Exception";

describe("Exception", () => {
  describe("buildClassError", () => {
    it("should return class error", () => {
      // GIVEN
      // WHEN
      const result = Exception.buildClassError({
        className: "MyClass",
        methodName: "myMethod",
        message: "Something went wrong",
        data: { some: 0, data: 1 },
      });
      // THEN
      expect(result).toEqual({
        className: "MyClass",
        methodName: "myMethod",
        message: "Something went wrong",
        data: { some: 0, data: 1 },
      });
    });
  });
  describe("buildFunctionError", () => {
    it("should return class error", () => {
      // GIVEN
      // WHEN
      const result = Exception.buildFunctionError({
        functionName: "myFunction",
        message: "Something went wrong",
        data: { some: 0, data: 1 },
      });
      // THEN
      expect(result).toEqual({
        functionName: "myFunction",
        message: "Something went wrong",
        data: { some: 0, data: 1 },
      });
    });
  });
  describe("parseError", () => {
    it("should handle undefined errors", () => {
      const result = Exception.parse(undefined);
      expect(result).toEqual(undefined);
    });
    it("should handle null errors", () => {
      const result = Exception.parse(null);
      expect(result).toEqual(null);
    });
    it("should handle empty string errors", () => {
      const result = Exception.parse("");
      expect(result).toEqual("");
    });
    it("should handle String errors", () => {
      const result = Exception.parse("this is a string error");
      expect(result).toEqual("this is a string error");
    });
    it("should handle Object errors", () => {
      const result = Exception.parse({
        someProperty: "this is a string error",
      });
      expect(result).toEqual({ someProperty: "this is a string error" });
    });
    it("should handle Object with deep properties", () => {
      const result = Exception.parse({
        someProperty: "this is a string error",
        anotherProperty: { hello: 3 },
      });
      expect(result).toEqual({
        someProperty: "this is a string error",
        anotherProperty: { hello: 3 },
      });
    });
    it("should handle new Error()", () => {
      const result = Exception.parse(new Error("This is a new error"));
      expect(result.message).toEqual("This is a new error");
      expect(result.stack).toContain("Error: This is a new error");
    });
  });
});
