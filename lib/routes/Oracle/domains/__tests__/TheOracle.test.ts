import { TheOracle } from "../TheOracle";

describe("TheOracle", () => {
  describe("Given I want a value based off a dice result", () => {
    it("should return the right value based off the right number", () => {
      expect(TheOracle.getValue(5)).toBe("YesAnd");
      expect(TheOracle.getValue(4)).toBe("YesAnd");
      expect(TheOracle.getValue(3)).toBe("Yes");
      expect(TheOracle.getValue(2)).toBe("Yes");
      expect(TheOracle.getValue(1)).toBe("Yes");
      expect(TheOracle.getValue(0)).toBe("YesBut");
      expect(TheOracle.getValue(-1)).toBe("No");
      expect(TheOracle.getValue(-2)).toBe("No");
      expect(TheOracle.getValue(-3)).toBe("No");
      expect(TheOracle.getValue(-4)).toBe("NoAnd");
      expect(TheOracle.getValue(-5)).toBe("NoAnd");
    });
  });
});
