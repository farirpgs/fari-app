import { renderHook, act } from "@testing-library/react-hooks";
import { makeUseCharacters } from "../useCharacters";
import { usePeer } from "../usePeer";
import { CharacterService } from "../../../../services/character-service/CharacterService";

// tslint:disable: react-hooks-nesting
describe("useCharacters", () => {
  // should default
  describe("GM ", () => {
    describe("Adding a character", () => {
      it("should add a character to the scene if it doesnt exist and update it if it does", () => {
        const peerManagerMock = getPeerManagerMock();
        const characterSerivceMock = getCharacterServiceMock();
        const useCharacters = makeUseCharacters(characterSerivceMock);
        const { result } = renderHook(() => useCharacters(peerManagerMock));

        act(() => {
          // GM receives initial character from player
          result.current.gm.addOrUpdateCharacterInScene({
            _id: "1",
            _rev: "",
            description: "",
            game: "",
            name: "Robert Tremblay"
          });
        });
        expect(result.current.global.sceneCharacters.length).toEqual(1);

        // GM receives updated character from player
        act(() => {
          result.current.gm.addOrUpdateCharacterInScene({
            _id: "1",
            _rev: "",
            description: "updated",
            game: "",
            name: "Robert Tremblay"
          });
        });
        expect(result.current.global.sceneCharacters[0].description).toEqual(
          "updated"
        );

        // GM receives another character from a second player
        act(() => {
          result.current.gm.addOrUpdateCharacterInScene({
            _id: "2",
            _rev: "",
            description: "",
            game: "",
            name: "Rejean Laplante"
          });
        });
        expect(result.current.global.sceneCharacters.length).toEqual(2);

        // GM receives an update from the character of the second player
        act(() => {
          result.current.gm.addOrUpdateCharacterInScene({
            _id: "2",
            _rev: "",
            description: "updated",
            game: "",
            name: "Rejean Laplante"
          });
        });
        expect(result.current.global.sceneCharacters.length).toEqual(2);
      });
    });

    describe("Removing character", () => {
      it("should remove a character from the scene", () => {
        const peerManagerMock = getPeerManagerMock();
        const characterSerivceMock = getCharacterServiceMock();
        const useCharacters = makeUseCharacters(characterSerivceMock);
        const { result } = renderHook(() => useCharacters(peerManagerMock));

        // GM receives initial character from player
        act(() => {
          result.current.gm.addOrUpdateCharacterInScene({
            _id: "1",
            _rev: "",
            description: "",
            game: "",
            name: "Robert Tremblay"
          });
        });
        expect(result.current.global.sceneCharacters.length).toEqual(1);

        // GM removes the character from the scene
        act(() => {
          result.current.gm.removeCharacterFromScene({
            _id: "1",
            _rev: "",
            description: "updated",
            game: "",
            name: "Robert Tremblay"
          });
        });
        expect(result.current.global.sceneCharacters.length).toEqual(0);
      });
    });
  });

  describe("Player", () => {
    describe("Adding a character using the character selection modal", () => {
      it("should add it to the list of ids and send it to the gm", () => {
        const peerManagerMock = getPeerManagerMock();
        const characterSerivceMock = getCharacterServiceMock();
        const useCharacters = makeUseCharacters(characterSerivceMock);
        const { result } = renderHook(() => useCharacters(peerManagerMock));
        const characterToSend = {
          _id: "1",
          _rev: "",
          description: "",
          game: "",
          name: "Robert Tremblay"
        };

        // Player sending first character
        act(() => {
          result.current.player.onSendCharacterToGMButtonClick();
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(true);
        act(() => {
          result.current.player.onCharacterSelectClose(characterToSend);
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(false);
        expect(peerManagerMock.sendToGM).toHaveBeenCalledWith({
          payload: { character: characterToSend },
          type: "UPDATE_CHARACTER_IN_GM_SCREEN"
        });
        expect(result.current.player.playerCharactersIds.length).toEqual(1);

        // Simulating push from GM
        act(() => {
          result.current.player.setSceneCharacters([characterToSend]);
        });
        expect(result.current.global.sceneCharacters.length).toEqual(1);

        // Syncing changes from player's character card
        const updatedCharacter = { ...characterToSend, description: "updated" };
        act(() => {
          result.current.player.syncACharacter(updatedCharacter);
        });
        expect(peerManagerMock.sendToGM).toHaveBeenCalledWith({
          payload: { character: updatedCharacter },
          type: "UPDATE_CHARACTER_IN_GM_SCREEN"
        });
        expect(characterSerivceMock.update).toHaveBeenCalledWith(
          updatedCharacter
        );

        // Player sending another character
        act(() => {
          result.current.player.onSendCharacterToGMButtonClick();
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(true);
        const anotherCharacter = {
          _id: "2",
          _rev: "",
          description: "",
          game: "",
          name: "Rejean Derp"
        };
        act(() => {
          result.current.player.onCharacterSelectClose(anotherCharacter);
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(false);
        expect(peerManagerMock.sendToGM).toHaveBeenCalledWith({
          payload: { character: anotherCharacter },
          type: "UPDATE_CHARACTER_IN_GM_SCREEN"
        });
        expect(result.current.player.playerCharactersIds.length).toEqual(2);

        // Player sending same character
        act(() => {
          result.current.player.onSendCharacterToGMButtonClick();
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(true);

        act(() => {
          result.current.player.onCharacterSelectClose(anotherCharacter);
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(false);
        expect(peerManagerMock.sendToGM).toHaveBeenCalledWith({
          payload: { character: anotherCharacter },
          type: "UPDATE_CHARACTER_IN_GM_SCREEN"
        });
        expect(result.current.player.playerCharactersIds.length).toEqual(2);
      });
    });

    describe("Canceling the character selection modal", () => {
      it("should hide the character selection modal", () => {
        const peerManagerMock = getPeerManagerMock();
        const characterSerivceMock = getCharacterServiceMock();
        const useCharacters = makeUseCharacters(characterSerivceMock);
        const { result } = renderHook(() => useCharacters(peerManagerMock));

        // Opening dialog
        act(() => {
          result.current.player.onSendCharacterToGMButtonClick();
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(true);

        // Closing dialog using cancel button
        act(() => {
          result.current.player.onCharacterSelectClose();
        });
        expect(result.current.player.isCharacterModalOpened).toEqual(false);
      });
    });
  });
});

function getPeerManagerMock(): ReturnType<typeof usePeer> {
  return {
    isConnectedToGM: false,
    numberOfConnectedPlayers: 0,
    peerId: "",
    sendToAllPlayers: jest.fn(),
    sendToGM: jest.fn()
  };
}

function getCharacterServiceMock(): CharacterService {
  return {
    add: jest.fn(),
    get: jest.fn(),
    getAllByGame: jest.fn(),
    remove: jest.fn(),
    update: jest.fn()
  };
}
