import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import React, { useCallback, useEffect, useState } from "react";
import { AppFab } from "../components/AppFab/AppFab";
import { AppLink } from "../components/AppLink/AppLink";
import { AppProgress } from "../components/AppProgress/AppProgress";
import { PostIt } from "../components/Aspect/PostIt";
import { getScenesDb } from "../database/database";
import { IScene } from "../root/AppRouter";
export const Scene: React.FC<{
  match: {
    params: {
      sceneId: string;
    };
  };
}> = props => {
  const { sceneId } = props.match.params;
  const [scene, setScene] = useState<IScene>(undefined);
  const isLoading = scene === undefined;
  const [sceneUpdatedSnackBar, setSceneUpdatedSnackBar] = React.useState({
    visible: false
  });
  const loadScenes = useCallback(async () => {
    const result = await getScenesDb().get<IScene>(sceneId);
    setScene(result);
  }, [sceneId]);
  const saveScene = async () => {
    const result = await getScenesDb().put<IScene>(scene);
    await loadScenes();
    setSceneUpdatedSnackBar({ visible: true });
  };
  const setImages = (images: string) => {
    setScene({
      ...scene,
      images: images
    });
  };
  const addPostIt = () => {
    setScene({
      ...scene,
      postIts: [...(scene.postIts || []), ""]
    });
  };
  const setPostIt = (content: string, index: number) => {
    const postItsCopy = [...(scene.postIts || [])];
    postItsCopy[index] = content;
    setScene({
      ...scene,
      postIts: postItsCopy
    });
  };
  const removePostIt = (indexToRemove: number) => {
    setScene({
      ...scene,
      postIts: scene.postIts.filter(
        (element, currentIndex) => currentIndex !== indexToRemove
      )
    });
  };
  useEffect(() => {
    loadScenes();
  }, [loadScenes]);
  const sceneImages = ((scene || ({} as any)).images || "").split("\n") || [];
  return (
    <div>
      {isLoading && <AppProgress />}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={sceneUpdatedSnackBar.visible}
        onClose={() => setSceneUpdatedSnackBar({ visible: false })}
        message={<span id="message-id">Scene Updated</span>}
      />
      {!isLoading && (
        <div>
          <div className="row">
            <div className="col-xs">
              <div>
                <div className="row between-xs middle-xs">
                  <div className="col-xs">
                    <h1>Your Scene: {scene.name}</h1>
                  </div>
                  <div className="col-xs end-xs">
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={saveScene}
                    >
                      <SaveIcon style={{ marginRight: ".3rem" }} /> Save
                    </Button>
                  </div>
                </div>
                <h2>
                  <AppLink to={`/scenes`}>All Scenes</AppLink>
                </h2>

                <AppFab onClick={addPostIt}>
                  <AddIcon />
                </AppFab>
              </div>
            </div>
          </div>
          <Divider style={{ margin: "1rem 0" }} />
          <div className="row">
            {sceneImages.map((image, sceneIndex) => {
              const isLink = image.indexOf("http") !== -1;
              if (!isLink) {
                return null;
              }
              return (
                <div className="col-xs-3" key={sceneIndex}>
                  <img
                    src={image}
                    style={{
                      width: "100%",
                      height: "auto"
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* <Divider style={{ margin: "1rem 0" }} /> */}
          <div className="row">
            {(scene.postIts || []).map((postIt, postItIndex) => (
              <div className="col-xs-4" key={postItIndex}>
                <PostIt
                  value={postIt}
                  onChange={event => {
                    setPostIt(event.target.value, postItIndex);
                  }}
                  onDelete={() => {
                    removePostIt(postItIndex);
                  }}
                />
              </div>
            ))}
          </div>
          {/* <Divider style={{ margin: "1rem 0" }} /> */}
          <div className="row">
            <div className="col-xs-12">
              <Typography variant="body1">Images</Typography>
              <Typography variant="body2">
                Add one image per line to add images to your scene
              </Typography>
              <br />
              <TextField
                multiline={true}
                rows="15"
                variant="filled"
                value={scene.images || ""}
                style={{
                  width: "100%"
                }}
                onChange={e => {
                  setImages(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
