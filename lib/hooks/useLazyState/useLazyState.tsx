import { useEffect, useRef, useState } from "react";

type IStateSetter<T> = (prevState: T) => T;
type ILazyStateProps<T> = {
  value: T;
  onChange?(newValue: T): void;
  delay: number;
};

export function LazyState<T>(
  props: ILazyStateProps<T> & {
    render(
      renderProps: [state: T, setState: (newValue: T | IStateSetter<T>) => void]
    ): JSX.Element;
  }
) {
  const [state, setState] = useLazyState({
    delay: props.delay,
    value: props.value,
    onChange: props.onChange,
  });

  return props.render([state, setState]);
}

export function useLazyState<T>(props: ILazyStateProps<T>) {
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

  function setState(newValue: T | IStateSetter<T>) {
    willUpdateSoon.current = true;

    let valueForOnChange: T;

    // set state
    const isNewValueASetter = typeof newValue === "function";
    if (isNewValueASetter) {
      const newValueSetter = newValue as IStateSetter<T>;
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
      latestOnChange.current?.(valueForOnChange);
      willUpdateSoon.current = false;
    }, delay);
  }

  return [internalValue, setState] as const;
}
