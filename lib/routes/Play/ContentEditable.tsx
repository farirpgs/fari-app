import { css } from "emotion";
import React, { useEffect, useRef, useState } from "react";

export const ContentEditable: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}> = (props) => {
  const [html, setHtml] = useState(props.value);
  const $ref = useRef<HTMLDivElement>();

  useEffect(() => {
    setHtml(html);
  }, [props.value]);

  useEffect(() => {
    if ($ref.current && props.autoFocus) {
      $ref.current.focus();
    }
  }, [props.autoFocus]);

  function onChange() {
    if ($ref.current) {
      props.onChange($ref.current.innerHTML);
    }
  }

  const htmlForDiv = props.disabled ? props.value : html;
  return (
    <div
      className={css({
        outline: "none",
      })}
      ref={$ref}
      onInput={() => {
        onChange();
      }}
      onBlur={() => {
        onChange();
      }}
      contentEditable={!props.disabled}
      dangerouslySetInnerHTML={{ __html: htmlForDiv }}
    ></div>
  );
};
ContentEditable.displayName = "ContentEditable";
