import React from "react";
import { Helmet } from "react-helmet-async";
import { Images } from "../../constants/Images";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const PageMeta: React.FC<{
  title: string | undefined;
  description?: string;
  image?: string;
  noIndex?: boolean;
}> = (props) => {
  const { t } = useTranslate();
  const propsTitle = props.title?.trim();

  const title = propsTitle
    ? `${propsTitle} | Fari `
    : `Fari App | ${t("home-route.meta.title")}`;
  const meta = [];

  meta.push({
    name: "name",
    content: title,
  });
  meta.push({
    name: "og:title",
    content: title,
  });
  meta.push({
    name: "twitter:title",
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

  const imageToUse = props.image ? props.image : Images.banner;
  meta.push({
    name: "image",
    content: imageToUse,
  });
  meta.push({
    name: "og:image",
    content: imageToUse,
  });
  meta.push({
    name: "twitter:image",
    content: imageToUse,
  });

  meta.push({
    name: "og:url",
    content: location.href,
  });

  if (props.noIndex) {
    meta.push({
      name: "robots",
      content: "noindex",
    });
  }

  return <Helmet title={title} meta={meta} />;
};

PageMeta.displayName = "PageMeta";
