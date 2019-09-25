import { Button, Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { ChangeEventHandler } from "react";

export const PostIt: React.FC<{
  value: string;
  onChange: ChangeEventHandler<any>;
  onDelete: () => void;
}> = props => {
  return (
    <Paper
      style={{
        minHeight: "4rem",
        padding: "1rem 1.5rem 1rem 1.5rem",
        marginBottom: "1rem",
        background: "#ffffcf"
      }}
    >
      <TextField
        type="text"
        value={props.value}
        onChange={props.onChange}
        multiline={true}
        style={{
          width: "100%",
          height: "100%",
          outline: "none"
        }}
        InputProps={{
          style: {
            fontSize: "1.5rem"
          }
        }}
        margin="none"
      />
      <Divider style={{ margin: "1rem 0", height: "0" }}></Divider>
      <div className="row end-xs">
        <Button onClick={props.onDelete} color="secondary">
          Remove
        </Button>
      </div>
    </Paper>
  );
};
