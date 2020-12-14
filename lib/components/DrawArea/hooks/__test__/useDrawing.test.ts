import { renderHook } from "@testing-library/react-hooks";
import { useDrawing } from "../useDrawing";

describe("useDrawing", () => {
  it("initial", () => {
    // GIVEN
    const { result } = renderHook(() => {
      return useDrawing({
        objects: [],
        onChange: () => {},
        readonly: false,
      });
    });
    // WHEN
    // THEN
    expect(result.current.state).toMatchObject({
      color: "#000000",
    });
  });
});
