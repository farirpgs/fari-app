import { css } from "emotion";
import React, { useEffect, useRef } from "react";

export const ContentEditable: React.FC<{
  value: string;
  onChange: (value: string) => void;
  readonly?: boolean;
  autoFocus?: boolean;
}> = (props) => {
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

  return (
    <div
      className={css({
        outline: "none",
        wordBreak: "break-word",
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
    ></div>
  );
};
ContentEditable.displayName = "ContentEditable";
