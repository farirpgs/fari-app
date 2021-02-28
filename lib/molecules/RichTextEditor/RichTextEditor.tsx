import { css } from "@emotion/css";
import { useTheme } from "@material-ui/core/styles";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import React, { useEffect, useRef, useState } from "react";
import { Id } from "../../domains/id/Id";

export const RichTextEditor: React.FC<{
  value: string;
  onChange(value: string): void;
}> = (p) => {
  const theme = useTheme();
  const [id] = useState(() => {
    return `fari-rich-text-editor-${Id.generate()}`;
  });
  const quill = useRef<Quill>();
  const timeout = useRef<any | undefined>(undefined);
  const latestProps = useRef(p);
  useEffect(() => {
    latestProps.current = p;
  });

  const handleOnChange = latestProps.current.onChange;

  const getCurrentHtml = () => {
    return quill.current?.root.innerHTML ?? "";
  };

  useEffect(function initializeQuillOnLoad() {
    quill.current = new Quill(`#${id}`, {
      theme: "snow",
    });
    quill.current.root.innerHTML = p.value;

    quill.current.on("text-change", () => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        const currentHtml = getCurrentHtml();
        handleOnChange(currentHtml);
      }, 500);
    });
  }, []);

  useEffect(
    function updateQuillOnValueChange() {
      if (quill.current && p.value !== getCurrentHtml()) {
        quill.current.root.innerHTML = p.value;
      }
    },
    [p.value]
  );

  return (
    <div
      id={id}
      className={css({
        background: theme.palette.background.paper,
      })}
    />
  );
};
