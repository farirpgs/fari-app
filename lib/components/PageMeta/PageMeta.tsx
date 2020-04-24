import React from "react";
import { Helmet } from "react-helmet-async";

type Metas = React.DetailedHTMLProps<
  React.MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>[];

export const PageMeta: React.FC<{ title: string; description?: string }> = (
  props
) => {
  const title = `Fari | ${props.title || "Fate RPG Companion"}`;
  const metas: Metas = props.description
    ? [
        {
          name: "description",
          content: props.description,
        },
      ]
    : [];
  return <Helmet title={title} meta={metas}></Helmet>;
};

PageMeta.displayName = "PageMeta";
