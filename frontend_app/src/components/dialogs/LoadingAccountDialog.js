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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function LoadingAccountDialog(props) {
  const handleSend = async (event) => {
    await new Promise(r => setTimeout(r, 10000));
    props.handleClose(props.address);
  };

  return (
    <Fragment>
      <Dialog open={props.open} onEntering={handleSend}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Creating Account
          </Typography>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
