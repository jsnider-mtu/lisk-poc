import React, { Fragment, useContext } from "react";
import {
  Dialog,
  DialogContent,
  Divider,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { cryptography } from "@liskhq/lisk-client";
import { NodeInfoContext } from "../../context";
import { createAccount } from "../../utils/transactions/create_account";
import * as api from "../../api";

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
    // Need to replace with a check for account from API
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
          <Divider />
          <br />
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
