import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  IconButton,
  TextField,
  Typography,
  Tabs,
  Tab,
  Fade
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import React, { useState } from "react";
import { Banner } from "../../components/Banner/Banner";
import { FudgeDice } from "../../components/Dice/FudgeDice";
import { routerHistory } from "../../components/History/History";
import { LinkShare } from "../../components/LinkShare/LinkShare";
import { Page } from "../../components/Page/Page";
import { PostIt } from "../../components/PostIt/PostIt";
import { IScene } from "../../types/IScene";
import { BadGuyCard } from "./cards/BadGuyCard";
import { CharacterCard } from "./cards/CharacterCard";
import { BadGuyDialog } from "./dialogs/BadGuyDialog";
import { CharacterSelectDialog } from "./dialogs/CharacterSelectDialog";
import { IAspectsManager } from "./hooks/useAspects";
import { ICharactersManager } from "./hooks/useCharacters";
import { IPeerManager } from "./hooks/usePeer";
import { IBadGuysManager } from "./hooks/useBadGuys";

export const ScenePure: React.FC<{
  sceneId: string;
  scene: IScene;
  isLoading: boolean;
  isSceneNotFound: boolean;
  isGM: boolean;
  setScene: any;
  saveScene: () => Promise<void>;
  aspectsManager: IAspectsManager;
  characterManager: ICharactersManager;
  peerManager: IPeerManager;
  badGuyManager: IBadGuysManager;
}> = props => {
  const {
    // model
    sceneId,
    scene,
    isLoading,
    isGM,
    isSceneNotFound,
    // handlers
    setScene,
    saveScene,
    // managers
    aspectsManager,
    characterManager,
    peerManager,
    badGuyManager
  } = props;

  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = ["Scene", "Characters", "Bad Guys"];
  const isPlayer = !isGM;
  const isCreatingScene = !sceneId;
  const hasPeerId = !!peerManager.peerId;
  const playerLink = isGM
    ? `${location.origin}/scenes/play/${sceneId}/${peerManager.peerId}`
    : "";

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
      <BadGuyDialog
        open={badGuyManager.isBadGuyModalOpened}
        onClose={badGuyManager.onBadGuyDialogClose}
        badGuy={badGuyManager.badGuyToModify}
      ></BadGuyDialog>

      <CharacterSelectDialog
        open={characterManager.player.isCharacterModalOpened}
        onClose={characterManager.player.onCharacterSelectClose}
      ></CharacterSelectDialog>

      {renderPlayerLink()}
      {renderDice()}

      <Tabs
        value={currentTab}
        indicatorColor="primary"
        className="margin-2"
        textColor="primary"
        variant="fullWidth"
        style={{
          background: "#f5f5f5"
        }}
        onChange={(e, clickedTab) => {
          setCurrentTab(clickedTab);
        }}
      >
        {tabs.map((tabName: string) => (
          <Tab key={tabName} label={tabName} />
        ))}
      </Tabs>

      {currentTab === 0 && (
        <Fade in timeout={250}>
          <div>
            {renderSceneNameFieldBox()}
            {renderSceneDescriptionFieldBox()}
            {renderSceneActions()}
            {renderAspectsBox()}
          </div>
        </Fade>
      )}
      {currentTab === 1 && (
        <Fade in timeout={250}>
          <div>
            {renderCharactersActions()}
            {renderCharacterBoxes()}
          </div>
        </Fade>
      )}
      {currentTab === 2 && (
        <Fade in timeout={250}>
          <div>
            {renderBadGuysActions()}
            {renderBadGuyBoxes()}
          </div>
        </Fade>
      )}
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

  function renderSceneNameFieldBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          <div className="col-xs-12">
            {isGM ? (
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
            ) : (
              <div className="h1">{sceneName}</div>
            )}
          </div>
        </div>
      </Box>
    );
  }

  function renderSceneDescriptionFieldBox() {
    return (
      <>
        <Box margin="1rem 0">
          <div className="row">
            <div className="col-xs-12">
              {isGM ? (
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
              ) : (
                <div style={{ fontSize: "1.5em", lineHeight: "1.7em" }}>
                  {sceneDescription}
                </div>
              )}
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
        </div>
      </div>
    );
  }
  function renderCharactersActions() {
    return (
      <div>
        <div className="row center-xs">
          {isPlayer && (
            <div className="col-xs margin-1">
              <Fab
                onClick={() => {
                  characterManager.player.onSendCharacterToGMButtonClick();
                }}
                color="primary"
                variant="extended"
              >
                <AddIcon style={{ marginRight: " .5rem" }} />
                Add a character to the scene
              </Fab>
            </div>
          )}
        </div>
      </div>
    );
  }
  function renderBadGuysActions() {
    return (
      <div>
        <div className="row center-xs">
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
          {characterManager.global.sceneCharacters.map(character => {
            const isForPlayer =
              characterManager.player.playerCharactersIds.indexOf(
                character._id
              ) !== -1;

            return (
              <div className="col-xs-12 col-sm-6 col-md-6" key={character._id}>
                <CharacterCard
                  character={character}
                  readOnly={!isForPlayer || isGM}
                  isGM={isGM}
                  onSync={character => {
                    characterManager.player.syncACharacter(character);
                  }}
                  onRemove={character => {
                    characterManager.gm.removeCharacterFromScene(character);
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

ScenePure.displayName = "ScenePure";
