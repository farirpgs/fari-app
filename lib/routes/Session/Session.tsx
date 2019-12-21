import { Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { SceneService } from "../../services/scene-service/SceneService";
import { IScene } from "../../types/IScene";
import { CharacterService } from "../../services/character-service/CharacterService";
import { SessionPure } from "./SessionPure";
import { makeUseCharacters } from "../Scene/hooks/useCharacters";
import { usePeerHost } from "../Scene/hooks/usePeerHost";

import { useAspects } from "../Scene/hooks/useAspects";
import { useBadGuys } from "../Scene/hooks/useBadGuys";
import { IPeerAction, ISendToPlayersActions } from "../Scene/types/IPeerAction";
import { useStoreContext } from "../../context/store";
import { usePeerConnection } from "../Scene/hooks/usePeerConnection";
import { googleAnalyticsService } from "../../services/injections";
import { Chat } from "../Scene/Chat";
import { useSceneChat } from "../Scene/hooks/useSceneChat";

const defaultScene = { badGuys: [], characters: [] };
const REFRESH_PLAYER_INFO_EVERY_MS = 200;
const useCharacters = makeUseCharacters(new CharacterService());

export const Session: React.FC<{
  match: {
    params: {
      sceneId?: string;
      peerId?: string;
    };
  };
}> = props => {
  const { sceneId, peerId: peerIdFromParams } = props.match.params;
  const isGM = !peerIdFromParams;
  const isPlayer = !isGM;

  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<IScene>(defaultScene);
  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });
  const [isSceneNotFound, setIsSceneNotFound] = useState(false);
  const peerHostManager = usePeerHost(handleDataReceiveFromConnections, {
    disabled: isPlayer
  });
  const peerConnectionManager = usePeerConnection(
    peerIdFromParams,
    handleDataReceiveFromHost,
    { disabled: isGM }
  );
  const aspectsManager = useAspects(setScene);
  const badGuyManager = useBadGuys(setScene);
  const characterManager = useCharacters(peerConnectionManager);
  const sceneChatManager = useSceneChat();

  async function loadScene(sceneId: string) {
    const result = await new SceneService().get(sceneId);
    if (!result) {
      setIsSceneNotFound(true);
    } else {
      setScene({
        ...result,
        badGuys: !!result.badGuys ? result.badGuys : []
      });
      googleAnalyticsService.sendEvent({
        category: "SceneSession",
        action: "Get",
        label: "GM"
      });
    }
    setIsLoading(false);
  }

  async function saveScene() {
    await new SceneService().update(scene);
    googleAnalyticsService.sendEvent({
      category: "SceneSession",
      action: "Update"
    });
    await loadScene(scene._id);
    setSceneUpdatedSnackBar({ visible: true });
  }

  function handleDataReceiveFromHost(action: IPeerAction) {
    const reducer: { [action in ISendToPlayersActions]: Function } = {
      SYNC_SCENE: () => {
        setScene(action.payload.scene);
        characterManager.player.setSceneCharacters(action.payload.characters);
        sceneChatManager.setMessages(action.payload.messages);
        setIsLoading(false);
      }
    };
    reducer[action.type]();
  }

  function handleDataReceiveFromConnections(action: IPeerAction) {
    const reducer = {
      UPDATE_CHARACTER: () => {
        characterManager.gm.addOrUpdateCharacterInScene(
          action.payload.character
        );
      },
      SEND_MESSAGE: () => {
        sceneChatManager.addMessage(action.payload.message);
      }
    };
    reducer[action.type]?.();
  }

  useEffect(() => {
    if (isGM) {
      loadScene(sceneId);
    } else {
      googleAnalyticsService.sendEvent({
        category: "SceneSession",
        action: "Get",
        label: "Player"
      });
    }
  }, [sceneId]);

  useEffect(() => {
    let id = undefined;
    if (isGM) {
      id = setInterval(() => {
        peerHostManager.sendToAllPlayers({
          type: "SYNC_SCENE",
          payload: {
            scene: scene,
            characters: characterManager.global.sceneCharacters,
            messages: sceneChatManager.messages
          }
        });
      }, REFRESH_PLAYER_INFO_EVERY_MS);
    }
    return () => {
      clearInterval(id);
    };
  }, [
    peerHostManager.numberOfConnections,
    scene,
    characterManager.global.sceneCharacters
  ]);

  const store = useStoreContext();
  useEffect(() => {
    if (!!scene.name && isPlayer) {
      store.session.addLiveSession({
        label: scene.name,
        description: scene.description,
        pathname: location.pathname
      });
    }
  }, [scene.name]);

  return (
    <>
      <SessionPure
        sceneId={sceneId}
        scene={scene}
        isLoading={isLoading}
        isGM={isGM}
        isSceneNotFound={isSceneNotFound}
        setScene={setScene}
        saveScene={saveScene}
        aspectsManager={aspectsManager}
        characterManager={characterManager}
        peerHostManager={peerHostManager}
        peerConnectionManager={peerConnectionManager}
        badGuyManager={badGuyManager}
      ></SessionPure>
      <Chat
        messages={sceneChatManager.messages}
        onMessageSend={message => {
          if (isGM) {
            sceneChatManager.addMessage(message);
          } else {
            peerConnectionManager.sendToHost({
              type: "SEND_MESSAGE",
              payload: { message: message }
            });
          }
        }}
      ></Chat>
      {renderSnackBars()}
    </>
  );

  function renderSnackBars() {
    return (
      <>
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={sceneUpdatedSnackBar.visible}
          onClose={() => setSceneUpdatedSnackBar({ visible: false })}
          message={<span id="message-id">Scene Updated</span>}
        />
      </>
    );
  }
};

Session.displayName = "Session";
