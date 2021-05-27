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
// import { createNFTToken } from "../../utils/transactions/create_nft_token";
import { sharePost } from "../../utils/transactions/share_post";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function SharePostDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    postId: props.post.id,
    message: "",
    fee: "0",
    passphrase: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await sharePost({
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
        <DialogTitle id="alert-dialog-title">{"Share Post"}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Message"
              value={data.message}
              name="message"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Shared Post"
              value={data.postId}
              name="postId"
              onChange={handleChange}
              fullWidth
            />
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
          <Button onClick={handleSend}>Share Post</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
