import React, { Fragment, useContext } from "react";
import {
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { NodeInfoContext } from "../../context";
import { unbanAccount } from "../../utils/transactions/unban_account";
import * as api from "../../api";

export default function UnbanAccountDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
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
      <Backdrop open={props.open} onEntering={handleSend}>
        <CircularProgress />
      </Backdrop>
    </Fragment>
  );
}
