import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
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
        marginBottom: "1rem"
      }}
    >
      <div className="row top-xs">
        <div className="col-xs" style={{ flex: "1 " }}>
          <TextField
            type="text"
            value={props.value}
            onChange={props.onChange}
            label="Aspect"
            multiline={true}
            // margin="normal"
            // variant="filled"
            style={{
              width: "100%",
              height: "100%",
              outline: "none"
            }}
            margin="none"
          />
        </div>
        <div className="col-xs" style={{ flex: "0" }}>
          <IconButton edge="end" onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};
