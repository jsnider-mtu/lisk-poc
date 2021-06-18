import React, { Fragment, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function SettingsDialog(props) {
  const classes = useStyles();
  const [data, setData] = useState({
    paletteType: props.palType,
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    props.handleClose(data.paletteType);
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={handleSend}>
        <DialogTitle id="alert-dialog-title">{"Settings"}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Palette Type</FormLabel>
            <RadioGroup
              label="paletteType"
              value={data.paletteType}
              name="paletteType"
              onChange={handleChange}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light Mode" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark Mode" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Save Settings</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
