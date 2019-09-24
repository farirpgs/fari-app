import {
  Box,
  Button,
  IconButton,
  Snackbar,
  TextField
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import React, { useEffect, useState } from "react";
import uuid from "uuid/v4";
import { routerHistory } from "../..";
import { AppFab } from "../../components/AppFab/AppFab";
import { PostIt } from "../../components/Aspect/PostIt";
import { Page } from "../../components/Page/Page";
import { getScenesDb } from "../../database/database";
import { IBadGuy } from "../../typings/IBadGuy";
import { IScene } from "../../typings/IScene";
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
  const [isCreatingBadGuy, setIsCreatingBadGuy] = useState(false);
  const [badGuyToEdit, setBadGuyToEdit] = useState<IBadGuy>(undefined);

  const sceneName = scene.name || "";
  const sceneDescription = scene.description || "";
  console.log(scene.badGuys);
  const loadScenes = async (sceneId: string) => {
    if (sceneId) {
      setIsLoading(true);
      const result = await getScenesDb().get<IScene>(sceneId);
      setScene(result);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const saveScene = async () => {
    if (!!scene._id) {
      await getScenesDb().put<IScene>(scene);
      await loadScenes(scene._id);
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

  const handleBadGuyUpdate = (updatedBadGuy?: IBadGuy) => {
    setIsCreatingBadGuy(false);
    const isNew = !updatedBadGuy.id;

    if (isNew) {
      setScene({
        ...scene,
        badGuys: [...scene.badGuys, updatedBadGuy]
      });
    } else {
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
  };

  useEffect(() => {
    loadScenes(sceneId);
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
      {renderSnackBarsAndFab()}
      {renderSceneActions()}

      <BadGuyDialog
        open={isCreatingBadGuy}
        handleClose={handleBadGuyUpdate}
        badGuy={badGuyToEdit}
      ></BadGuyDialog>

      {renderSceneNameFieldBox()}
      {renderSceneDescriptionFieldBox()}
      {renderAspectsBox()}
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
        <AppFab onClick={addAspect} variant="extended">
          <AddIcon style={{ marginRight: " .5rem" }} />
          Add an aspect
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
                label="Where are you ?"
                placeholder="In the middle of the woods"
                variant="filled"
                style={{
                  width: "100%"
                }}
                autoFocus
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

  function renderAspectsBox() {
    return (
      <Box margin="1rem 0">
        <div className="row">
          {((scene && scene.aspects) || []).map((aspect, aspectIndex) => (
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

  function renderSceneActions() {
    return (
      <div className="row end-xs">
        <div className="col-xs">
          <Button
            onClick={() => {
              setIsCreatingBadGuy(true);
              setBadGuyToEdit(undefined);
            }}
            color="secondary"
          >
            Add a bad guy
          </Button>
        </div>
      </div>
    );
  }
};
