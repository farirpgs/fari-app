import { act, renderHook } from "@testing-library/react-hooks";
import { ManagerMode } from "../../../components/Manager/Manager";
import {
  CharacterType,
  ICharacter,
  IV1Character,
  migrateCharacters,
  useCharacters,
} from "../CharactersContext";
import { ComplexCharacter } from "../mocks/ComplexCharacter";
import { Warden } from "../mocks/WardenLeMagane";

describe("migrateCharacters", () => {
  describe("v1", () => {
    describe("stressTracks", () => {
      it("should migrate characters from v1 `stressTracks` to v2 `stressTracks`", () => {
        // GIVEN
        const v1Char: IV1Character = {
          id: "",
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
          result[0].sections.find((s) => s.label === "Stress")?.fields
        ).toEqual([
          {
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
        id: "03dd15c8-5bed-40a5-b1e3-b0aa5e59e2e7",
        name: "Warden Le Magané",
        group: undefined,
        lastUpdated: 1606783644,
        sections: [
          {
            label: "Aspects",
            position: 0,
            type: 0,
            fields: [
              {
                label: "High Concept",
                value:
                  "Survivant à l'apocalypse et à une rencontre contre la Mère des Sans-Visages",
              },
              {
                label: "Trouble Aspect",
                value:
                  "Mon apparence affreuse traumatise quiconque me regarde (CORRUPTED)",
              },
              {
                label: "RELATIONSHIP",
                value: "J'ai survécu grâce à l'apocalypse Rodolf Salis",
              },
              {
                label: "Other Aspect",
                value: "Ancien chasseur de tête / Assassin",
              },
              { label: "OTHER ASPECT", value: "" },
            ],
          },
          {
            label: "Stunts & Extras",
            position: 0,
            type: 0,
            fields: [
              {
                label: "The voices, they are telling me things...",
                value: "Use Will instead of Notice (And +2)",
              },
              {
                label: "Touched by the occult",
                value:
                  "Use Lore instead of Academics about occult, weird or creepy subjects",
              },
              {
                label: "Armor of Fear",
                value:
                  "You can use Provoke to defend against Fight attacks, but only until the first time you’re dealt stress in a conflict. You can make your opponents hesitate to attack, but when someone shows them that you’re only human your advantage disappears.",
              },
            ],
          },
          {
            label: "Other",
            position: 0,
            type: 0,
            fields: [{ label: "Notes", value: "" }],
          },
          {
            label: "Stress",
            position: 1,
            type: 2,
            fields: [
              {
                label: "Physical",
                value: [
                  { checked: false, label: "1" },
                  { checked: false, label: "2" },
                  { checked: false, label: "3" },
                  { checked: false, label: "4" },
                ],
              },
              {
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
                label: "Corruption",
                value: [
                  { checked: false, label: "1" },
                  { checked: false, label: "2" },
                  { checked: false, label: "3" },
                  { checked: false, label: "4" },
                ],
              },
            ],
          },
          {
            label: "Consequences",
            position: 1,
            type: 0,
            fields: [
              { label: "Mild", value: "" },
              { label: "Moderate", value: "" },
              { label: "Severe", value: "" },
            ],
          },
          {
            label: "Skills",
            position: 1,
            type: 1,
            fields: [
              { label: "Academics", value: "" },
              { label: "Athletics", value: "2" },
              { label: "Burglary", value: "" },
              { label: "Contacts", value: "" },
              { label: "Crafts", value: "" },
              { label: "Deceive", value: "1" },
              { label: "Drive", value: "" },
              { label: "Empathy", value: "1" },
              { label: "Fight", value: "" },
              { label: "Investigate", value: "2" },
              { label: "Lore", value: "3" },
              { label: "Notice", value: "" },
              { label: "Physique", value: "1" },
              { label: "Provoke", value: "4" },
              { label: "Rapport", value: "2" },
              { label: "Resources", value: "" },
              { label: "Shoot", value: "" },
              { label: "Stealth", value: "1" },
              { label: "Will", value: "3" },
            ],
          },
        ],
        version: 3,
      });
    });
    it("should convert ComplexCharacter", () => {
      const result = migrateCharacters([ComplexCharacter]);

      expect(result[0]).toEqual({
        id: "03dd15c8-5bed-40a5-b1e3-b0aa5e59e2e7",
        name: "Compliqué",
        group: "Le groupe des compliqués",
        lastUpdated: 1606783644,
        sections: [
          {
            fields: [{ label: "Grand Concept", value: "Mon grand concepte" }],
            label: "Aspects",
            position: 0,
            type: 0,
          },
          {
            label: "Pouvoirs",
            position: 0,
            type: 0,
            fields: [
              { label: "Mon super pouvoir", value: "Me permet de faire..." },
            ],
          },
          {
            label: "Les Notes",
            position: 0,
            type: 0,
            fields: [{ label: "Notes", value: "Some notes..." }],
          },
          {
            label: "Stresse",
            position: 1,
            type: 2,
            fields: [
              {
                label: "Physique",
                value: [
                  { checked: false, label: "11" },
                  { checked: true, label: "22" },
                  { checked: false, label: "33" },
                  { checked: true, label: "44" },
                ],
              },
            ],
          },
          {
            label: "Conséquences",
            position: 1,
            type: 0,
            fields: [{ label: "Mild", value: "" }],
          },
          {
            label: "Attributs",
            position: 1,
            type: 1,
            fields: [{ label: "Tout", value: "8" }],
          },
        ],
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
      expect(result.current.state.characters).toEqual([
        {
          id: newCharacter!.id,
          lastUpdated: newCharacter!.lastUpdated,
          aspects: [
            { name: "High Concept", value: "" },
            { name: "Trouble", value: "" },
            { name: "Relationship", value: "" },
            { name: "Other Aspect", value: "" },
            { name: "Other Aspect", value: "" },
          ],
          consequences: [
            { name: "Mild", value: "" },
            { name: "Moderate", value: "" },
            { name: "Severe", value: "" },
          ],

          name: "",
          refresh: 3,
          skills: [
            { name: "Academics", value: "" },
            { name: "Athletics", value: "" },
            { name: "Burglary", value: "" },
            { name: "Contacts", value: "" },
            { name: "Crafts", value: "" },
            { name: "Deceive", value: "" },
            { name: "Drive", value: "" },
            { name: "Empathy", value: "" },
            { name: "Fight", value: "" },
            { name: "Investigate", value: "" },
            { name: "Lore", value: "" },
            { name: "Notice", value: "" },
            { name: "Physique", value: "" },
            { name: "Provoke", value: "" },
            { name: "Rapport", value: "" },
            { name: "Resources", value: "" },
            { name: "Shoot", value: "" },
            { name: "Stealth", value: "" },
            { name: "Will", value: "" },
          ],
          stressTracks: [
            {
              name: "Physical",
              value: [
                { checked: false, label: "1" },
                { checked: false, label: "2" },
                { checked: false, label: "3" },
              ],
            },
            {
              name: "Mental",
              value: [
                { checked: false, label: "1" },
                { checked: false, label: "2" },
                { checked: false, label: "3" },
              ],
            },
          ],
          stunts: [
            { name: "Stunt #1", value: "" },
            { name: "Stunt #2", value: "" },
            { name: "Stunt #3", value: "" },
          ],
          version: 2,
        },
      ]);

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

      return;

      // THEN the new character has been added and is properly sorted
      expect(result.current.state.characters[0]).toEqual(
        expect.objectContaining({
          id: playingCharacter!.id,
        })
      );
      expect(result.current.state.characters[1]).toEqual(
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
          id: "id-that-is-not-in-the-db",
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
