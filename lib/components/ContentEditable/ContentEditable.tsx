import { useTheme } from "@material-ui/core";
import { css } from "emotion";
import React, { useEffect, useRef } from "react";

export const ContentEditable: React.FC<{
  value: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
  autoFocus?: boolean;
  inline?: boolean;
  border?: boolean;
  fullWidth?: boolean;
}> = (props) => {
  const theme = useTheme();
  const $ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!props.value && props.readonly) {
      $ref.current.innerHTML = "&nbsp;";
    } else if ($ref.current.innerHTML !== props.value) {
      $ref.current.innerHTML = props.value;
    }
  }, [props.value]);

  useEffect(() => {
    function focusOnLoad() {
      if ($ref.current && props.autoFocus) {
        $ref.current.focus();
      }
    }
    focusOnLoad();
  }, []);

  function onChange() {
    if ($ref.current) {
      props.onChange($ref.current.innerHTML);
    }
  }

  const Component = props.inline ? "span" : "div";
  return (
    <Component
      className={css({
        outline: "none",
        wordBreak: "break-word",
        display: props.inline ? "inline-block" : "block",
        width: props.fullWidth ? "100%" : undefined,
        borderBottom: props.border
          ? `1px solid ${theme.palette.divider}`
          : undefined,
        img: {
          width: "100%",
          padding: ".5rem 0",
        },
      })}
      ref={$ref}
      onInput={() => {
        onChange();
      }}
      onBlur={() => {
        onChange();
      }}
      contentEditable={!props.readonly}
    ></Component>
  );
};
ContentEditable.displayName = "ContentEditable";

export function sanitizeContentEditable(value: string) {
  return removeHTMLTags(removeNBSP(value)).trim();
}

function removeNBSP(value: string) {
  return value.replace(/&nbsp;/g, " ");
}

function removeHTMLTags(value: string) {
  return value.replace(/<\/?[^>]+(>|$)/g, " ");
}
