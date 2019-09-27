import { useState } from "react";

export function useFudge() {
  const [value, setValue] = useState("");
  const rollAnimationCount = 30;
  const [isRolling, setIsRolling] = useState(false);

  function roll(count = 0) {
    if (isRolling && count === 0) {
      return;
    }
    setIsRolling(true);
    const number = Math.floor((Math.random() * 100) % 3);
    setValue(FudgeTypes[number]);
    if (count !== rollAnimationCount) {
      setTimeout(() => {
        roll(count + 1);
      }, 50);
    } else {
      setIsRolling(false);
    }
  }

  return {
    value,
    isRolling,
    roll
  };
}

const FudgeTypes = {
  0: "",
  1: "+",
  2: "-"
};
