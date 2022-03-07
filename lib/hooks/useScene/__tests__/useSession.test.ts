/**
 * @jest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react-hooks";
import { useCharacters } from "../../../contexts/CharactersContext/CharactersContext";
import { makeNewBlankDocument } from "../../../routes/Draw/TldrawWriterAndReader";
import { ISession } from "../IScene";
import { useSession } from "../useSession";

describe("useSession", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";

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
      tlDrawDoc: makeNewBlankDocument(),
    };
    // WHEN
    const { result } = renderHook(() => {
      return useSession({
        userId,
      });
    });
    // THEN
    expect(result.current.state.session).toEqual(expectDefaultSession);
  });

  describe("players", () => {
    it("should map connections to players", () => {
      // GIVEN
      const userId = "111";

      // WHEN initial render
      const { result } = renderHook(() => {
        return useSession({
          userId,
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
    });
  });

  describe("confetti", () => {
    // GIVEN
    const userId = "111";

    // WHEN initial render
    const { result } = renderHook(() => {
      return useSession({
        userId,
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
  });

  describe("offline character", () => {
    const userId = "111";

    // WHEN initial render
    const { result } = renderHook(() => {
      return useSession({
        userId,
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
      updateIfStoredAndMoreRecent: jest.fn(),
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
