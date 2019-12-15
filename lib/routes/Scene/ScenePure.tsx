import {
  Box,
  Fab,
  Fade,
  IconButton,
  Tab,
  Tabs,
  TextField
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import React, { useState } from "react";
import { Banner } from "../../components/Banner/Banner";
import { routerHistory } from "../../components/History/History";
import { Page } from "../../components/Page/Page";
import { PostIt } from "../../components/PostIt/PostIt";
import { IScene } from "../../types/IScene";
import { BadGuyCard } from "./cards/BadGuyCard";
import { BadGuyDialog } from "./dialogs/BadGuyDialog";
import { IAspectsManager } from "./hooks/useAspects";
import { IBadGuysManager } from "./hooks/useBadGuys";

export const ScenePure: React.FC<{
  sceneId: string;
  scene: IScene;
  isLoading: boolean;
  isSceneNotFound: boolean;
  setScene: any;
  saveScene: () => Promise<void>;
  aspectsManager: IAspectsManager;
  badGuyManager: IBadGuysManager;
}> = props => {
  const {
    // model
    sceneId,
    scene,
    isLoading,
    isSceneNotFound,
    // handlers
    setScene,
    saveScene,
    // managers
    aspectsManager,
    badGuyManager
  } = props;

  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = ["Scene", `Bad Guys (${scene.badGuys.length})`];

  return (
    <Page
      isLoading={isLoading}
      h1={sceneName}
      backFunction={() => {
        routerHistory.push("/scenes");
      }}
      appBarActions={
        <IconButton
          edge="end"
          onClick={() => {
            saveScene();
          }}
          color="inherit"
        >
          <SaveIcon />
        </IconButton>
      }
      notFound={renderNotFound()}
    >
      <BadGuyDialog
        open={badGuyManager.isBadGuyModalOpened}
        onClose={badGuyManager.onBadGuyDialogClose}
        badGuy={badGuyManager.badGuyToModify}
      ></BadGuyDialog>
      {renderStartSessionCTA()}

      <Tabs
        value={currentTab}
        indicatorColor="primary"
        className="margin-2"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        style={{
          background: "rgba(64, 81, 181, 0.16)"
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
            {renderBadGuysActions()}
            {renderBadGuyBoxes()}
          </div>
        </Fade>
      )}
    </Page>
  );

  function renderNotFound() {
    return (
      isSceneNotFound && (
        <Banner variant="warning">
          <div>
            The scene you are trying to access doesn&apos;t exists.
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
            <TextField
              value={sceneName}
              label="Where are you ?"
              placeholder="In the middle of the woods"
              variant="filled"
              style={{
                width: "100%"
              }}
              helperText={`Pro Tip: Use "-", "/" or "|" to group your scenes in a campaign. E.g. "Book 1 / The Boy in the Iceberg"`}
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

  function renderStartSessionCTA() {
    if (!sceneId) {
      return null;
    }
    return (
      <div>
        <div className="row center-xs">
          <div className="col-xs-12 col-sm-6 margin-1">
            <Fab
              onClick={() => {
                routerHistory.push(`/session/gm/${sceneId}`);
              }}
              variant="extended"
              color="primary"
            >
              <PlayCircleFilledOutlinedIcon style={{ marginRight: " .5rem" }} />
              Start a Game Session
            </Fab>
          </div>
        </div>
      </div>
    );
  }
  function renderSceneActions() {
    return (
      <div>
        <div className="row center-xs">
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
        </div>
      </div>
    );
  }

  function renderBadGuysActions() {
    return (
      <div>
        {scene.badGuys.length === 0 && (
          <Banner variant="info" paper={false}>
            <div className="margin-2">
              There is no bad guys in that scene yet
            </div>
          </Banner>
        )}

        <div className="row center-xs">
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

  function renderAspectsBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {(scene.aspects || []).map((aspect, aspectIndex) => (
            <div className="col-xs-12 col-sm-6 col-md-4" key={aspectIndex}>
              <PostIt
                value={aspect}
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
