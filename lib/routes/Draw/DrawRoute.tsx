import React, { useEffect } from "react";
import { DrawObjects } from "../../components/DrawArea/DrawObjects";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DrawRoute: React.FC = (props) => {
  const { t } = useTranslate();
  const logger = useLogger();

  useEffect(() => {
    logger.info("Route:Draw");
  }, []);

  return (
    <Page>
      <PageMeta
        title={t("draw-route.meta.title")}
        description={t("draw-route.meta.description")}
      />

      <DrawObjects controls="top" fullScreen />
    </Page>
  );
};

DrawRoute.displayName = "DrawRoute";
