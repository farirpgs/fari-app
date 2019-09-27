import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { IBadGuy } from "../../types/IBadGuy";

export const BadGuyDialog: React.FC<{
  open: boolean;
  handleClose: (badGuy?: IBadGuy) => void;
  badGuy?: IBadGuy;
}> = props => {
  const badGuy: IBadGuy = props.badGuy || ({} as any);
  const id = badGuy.id || undefined;
  const [name, setName] = useState("");
  const [aspects, setAspects] = useState("");
  const [skilledAt, setSkilledAt] = useState("");
  const [badAt, setBadAt] = useState("");
  const [stress, setStress] = useState("2");
  const [consequences, setConsequences] = useState("0");

  const resetForm = () => {
    setName("");
    setAspects("");
    setSkilledAt("");
    setBadAt("");
    setStress("2");
    setConsequences("0");
  };

  useEffect(() => {
    if (!!props.badGuy) {
      setName(badGuy.name);
      setAspects(badGuy.aspects);
      setSkilledAt(badGuy.skilledAt);
      setBadAt(badGuy.badAt);
      setStress(badGuy.stress);
      setConsequences(badGuy.consequences);
    }
  }, [props.badGuy]);

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
          autoFocus={!props.badGuy}
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
        {/* TODO: Use Select !!! */}
        <TextField
          value={stress}
          label="Stress Counters"
          variant="filled"
          margin="normal"
          type="number"
          style={{
            width: "100%"
          }}
          onChange={e => {
            setStress(e.target.value);
          }}
        />
        <TextField
          value={consequences}
          label="Consequences Counter"
          variant="filled"
          margin="normal"
          type="number"
          style={{
            width: "100%"
          }}
          onChange={e => {
            setConsequences(e.target.value);
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
            resetForm();
            props.handleClose(
              badGuyFactory(
                id,
                name,
                aspects,
                skilledAt,
                badAt,
                stress,
                badGuy,
                consequences
              )
            );
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

function badGuyFactory(
  id: string,
  name: string,
  aspects: string,
  skilledAt: string,
  badAt: string,
  stress: string,
  badGuy: IBadGuy,
  consequences: string
): IBadGuy {
  return {
    id: id,
    name,
    aspects,
    skilledAt,
    badAt,
    stress: stress || "0",
    stressValues: badGuy.stressValues || {},
    consequences: consequences || "0",
    consequencesValues: badGuy.consequencesValues || {}
  };
}
