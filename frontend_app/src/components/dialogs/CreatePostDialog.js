import React, { Fragment, useContext, useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Link,
  Tooltip,
  Card,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { blue } from '@material-ui/core/colors';
import { Link as RouterLink } from "react-router-dom";
import { createPost } from "../../utils/transactions/create_post";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  bigAvatar: {
    backgroundColor: blue[500],
    width: theme.spacing(35),
    height: theme.spacing(35),
  },
  msgLinks: {
    color: blue[500],
  },
  mono: {
    fontFamily: "Monospace",
  },
}));

export default function CreatePostDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  let passp = "ipsum";
  if (document.cookie.includes('passphrase')) {
    passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  }
  const [data, setData] = useState({
    message: "",
    fee: "0",
    passphrase: passp,
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await createPost({
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

  const HASHTAG_FORMATTER = string => {
    return string.split(/(?:([@#][a-z\d-]+)|(https?:\/\/[.a-zA-Z\d-_?&=#@/]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.replace(/^\s+|\s+$/g, '').startsWith('#')){
        return <><Link key={i} className={classes.msgLinks} component={RouterLink} to={`/hashtag/${v.replace(/^\s+|\s+$/g, '').slice(1)}`}>{v}</Link></>;
      } else if (v.replace(/^\s+|\s+$/g, '').startsWith('@')) {
        return <><Link key={i} className={classes.msgLinks} component={RouterLink} to={`/user/${v.replace(/^\s+|\s+$/g, '').slice(1)}`}>{v}</Link></>;
      } else if (v.replace(/^\s+|\s+$/g, '').startsWith('http')) {
        if (/(\.png$)|(\.jpg$)|(\.jpeg$)|(\.gif$)/i.test(v.replace(/^\s+|\s+$/g, ''))) {
          return <><Tooltip disableFocusListener disableTouchListener
                   placement="right"
                   title={
                     <React.Fragment key={i}>
                       <Card key={i} variant="outlined" className={classes.bigAvatar}>
                         <img key={i} alt="" src={v.replace(/^\s+|\s+$/g, '')} width="280" height="280" />
                       </Card>
                     </React.Fragment>
                   }
                 >
                   <Link key={i} className={classes.msgLinks} component={RouterLink} to={{pathname: v.replace(/^\s+|\s+$/g, '')}} target="_blank">{v}</Link>
                 </Tooltip></>;
        } else {
          return <><Link key={i} className={classes.msgLinks} component={RouterLink} to={{pathname: v.replace(/^\s+|\s+$/g, '')}} target="_blank">{v}</Link></>;
        }
      } else if (v.split(/(?:^|\n)```(?:\n|$)/g).length >= 3) {
        return v.split(/(?:^|\n)```(?:\n|$)/g).map((v2,i2)=>{
          if (i2 % 2 !== 0) {
            return <><Typography className={classes.mono}>{v2}</Typography></>;
          } else {
            return v2
          }
        });
      } else {
        return v;
      }
    })
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{"Create Post"}</DialogTitle>
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
          <Button onClick={handleSend}>Create Post</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
