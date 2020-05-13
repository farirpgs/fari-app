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
    const diceRoll = Dice.roll4DF();
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
