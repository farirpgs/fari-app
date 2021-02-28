import { CharacterFactory } from "../CharacterFactory";
import { ComplexCharacter } from "../mocks/ComplexCharacter";
import { Warden } from "../mocks/WardenLeMagane";
import { IV1Character } from "../types";

describe("CharacterFactory.migrate", () => {
  describe("v1", () => {
    describe("stressTracks", () => {
      it("should migrate characters from v1 `stressTracks` to v2 `stressTracks`", () => {
        // GIVEN
        const v1Char: IV1Character = {
          id: expect.anything(),
          name: "",
          group: undefined,
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
          aspectsLabel: undefined,
          skillsLabel: undefined,
          stuntsLabel: undefined,
          stressTracksLabel: undefined,
          consequencesLabel: undefined,
          refreshLabel: undefined,
          fatePoints: undefined,
          playedDuringTurn: undefined,
          notes: undefined,
          notesLabel: undefined,
          version: 1,
          lastUpdated: 0,
        };
        // WHEN
        const result = CharacterFactory.migrate(v1Char);

        // THEN
        expect(
          result.pages
            .flatMap((p) => p.sections)
            .find((s) => s.label === "Stress")?.blocks
        ).toEqual([
          {
            id: expect.anything(),
            label: "Physical",
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
  describe("v2", () => {
    it("should convert Warden le Magané", () => {
      const result = CharacterFactory.migrate(Warden);

      expect(result).toEqual({
        fatePoints: undefined,
        group: undefined,
        id: expect.anything(),
        lastUpdated: expect.anything(),
        name: "Warden Le Magané",
        pages: [
          {
            id: expect.anything(),
            sections: [
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "High Concept",
                    value:
                      "Survivant à l'apocalypse et à une rencontre contre la Mère des Sans-Visages",
                  },
                  {
                    id: expect.anything(),
                    label: "Trouble Aspect",
                    value:
                      "Mon apparence affreuse traumatise quiconque me regarde (CORRUPTED)",
                  },
                  {
                    id: expect.anything(),
                    label: "RELATIONSHIP",
                    value: "J'ai survécu grâce à l'apocalypse Rodolf Salis",
                  },
                  {
                    id: expect.anything(),
                    label: "Other Aspect",
                    value: "Ancien chasseur de tête / Assassin",
                  },
                  {
                    id: expect.anything(),
                    label: "OTHER ASPECT",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Aspects",
                position: 0,
                type: 0,
                visibleOnCard: true,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "The voices, they are telling me things...",
                    value: "Use Will instead of Notice (And +2)",
                  },
                  {
                    id: expect.anything(),
                    label: "Touched by the occult",
                    value:
                      "Use Lore instead of Academics about occult, weird or creepy subjects",
                  },
                  {
                    id: expect.anything(),
                    label: "Armor of Fear",
                    value:
                      "You can use Provoke to defend against Fight attacks, but only until the first time you’re dealt stress in a conflict. You can make your opponents hesitate to attack, but when someone shows them that you’re only human your advantage disappears.",
                  },
                ],
                id: expect.anything(),
                label: "Stunts & Extras",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Notes",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Other",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Physical",
                    value: [
                      { checked: false, label: "1" },
                      { checked: false, label: "2" },
                      { checked: false, label: "3" },
                      { checked: false, label: "4" },
                    ],
                  },
                  {
                    id: expect.anything(),
                    label: "Mental",
                    value: [
                      { checked: false, label: "1" },
                      { checked: false, label: "2" },
                      { checked: false, label: "3" },
                      { checked: false, label: "4" },
                      { checked: false, label: "5" },
                      { checked: false, label: "6" },
                    ],
                  },
                  {
                    id: expect.anything(),
                    label: "Corruption",
                    value: [
                      { checked: false, label: "1" },
                      { checked: false, label: "2" },
                      { checked: false, label: "3" },
                      { checked: false, label: "4" },
                    ],
                  },
                ],
                id: expect.anything(),
                label: "Stress",
                position: 1,
                type: 2,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Mild",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Moderate",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Severe",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Consequences",
                position: 1,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Academics",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Athletics",
                    value: "2",
                  },
                  {
                    id: expect.anything(),
                    label: "Burglary",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Contacts",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Crafts",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Deceive",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Drive",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Empathy",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Fight",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Investigate",
                    value: "2",
                  },
                  {
                    id: expect.anything(),
                    label: "Lore",
                    value: "3",
                  },
                  {
                    id: expect.anything(),
                    label: "Notice",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Physique",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Provoke",
                    value: "4",
                  },
                  {
                    id: expect.anything(),
                    label: "Rapport",
                    value: "2",
                  },
                  {
                    id: expect.anything(),
                    label: "Resources",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Shoot",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Stealth",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Will",
                    value: "3",
                  },
                ],
                id: expect.anything(),
                label: "Skills",
                position: 1,
                type: 1,
                visibleOnCard: true,
              },
            ],
          },
        ],
        playedDuringTurn: false,
        refresh: 3,
        version: 3,
      });
    });

    it("should convert ComplexCharacter", () => {
      const result = CharacterFactory.migrate(ComplexCharacter);

      expect(result).toEqual({
        fatePoints: 3,
        group: "Le groupe des compliqués",
        id: expect.anything(),
        lastUpdated: 1606783644,
        name: "Compliqué",
        pages: [
          {
            id: expect.anything(),
            sections: [
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Grand Concept",
                    value: "Mon grand concepte",
                  },
                ],
                id: expect.anything(),
                label: "Aspects",
                position: 0,
                type: 0,
                visibleOnCard: true,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Mon super pouvoir",
                    value: "Me permet de faire...",
                  },
                ],
                id: expect.anything(),
                label: "Pouvoirs",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Notes",
                    value: "Some notes...",
                  },
                ],
                id: expect.anything(),
                label: "Les Notes",
                position: 0,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Physique",
                    value: [
                      { checked: false, label: "11" },
                      { checked: true, label: "22" },
                      { checked: false, label: "33" },
                      { checked: true, label: "44" },
                    ],
                  },
                ],
                id: expect.anything(),
                label: "Stresse",
                position: 1,
                type: 2,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Mild",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Conséquences",
                position: 1,
                type: 0,
              },
              {
                fields: [
                  {
                    id: expect.anything(),
                    label: "Tout",
                    value: "8",
                  },
                ],
                id: expect.anything(),
                label: "Attributs",
                position: 1,
                type: 1,
                visibleOnCard: true,
              },
            ],
          },
        ],
        playedDuringTurn: false,
        refresh: 3,
        version: 3,
      });
    });
  });
});
