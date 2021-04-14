/* eslint-disable react/display-name */
import { act, renderHook } from "@testing-library/react-hooks";
import { Confetti } from "../../../domains/confetti/Confetti";
import { IDiceRollResult, RollType } from "../../../domains/dice/Dice";
import { useLatestDiceRoll } from "../useLatestDiceRoll";
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
      const rolls: Array<IDiceRollResult> = [];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: 4,
          totalWithoutModifiers: 4,
          commandResult: [
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
            {
              value: 1,
              commandGroupId: "1dF",
              commandName: "1dF",
              type: RollType.DiceCommand,
            },
          ],
        },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
      const rolls: Array<IDiceRollResult> = [];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
        },
        {
          initialProps: { rolls },
        }
      );
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
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
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
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
            options: { listResults: false },
            total: 0,
            totalWithoutModifiers: 0,
            commandResult: [
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
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
            options: { listResults: false },
            total: -3,
            totalWithoutModifiers: -3,
            commandResult: [
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 0,
            totalWithoutModifiers: 0,
            commandResult: [
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
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
            options: { listResults: false },
            total: -4,
            totalWithoutModifiers: -4,
            commandResult: [
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: -3,
            totalWithoutModifiers: -3,
            commandResult: [
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 0,
            totalWithoutModifiers: 0,
            commandResult: [
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
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
      jest.useFakeTimers();
      // GIVEN
      const rolls: Array<IDiceRollResult> = [];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 2,
            commandResult: [
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              { value: 2, label: "Notice", type: RollType.Modifier },
            ],
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
            options: { listResults: false },
            total: 8,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              { value: 4, label: "Shoot", type: RollType.Modifier },
            ],
          },
          {
            options: { listResults: false },
            total: 2,
            totalWithoutModifiers: 2,
            commandResult: [
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              { value: 2, label: "Notice", type: RollType.Modifier },
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
      expect(view.result.current.state.finalResultTotal).toEqual("+8");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: -3,
            totalWithoutModifiers: -3,
            commandResult: [
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: -1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            commandResult: [
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
          },
          {
            options: { listResults: false },
            total: 2,
            totalWithoutModifiers: 2,
            commandResult: [
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 0,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
              {
                value: 1,
                commandGroupId: "1dF",
                commandName: "1dF",
                type: RollType.DiceCommand,
              },
            ],
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
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: 1,
          totalWithoutModifiers: 1,
          commandResult: [
            {
              value: 1,
              commandGroupId: "coin",
              commandName: "coin",
              type: RollType.DiceCommand,
            },
          ],
        },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: -1,
          totalWithoutModifiers: -1,
          commandResult: [
            {
              value: -1,
              commandGroupId: "coin",
              commandName: "coin",
              type: RollType.DiceCommand,
            },
          ],
        },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: 8,
          totalWithoutModifiers: 8,
          commandResult: [
            {
              value: 5,
              commandGroupId: "1d6",
              commandName: "1d6",
              type: RollType.DiceCommand,
            },
            {
              value: 3,
              commandGroupId: "1d6",
              commandName: "1d6",
              type: RollType.DiceCommand,
            },
          ],
        },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: 10,
          totalWithoutModifiers: 8,
          commandResult: [
            {
              value: 5,
              commandGroupId: "1d6",
              commandName: "1d6",
              type: RollType.DiceCommand,
            },
            {
              value: 3,
              commandGroupId: "1d6",
              commandName: "1d6",
              type: RollType.DiceCommand,
            },
            { value: 2, label: "Academics", type: RollType.Modifier },
          ],
        },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: 45,
          totalWithoutModifiers: 45,
          commandResult: [
            {
              value: 45,
              commandGroupId: "1d100",
              commandName: "1d100",
              type: RollType.DiceCommand,
            },
          ],
        },
      ];

      // WHEN
      const view = renderHook(
        (props) => {
          return useLatestDiceRoll(props.rolls);
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
