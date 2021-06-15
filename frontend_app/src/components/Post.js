import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
  Link,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";
import { red } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { cryptography, Buffer } from "@liskhq/lisk-client";

import LikePostDialog from "./dialogs/LikePostDialog";
import UnlikePostDialog from "./dialogs/UnlikePostDialog";
import SharePostDialog from "./dialogs/SharePostDialog";
import CreateChildPostDialog from "./dialogs/CreateChildPostDialog";
import DeletePostDialog from "./dialogs/DeletePostDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  message: {
    'white-space': 'pre-wrap',
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
  const [openUnlike, setOpenUnlike] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');
  const curUserAddress = cryptography.getAddressFromPassphrase(document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1]).toString('hex');
  const dateobj = new Date(props.item.timestamp);
  const datetime = dateobj.toLocaleString();
  const [likes, setLikes] = useState(props.item.likes.length);
  const [liked, setLiked] = useState(props.item.likes.includes(curUserAddress));
  const [newLike, setNewLike] = useState(false);
  const [newUnlike, setNewUnlike] = useState(false);

  useEffect(() => {
    setLikes(likes => likes + (newLike ? 1 : 0));
    setLikes(likes => likes + (newUnlike ? -1 : 0));
  }, [newLike, newUnlike]);

  let deletebutton;

  if (curUserAddress === props.item.ownerAddress) {
    deletebutton = 
        <IconButton
          aria-label="delete"
          onClick={() => {
            setOpenDelete(true);
          }}
        >
          <DeleteIcon />
        </IconButton>;
  } else {
    deletebutton = <></>;
  }

  let likebutton;

  if (!liked) {
    likebutton =
      <IconButton
        aria-label="like"
        onClick={() => {
          setOpenLike(true);
          setNewUnlike(false);
          setNewLike(true);
          setLiked(true);
        }}
      >
        <FavoriteBorderIcon />
      </IconButton>;
  } else {
    likebutton =
      <IconButton
        aria-label="unlike"
        onClick={() => {
          setOpenUnlike(true);
          setNewLike(false);
          setNewUnlike(true);
          setLiked(false);
        }}
      >
        <FavoriteIcon />
      </IconButton>;
  }

  return (
    <Card className={classes.root}>
      <Link
        component={RouterLink}
        to={`/accounts/${base32UIAddress}`}
      >
        <CardHeader
          avatar={
            <Avatar aria-label="avatar" className={classes.avatar}>
              {props.item.username[0]}
            </Avatar>
          }
          title={props.item.username}
          subheader={datetime}
        />
      </Link>
      <CardContent>
        <Typography className={classes.message} variant="body2" color="textPrimary" component="p">
          {props.item.message}
        </Typography>
      </CardContent>
      <CardActions>
        {likebutton}
        {likes}
        <LikePostDialog
          open={openLike}
          handleClose={() => {
            setOpenLike(false);
          }}
          post={props.item}
        />
        <UnlikePostDialog
          open={openUnlike}
          handleClose={() => {
            setOpenUnlike(false);
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
        {deletebutton}
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
