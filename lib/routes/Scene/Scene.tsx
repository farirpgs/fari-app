import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import SaveIcon from "@material-ui/icons/Save";
import React, { useCallback, useEffect, useState } from "react";
import uuid from "uuid/v4";
import { routerHistory } from "../..";
import { AppFab } from "../../components/AppFab/AppFab";
import { PostIt } from "../../components/Aspect/PostIt";
import { Page } from "../../components/Page/Page";
import { getScenesDb } from "../../database/database";
import { IScene } from "../../root/AppRouter";

export const Scene: React.FC<{
  presentModeEnabled?: boolean;
  match: {
    params: {
      sceneId: string;
    };
  };
}> = props => {
  const { sceneId } = props.match.params;
  const { presentModeEnabled = false } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<IScene>({});
  const [sceneCreatedSnackBar, setSceneCreatedSnackBar] = React.useState({
    visible: false
  });
  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });

  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";
  const isInCreateMode = !scene._id;

  const loadScenes = useCallback(async () => {
    if (sceneId) {
      setIsLoading(true);
      const result = await getScenesDb().get<IScene>(sceneId);
      setScene(result);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [sceneId]);

  const saveScene = async () => {
    if (!!scene._id) {
      await getScenesDb().put<IScene>(scene);
      await loadScenes();
      setSceneUpdatedSnackBar({ visible: true });
    } else {
      const newId = uuid();
      await getScenesDb().put<IScene>({
        _id: newId,
        ...scene
      });
      setSceneCreatedSnackBar({
        visible: true
      });
      routerHistory.push(`/scenes/${newId}`);
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

  useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  return (
    <Page
      isLoading={isLoading}
      h1={presentModeEnabled ? "" : sceneName}
      backFunction={() => {
        if (presentModeEnabled) {
          routerHistory.push(`/scenes/${sceneId}`);
        } else {
          routerHistory.push(`/scenes`);
        }
      }}
      appBarActions={
        <>
          {!isInCreateMode && !presentModeEnabled && (
            <IconButton
              edge="end"
              color="inherit"
              style={{
                marginRight: "1rem"
              }}
              onClick={() => {
                routerHistory.push(`/scenes/${sceneId}/present`);
              }}
            >
              <PresentToAllIcon />
            </IconButton>
          )}
          {!presentModeEnabled && (
            <IconButton edge="end" onClick={saveScene} color="inherit">
              <SaveIcon />
            </IconButton>
          )}
        </>
      }
    >
      {presentModeEnabled && (
        <>
          {renderTitlePresentationBox()}
          {renderAspectsPresentationBox()}
          {renderSceneDescriptionPresentationBox()}
        </>
      )}
      {!presentModeEnabled && (
        <>
          {renderSnackBarsAndFab()}

          {renderSceneNameFieldBox()}
          {renderSceneDescriptionFieldBox()}
          {renderAspectsBox()}
        </>
      )}
    </Page>
  );

  function renderSnackBarsAndFab() {
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
        <AppFab onClick={addAspect}>
          <AddIcon />
        </AppFab>
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
                label="Name of your scene"
                variant="outlined"
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
                rows={10}
                multiline
                label="Description"
                variant="outlined"
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

  function renderSceneDescriptionPresentationBox() {
    return (
      <Box margin="1rem 0">
        <Typography
          variant="body1"
          component="div"
          style={{
            fontSize: "1.3rem"
          }}
        >
          <div className="row center-xs">
            {sceneDescription.split("\n").map((line, lineIndex) => {
              const isLink = line.startsWith("http");
              const isEmpty = line.trim().length === 0;
              if (isLink) {
                const imageLink = line.trim();
                return (
                  <div
                    className="col-xs-12 col-md-4"
                    key={lineIndex}
                    style={{ margin: "2rem 0" }}
                  >
                    <img
                      src={imageLink}
                      style={{
                        width: "100%",
                        height: "auto"
                      }}
                    />
                  </div>
                );
              } else if (isEmpty) {
                return (
                  <div
                    className="col-xs-12"
                    key={lineIndex}
                    style={{ height: "1rem" }}
                  />
                );
              } else {
                return (
                  <div
                    className="col-xs-12"
                    key={lineIndex}
                    style={{
                      textAlign: "left"
                    }}
                  >
                    {line}
                  </div>
                );
              }
            })}
          </div>
        </Typography>
      </Box>
    );
  }

  function renderAspectsBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {((scene && scene.aspects) || []).map((aspect, aspectIndex) => (
            <div className="col-xs-12 col-md-6" key={aspectIndex}>
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

  function renderTitlePresentationBox() {
    return (
      <Box margin="1rem 0">
        <div className="row center-xs">
          <div className="col-xs">
            <h1>{sceneName}</h1>
          </div>
        </div>
      </Box>
    );
  }

  function renderAspectsPresentationBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {((scene && scene.aspects) || []).map((aspect, aspectIndex) => (
            <div
              className="col-xs-6 col-md-4"
              key={aspectIndex}
              style={{ display: "flex" }}
            >
              <Paper
                style={{
                  minHeight: "4rem",
                  width: "100%",
                  padding: "1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2rem"
                }}
              >
                <div className="row">
                  <div className="col-xs">
                    <div style={{ textAlign: "center" }}>{aspect}</div>
                  </div>
                </div>
              </Paper>
            </div>
          ))}
        </div>
      </Box>
    );
  }
};
