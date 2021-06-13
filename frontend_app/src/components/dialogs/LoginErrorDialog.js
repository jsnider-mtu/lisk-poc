import React, { Fragment } from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';

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
