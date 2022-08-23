import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { updateAccount } from "../../utils/transactions/update_account";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function UnfollowAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  const [data, setData] = useState({
    address: props.account.address,
    bio: props.account.socmed.bio,
    avatar: props.account.socmed.avatar,
    displayname: props.account.socmed.displayname,
    fee: "0",
    passphrase: passp,
  });

  if (passp !== data.passphrase) {
    setData({ ...data, passphrase: passp });
  }

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await updateAccount({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose();
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{"Update Account"}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Username"
              value={props.account.socmed.name}
              name="name"
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Display Name"
              value={data.displayname}
              name="displayname"
              onChange={handleChange}
            />
            <TextField
              label="Bio"
              value={data.bio}
              name="bio"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Avatar URL"
              value={data.avatar}
              name="avatar"
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Update Account</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
