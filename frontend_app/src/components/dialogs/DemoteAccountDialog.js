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
import { demoteAccount } from "../../utils/transactions/demote_account";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function DemoteAccountDialog(props) {
  console.log(props);
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    address: props.account.address,
    fee: "0",
    passphrase: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await demoteAccount({
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
        <DialogTitle id="alert-dialog-title">{"Demote Account"}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Demote Account</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
