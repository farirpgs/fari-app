import { IDiceRollResult, RollType } from "../../Dice";
import { NarrativeDice } from "../NarrativeDice";

describe("NarrativeDice", () => {
  describe("Given I have 5 successes and 3 failure", () => {
    it("should return me a result with only 2 successes", () => {
      const value: IDiceRollResult = {
        commandResult: [
          {
            commandGroupId: "narrative-green",
            commandName: "narrative-green",
            label: undefined,
            type: RollType.DiceCommand,
            value: {} as any,
          },
        ],
        options: { listResults: true },
        total: 0,
        totalWithoutModifiers: 0,
      };
      const result = NarrativeDice.filter(value);
      expect(result).toEqual(result);
    });
  });
});
