import { listItem } from "../ListItem";

describe("istItem", () => {
  describe("formatDate", () => {
    it("should support empty string", () => {
      // GIVEN
      const timestamp = "";
      // WHEN
      // @ts-expect-error
      const result = listItem.formatDate(timestamp);
      // THEN
      expect(result).toEqual("");
    });
    it("should support 0", () => {
      // GIVEN
      const timestamp = 0;
      // WHEN
      const result = listItem.formatDate(timestamp);
      // THEN
      expect(result).toEqual("");
    });
    it("should support undefined", () => {
      // GIVEN
      const timestamp = undefined;
      // WHEN
      // @ts-expect-error
      const result = listItem.formatDate(timestamp);
      // THEN
      expect(result).toEqual("");
    });
    it("should format", () => {
      // GIVEN
      const timestamp = 1595012404126;
      // WHEN
      const result = listItem.formatDate(timestamp);
      // THEN
      expect(result).toEqual("Jul 17, 2020 7:00 PM");
    });
  });
  describe("getColor", () => {
    it("should support empty string", () => {
      // GIVEN
      const str = "";
      // WHEN
      const result = listItem.getColor(str);
      // THEN
      expect(result).toEqual("#000000");
    });
    it("should support undefined", () => {
      // GIVEN
      const str = undefined;
      // WHEN
      // @ts-expect-error
      const result = listItem.getColor(str);
      // THEN
      expect(result).toEqual("#000000");
    });
    it("should return the same color for the same text", () => {
      // GIVEN
      const str1 = "The Great Barrier";
      const str2 = "The Great Barrier";
      // WHEN
      const result1 = listItem.getColor(str1);
      const result2 = listItem.getColor(str2);
      // THEN
      expect(result1).toEqual("#55134f");
      expect(result1).toEqual(result2);
    });
  });
  describe("getAbreviation", () => {
    it("should support empty string", () => {
      // GIVEN
      const str = "";
      // WHEN
      const result = listItem.getAbreviation(str);
      // THEN
      expect(result).toEqual("");
    });
    it("should support undefined", () => {
      // GIVEN
      const str = undefined;
      // WHEN
      // @ts-expect-error
      const result = listItem.getAbreviation(str);
      // THEN
      expect(result).toEqual("");
    });
    it("should single word", () => {
      // GIVEN
      const str = "Barrier";
      // WHEN
      const result = listItem.getAbreviation(str);
      // THEN
      expect(result).toEqual("B");
    });
    it("should multiple words", () => {
      // GIVEN
      const str = "The Great Barrier";
      // WHEN
      const result = listItem.getAbreviation(str);
      // THEN
      expect(result).toEqual("T");
    });
  });
});
