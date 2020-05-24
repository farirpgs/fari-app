import React from "react";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterManager } from "./CharacterManager";

export const CharactersRoute: React.FC<{}> = (props) => {
  const { t } = useTranslate();
  return (
    <>
      <PageMeta
        title={t("characters-route.title")}
        description={t("characters-route.description")}
      ></PageMeta>

      <Page>
        <CharacterManager></CharacterManager>
      </Page>
    </>
  );
};

CharactersRoute.displayName = "CharactersRoute";
