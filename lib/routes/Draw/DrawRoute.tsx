import React from "react";
import { DrawObjects } from "../../components/DrawArea/DrawObjects";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const DrawRoute: React.FC = (props) => {
  const { t } = useTranslate();
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
