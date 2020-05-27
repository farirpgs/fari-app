import React from "react";

export const Kofi: React.FC<{}> = (props) => {
  let html: string = "";

  try {
    const kofiwidget2 = window["kofiwidget2"];
    if (kofiwidget2) {
      kofiwidget2.init("Support Fari on Ko-fi", "#3f51b5", "B0B4AHLJ");
      html = kofiwidget2.getHTML();
    }
  } catch (error) {}

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};
