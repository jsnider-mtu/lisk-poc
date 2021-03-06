import React, { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { passphrase, cryptography } from "@liskhq/lisk-client";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function CreateAccountDialog(props) {
  const [data, setData] = useState({ passphrase: "", address: "", username: "" });
  const classes = useStyles();

  useEffect(() => {
    const pw = passphrase.Mnemonic.generateMnemonic(); // How often could this create duplicate accounts?
    const address = cryptography.getBase32AddressFromPassphrase(pw).toString("hex");
    const username = props.username;
    setData({ passphrase: pw, address, username });
  }, [props.username]);

  const handleSend = async (event) => {
    event.preventDefault();

    props.handleClose(data.address, data.passphrase);
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose} fullWidth>
        <DialogTitle id="alert-dialog-title">
          {"Please save the username and passphrase in your password manager"}
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" className={classes.root}>
            <TextField
              label="Username"
              value={data.username}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Address"
              value={data.address}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Create Account</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

