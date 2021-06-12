import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import { cryptography } from "@liskhq/lisk-client";
import { NodeInfoContext } from "../../context";
import { createAccount } from "../../utils/transactions/create_account";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function LoadingAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const handleSend = async (event) => {
    const res = await createAccount({
      address: cryptography.getAddressFromBase32Address(props.address),
      name: props.username,
      fee: "0",
      passphrase: props.passphrase,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    await new Promise(r => setTimeout(r, 5500));
    props.handleClose(props.address);
  };

  return (
    <Fragment>
      <Dialog open={props.open} onEntering={handleSend}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Creating Account
          </Typography>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}