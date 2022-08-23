import Box from "@mui/material/Box";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene } from "../../components/Scene/Scene";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { useScene } from "../../hooks/useScene/useScene";

function SceneRoute() {
  const params = useParams<{ id: string }>();
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene();
  const sceneName = sceneManager.state.scene?.name ?? "";

  const diceManager = useContext(DiceContext);
  const pageTitle = previewContentEditable({ value: sceneName });
  const navigate = useNavigate();
  const logger = useLogger();
  const myBinderManager = useContext(MyBinderContext);

  useEffect(() => {
    logger.track("view_scene");
  }, []);

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === params.id
    );

    if (sceneToLoad) {
      sceneManager.actions.loadScene(sceneToLoad);
    } else {
      navigate("/", { replace: true });
      myBinderManager.actions.open({ folder: "scenes" });
    }
  }, [params.id, scenesManager.state.scenes]);

  return (
    <>
      <PageMeta title={pageTitle} />
      <Page maxWidth="none" sx={{ paddingTop: "2rem" }}>
        <Box px="2rem">
          <Scene
            sceneManager={sceneManager}
            isGM={true}
            canLoad={false}
            onRoll={() => {}}
            onPoolClick={(element) => {
              // diceManager.actions.addOrRemovePoolElement(element);
            }}
            onIndexCardUpdate={(indexCard, type) => {
              sceneManager.actions.updateIndexCard(indexCard, type);
            }}
          />
        </Box>
      </Page>
    </>
  );
}

SceneRoute.displayName = "SceneRoute";
export default SceneRoute;
