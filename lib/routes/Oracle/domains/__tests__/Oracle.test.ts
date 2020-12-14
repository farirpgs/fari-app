import { Oracle } from "../Oracle";

describe("Oracle", () => {
  describe("Given I want a value based off a dice result", () => {
    it("should return the right value based off the right number", () => {
      expect(Oracle.getValue(5)).toBe("YesAnd");
      expect(Oracle.getValue(4)).toBe("YesAnd");
      expect(Oracle.getValue(3)).toBe("Yes");
      expect(Oracle.getValue(2)).toBe("Yes");
      expect(Oracle.getValue(1)).toBe("Yes");
      expect(Oracle.getValue(0)).toBe("YesBut");
      expect(Oracle.getValue(-1)).toBe("No");
      expect(Oracle.getValue(-2)).toBe("No");
      expect(Oracle.getValue(-3)).toBe("No");
      expect(Oracle.getValue(-4)).toBe("NoAnd");
      expect(Oracle.getValue(-5)).toBe("NoAnd");
    });
  });
});
