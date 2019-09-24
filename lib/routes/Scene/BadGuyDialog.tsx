import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, { useState } from "react";
import { IBadGuy } from "../../typings/IBadGuy";
export const BadGuyDialog: React.FC<{
  open: boolean;
  handleClose: (badGuy?: IBadGuy) => void;
  badGuy?: IBadGuy;
}> = props => {
  const badGuy: IBadGuy = props.badGuy || ({} as any);
  const id = badGuy.id || undefined;
  const [name, setName] = useState(badGuy.name || "");
  const [aspects, setAspects] = useState(badGuy.aspects || "");
  const [skilledAt, setSkilledAt] = useState(badGuy.skilledAt || "");
  const [badAt, setBadAt] = useState(badGuy.badAt || "");
  const [stress, setStress] = useState(badGuy.stress || 2);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Who's the bad guy ?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let's create a bad guy
        </DialogContentText>

        <TextField
          value={name}
          label="Name"
          placeholder="Sky Shark"
          variant="filled"
          margin="normal"
          style={{
            width: "100%"
          }}
          onChange={e => {
            setName(e.target.value);
          }}
          autoFocus
        />
        <TextField
          value={aspects}
          label="Aspects"
          placeholder="I'm a Shark, Vulnerable Belly"
          variant="filled"
          margin="normal"
          style={{
            width: "100%"
          }}
          onChange={e => {
            setAspects(e.target.value);
          }}
        />
        <TextField
          value={skilledAt}
          label="Skilled (+2) at"
          placeholder="Flying, biting"
          variant="filled"
          margin="normal"
          style={{
            width: "100%"
          }}
          onChange={e => {
            setSkilledAt(e.target.value);
          }}
        />
        <TextField
          value={badAt}
          label="Bad (-2) at"
          placeholder="Anything that isn't flying or biting"
          variant="filled"
          margin="normal"
          style={{
            width: "100%"
          }}
          onChange={e => {
            setBadAt(e.target.value);
          }}
        />
        <TextField
          value={stress}
          label="Stress Counters"
          variant="filled"
          margin="normal"
          type="number"
          InputProps={{}}
          style={{
            width: "100%"
          }}
          onChange={e => {
            setStress(parseInt(e.target.value));
          }}
        />
      </DialogContent>
      <DialogActions
        style={{
          padding: "1rem 1.5rem"
        }}
      >
        <Button
          onClick={() => {
            props.handleClose();
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.handleClose({
              id: id,
              name,
              aspects,
              skilledAt,
              badAt,
              stress
            });
          }}
          variant="contained"
          color="primary"
        >
          {!!props.badGuy ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
