import Container from "@mui/material/Container";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene } from "../../components/Scene/Scene";
import { DiceContext } from "../../contexts/DiceContext/DiceContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { useScene } from "../../hooks/useScene/useScene";

export const SceneRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene();
  const sceneName = sceneManager.state.scene?.name ?? "";

  const diceManager = useContext(DiceContext);
  const pageTitle = previewContentEditable({ value: sceneName });
  const history = useHistory();
  const logger = useLogger();
  const myBinderManager = useContext(MyBinderContext);

  useEffect(() => {
    logger.track("view_scene");
  }, []);

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === props.match.params.id
    );

    if (sceneToLoad) {
      sceneManager.actions.loadScene(sceneToLoad);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "scenes" });
    }
  }, [props.match.params.id, scenesManager.state.scenes]);

  return (
    <>
      <PageMeta title={pageTitle} />
      <Page>
        <Container>
          <Scene
            sceneManager={sceneManager}
            isGM={true}
            canLoad={false}
            onRoll={() => {}}
            onPoolClick={(element) => {
              diceManager.actions.addOrRemovePoolElement(element);
            }}
            onIndexCardUpdate={(indexCard, type) => {
              sceneManager.actions.updateIndexCard(indexCard, type);
            }}
          />
        </Container>
      </Page>
    </>
  );
};

SceneRoute.displayName = "SceneRoute";
export default SceneRoute;
