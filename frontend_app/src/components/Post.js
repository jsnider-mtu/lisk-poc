import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
  Link,
  Divider,
  Button,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";
import { red } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { cryptography, Buffer } from "@liskhq/lisk-client";

import LikePostDialog from "./dialogs/LikePostDialog";
import SharePostDialog from "./dialogs/SharePostDialog";
import CreateChildPostDialog from "./dialogs/CreateChildPostDialog";
import DeletePostDialog from "./dialogs/DeletePostDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Post(props) {
  const classes = useStyles();
  const [openShare, setOpenShare] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openLike, setOpenLike] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');
  const dateobj = new Date(props.item.timestamp);
  const datetime = dateobj.toLocaleString();
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="avatar" className={classes.avatar}>
            {props.item.username[0]}
          </Avatar>
        }
        title={props.item.username}
        subheader={datetime}
      />
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          {props.item.message}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="like"
          onClick={() => {
            setOpenLike(true);
          }}
        >
          <FavoriteIcon />
        </IconButton>
        {props.item.likes.length}
        <LikePostDialog
          open={openLike}
          handleClose={() => {
            setOpenLike(false);
          }}
          post={props.item}
        />
        <IconButton
          aria-label="share"
          onClick={() => {
            setOpenShare(true);
          }}
        >
          <ShareIcon />
        </IconButton>
        {props.item.shares.length}
        <SharePostDialog
          open={openShare}
          handleClose={() => {
            setOpenShare(false);
          }}
          post={props.item}
        />
        <IconButton
          aria-label="reply"
          onClick={() => {
            setOpenReply(true);
          }}
        >
          <ReplyIcon />
        </IconButton>
        {props.item.replies.length}
        <CreateChildPostDialog
          open={openReply}
          handleClose={() => {
            setOpenReply(false);
          }}
          post={props.item}
        />
        <IconButton
          aria-label="delete"
          onClick={() => {
            setOpenDelete(true);
          }}
        >
          <DeleteIcon />
        </IconButton>
        <DeletePostDialog
          open={openDelete}
          handleClose={() => {
            setOpenDelete(false);
          }}
          post={props.item}
        />
      </CardActions>
    </Card>
  );
}
