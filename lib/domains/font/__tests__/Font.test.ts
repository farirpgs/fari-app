import { Font } from "../Font";

describe("Font", () => {
  describe("lineHeight", () => {
    it("should always return a line height 1.5 bigger than the font size", () => {
      // GIVEN
      const fontSize = 1;
      // WHEN
      const result = Font.lineHeight(fontSize);
      // THEN
      expect(result).toEqual(`1.5rem`);
    });
    it("should fallback to 1rem if there's no fontSize", () => {
      // GIVEN
      const fontSize = undefined;
      // WHEN
      //@ts-expect-error
      const result = Font.lineHeight(fontSize);
      // THEN
      expect(result).toEqual(`1rem`);
    });
  });
});
