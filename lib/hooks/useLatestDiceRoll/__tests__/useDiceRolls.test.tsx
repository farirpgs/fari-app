/* eslint-disable react/display-name */
import { act, renderHook } from "@testing-library/react-hooks";
import { Confetti } from "../../../domains/confetti/Confetti";
import { IDiceRollResult } from "../../../domains/dice/Dice";
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
      expect(view.result.current.state.color).toEqual("#fff");
    });
    it("should display first roll on load without animation", () => {
      // GIVEN
      const rolls: Array<IDiceRollResult> = [
        {
          options: { listResults: false },
          total: 4,
          totalWithoutModifiers: 4,
          rollGroups: [
            {
              commandSets: [
                {
                  id: "4dF",
                  commands: [
                    { value: 1, name: "1dF" },
                    { value: 1, name: "1dF" },
                    { value: 1, name: "1dF" },
                    { value: 1, name: "1dF" },
                  ],
                },
              ],
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
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.color).toEqual("rgb(36, 100, 40)");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.color).toEqual("rgb(36, 100, 40)");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: 0,
            totalWithoutModifiers: 0,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: 0, name: "1dF" },
                      { value: 0, name: "1dF" },
                      { value: 0, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.color).toEqual("#1976d2");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: -3,
            totalWithoutModifiers: -3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 0,
            totalWithoutModifiers: 0,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "1dF",
                    commands: [{ value: 0, name: "1dF" }],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.color).toEqual("rgb(168, 37, 37)");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: -4,
            totalWithoutModifiers: -4,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: -3,
            totalWithoutModifiers: -3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 0,
            totalWithoutModifiers: 0,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [{ value: 0, name: "1dF" }],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 3,
            totalWithoutModifiers: 3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 0, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.color).toEqual("rgb(168, 37, 37)");
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
            rollGroups: [
              {
                label: "Notice",
                modifier: 2,
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 0, name: "1dF" },
                      { value: 0, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.finalResultTotal).toEqual("+4");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: 8,
            totalWithoutModifiers: 4,
            rollGroups: [
              {
                label: "Shoot",
                modifier: 4,
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 2,
            rollGroups: [
              {
                label: "Notice",
                modifier: 2,
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 0, name: "1dF" },
                      { value: 0, name: "1dF" },
                    ],
                  },
                ],
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
      expect(view.result.current.state.finalResultTotal).toEqual("+8");

      // WHEN
      view.rerender({
        rolls: [
          ...rolls,
          {
            options: { listResults: false },
            total: -3,
            totalWithoutModifiers: -3,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: -1, name: "1dF" },
                      { value: 0, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 4,
            totalWithoutModifiers: 4,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            options: { listResults: false },
            total: 2,
            totalWithoutModifiers: 2,
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 0, name: "1dF" },
                      { value: 0, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
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
          rollGroups: [
            {
              commandSets: [
                {
                  id: "coin",
                  commands: [{ value: 1, name: "coin" }],
                },
              ],
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
          rollGroups: [
            {
              commandSets: [
                {
                  id: "coin",
                  commands: [{ value: -1, name: "coin" }],
                },
              ],
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
          rollGroups: [
            {
              commandSets: [
                {
                  id: "2d6",
                  commands: [
                    { value: 5, name: "1d6" },
                    { value: 3, name: "1d6" },
                  ],
                },
              ],
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
          rollGroups: [
            {
              label: "Academics",
              modifier: 2,
              commandSets: [
                {
                  id: "2d6",
                  commands: [
                    { value: 5, name: "1d6" },
                    { value: 3, name: "1d6" },
                  ],
                },
              ],
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
          rollGroups: [
            {
              commandSets: [
                {
                  id: "1d100",
                  commands: [{ value: 45, name: "1d100" }],
                },
              ],
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
