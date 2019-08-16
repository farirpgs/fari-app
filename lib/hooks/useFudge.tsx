import { useRef, useState } from "react";

export function useFudge() {
  const [value, setValue] = useState("");
  const rollAnimationCount = 30;
  const isRolling = useRef(false);
  function roll(count = 0) {
    if (isRolling.current && count === 0) {
      return;
    }
    isRolling.current = true;
    const number = Math.floor((Math.random() * 100) % 3);
    setValue(FudgeTypes[number]);
    if (count !== rollAnimationCount) {
      setTimeout(() => {
        roll(count + 1);
      }, 50);
    } else {
      isRolling.current = false;
    }
  }
  function reset() {
    setValue("");
  }
  return {
    value,
    reset,
    roll
  };
}

const FudgeTypes = {
  0: "",
  1: "+",
  2: "-"
};
