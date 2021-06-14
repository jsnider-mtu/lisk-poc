import React, { Fragment, useContext } from "react";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { banAccount } from "../../utils/transactions/ban_account";
import * as api from "../../api";

export default function BanAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1];
  const data = {
    address: props.account.address,
    fee: "0",
    passphrase: passp,
  };

  const handleSend = async (event) => {
    const res = await banAccount({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose();
  };

  return (
    <Fragment>
      <Dialog open={props.open} onEntering={handleSend}>
        <DialogTitle id="alert-dialog-title">{"Banning Account"}</DialogTitle>
        <DialogContent>
          <Grid container justify="center">
            <CircularProgress />
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
