import { act, renderHook } from "@testing-library/react-hooks";
import { ManagerMode } from "../../../components/Manager/Manager";
import { CharacterType } from "../CharacterType";
import { ComplexCharacter } from "../mocks/ComplexCharacter";
import { Warden } from "../mocks/WardenLeMagane";
import {
  ICharacter,
  IV1Character,
  migrateCharacters,
  useCharacters,
  import
} from { CharacterType };
 from "../CharacterType";
} from "../CharactersContext";

describe("migrateCharacters", () => {
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
        const result = migrateCharacters([v1Char]);
        // THEN

        expect(
          result[0].pages
            .flatMap((p) => p.sections)
            .find((s) => s.label === "Stress")?.fields
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
      const result = migrateCharacters([Warden]);

      expect(result[0]).toEqual({
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
      const result = migrateCharacters([ComplexCharacter]);

      expect(result[0]).toEqual({
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

describe("useCharacters", () => {
  describe("local storage load", () => {
    it("should load info from local storage", () => {
      // GIVEN
      const localStorage = new LocalStorageMock();
      localStorage.setItem("fari-characters", JSON.stringify([{ id: "hey" }]));
      // WHEN
      const { result } = renderHook(() => {
        return useCharacters({ localStorage: localStorage as any });
      });

      // THEN
      expect(result.current.state.characters).toEqual([{ id: "hey" }]);
    });
    it("should not info from local storage if empty", () => {
      // GIVEN
      const localStorage = new LocalStorageMock();
      localStorage.setItem("fari-characters", "");
      // WHEN
      const { result } = renderHook(() => {
        return useCharacters({ localStorage: localStorage as any });
      });

      // THEN
      expect(result.current.state.characters).toEqual([]);
    });
    it("should not info from local storage if empty", () => {
      // GIVEN
      const localStorage = new LocalStorageMock();
      localStorage.setItem("fari-characters", "][");
      // WHEN
      const { result } = renderHook(() => {
        return useCharacters({ localStorage: localStorage as any });
      });

      // THEN
      expect(result.current.state.characters).toEqual([]);
    });
  });
  describe("flow", () => {
    it("should be able to manager characters", () => {
      // GIVEN
      const localStorage = new LocalStorageMock();

      const { result } = renderHook(() => {
        return useCharacters({ localStorage: localStorage as any });
      });

      // WHEN I add a new character
      let newCharacter: ICharacter | undefined = undefined;
      act(() => {
        newCharacter = result.current.actions.add(CharacterType.CoreCondensed);
      });
      // THEN the character is added
      expect(result.current.state.characters.length).toEqual(1);

      act(() => {
        // WHEN I update my character
        newCharacter = result.current.actions.upsert({
          ...newCharacter,
          name: "UPDATED NAME",
        } as ICharacter);
      });
      let playingCharacter: ICharacter | undefined = undefined;
      act(() => {
        // WHEN I save a character I'm already playing
        playingCharacter = result.current.actions.upsert({
          id: "an id from a live session",
        } as ICharacter);
      });

      // THEN the new character has been added and is properly sorted
      expect(result.current.state.characters[1]).toEqual(
        expect.objectContaining({
          id: playingCharacter!.id,
        })
      );
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          name: "UPDATED NAME",
        })
      );

      act(() => {
        // WHEN I remove a character
        result.current.actions.remove("an id from a live session");
      });
      // THEN the character is deleted
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          name: "UPDATED NAME",
        })
      );
      expect(result.current.state.characters[1]).toEqual(undefined);

      act(() => {
        // WHEN I add an undefined character
        result.current.actions.upsert(undefined as any);
      });
      // THEN nothing happens
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          name: "UPDATED NAME",
        })
      );

      act(() => {
        // WHEN I update an undefined character
        result.current.actions.updateIfExists(undefined as any);
      });
      // THEN nothing happens
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          name: "UPDATED NAME",
        })
      );

      act(() => {
        // WHEN I update a character that is not in the DB
        result.current.actions.updateIfExists({
          id: expect.anything(),
          name: "A NEW NAME",
        } as ICharacter);
      });
      // THEN nothing happens
      expect(result.current.state.characters.length).toEqual(1);
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          name: "UPDATED NAME",
        })
      );

      act(() => {
        // WHEN I update a character that is in the DB
        result.current.actions.updateIfExists({
          ...newCharacter,
          name: "A NEW NAME",
        } as ICharacter);
      });
      // THEN the character is updated
      expect(result.current.state.characters.length).toEqual(1);
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          name: "A NEW NAME",
        })
      );

      act(() => {
        // WHEN I open the manager
        result.current.actions.openManager(ManagerMode.Use);
      });
      // THEN the manager is opened
      expect(result.current.state.mode).toEqual(ManagerMode.Use);
      act(() => {
        // WHEN I close the manager
        result.current.actions.closeManager();
      });
      // THEN the manager is closed
      expect(result.current.state.mode).toEqual(ManagerMode.Close);
    });
  });
});

class LocalStorageMock {
  private store: Record<string, string>;
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}
