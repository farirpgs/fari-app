import React from "react";
import { Helmet } from "react-helmet-async";
import { Images } from "../../constants/Images";

type Metas = React.DetailedHTMLProps<
  React.MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>[];

export const PageMeta: React.FC<{
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}> = (props) => {
  const title = `${props.title?.trim() || "Fate RPG Companion"} | Fari `;
  const meta = [];

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
  }

  if (props.image) {
    meta.push({
      name: "og:image",
      content: props.image,
    });
  } else {
    meta.push({
      name: "og:image",
      content: Images.logo,
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

  return <Helmet title={title} meta={meta} />;
};

PageMeta.displayName = "PageMeta";
