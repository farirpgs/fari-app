import { Dice } from "../Dice";

describe("Dice", () => {
  describe("roll4DF", () => {
    for (let i = 0; i < 10; i++) {
      it("should be fair", () => {
        fudgeDiceShouldBeFair();
      });
    }
  });
});

function fudgeDiceShouldBeFair() {
  const results: Record<number, number> = {};
  const numberOfTests = 10000;

  for (let i = 0; i < numberOfTests; i++) {
    const diceRoll = Dice.rollGroups(
      [
        {
          commandSets: [
            {
              id: "1dF",
            },
            {
              id: "1dF",
            },
            {
              id: "1dF",
            },
            {
              id: "1dF",
            },
          ],
        },
      ],
      {
        listResults: false,
      }
    );
    const currentCount = results[diceRoll.total] ?? 0;
    results[diceRoll.total] = currentCount + 1;
  }

  const fourProbability = (1 / 81) * 100;
  const threeProbability = (4 / 81) * 100;
  const twoProbability = (10 / 81) * 100;
  const oneProbability = (16 / 81) * 100;
  const zeroProbability = (19 / 81) * 100;

  assert(results, -4, numberOfTests, fourProbability - 1, fourProbability + 1);
  assert(results, 4, numberOfTests, fourProbability - 1, fourProbability + 1);
  assert(
    results,
    -3,
    numberOfTests,
    threeProbability - 1,
    threeProbability + 1
  );
  assert(results, 3, numberOfTests, threeProbability - 1, threeProbability + 1);
  assert(results, -2, numberOfTests, twoProbability - 2, twoProbability + 2);
  assert(results, 2, numberOfTests, twoProbability - 2, twoProbability + 2);
  assert(results, -1, numberOfTests, oneProbability - 2, oneProbability + 2);
  assert(results, 1, numberOfTests, oneProbability - 2, oneProbability + 2);
  assert(results, 0, numberOfTests, zeroProbability - 2, zeroProbability + 2);
}

function assert(
  results: Record<number, number>,
  number: number,
  numberOfTests: number,
  min: number,
  max: number
) {
  expect((results[number] / numberOfTests) * 100).toBeGreaterThanOrEqual(min);
  expect((results[number] / numberOfTests) * 100).toBeLessThanOrEqual(max);
}

describe("simplifyResults", () => {
  describe("Given 4Df", () => {
    it("should simplify them", () => {
      const result = Dice.simplifyRolls([
        {
          label: "Fight",
          commandSets: [
            {
              id: "4dF",
              commands: [
                { name: "1dF", value: 1 },
                { name: "1dF", value: 1 },
                { name: "1dF", value: 1 },
                { name: "1dF", value: 1 },
              ],
            },
          ],
        },
      ]);

      expect(result).toEqual([{ label: "Fight", simplifiedRolls: ["4dF"] }]);
    });
  });
  describe("Given multiple commands of the same type", () => {
    it("should simplify them", () => {
      const result = Dice.simplifyRolls([
        {
          commandSets: [
            {
              id: "1d10",
              commands: [{ name: "1d10", value: 5 }],
            },
            {
              id: "1d4",
              commands: [{ name: "1d4", value: 2 }],
            },
            {
              id: "1d10",
              commands: [{ name: "1d10", value: 10 }],
            },
          ],
        },
      ]);

      expect(result).toEqual([
        { label: undefined, simplifiedRolls: ["2d10", "1d4"] },
      ]);
    });
  });
  describe("Given multiple commands of the same type with groups label", () => {
    it("should simplify them", () => {
      const result = Dice.simplifyRolls([
        {
          label: "Lore",
          commandSets: [
            {
              id: "1d10",
              commands: [{ name: "1d10", value: 5 }],
            },
            {
              id: "1d4",
              commands: [{ name: "1d4", value: 2 }],
            },
            {
              id: "1d10",
              commands: [{ name: "1d10", value: 10 }],
            },
          ],
        },
        {
          label: "Will",
          commandSets: [
            {
              id: "1d6",
              commands: [{ name: "1d6", value: 5 }],
            },
            {
              id: "1d6",
              commands: [{ name: "1d6", value: 5 }],
            },
            {
              id: "1d6",
              commands: [{ name: "1d6", value: 5 }],
            },
          ],
        },
      ]);

      expect(result).toEqual([
        { label: "Lore", simplifiedRolls: ["2d10", "1d4"] },
        { label: "Will", simplifiedRolls: ["3d6"] },
      ]);
    });
  });
  describe("Given coins", () => {
    it("should ignore them", () => {
      const result = Dice.simplifyRolls([
        {
          commandSets: [
            {
              id: "coin",
              commands: [{ name: "coin", value: 1 }],
            },
            {
              id: "coin",
              commands: [{ name: "coin", value: -1 }],
            },
          ],
        },
      ]);

      expect(result).toEqual([{ label: undefined, simplifiedRolls: ["Coin"] }]);
    });
  });
});
