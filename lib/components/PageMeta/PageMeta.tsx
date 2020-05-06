import React from "react";
import { Helmet } from "react-helmet-async";

type Metas = React.DetailedHTMLProps<
  React.MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>[];

export const PageMeta: React.FC<{
  title: string;
  description?: string;
  noIndex?: boolean;
}> = (props) => {
  const title = `Fari | ${props.title?.trim() || "Fate RPG Companion"}`;
  const metas = [];
  if (props.description) {
    metas.push({
      name: "description",
      content: props.description,
    });
  }
  if (props.noIndex) {
    metas.push({
      name: "robots",
      content: "noindex",
    });
  }
  return <Helmet title={title} meta={metas}></Helmet>;
};

PageMeta.displayName = "PageMeta";
