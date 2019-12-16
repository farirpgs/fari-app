import { BadGuyCard, selectors } from "../BadGuyCard";

describe("BadGuyCard", () => {
  describe("selectors", () => {
    describe("getStressCount", () => {
      it("should parse normal number ", () => {
        const result = selectors.getStressCount({ stress: "3" });
        expect(result).toEqual(3);
      });
      it("should parse decimal number ", () => {
        const result = selectors.getStressCount({ stress: "3.4" });
        expect(result).toEqual(3);
      });
      it("should default to 0 on parsing symbols ", () => {
        const result = selectors.getStressCount({ stress: "---" });
        expect(result).toEqual(0);
      });
      it("should default to 0 on parsing letters ", () => {
        const result = selectors.getStressCount({ stress: "asd" });
        expect(result).toEqual(0);
      });
    });
    describe("getConsequenceCount", () => {
      it("should parse normal number ", () => {
        const result = selectors.getConsequenceCount({ consequences: "3" });
        expect(result).toEqual(3);
      });
      it("should parse decimal number ", () => {
        const result = selectors.getConsequenceCount({ consequences: "3.4" });
        expect(result).toEqual(3);
      });
      it("should default to 0 on parsing symbols ", () => {
        const result = selectors.getConsequenceCount({ consequences: "---" });
        expect(result).toEqual(0);
      });
      it("should default to 0 on parsing letters ", () => {
        const result = selectors.getConsequenceCount({ consequences: "asd" });
        expect(result).toEqual(0);
      });
    });
  });
});
