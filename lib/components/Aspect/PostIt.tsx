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
        padding: "1rem",
        marginBottom: "1rem"
      }}
    >
      <div className="row middle-xs">
        <div className="col-xs-11">
          <TextField
            type="text"
            value={props.value}
            onChange={props.onChange}
            placeholder="Name of your aspect"
            multiline={true}
            margin="normal"
            variant="outlined"
            style={{
              width: "100%",
              height: "100%",
              fontSize: "2rem",
              outline: "none"
            }}
            InputProps={{ style: { border: "none" } }}
          />
        </div>
        <div className="col-xs-1">
          <IconButton edge="end" onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};
