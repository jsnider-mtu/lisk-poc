import React, { Fragment, useContext } from "react";
import {
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { userUnpinPost } from "../../utils/transactions/user_unpin_post";
import * as api from "../../api";

export default function UserUnpinPostDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  const data = {
    postId: props.post.id,
    fee: "0",
    passphrase: passp,
  };

  const handleSend = async (event) => {
    const res = await userUnpinPost({
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
