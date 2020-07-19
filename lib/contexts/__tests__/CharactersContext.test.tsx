import { ICharacter, migrateCharacters } from "../CharactersContext";

describe("migrateCharacters", () => {
  describe("v1", () => {
    describe("stressTracks", () => {
      it("should migrate characters from v1 `stressTracks` to v2 `stressTracks`", () => {
        // GIVEN
        const v1Char: ICharacter = {
          id: "",
          name: "",
          aspects: [],
          stunts: [],
          skills: [],
          stressTracks: [
            {
              name: "Physical",
              value: [false, true, false] as any,
            },
          ],
          consequences: [],
          refresh: 3,
          version: 1,
          lastUpdated: 0,
        };
        // WHEN
        const result = migrateCharacters([v1Char]);
        // THEN
        expect(result[0].stressTracks).toEqual([
          {
            name: "Physical",
            value: [
              { checked: false, label: "1" },
              { checked: true, label: "2" },
              { checked: false, label: "3" },
            ],
          },
        ]);
      });
    });
  });
});
