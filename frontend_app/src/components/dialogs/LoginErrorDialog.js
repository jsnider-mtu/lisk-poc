import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import { cryptography } from "@liskhq/lisk-client";
import { NodeInfoContext } from "../../context";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function LoginErrorDialog(props) {
  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Username does not match passphrase
          </Typography>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
