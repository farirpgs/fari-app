import { act, renderHook } from "@testing-library/react-hooks";
import { useLazyState } from "../useLazyState";

describe("useLazyState", () => {
  it.each([500, 5000])(
    "delay set states to prevent performance issues with a delay of %s",
    (delay) => {
      // GIVEN a string value
      jest.useFakeTimers();
      const onChange = jest.fn();
      const initialValue = "initial";
      const { result, rerender } = renderHook(
        (props) => {
          return useLazyState({
            value: props.value,
            onChange: props.onChange,
            delay: delay,
          });
        },
        { initialProps: { value: initialValue, onChange: onChange } }
      );

      // THEN the state should be initialized
      expect(result.current[0]).toEqual("initial");
      expect(onChange).toHaveBeenCalledTimes(0);

      // WHEN I update the state
      act(() => {
        result.current[1]("new");
      });

      // THEN the internal state is OK but onChange hasnt been called
      expect(result.current[0]).toEqual("new");
      expect(onChange).toHaveBeenCalledTimes(0);

      // WHEN time passes by
      jest.runAllTimers();

      // THEN internal state s OK and onChange has been called
      expect(result.current[0]).toEqual("new");
      expect(onChange).toHaveBeenCalledWith("new");
      expect(onChange).toHaveBeenCalledTimes(1);

      // WHEN props change
      rerender({
        value: "new-from-props",
        onChange: onChange,
      });

      // THEN internal state is updated and onChange hasnt been called
      expect(result.current[0]).toEqual("new-from-props");
      expect(onChange).toHaveBeenCalledWith("new");
      expect(onChange).toHaveBeenCalledTimes(1);
    }
  );
});
