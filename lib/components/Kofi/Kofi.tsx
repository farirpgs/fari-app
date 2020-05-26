import React from "react";

export const Kofi: React.FC<{}> = (props) => {
  const kofiwidget2 = window["kofiwidget2"];
  kofiwidget2.init("Support Fari on Ko-fi", "#3f51b5", "B0B4AHLJ");
  const html = kofiwidget2.getHTML();

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};
