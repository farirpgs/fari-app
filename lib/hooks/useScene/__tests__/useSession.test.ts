/**
 * @jest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react-hooks";
import { useCharacters } from "../../../contexts/CharactersContext/CharactersContext";
import { BlankTLDrawDocument } from "../../../routes/Draw/TLDraw";
import { ISession } from "../IScene";
import { useSession } from "../useSession";

describe("useSession", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";
    const useCharactersMock = mockUseCharacters();

    const expectDefaultSession: ISession = {
      gm: {
        id: expect.anything(),
        playerName: "Game Master",
        rolls: [],
        playedDuringTurn: false,
        private: false,
        npcs: [],
        isGM: true,
        points: "3",
      },
      players: {},
      goodConfetti: 0,
      badConfetti: 0,
      paused: false,
      tlDrawDoc: BlankTLDrawDocument,
    };
    // WHEN
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return useSession({
        userId,
        charactersManager,
      });
    });
    // THEN
    expect(result.current.state.session).toEqual(expectDefaultSession);
  });

  describe("players", () => {
    it("should map connections to players", () => {
      // GIVEN
      const userId = "111";
      const useCharactersMock = mockUseCharacters();

      // WHEN initial render
      const { result } = renderHook(() => {
        const charactersManager = useCharactersMock();
        return useSession({
          userId,
          charactersManager,
        });
      });
      // WHEN initial connection with a player
      act(() => {
        result.current.actions.addNpc();
      });
      // THEN
      expect(result.current.state.session.gm.npcs[0]).toEqual({
        character: undefined,
        id: expect.anything(),
        isGM: false,
        private: false,
        points: "3",
        playedDuringTurn: false,
        playerName: "Character #1",
        rolls: [],
      });
      // WHEN player plays (fp, rolls, initiative)
      act(() => {
        result.current.actions.updatePlayerPlayedDuringTurn("1", true);
        result.current.actions.updatePlayerRoll("1", {
          rollGroups: [
            {
              commandSets: [
                {
                  id: "4dF",
                  commands: [
                    { value: 1, name: "1dF" },
                    { value: 1, name: "1dF" },
                    { value: 1, name: "1dF" },
                    { value: 1, name: "1dF" },
                  ],
                },
              ],
            },
          ],

          total: 4,
          totalWithoutModifiers: 4,
          options: { listResults: false },
        });
        result.current.actions.updatePlayerCharacterMainPointCounter(
          "1",
          "1",
          "3"
        );
      });
      // THEN connection mappings reflects that
      expect(result.current.state.session.gm.npcs[0]).toEqual({
        character: undefined,
        id: "1",
        playedDuringTurn: true,
        isGM: false,
        private: false,
        points: "1",
        offline: false,
        playerName: "RP",
        rolls: [
          {
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
            options: {
              listResults: false,
            },
            total: 4,
            totalWithoutModifiers: 4,
          },
        ],
      });
      act(() => {
        // WHEN reseting initiative
        result.current.actions.resetInitiative();
      });
      // THEN initiative is reset
      expect(result.current.state.session.gm.npcs[0]).toEqual({
        character: undefined,
        id: "1",
        playedDuringTurn: false,
        isGM: false,
        private: false,
        points: "1",
        offline: false,
        playerName: "RP",
        rolls: [
          {
            rollGroups: [
              {
                commandSets: [
                  {
                    id: "4dF",
                    commands: [
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                      { value: 1, name: "1dF" },
                    ],
                  },
                ],
              },
            ],
            options: {
              listResults: false,
            },
            total: 4,
            totalWithoutModifiers: 4,
          },
        ],
      });
      act(() => {
        // WHEN player adds character sheet
        result.current.actions.updatePlayerCharacter("1", {
          myCharacter: "my first character",
        } as unknown as any);
      });
      // THEN player as character
      expect(result.current.state.session.gm.npcs[0].character).toEqual({
        myCharacter: "my first character",
      });
      act(() => {
        // WHEN player reloads character sheet
        result.current.actions.updatePlayerCharacter("1", {
          myCharacter: "my second character",
        } as unknown as any);
      });
      // THEN player as character
      expect(result.current.state.session.gm.npcs[0].character).toEqual({
        myCharacter: "my second character",
      });

      act(() => {
        // WHEN player reloads character sheet
        result.current.actions.updatePlayerCharacter("1", {
          myCharacter: "my second character",
        } as unknown as any);
      });
      // THEN player as character
      expect(result.current.state.session.gm.npcs[0].character).toEqual({
        myCharacter: "my second character",
      });
    });
  });

  describe("confetti", () => {
    // GIVEN
    const userId = "111";
    const useCharactersMock = mockUseCharacters();

    // WHEN initial render
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return useSession({
        userId,

        charactersManager,
      });
    });
    expect(result.current.state.session.goodConfetti).toEqual(0);
    expect(result.current.state.session.badConfetti).toEqual(0);

    // WHEN good confetti
    act(() => {
      result.current.actions.fireGoodConfetti();
    });
    // THEN
    expect(result.current.state.session.goodConfetti).toEqual(1);
    expect(result.current.state.session.badConfetti).toEqual(0);
    // WHEN bad confetti
    act(() => {
      result.current.actions.fireBadConfetti();
    });
    // THEN
    expect(result.current.state.session.goodConfetti).toEqual(1);
    expect(result.current.state.session.badConfetti).toEqual(1);
  });

  describe("overrideSession", () => {
    // GIVEN
    const userId = "111";
    const useCharactersMock = mockUseCharacters();

    // WHEN initial render
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return {
        useSession: useSession({
          userId,
          charactersManager,
        }),
        useCharacters: charactersManager,
      };
    });
    // WHEN safeSet with nothing
    act(() => {
      result.current.useSession.actions.overrideSession(
        undefined as unknown as any
      );
    });

    // WHEN safeSet
    act(() => {
      result.current.useSession.actions.overrideSession({
        gm: { npcs: [] },
        players: [{ character: {} }, { character: {} }],
      } as unknown as any);
    });

    // THEN
    expect(result.current.useSession.state.session).toEqual({
      gm: { npcs: [] },
      players: [{ character: {} }, { character: {} }],
    });
    expect(
      result.current.useCharacters.actions.updateIfMoreRecent
    ).toHaveBeenCalledTimes(2);
  });

  describe("offline character", () => {
    const userId = "111";
    const useCharactersMock = mockUseCharacters();

    // WHEN initial render
    const { result } = renderHook(() => {
      const charactersManager = useCharactersMock();
      return useSession({
        userId,
        charactersManager,
      });
    });
    // WHEN adding an offline character
    let playerId = "";
    act(() => {
      playerId = result.current.actions.addNpc();
    });
    // THEN
    expect(result.current.state.session.gm.npcs).toEqual([
      {
        character: undefined,
        points: "3",
        id: playerId,
        playedDuringTurn: false,
        private: false,
        isGM: false,

        playerName: "Character #1",
        rolls: [],
      },
    ]);
    // WHEN removing an offline player
    act(() => {
      result.current.actions.removePlayer(playerId);
    });
    // THEN
    expect(result.current.state.session.gm.npcs).toEqual([]);
  });
});

function mockUseCharacters() {
  const result = {
    state: {
      characters: [],
      groups: [],
    },
    actions: {
      add: jest.fn(),
      upsert: jest.fn(),
      updateIfMoreRecent: jest.fn(),
      addIfDoesntExist: jest.fn(),
      remove: jest.fn(),
      duplicate: jest.fn(),
      select: jest.fn(),
      setEntities: jest.fn(),
      clearSelected: jest.fn(),
      exportEntity: jest.fn(),
      importEntity: jest.fn(),
      exportEntityAsTemplate: jest.fn(),
    },
    selectors: {
      isInStorage: jest.fn(),
    },
  } as ReturnType<typeof useCharacters>;
  return () => {
    return result;
  };
}
