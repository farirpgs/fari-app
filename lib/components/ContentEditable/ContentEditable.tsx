import { css, cx } from "@emotion/css";
import { useTheme } from "@mui/material/styles";
import DOMPurify, { Config } from "dompurify";
import lowerCase from "lodash/lowerCase";
import startCase from "lodash/startCase";
import truncate from "lodash/truncate";
import React, { FormEvent, useEffect, useRef } from "react";
import { Delays } from "../../constants/Delays";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";

/**
 * `img` tags were allowed in earlier versions of Fari.
 *
 * For that reason, those tags are kept when we render the component using the data from the props.
 * As soon as the user updates the content of the input, we remove the `img` tags by using the options `onInputChangeOptions`
 */
const DomPurifyOptions: {
  onPropsChangeOptions: Config;
  onInputChangeOptions: Config;
} = {
  onPropsChangeOptions: {
    ALLOWED_TAGS: ["br", "i", "b", "img"],
  },
  onInputChangeOptions: {
    ALLOWED_TAGS: ["br", "i", "b"],
  },
};

type IPreviewContentEditableOptions = {
  value: string | undefined;
  length?: number;
  startCase?: boolean;
};

export function previewContentEditable(
  options: IPreviewContentEditableOptions
) {
  if (!options.value) {
    return "";
  }
  const valueWithoutBrTags = options.value.split("<br>").join(" ").trim();

  const div = document.createElement("div");
  div.innerHTML = valueWithoutBrTags;
  const content = div.textContent ?? "";

  const formattedContent = options.startCase
    ? startCase(lowerCase(content))
    : content;

  if (options.length) {
    return truncate(formattedContent, { length: options.length });
  }

  return formattedContent;
}

export const ContentEditablePreview: React.FC<IPreviewContentEditableOptions> =
  React.memo((props) => {
    const content = previewContentEditable({
      value: props.value,
      length: props.length,
    });
    return <>{content}</>;
  });

export const ContentEditable: React.FC<
  {
    value: string;
    className?: string;
    clickable?: boolean;
    onChange?: (value: string, event: FormEvent<HTMLSpanElement>) => void;
    readonly?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    inline?: boolean;
    border?: boolean;
    borderColor?: string;
    underline?: boolean;
    id?: string;
    noDelay?: boolean;
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const $ref = useRef<HTMLSpanElement | null>(null);
  const latestHtml = useRef<string>();
  const timeout = useRef<any | undefined>(undefined);
  const latestProps = useRef(props);
  const hasCursorPointer = props.readonly && props.clickable;

  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(
    function shouldUpdateInnerHtml() {
      if ($ref.current) {
        if (!props.value && props.readonly) {
          $ref.current.innerHTML = "&nbsp;";
        } else if (latestHtml.current !== props.value) {
          const newHtml = DOMPurify.sanitize(
            props.value,
            DomPurifyOptions.onPropsChangeOptions
          ) as string;
          latestHtml.current = newHtml;
          $ref.current.innerHTML = newHtml;
        }
      }
    },
    [props.value, props.readonly]
  );

  useEffect(function focusOnLoad() {
    if ($ref.current && props.autoFocus) {
      $ref.current.focus();
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  function handleOnChange(e: React.FormEvent<HTMLSpanElement>) {
    if ($ref.current) {
      clearTimeout(timeout.current);
      const cleanHTML = DOMPurify.sanitize(
        $ref.current.innerHTML,
        DomPurifyOptions.onInputChangeOptions
      ) as string;

      if (props.noDelay) {
        latestHtml.current = cleanHTML;
        latestProps.current.onChange?.(cleanHTML, e);
      } else {
        timeout.current = setTimeout(() => {
          latestHtml.current = cleanHTML;
          latestProps.current.onChange?.(cleanHTML, e);
        }, Delays.contentEditable);
      }
    }
  }

  function handleOnPaste(e: React.ClipboardEvent<HTMLSpanElement>) {
    e.preventDefault();
    const clipboardDataAsText = e.clipboardData.getData("text/plain");
    document.execCommand("inserttext", false, clipboardDataAsText);
  }

  return (
    <>
      <span
        data-cy={props["data-cy"]}
        id={props.id}
        ref={$ref}
        contentEditable={!props.readonly}
        onInput={handleOnChange}
        onPaste={handleOnPaste}
        className={cx(
          css({
            "outline": "none",
            "wordBreak": "break-word",
            "display": "inline-block",
            "width": "100%",
            "cursor": hasCursorPointer ? "pointer" : "text",
            "color": "inherit",
            "textDecoration": props.underline ? "underline" : undefined,
            "borderBottom": props.border
              ? `1px solid ${props.borderColor ?? theme.palette.divider}`
              : undefined,
            "&:empty:before": {
              color: theme.palette.text.secondary,
              content: props.placeholder ? `"${props.placeholder}"` : undefined,
            },
            "& b": { fontWeight: "bold" },
            "& i": { fontStyle: "italic" },
            "& img": {
              maxWidth: "90% !important" as any,
              padding: ".5rem !important" as any,
              margin: "0 auto !important" as any,
              display: "flex !important" as any,
              position: "relative !important" as any,
              cursor: "pointer !important" as any,
            },
          }),
          props.className
        )}
      />
    </>
  );
};
ContentEditable.displayName = "ContentEditable";
