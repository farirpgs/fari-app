import { Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { routerHistory } from "../../components/History/History";
import { SceneService } from "../../services/scene-service/SceneService";
import { addLiveLink } from "../../singletons/liveLinks";
import { IScene } from "../../types/IScene";
import { useAspects } from "./hooks/useAspects";
import { useBadGuys } from "./hooks/useBadGuys";
import { makeUseCharacters } from "./hooks/useCharacters";
import { usePeer } from "./hooks/usePeer";
import { ScenePure } from "./ScenePure";
import { IPeerAction } from "./types/IPeerAction";
import { CharacterService } from "../../services/character-service/CharacterService";

const defaultScene = { badGuys: [], characters: [] };

const REFRESH_PLAYER_INFO_EVERY_MS = 1000;

const useCharacters = makeUseCharacters(new CharacterService());

export const Scene: React.FC<{
  match: {
    params: {
      sceneId?: string;
      peerId?: string;
    };
  };
}> = props => {
  const { sceneId, peerId: peerIdFromParams } = props.match.params;
  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<IScene>(defaultScene);
  const [sceneCreatedSnackBar, setSceneCreatedSnackBar] = React.useState({
    visible: false
  });
  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });
  const [isSceneNotFound, setIsSceneNotFound] = useState(false);

  const peerManager = usePeer(
    peerIdFromParams,
    handleDataReceiveFromGM,
    handleDataReceiveFromPlayer
  );
  const aspectsManager = useAspects(setScene);
  const badGuyManager = useBadGuys(setScene);
  const characterManager = useCharacters(peerManager);

  const isGM = !peerIdFromParams;

  async function loadScene(sceneId: string) {
    if (sceneId) {
      setIsLoading(true);
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
    } else {
      setIsLoading(false);
    }
  }

  async function saveScene() {
    if (!!scene._id) {
      await new SceneService().update(scene);

      await loadScene(scene._id);
      setSceneUpdatedSnackBar({ visible: true });
    } else {
      const id = await new SceneService().add(scene);

      setSceneCreatedSnackBar({
        visible: true
      });
      routerHistory.push(`/scenes/${id}`);
    }
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
        peerManager.sendToAllPlayers({
          type: "UPDATE_SCENE_IN_PLAYER_SCREEN",
          payload: {
            scene: scene,
            characters: characterManager.global.sceneCharacters
          }
        });
      }, REFRESH_PLAYER_INFO_EVERY_MS);
    }
    if (!isGM && scene) {
      addLiveLink(scene.name, scene.description, location.pathname);
    }
    return () => {
      clearInterval(id);
    };
  }, [
    peerManager.numberOfConnectedPlayers,
    scene,
    characterManager.global.sceneCharacters
  ]);

  return (
    <>
      <ScenePure
        sceneId={sceneId}
        scene={scene}
        isLoading={isLoading}
        isGM={isGM}
        isSceneNotFound={isSceneNotFound}
        setScene={setScene}
        saveScene={saveScene}
        aspectsManager={aspectsManager}
        characterManager={characterManager}
        peerManager={peerManager}
        badGuyManager={badGuyManager}
      ></ScenePure>
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
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={sceneCreatedSnackBar.visible}
          onClose={() => setSceneCreatedSnackBar({ visible: false })}
          message={<span id="message-id">Scene Created</span>}
        />
      </>
    );
  }
};

Scene.displayName = "Scene";
