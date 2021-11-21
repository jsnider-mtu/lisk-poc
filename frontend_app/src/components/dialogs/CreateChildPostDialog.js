import React, { Fragment, useContext, useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { createChildPost } from "../../utils/transactions/create_child_post";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function CreateChildPostDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  const [data, setData] = useState({
    message: "",
    parentPost: props.post.id,
    fee: "0",
    passphrase: passp,
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await createChildPost({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    const res2 = await api.sendTransactions(res.tx);
    if (typeof(res2) === 'undefined') {
      props.handleClose('error');
    } else {
      props.handleClose(res2);
    }
  };

  let charcount;

  if (data.message.length > 512) {
    charcount =
      <Typography variant="caption" color="error">
        {512 - data.message.length}
      </Typography>
  } else {
    charcount =
      <Typography variant="caption" color="textSecondary">
        {512 - data.message.length}
      </Typography>
  }

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{"Create Reply"}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Message"
              value={data.message}
              name="message"
              onChange={handleChange}
              fullWidth
              multiline
              rows={6}
              variant="outlined"
            />
          </form>
          {charcount}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Create Reply</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
