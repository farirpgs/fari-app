import { DataTransferObject } from "../DataTransferObject";

describe("DataTransferObject", () => {
  describe("Given I want to encode an object", () => {
    it("should be possible to decode it", () => {
      const data = DataTransferObject.encode({
        playerName: "Magnus Burnsides",
        rolls: [],
        fatePoints: 3,
        refresh: 3,
        characterSheet: {
          name: "Magnus CharacterSheet",
        },
      });

      const result = DataTransferObject.decode(data);

      expect(result).toEqual({
        characterSheet: { name: "Magnus CharacterSheet" },
        fatePoints: 3,
        playerName: "Magnus Burnsides",
        refresh: 3,
        rolls: [],
      });
    });
  });
  describe("Given I want to encode an object with emojis in it", () => {
    it("should be possible to decode it", () => {
      const data = DataTransferObject.encode({
        playerName: "🐺🐺🐺🐺",
        rolls: [],
        fatePoints: 3,
        refresh: 3,
        characterSheet: {
          name: "Magnus CharacterSheet",
        },
      });

      const result = DataTransferObject.decode(data);

      expect(result).toEqual({
        characterSheet: { name: "Magnus CharacterSheet" },
        fatePoints: 3,
        playerName: "🐺🐺🐺🐺",
        refresh: 3,
        rolls: [],
      });
    });
  });
});
