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
import { IPeerAction } from "../Scene/types/IPeerAction";
import { useStoreContext } from "../../context/store";
import { usePeerConnection } from "../Scene/hooks/usePeerConnection";

const defaultScene = { badGuys: [], characters: [] };
const REFRESH_PLAYER_INFO_EVERY_MS = 1000;
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
  const peerHostManager = usePeerHost(handleDataReceiveFromPlayer, {
    disabled: isPlayer
  });
  const peerConnectionManager = usePeerConnection(
    peerIdFromParams,
    handleDataReceiveFromGM,
    { disabled: isGM }
  );
  const aspectsManager = useAspects(setScene);
  const badGuyManager = useBadGuys(setScene);
  const characterManager = useCharacters(peerConnectionManager);

  async function loadScene(sceneId: string) {
    if (!scene._id) {
      setIsLoading(true);
    }
    const result = await new SceneService().get(sceneId);

    if (!result) {
      setIsSceneNotFound(true);
    } else {
      setScene({
        ...result,
        badGuys: !!result.badGuys ? result.badGuys : []
      });
    }
    setIsLoading(false);
  }

  async function saveScene() {
    await new SceneService().update(scene);

    await loadScene(scene._id);
    setSceneUpdatedSnackBar({ visible: true });
  }

  function handleDataReceiveFromGM(action: IPeerAction) {
    const reducer = {
      UPDATE_SCENE_IN_PLAYER_SCREEN: () => {
        setScene(action.payload.scene);
        characterManager.player.setSceneCharacters(action.payload.characters);
        setIsLoading(false);
      }
    };
    reducer[action.type]();
  }

  function handleDataReceiveFromPlayer(action: IPeerAction) {
    const reducer = {
      UPDATE_CHARACTER_IN_GM_SCREEN: () => {
        characterManager.gm.addOrUpdateCharacterInScene(
          action.payload.character
        );
      }
    };
    reducer[action.type]();
  }

  useEffect(() => {
    if (isGM) {
      loadScene(sceneId);
    }
  }, [sceneId]);

  useEffect(() => {
    let id = undefined;
    if (isGM) {
      id = setInterval(() => {
        peerHostManager.sendToAllPlayers({
          type: "UPDATE_SCENE_IN_PLAYER_SCREEN",
          payload: {
            scene: scene,
            characters: characterManager.global.sceneCharacters
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
