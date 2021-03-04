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
      expect(view.result.current.state.finalResultTotal).toEqual("0");

      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(false);
      expect(view.result.current.state.color).toEqual("inherit");
    });
    it("should display first roll on load without animation", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        {
          total: 4,
          commandResults: [
            { value: 1, type: "1dF" },
            { value: 1, type: "1dF" },
            { value: 1, type: "1dF" },
            { value: 1, type: "1dF" },
          ],
        },
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
      expect(view.result.current.state.finalResultTotal).toEqual("+4");

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
        rolls: [
          ...rolls,
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("+4");

      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#4caf50");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: 3,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("+3");

      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#4caf50");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: 0,
            commandResults: [
              { value: 0, type: "1dF" },
              { value: 0, type: "1dF" },
              { value: 0, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          {
            total: 3,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("0");

      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("inherit");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: -3,
            commandResults: [
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          { total: 0, commandResults: [{ value: 0, type: "1dF" }] },
          {
            total: 3,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireCannon).toHaveBeenCalledTimes(0);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("-3");

      expect(view.result.current.state.hasRolledOnce).toEqual(true);
      expect(view.result.current.state.color).toEqual("#f44336");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: -4,
            commandResults: [
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
            ],
          },
          {
            total: -3,
            commandResults: [
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          { total: 0, commandResults: [{ value: 0, type: "1dF" }] },
          {
            total: 3,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireCannon).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("-4");

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
            commandResults: [
              { value: 0, type: "1dF" },
              { value: 0, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
            bonus: 2,
            bonusLabel: "Notice",
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("+4");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
            bonus: 4,
            bonusLabel: "Shoot",
          },
          {
            total: 2,
            commandResults: [
              { value: 0, type: "1dF" },
              { value: 0, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
            bonus: 2,
            bonusLabel: "Notice",
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(Confetti.fireConfetti).toHaveBeenCalledTimes(1);
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("+8");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            total: -3,
            commandResults: [
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: -1, type: "1dF" },
              { value: 0, type: "1dF" },
            ],
          },
          {
            total: 4,
            commandResults: [
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
            bonus: 4,
            bonusLabel: "Shoot",
          },
          {
            total: 2,
            commandResults: [
              { value: 0, type: "1dF" },
              { value: 0, type: "1dF" },
              { value: 1, type: "1dF" },
              { value: 1, type: "1dF" },
            ],
            bonus: 2,
            bonusLabel: "Notice",
          },
        ],
      });
      act(() => {
        jest.runAllTimers();
      });

      // THEN
      expect(view.result.current.state.finalResultHidden).toEqual(false);
      expect(view.result.current.state.finalResultTotal).toEqual("-3");
    });
  });
  describe("Coin toss", () => {
    it("should properly format heads", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        {
          total: 1,
          commandResults: [{ value: 1, type: "Coin" }],
        },
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
      expect(view.result.current.state.finalResultTotal).toEqual("1");

      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
    it("should properly format tails", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: -1, commandResults: [{ value: -1, type: "Coin" }] },
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
      expect(view.result.current.state.finalResultTotal).toEqual("-1");

      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });
  describe("2d6", () => {
    it("should properly format result", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        {
          total: 8,
          commandResults: [
            { value: 5, type: "1d6" },
            { value: 3, type: "1d6" },
          ],
        },
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
      expect(view.result.current.state.finalResultTotal).toEqual("8");

      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
    it("should properly format result with bonus", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        {
          total: 8,
          commandResults: [
            { value: 5, type: "1d6" },
            { value: 3, type: "1d6" },
          ],
          bonus: 2,
          bonusLabel: "Weird",
        },
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
      expect(view.result.current.state.finalResultTotal).toEqual("10");

      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });

  describe("1d100", () => {
    it("should properly format result", () => {
      // GIVEN
      const rolls: Array<IDiceRollWithBonus> = [
        { total: 45, commandResults: [{ value: 45, type: "1d100" }] },
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
      expect(view.result.current.state.finalResultTotal).toEqual("45");

      expect(view.result.current.state.rolling).toEqual(false);
      expect(view.result.current.state.hasRolledOnce).toEqual(true);
    });
  });
});
