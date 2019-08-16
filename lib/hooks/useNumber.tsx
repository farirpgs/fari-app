import { useState } from "react";
export function useNumber(max: number) {
  const [value, setValue] = useState<number>(undefined);
  const [isRolling, setIsRolling] = useState(false);
  const rollAnimationCount = 30;
  function roll(count = 0) {
    if (isRolling && count === 0) {
      return;
    }
    setIsRolling(true);
    const number = getRandomNumber();
    setValue(number);
    if (count !== rollAnimationCount) {
      setTimeout(() => {
        roll(count + 1);
      }, 50);
    } else {
      setIsRolling(false);
    }
  }
  function getRandomNumber() {
    return Math.ceil((Math.random() * 100) % max);
  }
  return {
    value,
    isRolling,
    roll
  };
}
