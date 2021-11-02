import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function CreatePostErrorDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{"Error Creating Post"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textPrimary">
            {'Post was too long. Max 512 characters'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
