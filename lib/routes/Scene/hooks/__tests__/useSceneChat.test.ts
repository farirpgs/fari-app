import { useSceneChat } from "../useSceneChat";
import { renderHook, act } from "@testing-library/react-hooks";

describe.skip("useSceneChat", () => {
  describe("init", () => {
    it("Initialize with empty array of messages", () => {
      const { result } = renderHook(() => useSceneChat());
      expect(result.current.messages).toEqual([]);
    });
  });
  describe("set messages", () => {
    it("should set the messages", () => {
      const { result } = renderHook(() => useSceneChat());
      const dataToSet = [
        {
          from: "Robert",
          text: "",
          timestamp: 0
        },
        {
          from: "Julia",
          text: "",
          timestamp: 0
        }
      ];
      act(() => {
        result.current.setMessages(dataToSet);
      });
      expect(result.current.messages).toEqual(dataToSet);
    });
  });
  describe("add message", () => {
    it("should set the messages", () => {
      const { result } = renderHook(() => useSceneChat());

      act(() => {
        result.current.addMessage({
          from: "Robert",
          text: "",
          timestamp: 0
        });
      });
      expect(result.current.messages).toEqual([
        {
          from: "Robert",
          text: "",
          timestamp: 0
        }
      ]);

      act(() => {
        result.current.addMessage({
          from: "Julia",
          text: "",
          timestamp: 0
        });
      });
      expect(result.current.messages).toEqual([
        {
          from: "Robert",
          text: "",
          timestamp: 0
        },
        {
          from: "Julia",
          text: "",
          timestamp: 0
        }
      ]);
    });
    it("should delete message if exceeds limit", () => {
      const { result } = renderHook(() => useSceneChat());

      act(() => {
        result.current.setMessages(
          new Array(150).map(c => {
            return {
              from: "Robert",
              text: "",
              timestamp: 0
            };
          })
        );
      });

      expect(result.current.messages.length).toEqual(150);
      act(() => {
        result.current.addMessage({
          from: "Julia",
          text: "",
          timestamp: 0
        });
      });
      expect(result.current.messages.length).toEqual(100);
      expect(
        result.current.messages[result.current.messages.length - 1]
      ).toEqual({
        from: "Julia",
        text: "",
        timestamp: 0
      });
    });
  });
});
