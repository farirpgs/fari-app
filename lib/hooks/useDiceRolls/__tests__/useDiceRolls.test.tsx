/* eslint-disable react/display-name */
import { act, renderHook } from "@testing-library/react-hooks";
import { Confetti } from "../../../domains/confetti/Confetti";
import { IDiceRollWithBonus } from "../../../domains/dice/Dice";
import { useDiceRolls } from "../useDiceRolls";
jest.mock("../../../domains/confetti/Confetti");

beforeEach(() => {
  // @ts-expect-error
  Confetti.fireConfetti.mockClear();
  // @ts-expect-error
  Confetti.fireCannon.mockClear();
});
//

describe("useDiceRolls", () => {
  describe("Generic 4Df", () => {
    it("should display nothing on load", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(true);
      expect(view.result.current.state.display.formatted).toEqual("0");
      expect(view.result.current.state.display.spreaded).toEqual(undefined);
      expect(view.result.current.state.display.explanation).toEqual(undefined);
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(false);
      expect(view.result.current.state.color).toEqual("inherit");
    });
    it("should display first roll on load without animation", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 4, rolls: [1, 1, 1, 1], type: "4dF" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);

      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("+4");
      expect(view.result.current.state.display.spreaded).toEqual("+ + + +");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
    it("should change colors depending on rolls", async () => {
      // GIVEN
      jest.useFakeTimers();
      const rolls: Array<IDiceRollWithBonus> = [];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );
      view.rerender({
        rolls: [...rolls, { total: 4, rolls: [1, 1, 1, 1], type: "4dF" }],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("+4");
      expect(view.result.current.state.display.spreaded).toEqual("+ + + +");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#4caf50");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          { total: 3, rolls: [1, 1, 1, 0], type: "4dF" },
          { total: 4, rolls: [1, 1, 1, 1], type: "4dF" },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("+3");
      expect(view.result.current.state.display.spreaded).toEqual("+ + + 0");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#4caf50");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          { total: 0, rolls: [0, 0, 0, 0], type: "4dF" },
          { total: 3, rolls: [1, 1, 1, 0], type: "4dF" },
          { total: 4, rolls: [1, 1, 1, 1], type: "4dF" },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("0");
      expect(view.result.current.state.display.spreaded).toEqual("0 0 0 0");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("inherit");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          { total: -3, rolls: [-1, -1, -1, 0], type: "4dF" },
          { total: 0, rolls: [0], type: "4dF" },
          { total: 3, rolls: [1, 1, 1, 0], type: "4dF" },
          { total: 4, rolls: [1, 1, 1, 1], type: "4dF" },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireCannon).toHaveBeenCalledTimes(0);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("-3");
      expect(view.result.current.state.display.spreaded).toEqual("- - - 0");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#f44336");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          { total: -4, rolls: [-1, -1, -1, -1], type: "4dF" },
          { total: -3, rolls: [-1, -1, -1, 0], type: "4dF" },
          { total: 0, rolls: [0], type: "4dF" },
          { total: 3, rolls: [1, 1, 1, 0], type: "4dF" },
          { total: 4, rolls: [1, 1, 1, 1], type: "4dF" },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireCannon).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("-4");
      expect(view.result.current.state.display.spreaded).toEqual("- - - -");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#f44336");
    });
    it("should handle labels on load and after and going back to without labels", async () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: 2,
            rolls: [0, 0, 1, 1],
            bonus: 2,
            bonusLabel: "Notice",
            type: "4dF",
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("+4");
      expect(view.result.current.state.display.spreaded).toEqual("0 0 + +");
      expect(view.result.current.state.display.explanation).toEqual(
        "4dF + 2 (Notice)"
      );
      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: 4,
            rolls: [1, 1, 1, 1],
            bonus: 4,
            bonusLabel: "Shoot",
            type: "4dF",
          },
          {
            total: 2,
            rolls: [0, 0, 1, 1],
            bonus: 2,
            bonusLabel: "Notice",
            type: "4dF",
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("+8");
      expect(view.result.current.state.display.spreaded).toEqual("+ + + +");
      expect(view.result.current.state.display.explanation).toEqual(
        "4dF + 4 (Shoot)"
      );

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          { total: -3, rolls: [-1, -1, -1, 0], type: "4dF" },
          {
            total: 4,
            rolls: [1, 1, 1, 1],
            bonus: 4,
            bonusLabel: "Shoot",
            type: "4dF",
          },
          {
            total: 2,
            rolls: [0, 0, 1, 1],
            bonus: 2,
            bonusLabel: "Notice",
            type: "4dF",
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("-3");
      expect(view.result.current.state.display.spreaded).toEqual("- - - 0");
      expect(view.result.current.state.display.explanation).toEqual("4dF");
    });
  });
  describe("Coin toss", () => {
    it("should properly format heads", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 1, rolls: [1], type: "Coin" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("1");
      expect(view.result.current.state.display.spreaded).toEqual("Heads");
      expect(view.result.current.state.display.explanation).toEqual("Coin");
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
    it("should properly format tails", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: -1, rolls: [-1], type: "Coin" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("-1");
      expect(view.result.current.state.display.spreaded).toEqual("Tails");
      expect(view.result.current.state.display.explanation).toEqual("Coin");
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });
  describe("2d6", () => {
    it("should properly format result", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 8, rolls: [5, 3], type: "2d6" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("8");
      expect(view.result.current.state.display.spreaded).toEqual("5 + 3");
      expect(view.result.current.state.display.explanation).toEqual("2d6");
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
    it("should properly format result with bonus", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 8, rolls: [5, 3], type: "2d6", bonus: 2, bonusLabel: "Weird" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("10");
      expect(view.result.current.state.display.spreaded).toEqual("5 + 3");
      expect(view.result.current.state.display.explanation).toEqual(
        "2d6 + 2 (Weird)"
      );
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });
  describe("1dF", () => {
    it("should properly format result", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 1, rolls: [1], type: "1dF" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("+1");
      expect(view.result.current.state.display.spreaded).toEqual("+");
      expect(view.result.current.state.display.explanation).toEqual("1dF");
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });
  describe("1d100", () => {
    it("should properly format result", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 45, rolls: [45], type: "1d100" },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useDiceRolls(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.display.formatted).toEqual("45");
      expect(view.result.current.state.display.spreaded).toEqual("45");
      expect(view.result.current.state.display.explanation).toEqual("1d100");
      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });
});
