import { Button, Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { ChangeEventHandler } from "react";

export const PostIt: React.FC<{
  value: string;
  readOnly?: boolean;
  onChange: ChangeEventHandler<any>;
  onDelete: () => void;
}> = props => {
  return (
    <Paper
      style={{
        minHeight: "5rem",
        padding: "2rem 1.5rem 2rem 1.5rem",
        marginBottom: "1rem",
        background: "#ffffcf"
      }}
    >
      <TextField
        type="text"
        value={props.value}
        onChange={props.onChange}
        className="margin-1"
        multiline={true}
        style={{
          width: "100%",
          height: "100%",
          outline: "none"
        }}
        InputProps={{
          readOnly: props.readOnly,
          style: {
            fontSize: "1.5rem"
          }
        }}
        margin="none"
      />
      {!props.readOnly && (
        <div className="row end-xs">
          <Button onClick={props.onDelete} color="secondary">
            Remove
          </Button>
        </div>
      )}
    </Paper>
  );
};
