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

describe("useDiceRolls", () => {
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
    expect(view.result.current.state.label).toEqual("");
    expect(view.result.current.state.rollDetails).toEqual("");
    expect(view.result.current.state.rollBonus).toEqual("");
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
    expect(view.result.current.state.label).toEqual("+4");
    expect(view.result.current.state.rollDetails).toEqual("+ + + +");
    expect(view.result.current.state.total).toEqual("4");
    expect(view.result.current.state.rollBonus).toEqual("");
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
    expect(view.result.current.state.label).toEqual("+4");
    expect(view.result.current.state.rollDetails).toEqual(
      "[+] [+] [+] [+] (4)"
    );
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
    expect(view.result.current.state.label).toEqual("+3");
    expect(view.result.current.state.rollDetails).toEqual(
      "[+] [+] [+] [ ] (3)"
    );
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
    expect(view.result.current.state.label).toEqual("0");
    expect(view.result.current.state.rollDetails).toEqual(
      "[ ] [ ] [ ] [ ] (0)"
    );
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
    expect(view.result.current.state.label).toEqual("-3");
    expect(view.result.current.state.rollDetails).toEqual(
      "[-] [-] [-] [ ] (-3)"
    );
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
    expect(view.result.current.state.label).toEqual("-4");
    expect(view.result.current.state.rollDetails).toEqual(
      "[-] [-] [-] [-] (-4)"
    );
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
    expect(view.result.current.state.label).toEqual("+4");
    expect(view.result.current.state.rollDetails).toEqual("0 0 + +");
    expect(view.result.current.state.total).toEqual("2");
    expect(view.result.current.state.rollBonus).toEqual("Notice (+2)");

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
    expect(view.result.current.state.label).toEqual("+8");
    expect(view.result.current.state.rollDetails).toEqual(
      "[+] [+] [+] [+] (4)"
    );
    expect(view.result.current.state.rollBonus).toEqual("Shoot (+4)");

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
    expect(view.result.current.state.label).toEqual("-3");
    expect(view.result.current.state.rollDetails).toEqual(
      "[-] [-] [-] [ ] (-3)"
    );
    expect(view.result.current.state.rollBonus).toEqual("");
  });
});
