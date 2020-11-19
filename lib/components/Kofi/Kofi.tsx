import React from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const Kofi: React.FC<{}> = (props) => {
  let html: string = "";
  const { t } = useTranslate();
  try {
    const kofiwidget2 = (window as any)["kofiwidget2"];
    if (kofiwidget2) {
      kofiwidget2.init(t("donation.kofi"), "#3f51b5", "B0B4AHLJ");
      html = kofiwidget2.getHTML();
    }
  } catch (error) {}

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
