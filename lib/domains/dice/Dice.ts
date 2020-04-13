export const Dice = {
  runFudgeDice() {
    const fudgeDice = [-1, -1, 0, 0, 1, 1];
    const result = rollDice(fudgeDice, 4);
    return result;
  },
};

function rollDice(dice: Array<number>, times: number) {
  let total = 0;
  for (let i = 0; i < times; i++) {
    const side = getRandomDiceSide(dice.length);
    const roll = dice[side];
    total += roll;
  }

  return total;
}

function getRandomDiceSide(numberOfSides: number) {
  const randomNumber = Math.round(Math.random() * 100);
  const side = randomNumber % numberOfSides;
  return side;
}
