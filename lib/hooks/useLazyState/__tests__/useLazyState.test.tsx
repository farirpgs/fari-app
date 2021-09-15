import { act, renderHook } from "@testing-library/react-hooks";
import produce from "immer";
import { useLazyState } from "../useLazyState";

describe("useLazyState", () => {
  describe("given there is a delay", () => {
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
  describe("Given the state update is based on the previous state", () => {
    describe("with a normal update", () => {
      it("should not work", () => {
        // GIVEN
        jest.useFakeTimers();

        const onChange = jest.fn();
        const initialValue = 0;
        const { result } = renderHook(
          (props) => {
            return useLazyState({
              value: props.value,
              onChange: props.onChange,
              delay: 250,
            });
          },
          { initialProps: { value: initialValue, onChange: onChange } }
        );

        // THEN the state should be initialized
        expect(result.current[0]).toEqual(0);

        // WHEN I update the state
        act(() => {
          result.current[1](result.current[0] + 1);
          result.current[1](result.current[0] + 1);
          result.current[1](result.current[0] + 1);
        });

        jest.runAllTimers();
        // THEN the state should be initialized
        expect(result.current[0]).toEqual(1);
        expect(onChange).toHaveBeenCalledWith(1);
      });
    });
    describe("with a draft update", () => {
      it("should work", () => {
        // GIVEN
        jest.useFakeTimers();

        const onChange = jest.fn();
        const initialValue = 0;
        const { result } = renderHook(
          (props) => {
            return useLazyState<number>({
              value: props.value,
              onChange: props.onChange,
              delay: 250,
            });
          },
          { initialProps: { value: initialValue, onChange: onChange } }
        );

        // THEN the state should be initialized
        expect(result.current[0]).toEqual(0);

        // WHEN I update the state
        act(() => {
          result.current[1]((draft) => draft + 1);
          result.current[1]((draft) => draft + 1);
          result.current[1]((draft) => draft + 1);
        });

        jest.runAllTimers();
        // THEN the state should be initialized
        expect(result.current[0]).toEqual(3);
        expect(onChange).toHaveBeenCalledWith(3);
      });
    });
    describe("with a draft update on an object", () => {
      it("should work", () => {
        // GIVEN
        jest.useFakeTimers();

        const onChange = jest.fn();
        const initialValue = { counter: 0 };
        const { result } = renderHook(
          (props) => {
            return useLazyState<{ counter: number }>({
              value: props.value,
              onChange: props.onChange,
              delay: 250,
            });
          },
          { initialProps: { value: initialValue, onChange: onChange } }
        );

        // THEN the state should be initialized
        expect(result.current[0]).toEqual({ counter: 0 });

        // WHEN I update the state
        act(() => {
          result.current[1]((draft) => ({
            ...draft,
            counter: draft.counter + 1,
          }));
          result.current[1]((draft) => ({
            ...draft,
            counter: draft.counter + 1,
          }));
          result.current[1]((draft) => ({
            ...draft,
            counter: draft.counter + 1,
          }));
        });

        jest.runAllTimers();

        // THEN the state should be update
        expect(result.current[0]).toEqual({ counter: 3 });
        expect(onChange).toHaveBeenCalledWith({ counter: 3 });
      });
    });
    describe("with a draft update on an object with immer", () => {
      it("should work", () => {
        // GIVEN
        jest.useFakeTimers();

        const onChange = jest.fn();
        const initialValue = { counter: 0 };
        const { result } = renderHook(
          (props) => {
            return useLazyState<{ counter: number }>({
              value: props.value,
              onChange: props.onChange,
              delay: 250,
            });
          },
          { initialProps: { value: initialValue, onChange: onChange } }
        );

        // THEN the state should be initialized
        expect(result.current[0]).toEqual({ counter: 0 });

        // WHEN I update the state
        act(() => {
          result.current[1](
            produce((draft: { counter: number }) => {
              draft.counter += 1;
            })
          );
          result.current[1](
            produce((draft: { counter: number }) => {
              draft.counter += 1;
            })
          );
          result.current[1](
            produce((draft: { counter: number }) => {
              draft.counter += 1;
            })
          );
        });

        jest.runAllTimers();

        // THEN the state should be update
        expect(result.current[0]).toEqual({ counter: 3 });
        expect(onChange).toHaveBeenCalledWith({ counter: 3 });
      });
    });
  });
});
