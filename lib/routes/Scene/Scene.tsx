import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  IconButton,
  Snackbar,
  TextField
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import React, { useEffect, useState } from "react";
import { Banner } from "../../components/Banner/Banner";
import { FudgeDice } from "../../components/Dice/FudgeDice";
import { routerHistory } from "../../components/History/History";
import { LinkShare } from "../../components/LinkShare/LinkShare";
import { Page } from "../../components/Page/Page";
import { PostIt } from "../../components/PostIt/PostIt";
import { SceneService } from "../../services/scene-service/SceneService";
import { IScene } from "../../types/IScene";
import { BadGuyCard } from "./BadGuyCard";
import { BadGuyDialog } from "./BadGuyDialog";
import { CharacterCard } from "./CharacterCard";
import { CharacterSelectDialog } from "./CharacterSelectDialog";
import { useAspects } from "./hooks/useAspects";
import { useBadGuys } from "./hooks/useBadGuys";
import { useCharacters } from "./hooks/useCharacters";
import { usePeer } from "./hooks/usePeer";
import { IPeerAction } from "./types/IPeerAction";
import { addLiveLink } from "../../singletons/liveLinks";

const defaultScene = { badGuys: [], characters: [] };

const REFRESH_PLAYER_INFO_EVERY_MS = 1000;

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
  const characterManager = useCharacters(setScene, peerManager);
  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";

  const isGM = !peerIdFromParams;
  const isPlayer = !isGM;
  const isCreatingScene = !sceneId;
  const hasPeerId = !!peerManager.peerId;
  const playerLink = isGM
    ? `${location.origin}/scenes/play/${sceneId}/${peerManager.peerId}`
    : "";

  async function loadScene(sceneId: string) {
    if (sceneId) {
      setIsLoading(true);
      const result = await new SceneService().get(sceneId);

      if (!result) {
        setIsSceneNotFound(true);
      } else {
        setScene({
          ...result,
          badGuys: !!result.badGuys ? result.badGuys : [],
          characters: !!result.characters ? result.characters : []
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
        setIsLoading(false);
      }
    };
    reducer[action.type]();
  }

  function handleDataReceiveFromPlayer(action: IPeerAction) {
    const reducer = {
      UPDATE_CHARACTER_IN_GM_SCREEN: () => {
        characterManager.addOrUpdateCharacterInScene(
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
          payload: { scene: scene }
        });
      }, REFRESH_PLAYER_INFO_EVERY_MS);
    }
    if (isPlayer && scene) {
      addLiveLink(scene.name, scene.description, location.pathname);
    }
    return () => {
      clearInterval(id);
    };
  }, [peerManager.numberOfConnectedPlayers, scene]);

  return (
    <Page
      isLoading={isLoading}
      h1={sceneName}
      backFunction={() => {
        routerHistory.push(`/scenes`);
      }}
      appBarActions={renderAppBarStatus()}
      notFound={renderNotFound()}
    >
      {renderSnackBars()}

      <BadGuyDialog
        open={badGuyManager.isBadGuyModalOpened}
        onClose={badGuyManager.onBadGuyDialogClose}
        badGuy={badGuyManager.badGuyToModify}
      ></BadGuyDialog>

      <CharacterSelectDialog
        open={characterManager.isCharacterModalOpened}
        onClose={characterManager.onCharacterSelectClose}
      ></CharacterSelectDialog>

      {renderPlayerLink()}
      {renderSceneNameFieldBox()}
      {renderSceneDescriptionFieldBox()}
      {renderDice()}
      {renderSceneActions()}
      {renderBadGuyBoxes()}
      {renderCharacterBoxes()}
      {renderAspectsBox()}
    </Page>
  );

  function renderAppBarStatus() {
    return (
      <>
        {!isCreatingScene && isGM && hasPeerId && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="h6" style={{ marginRight: ".5rem" }}>
              {peerManager.numberOfConnectedPlayers}P
            </span>
            <WifiIcon style={{ color: green[400] }} />
          </div>
        )}
        {!isCreatingScene && isGM && !hasPeerId && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                location.reload();
              }}
            >
              <WifiOffIcon style={{ color: red[400] }} />
            </IconButton>
          </div>
        )}
        {!isCreatingScene && isPlayer && peerManager.isConnectedToGM && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="h6" style={{ marginRight: ".5rem" }}>
              GM
            </span>
            <WifiIcon style={{ color: green[400] }} />
          </div>
        )}
        {!isCreatingScene && isPlayer && !peerManager.isConnectedToGM && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                location.reload();
              }}
            >
              <WifiOffIcon style={{ color: red[400] }} />
            </IconButton>
          </div>
        )}
        {isGM && (
          <IconButton
            edge="end"
            onClick={() => {
              saveScene();
            }}
            color="inherit"
          >
            <SaveIcon />
          </IconButton>
        )}
      </>
    );
  }

  function renderNotFound() {
    return (
      isSceneNotFound && (
        <Banner variant="warning">
          <div>
            The scene you are trying to access doesn't exists.
            <br />
            Are you sure you have the right url ?
          </div>
        </Banner>
      )
    );
  }

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

  function renderSceneNameFieldBox() {
    return (
      <>
        <Box margin="1rem 0">
          <div className="row">
            <div className="col-xs-12">
              <TextField
                value={sceneName}
                label="Where are you ?"
                placeholder="In the middle of the woods"
                InputProps={{
                  readOnly: isPlayer
                }}
                variant="filled"
                style={{
                  width: "100%"
                }}
                onChange={e => {
                  setScene({
                    ...scene,
                    name: e.target.value
                  });
                }}
              />
            </div>
          </div>
        </Box>
      </>
    );
  }

  function renderSceneDescriptionFieldBox() {
    return (
      <>
        <Box margin="1rem 0">
          <div className="row">
            <div className="col-xs-12">
              <TextField
                value={sceneDescription}
                rows={5}
                multiline
                label="What is hapenning ?"
                placeholder="The sun is set and you can hear the sounds of the night waking up..."
                variant="filled"
                InputProps={{
                  readOnly: isPlayer
                }}
                style={{
                  width: "100%"
                }}
                onChange={e => {
                  setScene({
                    ...scene,
                    description: e.target.value
                  });
                }}
              />
            </div>
          </div>
        </Box>
      </>
    );
  }

  function renderDice() {
    if (isCreatingScene) {
      return null;
    }
    return (
      <div className="row center-xs margin-1">
        <div className="col-xs">
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <span>Dice</span>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ width: "100%" }}>
                <FudgeDice></FudgeDice>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    );
  }

  function renderPlayerLink() {
    if (isCreatingScene || isPlayer) {
      return null;
    }
    return (
      <div>
        <div className="row center-xs margin-1">
          <div className="col-xs">
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                disabled={isPlayer || !hasPeerId}
              >
                <ShareIcon style={{ marginRight: "1rem" }}></ShareIcon>
                <span>Player Link</span>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={{ width: "100%" }}>
                  <div className="row">
                    <div className="col-xs">
                      <span>Share the following link to the players</span>
                      <LinkShare link={playerLink}></LinkShare>
                    </div>
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
      </div>
    );
  }
  function renderSceneActions() {
    return (
      <div>
        <div className="row center-xs">
          {isGM && (
            <div className="col-xs-12 col-sm-6 margin-1">
              <Fab
                onClick={() => {
                  aspectsManager.addAspectToScene();
                }}
                variant="extended"
                color="primary"
              >
                <AddIcon style={{ marginRight: " .5rem" }} />
                Add an aspect
              </Fab>
            </div>
          )}
          {isGM && (
            <div className="col-xs-12 col-sm-6 margin-1">
              <Fab
                onClick={() => {
                  badGuyManager.onAddBadBuyButtonClick();
                }}
                color="primary"
                variant="extended"
              >
                <AddIcon style={{ marginRight: " .5rem" }} />
                Add a bad buy
              </Fab>
            </div>
          )}
          {isPlayer && (
            <div className="col-xs-12 col-sm-6 margin-1">
              <Fab
                onClick={() => {
                  characterManager.onSendCharacterToGMButtonClick();
                }}
                color="primary"
                variant="extended"
              >
                <AddIcon style={{ marginRight: " .5rem" }} />
                Send a character to the GM
              </Fab>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderBadGuyBoxes() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {(scene.badGuys || []).map(badGuy => {
            return (
              <div className="col-xs-12 col-sm-6 col-md-6" key={badGuy.id}>
                <BadGuyCard
                  badGuy={badGuy}
                  readOnly={isPlayer}
                  onUpdate={badGuy => {
                    badGuyManager.updateBadGuyInScene(badGuy);
                  }}
                  onModify={badGuy => {
                    badGuyManager.onModifyBadBuyButtonClick(badGuy);
                  }}
                  onRemove={badGuy => {
                    badGuyManager.removeBadGuyFromScene(badGuy);
                  }}
                ></BadGuyCard>
              </div>
            );
          })}
        </div>
      </Box>
    );
  }

  function renderCharacterBoxes() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {scene.characters.map(character => {
            return (
              <div className="col-xs-12 col-sm-6 col-md-6" key={character._id}>
                <CharacterCard
                  character={character}
                  onUpdate={character => {
                    if (isPlayer) {
                      // TODO: TBD
                    }
                    console.log(character);
                  }}
                  onRemove={character => {
                    characterManager.removeCharacterFromScene(character);
                  }}
                ></CharacterCard>
              </div>
            );
          })}
        </div>
      </Box>
    );
  }

  function renderAspectsBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {(scene.aspects || []).map((aspect, aspectIndex) => (
            <div className="col-xs-12 col-sm-6 col-md-6" key={aspectIndex}>
              <PostIt
                value={aspect}
                readOnly={isPlayer}
                onChange={event => {
                  aspectsManager.updateAspectInScene(
                    event.target.value,
                    aspectIndex
                  );
                }}
                onDelete={() => {
                  aspectsManager.removeAspectFromScene(aspectIndex);
                }}
              />
            </div>
          ))}
        </div>
      </Box>
    );
  }
};

Scene.displayName = "Scene";
