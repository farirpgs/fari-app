import produce from "immer";
import { CharacterFactory } from "./CharacterFactory";
import { DefaultTemplates } from "./DefaultTemplates";
import { ComplexCharacter } from "./mocks/ComplexCharacter";
import { DuplicateIds } from "./mocks/DuplicateIds";
import { Warden } from "./mocks/WardenLeMagane";
import { ICharacter, IV1Character } from "./types";

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
        expect(sections.find((s) => s.label === "STRESS")?.blocks).toEqual([
          {
            id: expect.anything(),
            label: "PHYSICAL",
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
        group: undefined,
        id: expect.anything(),
        lastUpdated: 1606783644,
        name: "Warden Le Magané",
        pages: [
          {
            id: expect.anything(),
            label: "CHARACTER",
            rows: [
              {
                columns: [
                  {
                    sections: [
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "HIGH CONCEPT",
                            meta: {},
                            type: "Text",
                            value:
                              "Survivant à l'apocalypse et à une rencontre contre la Mère des Sans-Visages",
                          },
                          {
                            id: expect.anything(),
                            label: "TROUBLE ASPECT",
                            meta: {},
                            type: "Text",
                            value:
                              "Mon apparence affreuse traumatise quiconque me regarde (CORRUPTED)",
                          },
                          {
                            id: expect.anything(),
                            label: "RELATIONSHIP",
                            meta: {},
                            type: "Text",
                            value:
                              "J'ai survécu grâce à l'apocalypse Rodolf Salis",
                          },
                          {
                            id: expect.anything(),
                            label: "OTHER ASPECT",
                            meta: {},
                            type: "Text",
                            value: "Ancien chasseur de tête / Assassin",
                          },
                          {
                            id: expect.anything(),
                            label: "OTHER ASPECT",
                            meta: {},
                            type: "Text",
                            value: "",
                          },
                        ],
                        id: expect.anything(),
                        label: "ASPECTS",
                        visibleOnCard: true,
                      },
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "THE VOICES, THEY ARE TELLING ME THINGS...",
                            meta: {},
                            type: "Text",
                            value: "Use Will instead of Notice (And +2)",
                          },
                          {
                            id: expect.anything(),
                            label: "TOUCHED BY THE OCCULT",
                            meta: {},
                            type: "Text",
                            value:
                              "Use Lore instead of Academics about occult, weird or creepy subjects",
                          },
                          {
                            id: expect.anything(),
                            label: "ARMOR OF FEAR",
                            meta: {},
                            type: "Text",
                            value:
                              "You can use Provoke to defend against Fight attacks, but only until the first time you’re dealt stress in a conflict. You can make your opponents hesitate to attack, but when someone shows them that you’re only human your advantage disappears.",
                          },
                        ],
                        id: expect.anything(),
                        label: "STUNTS & EXTRAS",
                        visibleOnCard: undefined,
                      },
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "FATE POINTS",
                            meta: {
                              isMainPointCounter: true,
                              max: "3",
                            },
                            type: "PointCounter",
                            value: "1",
                          },
                        ],
                        id: expect.anything(),
                        label: "FATE POINTS",
                        visibleOnCard: undefined,
                      },
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "NOTES",
                            meta: {},
                            type: "Text",
                            value: "",
                          },
                        ],
                        id: expect.anything(),
                        label: "OTHER",
                        visibleOnCard: undefined,
                      },
                    ],
                  },
                  {
                    sections: [
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "PHYSICAL",
                            meta: {},
                            type: "SlotTracker",
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
                            label: "MENTAL",
                            meta: {},
                            type: "SlotTracker",
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
                            label: "CORRUPTION",
                            meta: {},
                            type: "SlotTracker",
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
                        id: expect.anything(),
                        label: "STRESS",
                        visibleOnCard: undefined,
                      },
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "MILD",
                            meta: {},
                            type: "Text",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "MODERATE",
                            meta: {},
                            type: "Text",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "SEVERE",
                            meta: {},
                            type: "Text",
                            value: "",
                          },
                        ],
                        id: expect.anything(),
                        label: "CONSEQUENCES",
                        visibleOnCard: undefined,
                      },
                      {
                        blocks: [
                          {
                            id: expect.anything(),
                            label: "ACADEMICS",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "ATHLETICS",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "2",
                          },
                          {
                            id: expect.anything(),
                            label: "BURGLARY",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "CONTACTS",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "CRAFTS",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "DECEIVE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            label: "DRIVE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "EMPATHY",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            label: "FIGHT",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "INVESTIGATE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "2",
                          },
                          {
                            id: expect.anything(),
                            label: "LORE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "3",
                          },
                          {
                            id: expect.anything(),
                            label: "NOTICE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "PHYSIQUE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            label: "PROVOKE",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "4",
                          },
                          {
                            id: expect.anything(),
                            label: "RAPPORT",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "2",
                          },
                          {
                            id: expect.anything(),
                            label: "RESOURCES",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "SHOOT",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "",
                          },
                          {
                            id: expect.anything(),
                            label: "STEALTH",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "1",
                          },
                          {
                            id: expect.anything(),
                            label: "WILL",
                            meta: {
                              commands: ["4dF"],
                            },
                            type: "Skill",
                            value: "3",
                          },
                        ],
                        id: expect.anything(),
                        label: "SKILLS",
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
        version: 6,
        wide: false,
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
            label: "CHARACTER",
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
                            label: "GRAND CONCEPT",
                            value: "Mon grand concepte",
                          },
                        ],
                        label: "ASPECTS",
                        visibleOnCard: true,
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "MON SUPER POUVOIR",
                            value: "Me permet de faire...",
                          },
                        ],
                        label: "POUVOIRS",
                        visibleOnCard: undefined,
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
                            label: "FATE POINTS",
                            value: "3",
                          },
                        ],
                        label: "FATE POINTS",
                        visibleOnCard: undefined,
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "NOTES",
                            value: "Some notes...",
                          },
                        ],
                        label: "LES NOTES",
                        visibleOnCard: undefined,
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
                            label: "PHYSIQUE",
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
                        label: "STRESSE",
                        visibleOnCard: undefined,
                      },
                      {
                        id: expect.anything(),
                        blocks: [
                          {
                            id: expect.anything(),
                            type: "Text",
                            meta: {},
                            label: "MILD",
                            value: "",
                          },
                        ],
                        label: "CONSÉQUENCES",
                        visibleOnCard: undefined,
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
                            label: "TOUT",
                            value: "8",
                          },
                        ],
                        label: "ATTRIBUTS",
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
        version: 6,
      });
    });
  });
});

