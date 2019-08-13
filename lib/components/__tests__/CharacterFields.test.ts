import { FateAccelerated } from "../../games/Fate";
import { selectors } from "../CharacterFields";

describe("selectors.rowsToTabs", () => {
  it("should create the Default tab", () => {
    const result = selectors.rowsToTabs([]);

    expect(result["Default"].length).toEqual(0);
  });
  it("should split the content between multiple tab", () => {
    const result = selectors.rowsToTabs(FateAccelerated.rows);

    expect(result["Default"].length).toEqual(5);
    expect(result["Guide"].length).toEqual(1);
  });
});
