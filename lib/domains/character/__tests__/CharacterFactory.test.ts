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
        const sections = result.pages
          .flatMap((p) => p.rows)
          .flatMap((r) => r.columns)
          .flatMap((c) => c.sections);
        expect(sections.find((s) => s.label === "Stress")?.blocks).toEqual([
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
  describe("vLatest", () => {
    it("should convert Warden le Magané", () => {
      const result = CharacterFactory.migrate(Warden);

      expect(result).toEqual({
        id: expect.anything(),
        name: "Warden Le Magané",
        lastUpdated: expect.anything(),
        wide: false,
        pages: [
          {
            id: expect.anything(),
            label: "Character",
            rows: [
              {
                columns: [
                  {
                    sections: [
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "High Concept",
                            value:
                              "Survivant à l'apocalypse et à une rencontre contre la Mère des Sans-Visages",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Trouble Aspect",
                            value:
                              "Mon apparence affreuse traumatise quiconque me regarde (CORRUPTED)",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "RELATIONSHIP",
                            value:
                              "J'ai survécu grâce à l'apocalypse Rodolf Salis",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Other Aspect",
                            value: "Ancien chasseur de tête / Assassin",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "OTHER ASPECT",
                            value: "",
                          },
                        ],
                        label: "Aspects",
                        visibleOnCard: true,
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "The voices, they are telling me things...",
                            value: "Use Will instead of Notice (And +2)",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Touched by the occult",
                            value:
                              "Use Lore instead of Academics about occult, weird or creepy subjects",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Armor of Fear",
                            value:
                              "You can use Provoke to defend against Fight attacks, but only until the first time you’re dealt stress in a conflict. You can make your opponents hesitate to attack, but when someone shows them that you’re only human your advantage disappears.",
                          },
                        ],
                        label: "Stunts & Extras",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "PointCounter",
                            meta: {
                              isMainPointCounter: true,
                              max: "3",
                            },
                            label: "Fate Points",
                            value: "1",
                          },
                        ],
                        label: "Fate Points",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Notes",
                            value: "",
                          },
                        ],
                        label: "Other",
                      },
                    ],
                  },
                  {
                    sections: [
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "SlotTracker",
                            meta: {},
                            label: "Physical",
                            value: [
                              {
                                checked: false,
                                label: "1",
                              },
                              {
                                checked: false,
                                label: "2",
                              },
                              {
                                checked: false,
                                label: "3",
                              },
                              {
                                checked: false,
                                label: "4",
                              },
                            ],
                          },
                          {
                            id: expect.anything(),
                            type: "SlotTracker",
                            meta: {},
                            label: "Mental",
                            value: [
                              {
                                checked: false,
                                label: "1",
                              },
                              {
                                checked: false,
                                label: "2",
                              },
                              {
                                checked: false,
                                label: "3",
                              },
                              {
                                checked: false,
                                label: "4",
                              },
                              {
                                checked: false,
                                label: "5",
                              },
                              {
                                checked: false,
                                label: "6",
                              },
                            ],
                          },
                          {
                            id: expect.anything(),
                            type: "SlotTracker",
                            meta: {},
                            label: "Corruption",
                            value: [
                              {
                                checked: false,
                                label: "1",
                              },
                              {
                                checked: false,
                                label: "2",
                              },
                              {
                                checked: false,
                                label: "3",
                              },
                              {
                                checked: false,
                                label: "4",
                              },
                            ],
                          },
                        ],
                        label: "Stress",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Mild",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Moderate",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Severe",
                            value: "",
                          },
                        ],
                        label: "Consequences",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Academics",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Athletics",
                            value: "2",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Burglary",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Contacts",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Crafts",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Deceive",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Drive",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Empathy",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Fight",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Investigate",
                            value: "2",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Lore",
                            value: "3",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Notice",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Physique",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Provoke",
                            value: "4",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Rapport",
                            value: "2",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Resources",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Shoot",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Stealth",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Will",
                            value: "3",
                          },
                        ],
                        label: "Skills",
                        visibleOnCard: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        playedDuringTurn: false,
        version: 5,
      });
    });

    it("should convert ComplexCharacter", () => {
      const result = CharacterFactory.migrate(ComplexCharacter);

      expect(result).toEqual({
        id: expect.anything(),
        name: "Compliqué",
        group: "Le groupe des compliqués",
        lastUpdated: 1606783644,
        wide: false,
        pages: [
          {
            id: expect.anything(),
            label: "Character",
            rows: [
              {
                columns: [
                  {
                    sections: [
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Grand Concept",
                            value: "Mon grand concepte",
                          },
                        ],
                        label: "Aspects",
                        visibleOnCard: true,
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Mon super pouvoir",
                            value: "Me permet de faire...",
                          },
                        ],
                        label: "Pouvoirs",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "PointCounter",
                            meta: {
                              isMainPointCounter: true,
                              max: "3",
                            },
                            label: "Fate Points",
                            value: "3",
                          },
                        ],
                        label: "Fate Points",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Notes",
                            value: "Some notes...",
                          },
                        ],
                        label: "Les Notes",
                      },
                    ],
                  },
                  {
                    sections: [
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "SlotTracker",
                            meta: {},
                            label: "Physique",
                            value: [
                              {
                                checked: false,
                                label: "11",
                              },
                              {
                                checked: true,
                                label: "22",
                              },
                              {
                                checked: false,
                                label: "33",
                              },
                              {
                                checked: true,
                                label: "44",
                              },
                            ],
                          },
                        ],
                        label: "Stresse",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "Mild",
                            value: "",
                          },
                        ],
                        label: "Conséquences",
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Skill",
                            meta: {
                              commands: ["4dF"],
                            },
                            label: "Tout",
                            value: "8",
                          },
                        ],
                        label: "Attributs",
                        visibleOnCard: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        playedDuringTurn: false,
        version: 5,
      });
    });
  });
});
