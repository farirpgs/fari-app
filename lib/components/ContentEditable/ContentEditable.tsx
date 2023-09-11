import { Box, BoxProps, useTheme } from "@mui/material";
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
  options: IPreviewContentEditableOptions,
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
ContentEditablePreview.displayName = "ContentEditablePreview";

export const ContentEditable: React.FC<
  {
    value: string;
    sx?: BoxProps["sx"];
    clickable?: boolean;
    onChange?: (value: string, event: FormEvent<HTMLSpanElement>) => void;
    onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement>;
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
      console.log("shouldUpdateInnerHtml", {
        propValue: props.value,
        currentValue: latestHtml.current,
        timeout: timeout.current,
      });
      if ($ref.current) {
        if (!props.value && props.readonly) {
          $ref.current.innerHTML = "&nbsp;";
        } else if (latestHtml.current !== props.value && !timeout.current) {
          const newHtml = DOMPurify.sanitize(
            props.value,
            DomPurifyOptions.onPropsChangeOptions,
          ) as string;
          latestHtml.current = newHtml;
          $ref.current.innerHTML = newHtml;
        }
      }
    },
    [props.value, props.readonly],
  );

  useEffect(function focusOnLoad() {
    if ($ref.current && props.autoFocus) {
      $ref.current.focus();
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    };
  }, []);

  function handleOnChange(e: React.FormEvent<HTMLSpanElement>) {
    if ($ref.current) {
      console.log("handleOnChange");
      clearTimeout(timeout.current);
      timeout.current = undefined;
      const cleanHTML = DOMPurify.sanitize(
        $ref.current.innerHTML,
        DomPurifyOptions.onInputChangeOptions,
      ) as string;

      if (props.noDelay) {
        latestHtml.current = cleanHTML;
        latestProps.current.onChange?.(cleanHTML, e);
      } else {
        timeout.current = setTimeout(() => {
          latestHtml.current = cleanHTML;
          latestProps.current.onChange?.(cleanHTML, e);
          timeout.current = undefined;
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
      <Box
        component="span"
        data-cy={props["dataCy"]}
        id={props.id}
        ref={$ref}
        contentEditable={!props.readonly}
        onInput={handleOnChange}
        onPaste={handleOnPaste}
        onKeyDown={props.onKeyDown}
        sx={{
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
            opacity: "50%",
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
          ...props.sx,
        }}
      />
    </>
  );
};
