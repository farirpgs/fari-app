import { DataTransferObject } from "../DataTransferObject";

describe("DataTransferObject", () => {
  describe("Given I want to encode an object", () => {
    it("should be possible to decode it", () => {
      const data = DataTransferObject.encode({
        playerName: "Magnus Burnsides",
        rolls: [],
        characterSheet: {
          name: "Magnus CharacterSheet",
        },
      });

      const result = DataTransferObject.decode(data);

      expect(result).toEqual({
        characterSheet: { name: "Magnus CharacterSheet" },
        playerName: "Magnus Burnsides",
        rolls: [],
      });
    });
  });
  describe("Given I want to encode an object with emojis in it", () => {
    it("should be possible to decode it", () => {
      const data = DataTransferObject.encode({
        playerName: "🐺🐺🐺🐺",
        rolls: [],
        characterSheet: {
          name: "Magnus CharacterSheet",
        },
      });

      const result = DataTransferObject.decode(data);

      expect(result).toEqual({
        characterSheet: { name: "Magnus CharacterSheet" },
        playerName: "🐺🐺🐺🐺",
        rolls: [],
      });
    });
  });
});
