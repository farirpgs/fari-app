import { useState } from "react";
export function useNumber(max: number) {
  const [value, setValue] = useState("");
  const rollAnimationCount = 50;
  function roll(count = 0) {
    const number = getRandomNumber();
    setValue(number.toString());
    if (count !== rollAnimationCount) {
      setTimeout(() => {
        roll(count + 1);
      }, 25);
    }
  }
  function getRandomNumber() {
    return Math.ceil((Math.random() * 100) % max);
  }
  return {
    value,
    roll
  };
}
