import React, { Fragment, useContext } from "react";
import {
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { demoteAccount } from "../../utils/transactions/demote_account";
import * as api from "../../api";

export default function DemoteAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('; ').pop().split('=')[1];
  const data = {
    address: props.account.address,
    fee: "0",
    passphrase: passp,
  };

  const handleSend = async (event) => {
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
      <Backdrop open={props.open} onEntering={handleSend}>
        <CircularProgress />
      </Backdrop>
    </Fragment>
  );
}
