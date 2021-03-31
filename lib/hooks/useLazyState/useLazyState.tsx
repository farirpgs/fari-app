import { useEffect, useRef, useState } from "react";

export function useLazyState<T>(props: {
  value: T;
  onChange(newValue: T): void;
  delay: number;
}) {
  const delay = props.delay;

  const [internalValue, setInternalValue] = useState(props.value);
  const timeout = useRef<any | undefined>(undefined);
  const willUpdateSoon = useRef<boolean>(false);
  const latestOnChange = useRef(props.onChange);

  useEffect(
    function keepLatestOnChange() {
      latestOnChange.current = props.onChange;
    },
    [props.onChange]
  );

  useEffect(
    function syncStateFromProps() {
      if (!willUpdateSoon.current) {
        setInternalValue(props.value);
      }
    },
    [props.value]
  );

  type IStateSetter = (prevState: T) => T;

  function setState(newValue: T | IStateSetter) {
    willUpdateSoon.current = true;

    let valueForOnChange: T;

    // set state
    const isNewValueASetter = typeof newValue === "function";
    if (isNewValueASetter) {
      const newValueSetter = newValue as IStateSetter;
      setInternalValue((prevState) => {
        const resultFromSetter = newValueSetter(prevState);
        valueForOnChange = resultFromSetter;
        return resultFromSetter;
      });
    } else {
      setInternalValue(newValue);
      valueForOnChange = newValue as T;
    }

    // update parent
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      latestOnChange.current(valueForOnChange);
      willUpdateSoon.current = false;
    }, delay);
  }

  return [internalValue, setState] as const;
}
