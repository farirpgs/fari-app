import { useEffect, useRef, useState } from "react";

const DEFAULT_DELAY = 1000;

export function useLazyState<T>(props: {
  value: T;
  onChange(newValue: T): void;
  delay?: number;
}) {
  const delay = props.delay ?? DEFAULT_DELAY;

  const [internalValue, setInternalValue] = useState(props.value);
  const timeout = useRef<any | undefined>(undefined);
  const latestOnChange = useRef(props.onChange);

  useEffect(
    function keepLatestOnChange() {
      latestOnChange.current = props.onChange;
    },
    [props.onChange]
  );

  useEffect(
    function syncStateFromProps() {
      setState(props.value);
    },
    [props.value]
  );

  function setState(newValue: T) {
    setInternalValue(newValue);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      latestOnChange.current(newValue);
    }, delay);
  }

  return [internalValue, setState] as const;
}
