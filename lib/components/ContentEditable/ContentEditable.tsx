import { useTheme } from "@material-ui/core";
import DOMPurify from "dompurify";
import { css } from "emotion";
import React, { useEffect, useRef } from "react";

const DOMPurifyOptions = {
  ALLOWED_TAGS: ["br", "img"],
};

export const ContentEditable: React.FC<{
  value: string;
  onChange?: (value: string, event: React.FormEvent<HTMLDivElement>) => void;
  readonly?: boolean;
  autoFocus?: boolean;
  inline?: boolean;
  border?: boolean;
  id?: string;
}> = (props) => {
  const theme = useTheme();
  const $ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if ($ref.current) {
      if (!props.value && props.readonly) {
        $ref.current.innerHTML = "&nbsp;";
      } else if ($ref.current.innerHTML !== props.value) {
        const cleanHTML = DOMPurify.sanitize(props.value, DOMPurifyOptions);
        $ref.current.innerHTML = cleanHTML;
      }
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

  function onChange(e: any) {
    if ($ref.current) {
      const cleanHTML = DOMPurify.sanitize(
        $ref.current.innerHTML,
        DOMPurifyOptions
      );
      props.onChange?.(cleanHTML, e);
    }
  }

  return (
    <span
      className={css({
        outline: "none",
        wordBreak: "break-word",
        display: "inline-block",
        width: "100%",
        borderBottom: props.border
          ? `1px solid ${theme.palette.divider}`
          : undefined,
        cursor: "text",
        img: {
          maxWidth: "75%",
          padding: ".5rem",
          margin: "0 auto",
          display: "flex",
        },
      })}
      id={props.id}
      ref={$ref}
      onInput={(e) => {
        onChange(e);
      }}
      onBlur={(e) => {
        onChange(e);
      }}
      contentEditable={!props.readonly}
    />
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
