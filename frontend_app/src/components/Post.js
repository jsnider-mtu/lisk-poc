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
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";
import { blue } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { cryptography, Buffer } from "@liskhq/lisk-client";
import * as api from "../api";

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
    padding: 20,
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
    backgroundColor: blue[500],
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  parentAvatar: {
    backgroundColor: blue[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  hashtag: {
    color: blue[500],
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
  const passp = document.cookie.split('; ').pop();
  const curUserAddress = cryptography.getAddressFromPassphrase(passp.split('=')[1]).toString('hex');
  const dateobj = new Date(props.item.timestamp);
  const datetime = dateobj.toLocaleString();
  const [likes, setLikes] = useState(props.item.likes.length);
  const [liked, setLiked] = useState(props.item.likes.includes(curUserAddress));
  const [newLike, setNewLike] = useState(false);
  const [newUnlike, setNewUnlike] = useState(false);
  const [parPost, setParPost] = useState({});
  const [shaPost, setShaPost] = useState({});
  const [mod, setMod] = useState(false);

  useEffect(() => {
    let curUser = {};
    async function fetchData() {
      if (props.item.parentPost.length !== 0) {
        const parpost = await api.fetchPost(props.item.parentPost);
        setParPost(parpost);
      }
      if (props.item.sharedPost.length !== 0) {
        const shapost = await api.fetchPost(props.item.sharedPost);
        setShaPost(shapost);
      }
      curUser = await api.fetchAccountInfo(curUserAddress);
      setMod(curUser.socmed.moderator);
    }
    fetchData();
    setLikes(likes => likes + (newLike ? 1 : 0));
    setLikes(likes => likes + (newUnlike ? -1 : 0));
  }, [newLike, newUnlike, curUserAddress, props.item.parentPost, props.item.sharedPost]);

  let deletebutton;

  if (curUserAddress === props.item.ownerAddress || mod) {
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

  let parentpost;

  if (props.item.parentPost.length === 0 || props.minimum) {
    if (props.item.parentPost.length === 0) {
      parentpost = <></>;
    } else {
      if (parPost.hasOwnProperty('ownerAddress')) {
        const base32ParAddress = cryptography.getBase32AddressFromAddress(Buffer.from(parPost.ownerAddress, 'hex'), 'lsk').toString('binary');
        parentpost =
          <div>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {'Replying to '}
              <Link component={RouterLink} to={`/accounts/${base32ParAddress}`}>
                {'@' + parPost.username}
              </Link>
            </Typography>
          </div>;
      } else {
        parentpost = <></>;
      }
    }
  } else {
    if (parPost.deleted) {
      parentpost =
        <div>
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={2}>
              <Avatar aria-label="avatar" className={classes.parentAvatar}>
                <AssignmentIndIcon />
              </Avatar>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1" color="textPrimary">
                {'Post deleted'}
              </Typography>
              <br />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                > {'Post deleted'}
              </Typography>
            </Grid>
          </Grid>
        </div>;
    } else {
      if (parPost.hasOwnProperty('ownerAddress')) {
        const base32ParAddress = cryptography.getBase32AddressFromAddress(Buffer.from(parPost.ownerAddress, 'hex'), 'lsk').toString('binary');
        parentpost =
          <div style={{flexGrow: 1}}>
            <Card raised>
              <Link
                component={RouterLink}
                to={`/accounts/${base32ParAddress}`}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <br />
                  </Grid>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item xs={1} />
                  <Grid item xs={1}>
                    <Avatar aria-label="avatar" className={classes.parentAvatar}>
                      <AssignmentIndIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="caption" color="textPrimary">
                      {parPost.username}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(parPost.timestamp).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Link>
              <Link
                component={RouterLink}
                to={`/post/${parPost.id}`}
              >
                <Grid container>
                  <Grid item xs={2} />
                  <Grid item xs={10}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      > {parPost.message}
                    </Typography>
                  </Grid>
                </Grid>
              </Link>
            </Card>
          </div>;
      } else {
        parentpost =
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {"Something went way wrong"}
          </Typography>;
      }
    }
  }

  let sharedpost;

  if (props.item.sharedPost.length === 0) {
    sharedpost = <></>;
  } else {
    let base32ShaAddress;
    if (shaPost.hasOwnProperty('ownerAddress')) {
      const base32ShaAddress = cryptography.getBase32AddressFromAddress(Buffer.from(shaPost.ownerAddress, 'hex'), 'lsk').toString('binary');
    }
    if (shaPost.deleted) {
      sharedpost =
        <Card variant="outlined" className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="avatar" className={classes.avatar}>
                <AssignmentIndIcon />
              </Avatar>
            }
            title={'Post deleted'}
          />
          <CardContent>
            <Typography className={classes.message} variant="body1" color="textSecondary" component="p">
              {'Post deleted'}
            </Typography>
          </CardContent>
        </Card>;
    } else {
      sharedpost =
        <Card variant="outlined" className={classes.root}>
          <Link
            component={RouterLink}
            to={`/accounts/${base32ShaAddress}`}
          >
            <CardHeader
              avatar={
                <Avatar aria-label="avatar" className={classes.avatar}>
                  <AssignmentIndIcon />
                </Avatar>
              }
              title={shaPost.username}
              subheader={new Date(shaPost.timestamp).toLocaleString()}
            />
          </Link>
          <Link
            component={RouterLink}
            to={`/post/${shaPost.id}`}
          >
            <CardContent>
              <Typography className={classes.message} variant="body1" color="textPrimary" component="p">
                {shaPost.message}
              </Typography>
            </CardContent>
          </Link>
        </Card>;
    }
  }

  const HASHTAG_FORMATTER = string => {
    return string.split(/((?:^|\s)(?:#[a-z\d-]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.includes('#')){
        return <Link key={i} component={RouterLink} to={`/hashtag/${v.replace(/^\s+|\s+$/g, '').slice(1)}`}>{v}</Link>;
      } else {
        return v;
      }
    })
  };

  return (
    <Card variant="outlined" className={classes.root}>
      <Link
        component={RouterLink}
        to={`/accounts/${base32UIAddress}`}
      >
        <CardHeader
          avatar={
            <Avatar aria-label="avatar" className={classes.avatar}>
              <AssignmentIndIcon />
            </Avatar>
          }
          title={props.item.username}
          subheader={datetime}
        />
      </Link>
      <CardContent>
        {parentpost}
        <Typography className={classes.message} variant="body1" color="textPrimary" component="p">
          {HASHTAG_FORMATTER(props.item.message)}
        </Typography>
        {sharedpost}
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
          post={props.item.sharedPost.length > 0 ? {id: props.item.sharedPost} : props.item}
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
