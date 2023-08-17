import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Scene } from "../../components/Scene/Scene";
import { Toolbox } from "../../components/Toolbox/Toolbox";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { ICommandResult } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useScene } from "../../hooks/useScene/useScene";
import { DiceDrawer } from "../DiceRoute/components/DiceDrawer";

function SceneRoute() {
  const params = useParams<{ id: string }>();
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene();
  const sceneName = sceneManager.state.scene?.name ?? "";

  const pageTitle = previewContentEditable({ value: sceneName });
  const navigate = useNavigate();
  const logger = useLogger();
  const myBinderManager = useContext(MyBinderContext);

  const [results, setResults] = useState<Array<ICommandResult>>([]);
  const handleClear = useEvent(() => {
    setResults([]);
  });

  useEffect(() => {
    logger.track("view_scene");
  }, []);

  useEffect(() => {
    const sceneToLoad = scenesManager.state.scenes.find(
      (s) => s.id === params.id,
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
            onRoll={(results) => {
              setResults(results.commandResults);
            }}
            onIndexCardUpdate={(indexCard, type) => {
              sceneManager.actions.updateIndexCard(indexCard, type);
            }}
          />
        </Box>
        <Toolbox
          diceFabProps={{
            onRoll(results) {
              const commandResults = results.flatMap((r) => r.commandResults);
              setResults(commandResults);
            },
          }}
        />
        <DiceDrawer results={results} onClear={handleClear} />
      </Page>
    </>
  );
}

SceneRoute.displayName = "SceneRoute";
export default SceneRoute;
