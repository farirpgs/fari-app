import { act, renderHook } from "@testing-library/react";
import { useCharacters } from "../../../contexts/CharactersContext/CharactersContext";
import { useSession } from "../../../routes/Play/components/Session/useSession";
import { DefaultPlayerColor } from "../../../routes/Play/consts/PlayerColors";
import { ISession } from "../IScene";

describe("useSession", () => {
  it("constructor", () => {
    // GIVEN
    const userId = "111";

    const expectDefaultSession: ISession = {
      gm: {
        id: expect.anything(),
        playerName: "Game Master",
        status: "",
        private: false,
        npcs: [],
        isGM: true,
        color: DefaultPlayerColor,
        points: "3",
      },
      players: {},
      goodConfetti: 0,
      badConfetti: 0,
      paused: false,
      playerColorIndex: 0,
      tlDrawDoc: {
        bindings: {},
        shapes: {},
      },
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
        color: DefaultPlayerColor,
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
    it("should be able to set", () => {
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
  });

  describe("overrideSession", () => {
    it("test", () => {
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
  });

  describe("offline character", () => {
    it("test", () => {
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
          color: DefaultPlayerColor,
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
});

function mockUseCharacters() {
  const result = {
    state: {
      characters: [],
      groups: [],
    },
    actions: {
      add: vi.fn(),
      upsert: vi.fn(),
      updateIfStoredAndMoreRecent: vi.fn(),
      addIfDoesntExist: vi.fn(),
      remove: vi.fn(),
      duplicate: vi.fn(),
      select: vi.fn(),
      setEntities: vi.fn(),
      clearSelected: vi.fn(),
      exportEntity: vi.fn(),
      importEntity: vi.fn(),
      exportEntityAsTemplate: vi.fn(),
    },
    selectors: {
      isInStorage: vi.fn(),
    },
  } as ReturnType<typeof useCharacters>;
  return () => {
    return result;
  };
}
