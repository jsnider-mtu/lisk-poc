import React, { Fragment, useContext } from "react";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { unbanAccount } from "../../utils/transactions/unban_account";
import * as api from "../../api";

export default function UnbanAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1];
  const data = {
    address: props.account.address,
    fee: "0",
    passphrase: passp,
  };

  const handleSend = async (event) => {
    const res = await unbanAccount({
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
        <DialogTitle id="alert-dialog-title">{"Unbanning Account"}</DialogTitle>
        <DialogContent>
          <Grid container justify="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
