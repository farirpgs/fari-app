import { IScene } from "../../../root/AppRouter";
import { defaultArcName } from "../defaultArcName";
import * as selectors from "../sceneSelectors";
describe("sceneSelectors", () => {
  describe("groupScenesByArc", () => {
    it("should map stories without arc inside the default group", () => {
      // PREPARE
      const scenes: Array<IScene> = [
        { name: "first" },
        { name: "second" },
        { name: "third" }
      ];
      // EXECUTE
      const result = selectors.groupScenesByArc(scenes);

      // VALIDATE
      expect(result[defaultArcName].length).toEqual(3);
    });
    it("should map stories with arc inside their own group", () => {
      // PREPARE
      const scenes: Array<IScene> = [
        { name: "first" },
        { name: "second" },
        { name: "third" },
        { name: "Avatar / Book One: Water" },
        { name: "Avatar / Book Two: Earth" },
        { name: "Avatar / Book Three: Fire" }
      ];
      // EXECUTE
      const result = selectors.groupScenesByArc(scenes);

      // VALIDATE
      expect(result[defaultArcName].length).toEqual(3);
      expect(result["Avatar"].length).toEqual(3);
    });
    it("should sort stories from the default group alphabetically", () => {
      // PREPARE
      const scenes: Array<IScene> = [
        { name: "C) Infinity War" },
        { name: "B) Age Of Ultron" },
        { name: "A) The Avengers" },
        { name: "D) End Game" }
      ];
      // EXECUTE
      const result = selectors.groupScenesByArc(scenes);

      // VALIDATE
      expect(result[defaultArcName]).toEqual([
        { name: "A) The Avengers" },
        { name: "B) Age Of Ultron" },
        { name: "C) Infinity War" },
        { name: "D) End Game" }
      ]);
    });
    it("should sort stories from the arcs alphabetically", () => {
      // PREPARE
      const scenes: Array<IScene> = [
        { name: "Avatar / 3. Book Three: Fire" },
        { name: "Avatar / 1. Book One: Water" },
        { name: "Avatar / 2. Book Two: Earth" }
      ];
      // EXECUTE
      const result = selectors.groupScenesByArc(scenes);

      // VALIDATE
      expect(result["Avatar"]).toEqual([
        { name: "1. Book One: Water" },
        { name: "2. Book Two: Earth" },
        { name: "3. Book Three: Fire" }
      ]);
    });
  });
});
