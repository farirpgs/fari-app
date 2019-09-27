import { Button, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";

export const LinkShare: React.FC<{ link: string }> = props => {
  const textFieldRef = useRef(undefined);
  const [hasClicked, setHasClicked] = useState(false);
  function copyLink() {
    const input = textFieldRef.current.querySelector("input");
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setHasClicked(true);
  }

  return (
    <div>
      <TextField
        value={props.link}
        variant="outlined"
        ref={textFieldRef}
        margin="normal"
        style={{
          width: "100%"
        }}
      ></TextField>
      <Button variant="contained" color="secondary" onClick={copyLink}>
        {hasClicked ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
};
