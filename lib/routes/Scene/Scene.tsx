import {
  Box,
  Button,
  Checkbox,
  Divider,
  Fab,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  TextField
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import React, { useEffect, useState } from "react";
import uuid from "uuid/v4";
import { routerHistory } from "../..";
import { PostIt } from "../../components/Aspect/PostIt";
import { Page } from "../../components/Page/Page";
import { SceneService } from "../../services/scene-service/SceneService";
import { IBadGuy } from "../../types/IBadGuy";
import { IScene } from "../../types/IScene";
import { BadGuyDialog } from "./BadGuyDialog";

export const Scene: React.FC<{
  match: {
    params: {
      sceneId: string;
    };
  };
}> = props => {
  const { sceneId } = props.match.params;

  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<IScene>({ badGuys: [] });
  const [sceneCreatedSnackBar, setSceneCreatedSnackBar] = React.useState({
    visible: false
  });
  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });
  const [isBadGuyModalOpened, setIsBadGuyModalOpened] = useState(false);
  const [badGuyToModify, setBadGuyToModify] = useState<IBadGuy>(undefined);

  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";

  const loadScene = async (sceneId: string) => {
    if (sceneId) {
      setIsLoading(true);
      const result = await new SceneService().get(sceneId);
      // TODO: Remove badguys backward compatible logic
      setScene({ ...result, badGuys: !!result.badGuys ? result.badGuys : [] });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const saveScene = async () => {
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
  };

  const addAspect = () => {
    setScene({
      ...scene,
      aspects: [...(scene.aspects || []), ""]
    });
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  };

  const setAspect = (content: string, index: number) => {
    const aspectCopy = [...(scene.aspects || [])];
    aspectCopy[index] = content;
    setScene({
      ...scene,
      aspects: aspectCopy
    });
  };

  const removeAspect = (indexToRemove: number) => {
    setScene({
      ...scene,
      aspects: scene.aspects.filter(
        (element, currentIndex) => currentIndex !== indexToRemove
      )
    });
  };

  const handleBadGuyUpdate = (updatedBadGuy?: IBadGuy) => {
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
  };

  const addBadGuy = (updatedBadGuy: IBadGuy) => {
    setScene({
      ...scene,
      badGuys: [...scene.badGuys, { ...updatedBadGuy, id: uuid() }]
    });
  };

  const updateBadGuy = (updatedBadGuy: IBadGuy) => {
    setScene({
      ...scene,
      badGuys: scene.badGuys.map(badGuy => {
        if (updatedBadGuy.id === badGuy.id) {
          return updatedBadGuy;
        }
        return badGuy;
      })
    });
  };

  const removeBadGuy = (updatedBadGuy: IBadGuy) => {
    setScene({
      ...scene,
      badGuys: scene.badGuys.filter(badGuy => {
        return badGuy.id !== updatedBadGuy.id;
      })
    });
  };

  useEffect(() => {
    loadScene(sceneId);
  }, [sceneId]);

  return (
    <Page
      isLoading={isLoading}
      h1={sceneName}
      backFunction={() => {
        routerHistory.push(`/scenes`);
      }}
      appBarActions={
        <IconButton edge="end" onClick={saveScene} color="inherit">
          <SaveIcon />
        </IconButton>
      }
    >
      {renderSnackBars()}

      <BadGuyDialog
        open={isBadGuyModalOpened}
        handleClose={handleBadGuyUpdate}
        badGuy={badGuyToModify}
      ></BadGuyDialog>

      {renderSceneNameFieldBox()}
      {renderSceneDescriptionFieldBox()}
      {renderSceneActions()}
      {renderBadGuyBox()}
      {renderAspectsBox()}
    </Page>
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

  function renderSceneActions() {
    return (
      <div className="row center-xs">
        <div className="col-xs">
          <Fab onClick={addAspect} variant="extended" color="primary">
            <AddIcon style={{ marginRight: " .5rem" }} />
            Add an aspect
          </Fab>
        </div>
        <div className="col-xs">
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
      </div>
    );
  }

  function renderBadGuyBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {(scene.badGuys || []).map(badGuy => {
            const stressCount = parseInt(badGuy.stress);
            const consequenceCount = parseInt(badGuy.consequences);

            return (
              <div className="col-xs-12 col-sm-6 col-md-6" key={badGuy.id}>
                <Paper
                  style={{
                    minHeight: "4rem",
                    padding: "1rem 1.5rem 1rem 1.5rem",
                    marginBottom: "1rem"
                  }}
                >
                  <div className="row center-xs">
                    <div className="col-xs-12">
                      <div
                        style={{
                          textTransform: "uppercase",
                          fontSize: "1.5rem"
                        }}
                      >
                        {badGuy.name}
                      </div>
                    </div>
                  </div>
                  <div className="row center-xs">
                    <div className="col-xs-12">
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: "1.2rem",
                          marginBottom: "1rem"
                        }}
                      >
                        {badGuy.aspects}
                      </div>
                    </div>
                  </div>
                  <Divider style={{ margin: "1rem 0" }}></Divider>
                  <div>
                    <b>Skilled (+2) at:</b> {badGuy.skilledAt}
                  </div>
                  <div>
                    <b>Bad (-2) at:</b> {badGuy.badAt}
                  </div>
                  {!!stressCount && (
                    <Divider style={{ margin: "1rem 0" }}></Divider>
                  )}
                  <div>
                    <div className="row">
                      {[...new Array(stressCount)].map((u, stressIndex) => {
                        return (
                          <div className="col-xs-4" key={stressIndex}>
                            <FormControlLabel
                              label={`Stress #${stressIndex + 1}`}
                              control={
                                <Checkbox
                                  checked={
                                    badGuy.stressValues[stressIndex] || false
                                  }
                                  onChange={e => {
                                    updateBadGuy({
                                      ...badGuy,
                                      stressValues: {
                                        ...badGuy.stressValues,
                                        [stressIndex]: e.target.checked
                                      }
                                    });
                                  }}
                                />
                              }
                            />
                          </div>
                        );
                      })}
                    </div>

                    {!!consequenceCount && (
                      <Divider style={{ margin: "1rem 0" }}></Divider>
                    )}
                    <div>
                      <div className="row">
                        {[...new Array(consequenceCount)].map(
                          (u, consequenceIndex) => {
                            const consequenceShift = (consequenceIndex + 1) * 2;
                            return (
                              <div className="col-xs-12" key={consequenceIndex}>
                                <TextField
                                  value={
                                    badGuy.consequencesValues[
                                      consequenceIndex
                                    ] || ""
                                  }
                                  label={`Consequence (${consequenceShift})`}
                                  variant="filled"
                                  margin="normal"
                                  style={{
                                    width: "100%"
                                  }}
                                  onChange={e => {
                                    updateBadGuy({
                                      ...badGuy,
                                      consequencesValues: {
                                        ...badGuy.consequencesValues,
                                        [consequenceIndex]: e.target.value
                                      }
                                    });
                                  }}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <Divider style={{ margin: "1rem 0" }}></Divider>
                  <div className="row end-xs">
                    <Button
                      onClick={() => {
                        removeBadGuy(badGuy);
                      }}
                      color="secondary"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => {
                        setBadGuyToModify(badGuy);
                        setIsBadGuyModalOpened(true);
                      }}
                      color="secondary"
                    >
                      Modify
                    </Button>
                  </div>
                </Paper>
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
