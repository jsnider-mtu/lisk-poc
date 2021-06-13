import React, { Fragment, useContext } from "react";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { deletePost } from "../../utils/transactions/delete_post";
import * as api from "../../api";

export default function DeletePostDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('; ').find(r => r.startsWith('passphrase')).split('=')[1];
  const data = {
    postId: props.post.id,
    fee: "0",
    passphrase: passp,
  };

  const handleSend = async (event) => {
    const res = await deletePost({
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
        <DialogTitle id="alert-dialog-title">{"Deleting Post"}</DialogTitle>
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