describe("CharacterFactory.duplicate", () => {
  it("should reset the ids", async () => {
    const defaultCharacter = await CharacterFactory.make(
      DefaultTemplates.FateCondensed
    );

    const characterWithFakeIds = produce(defaultCharacter, (draft) => {
      draft.id = "1";
      draft.pages.forEach((p) => {
        p.id = "1";
        p.rows.forEach((r) => {
          r.columns.forEach((c) => {
            c.sections.forEach((s) => {
              s.id = "1";
              s.blocks.forEach((b) => {
                b.id = "1";
              });
            });
          });
        });
      });
    });

    const duplicate = CharacterFactory.duplicate(characterWithFakeIds);
    expect(duplicate.id).not.toBe("1");
    duplicate.pages.forEach((p) => {
      expect(p.id).not.toBe("1");
      p.rows.forEach((r) => {
        r.columns.forEach((c) => {
          c.sections.forEach((s) => {
            expect(s.id).not.toBe("1");
            s.blocks.forEach((b) => {
              expect(b.id).not.toBe("1");
            });
          });
        });
      });
    });
  });

  it("should handle duplicate id imports", () => {
    const result = CharacterFactory.makeFromJson(DuplicateIds);

    const ids = [result.id];

    for (const page of result.pages) {
      ids.push(page.id);
      for (const row of page.rows) {
        for (const column of row.columns) {
          for (const section of column.sections) {
            ids.push(section.id);
            for (const block of section.blocks) {
              ids.push(block.id);
            }
          }
        }
      }
    }

    // This should check for duplicates
    expect(new Set(ids).size).toEqual(ids.length);
  });
});
