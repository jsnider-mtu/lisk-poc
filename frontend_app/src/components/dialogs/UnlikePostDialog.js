import React, { Fragment, useContext } from "react";
import {
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { unlikePost } from "../../utils/transactions/unlike_post";
import * as api from "../../api";

export default function UnlikePostDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1];
  const data = {
    postId: props.post.id,
    fee: "0",
    passphrase: passp,
  };

  const handleSend = async (event) => {
    const res = await unlikePost({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose();
  };

  return (
    <Fragment>
      <Backdrop open={props.open} onEntering={handleSend}>
        <CircularProgress />
      </Backdrop>
    </Fragment>
  );
}