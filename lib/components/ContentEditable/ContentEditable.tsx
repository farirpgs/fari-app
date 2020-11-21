import { css } from "@emotion/css";
import { useTheme } from "@material-ui/core/styles";
import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from "react";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";

const DOMPurifyOptions = {
  ALLOWED_TAGS: ["br", "img"],
};
const ContentEditableDelay = 125;

export const ContentEditable: React.FC<
  {
    value: string;
    onClick?: () => void;
    onChange?: (value: string, event: React.FormEvent<HTMLDivElement>) => void;
    readonly?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    inline?: boolean;
    border?: boolean;
    id?: string;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const $ref = useRef<HTMLSpanElement | null>(null);
  const timeout = useRef<any | undefined>(undefined);
  const [updating, setUpdating] = useState(false);
  const latestProps = useRef(props);

  const hasCursorPointer = props.readonly && props.onClick;

  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    if ($ref.current) {
      if (!props.value && props.readonly) {
        $ref.current.innerHTML = "&nbsp;";
      } else if ($ref.current.innerHTML !== props.value) {
        const cleanHTML = DOMPurify.sanitize(props.value, DOMPurifyOptions);
        $ref.current.innerHTML = cleanHTML;
      }
    }
  }, [props.value, props.readonly]);

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
      clearTimeout(timeout.current);
      const cleanHTML = DOMPurify.sanitize(
        $ref.current.innerHTML,
        DOMPurifyOptions
      );

      setUpdating(true);
      timeout.current = setTimeout(() => {
        latestProps.current.onChange?.(cleanHTML, e);
        setUpdating(false);
      }, ContentEditableDelay);
    }
  }

  return (
    <span
      data-cy={props["data-cy"]}
      className={css({
        "outline": "none",
        "wordBreak": "break-word",
        "display": "inline-block",
        "width": "100%",
        "cursor": hasCursorPointer ? "pointer" : "text",
        "color": updating ? "grey" : "inherit",
        "transition": !updating
          ? theme.transitions.create("color", { duration: 500 })
          : undefined,
        "borderBottom": props.border
          ? `1px solid ${theme.palette.divider}`
          : undefined,
        "img": {
          maxWidth: "75%",
          padding: ".5rem",
          margin: "0 auto",
          display: "flex",
        },
        "&:empty:before": {
          content: props.placeholder ? `"${props.placeholder}"` : undefined,
        },
      })}
      id={props.id}
      ref={$ref}
      onClick={() => {
        if (props.readonly) {
          props.onClick?.();
        }
      }}
      onInput={(e) => {
        onChange(e);
      }}
      contentEditable={!props.readonly}
    />
  );
};
ContentEditable.displayName = "ContentEditable";

export function sanitizeContentEditable(value: string | undefined) {
  if (!value) {
    return "";
  }
  return removeHTMLTags(removeNBSP(value)).trim();
}

function removeNBSP(value: string) {
  return value.replace(/&nbsp;/g, " ");
}

function removeHTMLTags(value: string) {
  return value.replace(/<\/?[^>]+(>|$)/g, " ");
}
