"use client";
import { Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { Page } from "../../components/Page/Page";
import { Scene } from "../../components/Scene/Scene";
import { Toolbox } from "../../components/Toolbox/Toolbox";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { ICommandResult } from "../../domains/dice/Dice";
import { useEvent } from "../../hooks/useEvent/useEvent";
import { useScene } from "../../hooks/useScene/useScene";
import { DiceDrawer } from "../DiceRoute/components/DiceDrawer";

export function SceneRoute() {
  const params = useParams();
  const scenesManager = useContext(ScenesContext);
  const sceneManager = useScene();
  const sceneName = sceneManager.state.scene?.name ?? "";

  const pageTitle = previewContentEditable({ value: sceneName });
  const router = useRouter();
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
      router.replace("/");
      myBinderManager.actions.open({ folder: "scenes" });
    }
  }, [params.id, scenesManager.state.scenes]);

  return (
    <>
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
