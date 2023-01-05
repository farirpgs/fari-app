import React, { useEffect, useState } from "react";

export function AnimatedResult(props: {
  result: string;
  animate: boolean;
  possibleResults?: Array<string>;
}) {
  const possibleResults = props.possibleResults || ["◢", "◣", "◤", "◥"];
  const [, setAnimating] = useState(false);
  const defaultResult = props.animate
    ? getRandomElement(possibleResults)
    : props.result;
  const [visibleResult, setVisibleResult] = useState(defaultResult);

  function getRandomElement(array: Array<string>) {
    return array[Math.floor(Math.random() * array.length)];
  }

  useEffect(() => {
    let timeout: any;
    let count = 0;

    function animate() {
      setAnimating(true);
      timeout = setTimeout(() => {
        if (count >= 15) {
          setAnimating(false);
          setVisibleResult(props.result);
          return;
        } else {
          count++;
          setVisibleResult(getRandomElement(possibleResults));
          animate();
        }
      }, 50);
    }

    if (props.animate) {
      animate();
    } else {
      setVisibleResult(props.result);
    }

    return () => clearTimeout(timeout);
  }, [props.result]);

  return <>{visibleResult}</>;
}
