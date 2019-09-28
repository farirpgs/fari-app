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
import uuid from "uuid/v4";
import { Banner } from "../../components/Banner/Banner";
import { FudgeDice } from "../../components/Dice/FudgeDice";
import { routerHistory } from "../../components/History/History";
import { LinkShare } from "../../components/LinkShare/LinkShare";
import { Page } from "../../components/Page/Page";
import { PostIt } from "../../components/PostIt/PostIt";
import { SceneService } from "../../services/scene-service/SceneService";
import { IBadGuy } from "../../types/IBadGuy";
import { ICharacter } from "../../types/ICharacter";
import { IScene } from "../../types/IScene";
import { BadGuyCard } from "./BadGuyCard";
import { BadGuyDialog } from "./BadGuyDialog";
import { CharacterCard } from "./CharacterCard";
import { CharacterSelectDialog } from "./CharacterSelectDialog";
import { IPeerAction } from "./IPeerAction";
import { usePeer } from "./usePeer";

const defaultScene = { badGuys: [], characters: {} };

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
  const [isBadGuyModalOpened, setIsBadGuyModalOpened] = useState(false);
  const [isCharacterModalOpened, setIsCharacterModalOpened] = useState(false);
  const [badGuyToModify, setBadGuyToModify] = useState<IBadGuy>(undefined);
  const [isSceneNotFound, setIsSceneNotFound] = useState(false);
  const {
    peerId,
    isConnectedToGM,
    numberOfConnectedPlayers,
    sendToAllPlayers,
    sendToGM
  } = usePeer(
    peerIdFromParams,
    handleDataReceiveFromGM,
    handleDataReceiveFromPlayer
  );
  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";
  const isGM = !peerIdFromParams;
  const isPlayer = !isGM;
  const hasPeerId = !!peerId;
  const playerLink = isGM
    ? `${location.origin}/scenes/play/${sceneId}/${peerId}`
    : "";

  async function loadScene(sceneId: string) {
    if (sceneId) {
      setIsLoading(true);
      if (isGM) {
        const result = await new SceneService().get(sceneId);

        if (!result) {
          setIsSceneNotFound(true);
        } else {
          setScene({
            ...result,
            badGuys: !!result.badGuys ? result.badGuys : [],
            characters: !!result.characters ? result.characters : {}
          });
        }
        setIsLoading(false);
      }
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

  function addAspect() {
    setScene({
      ...scene,
      aspects: [...(scene.aspects || []), ""]
    });
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  function setAspect(content: string, index: number) {
    const aspectCopy = [...(scene.aspects || [])];
    aspectCopy[index] = content;
    setScene({
      ...scene,
      aspects: aspectCopy
    });
  }

  function removeAspect(indexToRemove: number) {
    setScene({
      ...scene,
      aspects: scene.aspects.filter(
        (element, currentIndex) => currentIndex !== indexToRemove
      )
    });
  }

  function onBadGuyDialogClose(updatedBadGuy?: IBadGuy) {
    const shouldUpdateScene = !!updatedBadGuy;

    if (shouldUpdateScene) {
      const isNew = !updatedBadGuy.id;
      if (isNew) {
        addBadGuy(updatedBadGuy);
      } else {
        updateBadGuy(updatedBadGuy);
      }
    }
    setIsBadGuyModalOpened(false);
    setBadGuyToModify(undefined);
  }

  function onCharacterSelectClose(character?: ICharacter) {
    if (!!character) {
      sendCharacterToGM(character);
    }
    setIsCharacterModalOpened(false);
  }

  function addBadGuy(updatedBadGuy: IBadGuy) {
    setScene({
      ...scene,
      badGuys: [...scene.badGuys, { ...updatedBadGuy, id: uuid() }]
    });
  }

  function updateBadGuy(updatedBadGuy: IBadGuy) {
    setScene({
      ...scene,
      badGuys: scene.badGuys.map(badGuy => {
        if (updatedBadGuy.id === badGuy.id) {
          return updatedBadGuy;
        }
        return badGuy;
      })
    });
  }

  function removeBadGuy(updatedBadGuy: IBadGuy) {
    setScene({
      ...scene,
      badGuys: scene.badGuys.filter(badGuy => {
        return badGuy.id !== updatedBadGuy.id;
      })
    });
  }

  function setCharacter(character: ICharacter) {
    setScene(scene => {
      return {
        ...scene,
        characters: {
          ...scene.characters,
          [character._id]: character
        }
      };
    });
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
        setCharacter(action.payload.character);
      }
    };
    reducer[action.type]();
  }

  function sendCharacterToGM(character: ICharacter) {
    sendToGM({
      type: "UPDATE_CHARACTER_IN_GM_SCREEN",
      payload: { character: character }
    });
  }

  useEffect(() => {
    loadScene(sceneId);
  }, [sceneId]);

  useEffect(() => {
    let id = undefined;
    if (isGM) {
      id = setInterval(() => {
        sendToAllPlayers({
          type: "UPDATE_SCENE_IN_PLAYER_SCREEN",
          payload: { scene: scene }
        });
      }, REFRESH_PLAYER_INFO_EVERY_MS);
    }
    return () => {
      clearInterval(id);
    };
  }, [numberOfConnectedPlayers, scene]);

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
        open={isBadGuyModalOpened}
        onClose={onBadGuyDialogClose}
        badGuy={badGuyToModify}
      ></BadGuyDialog>

      <CharacterSelectDialog
        open={isCharacterModalOpened}
        onClose={onCharacterSelectClose}
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
        {isGM && hasPeerId && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="h6" style={{ marginRight: ".5rem" }}>
              {numberOfConnectedPlayers}P
            </span>
            <WifiIcon style={{ color: green[400] }} />
          </div>
        )}
        {isGM && !hasPeerId && (
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
        {isPlayer && isConnectedToGM && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="h6" style={{ marginRight: ".5rem" }}>
              GM
            </span>
            <WifiIcon style={{ color: green[400] }} />
          </div>
        )}
        {isPlayer && !isConnectedToGM && (
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
                  addAspect();
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
                  setBadGuyToModify(undefined);
                  setIsBadGuyModalOpened(true);
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
                  setIsCharacterModalOpened(true);
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
                  onUpdate={badGuy => {
                    updateBadGuy(badGuy);
                  }}
                  onModify={badGuy => {
                    setBadGuyToModify(badGuy);
                    setIsBadGuyModalOpened(true);
                  }}
                  onRemove={badGuy => {
                    removeBadGuy(badGuy);
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
          {Object.keys(scene.characters).map(characterId => {
            return (
              <div className="col-xs-12 col-sm-6 col-md-6" key={characterId}>
                <CharacterCard
                  character={scene.characters[characterId]}
                  onUpdate={character => {}}
                  onRemove={character => {}}
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
                onChange={event => {
                  setAspect(event.target.value, aspectIndex);
                }}
                onDelete={() => {
                  removeAspect(aspectIndex);
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
