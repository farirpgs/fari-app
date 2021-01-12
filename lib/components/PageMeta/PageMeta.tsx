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
  const title = `${props.title?.trim() || "Fate RPG Companion"} | Fari `;
  const meta = [];

  meta.push({
    name: "twitter:title",
    content: title,
  });

  meta.push({
    name: "og:title",
    content: title,
  });

  if (props.description) {
    meta.push({
      name: "description",
      content: props.description,
    });
    meta.push({
      name: "og:description",
      content: props.description,
    });
    meta.push({
      name: "twitter:description",
      content: props.description,
    });
  }

  if (props.noIndex) {
    meta.push({
      name: "robots",
      content: "noindex",
    });
  }

  meta.push({
    name: "og:url",
    content: location.href,
  });
  meta.push({
    name: "twitter:url",
    content: location.href,
  });

  return <Helmet title={title} meta={meta} />;
};

PageMeta.displayName = "PageMeta";
