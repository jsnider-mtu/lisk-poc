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
  Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";
import { blue } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { cryptography } from "@liskhq/lisk-client";
import * as api from "../api";

import LikePostDialog from "./dialogs/LikePostDialog";
import UnlikePostDialog from "./dialogs/UnlikePostDialog";
import SharePostDialog from "./dialogs/SharePostDialog";
import CreateChildPostDialog from "./dialogs/CreateChildPostDialog";
import DeletePostDialog from "./dialogs/DeletePostDialog";

import noavatar from '../noavatar.png';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
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
  bigAvatar: {
    backgroundColor: blue[500],
    width: theme.spacing(35),
    height: theme.spacing(35),
  },
}));

export default function Post(props) {
  const classes = useStyles();
  const [openShare, setOpenShare] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openLike, setOpenLike] = useState(false);
  const [openUnlike, setOpenUnlike] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  const curUserAddress = cryptography.getAddressFromPassphrase(passp).toString('hex');
  const dateobj = new Date(props.item.timestamp);
  const datetime = dateobj.toLocaleString();
  const [likes, setLikes] = useState(props.item.likes.length);
  const [liked, setLiked] = useState(props.item.likes.includes(curUserAddress));
  const [newLike, setNewLike] = useState(false);
  const [newUnlike, setNewUnlike] = useState(false);
  const [parPost, setParPost] = useState({});
  const [shaPost, setShaPost] = useState({});
  const [parPostOwner, setParPostOwner] = useState({});
  const [shaPostOwner, setShaPostOwner] = useState({});
  const [mod, setMod] = useState(false);
  const [postOwner, setPostOwner] = useState({});
  const [shaParPost, setShaParPost] = useState({});

  useEffect(() => {
    let curUser = {};
    async function fetchData() {
      if (props.item.parentPost.length !== 0 && !parPost.hasOwnProperty('ownerAddress')) {
        const parpost = await api.fetchPost(props.item.parentPost);
        setParPost(parpost);
      }
      if (props.item.sharedPost.length !== 0 && !shaPost.hasOwnProperty('ownerAddress')) {
        const shapost = await api.fetchPost(props.item.sharedPost);
        setShaPost(shapost);
      }
      curUser = await api.fetchAccountInfo(curUserAddress);
      setMod(curUser.socmed.moderator);
      if (!postOwner.hasOwnProperty('socmed')) {
        const postowner = await api.fetchAccountInfo(props.item.ownerAddress);
        setPostOwner(postowner);
      }
      if (parPost.hasOwnProperty('ownerAddress')) {
        const parpostowner = await api.fetchAccountInfo(parPost.ownerAddress);
        setParPostOwner(parpostowner);
      }
      if (shaPost.hasOwnProperty('ownerAddress')) {
        if (shaPost.parentPost.length !== 0) {
          const shaparpost = await api.fetchPost(shaPost.parentPost);
          setShaParPost(shaparpost);
        }
        const shapostowner = await api.fetchAccountInfo(shaPost.ownerAddress);
        setShaPostOwner(shapostowner);
      }
    }
    fetchData();
    setLikes(likes => likes + (newLike ? 1 : 0));
    setLikes(likes => likes + (newUnlike ? -1 : 0));
  }, [newLike, newUnlike, curUserAddress, props.item.ownerAddress, props.item.parentPost, props.item.sharedPost, parPost, shaPost, shaParPost, postOwner]);

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
        parentpost =
          <div>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {'Replying to '}
              <Link component={RouterLink} to={`/user/${parPost.username}`}>
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
        <Card variant="outlined" className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="avatar" className={classes.avatar} />
            }
            title={
              <Typography variant="body2" color="textSecondary">
                {'Post deleted'}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              > {'Post deleted'}
            </Typography>
          </CardContent>
        </Card>;
    } else {
      if (parPost.hasOwnProperty('ownerAddress') && parPostOwner.hasOwnProperty('socmed')) {
        parentpost =
          <Card variant="outlined" className={classes.root}>
            <CardHeader
              avatar={
                <Link
                  component={RouterLink}
                  to={`/user/${parPost.username}`}
                >
                  <Tooltip disableFocusListener disableTouchListener
                    placement="left"
                    title={
                      <React.Fragment>
                        <Card variant="outlined" className={classes.bigAvatar}>
                          <img alt="" src={parPostOwner.socmed.avatar || noavatar} width="280" height="280" />
                        </Card>
                      </React.Fragment>
                    }
                  >
                    <Avatar aria-label="avatar" className={classes.avatar} src={parPostOwner.socmed.avatar} />
                  </Tooltip>
                </Link>
              }
              title={
                <Link
                  component={RouterLink}
                  to={`/user/${parPost.username}`}
                >
                  <Typography variant="body2" color="textPrimary">
                    {parPostOwner.socmed.displayname}
                  </Typography>
                  <Typography variant="body2" color="textPrimary">
                    {'@' + parPost.username}
                  </Typography>
                </Link>
              }
              subheader={
                <Link
                  component={RouterLink}
                  to={`/post/${parPost.id}`}
                >
                  <Typography variant="caption" color="textSecondary">
                    {new Date(parPost.timestamp).toLocaleString()}
                  </Typography>
                </Link>
              }
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                > {parPost.message}
              </Typography>
            </CardContent>
          </Card>;
      } else {
        parentpost =
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {"Loading content"}
          </Typography>;
      }
    }
  }

  let sharedpost;

  if (props.item.sharedPost.length === 0) {
    sharedpost = <></>;
  } else {
    if (shaPost.deleted) {
      sharedpost =
        <Card variant="outlined" className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="avatar" className={classes.avatar} />
            }
            title={
              <Typography variant="body2" color="textSecondary">
                {'Post deleted'}
              </Typography>
            }
          />
          <CardContent>
            <Typography className={classes.message} variant="caption" color="textSecondary" gutterBottom>
              {'Post deleted'}
            </Typography>
          </CardContent>
        </Card>;
    } else {
      if (shaPost.hasOwnProperty('ownerAddress') && shaPostOwner.hasOwnProperty('socmed')) {
        if (shaParPost.hasOwnProperty('ownerAddress')) {
          sharedpost =
            <Card variant="outlined" className={classes.root}>
              <CardHeader
                avatar={
                  <Link
                    component={RouterLink}
                    to={`/user/${shaPost.username}`}
                  >
                    <Tooltip disableFocusListener disableTouchListener
                      placement="left"
                      title={
                        <React.Fragment>
                          <Card variant="outlined" className={classes.bigAvatar}>
                            <img alt="" src={shaPostOwner.socmed.avatar || noavatar} width="280" height="280" />
                          </Card>
                        </React.Fragment>
                      }
                    >
                      <Avatar aria-label="avatar" className={classes.avatar} src={shaPostOwner.socmed.avatar} />
                    </Tooltip>
                  </Link>
                }
                title={
                  <Link
                    component={RouterLink}
                    to={`/user/${shaPost.username}`}
                  >
                    <Typography variant="body2" color="textPrimary">
                      {shaPostOwner.socmed.displayname}
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      {'@' + shaPost.username}
                    </Typography>
                  </Link>
                }
                subheader={
                  <Link
                    component={RouterLink}
                    to={`/post/${shaPost.id}`}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {new Date(shaPost.timestamp).toLocaleString()}
                    </Typography>
                  </Link>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {'Replying to '}
                  <Link component={RouterLink} to={`/user/${shaParPost.username}`}>
                    {'@' + shaParPost.username}
                  </Link>
                </Typography>
                <Typography className={classes.message} variant="body1" color="textPrimary" component="p">
                  {shaPost.message}
                </Typography>
              </CardContent>
            </Card>;
        } else {
          sharedpost =
            <Card variant="outlined" className={classes.root}>
              <CardHeader
                avatar={
                  <Link
                    component={RouterLink}
                    to={`/user/${shaPost.username}`}
                  >
                    <Tooltip disableFocusListener disableTouchListener
                      placement="left"
                      title={
                        <React.Fragment>
                          <Card variant="outlined" className={classes.bigAvatar}>
                            <img alt="" src={shaPostOwner.socmed.avatar || noavatar} width="280" height="280" />
                          </Card>
                        </React.Fragment>
                      }
                    >
                      <Avatar aria-label="avatar" className={classes.avatar} src={shaPostOwner.socmed.avatar} />
                    </Tooltip>
                  </Link>
                }
                title={
                  <Link
                    component={RouterLink}
                    to={`/user/${shaPost.username}`}
                  >
                    <Typography variant="body2" color="textPrimary">
                      {shaPostOwner.socmed.displayname}
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      {'@' + shaPost.username}
                    </Typography>
                  </Link>
                }
                subheader={
                  <Link
                    component={RouterLink}
                    to={`/post/${shaPost.id}`}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {new Date(shaPost.timestamp).toLocaleString()}
                    </Typography>
                  </Link>
                }
              />
              <CardContent>
                <Typography className={classes.message} variant="body1" color="textPrimary" component="p">
                  {shaPost.message}
                </Typography>
              </CardContent>
            </Card>;
        }
      } else {
        sharedpost =
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {"Loading content"}
          </Typography>;
      }
    }
  }

  const HASHTAG_FORMATTER = string => {
    return string.split(/(?:^|\s)(?:([@#][a-z\d-]+)|(https?:\/\/[.a-zA-Z\d-_?&=/]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.replace(/^\s+|\s+$/g, '').startsWith('#')){
        return <Link key={i} component={RouterLink} to={`/hashtag/${v.replace(/^\s+|\s+$/g, '').slice(1)}`}>{v}</Link>;
      } else if (v.replace(/^\s+|\s+$/g, '').startsWith('@')) {
        return <Link key={i} component={RouterLink} to={`/user/${v.replace(/^\s+|\s+$/g, '').slice(1)}`}>{v}</Link>;
      } else if (v.replace(/^\s+|\s+$/g, '').startsWith('http')) {
        return <Link key={i} component={RouterLink} to={{pathname: v.replace(/^\s+|\s+$/g, '')}} target="_blank">{' '+v}</Link>;
      } else {
        return v;
      }
    })
  };

  let posttitle;

  if (postOwner.hasOwnProperty('socmed')) {
    posttitle =
      <Link
        component={RouterLink}
        to={`/user/${props.item.username}`}
      >
        <Typography variant="body2" color="textPrimary">
          {postOwner.socmed.displayname}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          {'@' + props.item.username}
        </Typography>
      </Link>;
  } else {
    posttitle =
      <Link
        component={RouterLink}
        to={`/user/${props.item.username}`}
      >
        <Typography variant="body2" color="textPrimary">
          {'@' + props.item.username}
        </Typography>
      </Link>;
  }

  let postavatar;

  if (postOwner.hasOwnProperty('socmed')) {
    postavatar =
      <Link
        component={RouterLink}
        to={`/user/${props.item.username}`}
      >
        <Tooltip disableFocusListener disableTouchListener
          placement="left"
          title={
            <React.Fragment>
              <Card variant="outlined" className={classes.bigAvatar}>
                <img alt="" src={postOwner.socmed.avatar || noavatar} width="280" height="280" />
              </Card>
            </React.Fragment>
          }
        >
          <Avatar aria-label="avatar" className={classes.avatar} src={postOwner.socmed.avatar} />
        </Tooltip>
      </Link>;
  } else {
    postavatar =
      <Link
        component={RouterLink}
        to={`/user/${props.item.username}`}
      >
        <Avatar aria-label="avatar" className={classes.avatar} />
      </Link>;
  }

  return (
    <Card variant="outlined" className={classes.root}>
      <CardHeader
        avatar={postavatar}
        title={posttitle}
        subheader={
          <Link
            component={RouterLink}
            to={`/post/${props.item.id}`}
          >
            <Typography variant="caption" color="textSecondary">
              {datetime}
            </Typography>
          </Link>
        }
      />
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
