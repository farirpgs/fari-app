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
            meta: {},
            type: "SlotTracker",
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
  fdescribe("v2", () => {
    it("should convert Warden le Magané", () => {
      const result = CharacterFactory.migrate(Warden);

      expect(result).toEqual({
        group: undefined,
        id: expect.anything(),
        lastUpdated: expect.anything(),
        name: "Warden Le Magané",
        pages: [
          {
            id: expect.anything(),
            label: "Character",
            sections: [
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "High Concept",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value:
                      "Survivant à l'apocalypse et à une rencontre contre la Mère des Sans-Visages",
                  },
                  {
                    id: expect.anything(),
                    label: "Trouble Aspect",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value:
                      "Mon apparence affreuse traumatise quiconque me regarde (CORRUPTED)",
                  },
                  {
                    id: expect.anything(),
                    label: "RELATIONSHIP",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value: "J'ai survécu grâce à l'apocalypse Rodolf Salis",
                  },
                  {
                    id: expect.anything(),
                    label: "Other Aspect",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value: "Ancien chasseur de tête / Assassin",
                  },
                  {
                    id: expect.anything(),
                    label: "OTHER ASPECT",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Aspects",
                position: "Left",
                visibleOnCard: true,
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "The voices, they are telling me things...",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value: "Use Will instead of Notice (And +2)",
                  },
                  {
                    id: expect.anything(),
                    label: "Touched by the occult",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value:
                      "Use Lore instead of Academics about occult, weird or creepy subjects",
                  },
                  {
                    id: expect.anything(),
                    label: "Armor of Fear",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value:
                      "You can use Provoke to defend against Fight attacks, but only until the first time you’re dealt stress in a conflict. You can make your opponents hesitate to attack, but when someone shows them that you’re only human your advantage disappears.",
                  },
                ],
                id: expect.anything(),
                label: "Stunts & Extras",
                position: "Left",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Notes",
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Other",
                position: "Left",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Physical",
                    meta: {},
                    type: "SlotTracker",
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
                    meta: {},
                    type: "SlotTracker",
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
                    meta: {},
                    type: "SlotTracker",
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
                position: "Right",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    label: "Mild",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    label: "Moderate",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    meta: {
                      checked: undefined,
                    },
                    type: "Text",
                    label: "Severe",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Consequences",
                position: "Right",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Academics",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Athletics",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "2",
                  },
                  {
                    id: expect.anything(),
                    label: "Burglary",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Contacts",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Crafts",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Deceive",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Drive",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Empathy",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Fight",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Investigate",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "2",
                  },
                  {
                    id: expect.anything(),
                    label: "Lore",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "3",
                  },
                  {
                    id: expect.anything(),
                    label: "Notice",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Physique",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Provoke",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "4",
                  },
                  {
                    id: expect.anything(),
                    label: "Rapport",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "2",
                  },
                  {
                    id: expect.anything(),
                    label: "Resources",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Shoot",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "",
                  },
                  {
                    id: expect.anything(),
                    label: "Stealth",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "1",
                  },
                  {
                    id: expect.anything(),
                    label: "Will",
                    meta: {
                      checked: undefined,
                    },
                    type: "Skill",
                    value: "3",
                  },
                ],
                id: expect.anything(),
                label: "Skills",
                position: "Right",
                visibleOnCard: true,
              },
            ],
          },
        ],
        playedDuringTurn: false,
        version: 3,
      });
    });

    it("should convert ComplexCharacter", () => {
      const result = CharacterFactory.migrate(ComplexCharacter);

      expect(result).toEqual({
        group: "Le groupe des compliqués",
        id: expect.anything(),
        lastUpdated: 1606783644,
        name: "Compliqué",
        pages: [
          {
            id: expect.anything(),
            label: "Character",
            sections: [
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Grand Concept",
                    meta: { checked: undefined },
                    type: "Text",
                    value: "Mon grand concepte",
                  },
                ],
                id: expect.anything(),
                label: "Aspects",
                position: "Left",
                visibleOnCard: true,
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Mon super pouvoir",
                    meta: { checked: undefined },
                    type: "Text",
                    value: "Me permet de faire...",
                  },
                ],
                id: expect.anything(),
                label: "Pouvoirs",
                position: "Left",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Notes",
                    meta: { checked: undefined },
                    type: "Text",
                    value: "Some notes...",
                  },
                ],
                id: expect.anything(),
                label: "Les Notes",
                position: "Left",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Physique",
                    meta: {},
                    type: "SlotTracker",
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
                position: "Right",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Mild",
                    meta: { checked: undefined },
                    type: "Text",
                    value: "",
                  },
                ],
                id: expect.anything(),
                label: "Conséquences",
                position: "Right",
              },
              {
                blocks: [
                  {
                    id: expect.anything(),
                    label: "Tout",
                    meta: { checked: undefined },
                    type: "Skill",
                    value: "8",
                  },
                ],
                id: expect.anything(),
                label: "Attributs",
                position: "Right",
                visibleOnCard: true,
              },
            ],
          },
        ],
        playedDuringTurn: false,
        version: 3,
      });
    });
  });
});
