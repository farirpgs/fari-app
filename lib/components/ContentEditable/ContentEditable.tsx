import { css, cx } from "@emotion/css";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { useTheme } from "@material-ui/core/styles";
import DOMPurify, { Config } from "dompurify";
import lowerCase from "lodash/lowerCase";
import startCase from "lodash/startCase";
import truncate from "lodash/truncate";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { IDataCyProps } from "../../domains/cypress/types/IDataCyProps";

const DOMPurifyOptions: Config = {
  ALLOWED_TAGS: ["br", "img"],
};

const ContentEditableDelay = 1000;

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

export const ContentEditablePreview: React.FC<IPreviewContentEditableOptions> = React.memo(
  (props) => {
    const content = previewContentEditable({
      value: props.value,
      length: props.length,
    });
    return <>{content}</>;
  }
);

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
  } & IDataCyProps
> = (props) => {
  const theme = useTheme();
  const $ref = useRef<HTMLSpanElement | null>(null);
  const latestHtml = useRef<string>();
  const timeout = useRef<any | undefined>(undefined);
  const latestProps = useRef(props);
  const [image, setImage] = useState<string>();
  const hasCursorPointer = props.readonly && props.clickable;

  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(
    function openImageOnClick() {
      function openImage(e: MouseEvent) {
        const img = e.target as HTMLImageElement;
        setImage(img.src);
      }
      setTimeout(() => {
        $ref.current?.querySelectorAll("img").forEach((i) => {
          i.addEventListener("click", openImage);
        });
      }, 0);
      return () => {
        $ref.current?.querySelectorAll("img").forEach((i) => {
          i.removeEventListener("click", openImage);
        });
      };
    },
    [props.value]
  );

  useEffect(
    function shouldUpdateInnerHtml() {
      if ($ref.current) {
        if (!props.value && props.readonly) {
          $ref.current.innerHTML = "&nbsp;";
        } else if (latestHtml.current !== props.value) {
          const newHtml = DOMPurify.sanitize(
            props.value,
            DOMPurifyOptions
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
        DOMPurifyOptions
      ) as string;

      timeout.current = setTimeout(() => {
        latestHtml.current = cleanHTML;
        latestProps.current.onChange?.(cleanHTML, e);
      }, ContentEditableDelay);
    }
  }

  return (
    <>
      <span
        data-cy={props["data-cy"]}
        id={props.id}
        ref={$ref}
        contentEditable={!props.readonly}
        onInput={handleOnChange}
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
              color: "lightgrey",
              content: props.placeholder ? `"${props.placeholder}"` : undefined,
            },
            "& *": {
              all: "unset !important" as any,
              img: {
                maxWidth: "90%",
                padding: ".5rem",
                margin: "0 auto",
                display: "flex",
                position: "relative",
                cursor: "pointer",
              },
            },
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
      <Dialog
        maxWidth="xl"
        open={!!image}
        onClose={() => {
          setImage(undefined);
        }}
      >
        <DialogContent>
          <img
            src={image}
            className={css({
              maxWidth: "100%",
              maxHeight: "80vh",
            })}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
ContentEditable.displayName = "ContentEditable";
