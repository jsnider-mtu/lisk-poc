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
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";
import PushPinIcon from "@mui/icons-material/PushPin";
import { blue } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { cryptography } from "@liskhq/lisk-client";
//import { LinkPreview } from '@dhaiwat10/react-link-preview';
import * as api from "../api";

import LikePostDialog from "./dialogs/LikePostDialog";
import UnlikePostDialog from "./dialogs/UnlikePostDialog";
import SharePostDialog from "./dialogs/SharePostDialog";
import CreateChildPostDialog from "./dialogs/CreateChildPostDialog";
import DeletePostDialog from "./dialogs/DeletePostDialog";
import UndeletePostDialog from "./dialogs/UndeletePostDialog";
import CreatePostErrorDialog from "./dialogs/CreatePostErrorDialog";
import ModPinPostDialog from "./dialogs/ModPinPostDialog";
import ModUnpinPostDialog from "./dialogs/ModUnpinPostDialog";
import UserPinPostDialog from "./dialogs/UserPinPostDialog";
import UserUnpinPostDialog from "./dialogs/UserUnpinPostDialog";

import noavatar from '../noavatar.png';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
  },
  content: {
    maxHeight: 400,
    overflow: 'auto',
  },
  parentcontent: {
    'padding-left': 20,
    display: 'inline-block',
  },
  parentpadding: {
    padding: 20,
    'white-space': 'pre-wrap',
  },
  message: {
	'white-space': 'pre',
	'white-space': 'pre-line',
	'white-space': '-pre-wrap',
	'white-space': '-o-pre-wrap',
	'white-space': '-moz-pre-wrap',
	'white-space': '-hp-pre-wrap',
	'word-wrap': 'break-word',
    'white-space': 'pre-wrap',
    'padding-left': 20,
    'padding-right': 20,
    'padding-bottom': 20,
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
  msgLinks: {
    color: blue[500],
  },
}));

export default function Post(props) {
  const classes = useStyles();
  const [openShare, setOpenShare] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openLike, setOpenLike] = useState(false);
  const [openUnlike, setOpenUnlike] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUndelete, setOpenUndelete] = useState(false);
  const [openModPin, setOpenModPin] = useState(false);
  const [openModUnpin, setOpenModUnpin] = useState(false);
  const [openUserPin, setOpenUserPin] = useState(false);
  const [openUserUnpin, setOpenUserUnpin] = useState(false);
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
  const [parShaPost, setParShaPost] = useState({});

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
      if (parPost.hasOwnProperty('ownerAddress') && !parPostOwner.hasOwnProperty('socmed')) {
        if (parPost.sharedPost.length !== 0 && !parShaPost.hasOwnProperty('ownerAddress')) {
          const parshapost = await api.fetchPost(parPost.sharedPost);
          setParShaPost(parshapost);
        }
        const parpostowner = await api.fetchAccountInfo(parPost.ownerAddress);
        setParPostOwner(parpostowner);
      }
      if (shaPost.hasOwnProperty('ownerAddress') && !shaPostOwner.hasOwnProperty('socmed')) {
        if (shaPost.parentPost.length !== 0 && !shaParPost.hasOwnProperty('ownerAddress')) {
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

  let pinbutton;

  if (mod) {
    if (!props.item.modpinned) {
      pinbutton =
        <IconButton
          aria-label="modpin"
          onClick={() => {
            setOpenModPin(true);
          }}
        >
          <PushPinIcon />
        </IconButton>;
    } else {
      pinbutton =
        <IconButton
          aria-label="modunpin"
          onClick={() => {
            setOpenModUnpin(true);
          }}
        >
          <PushPinIcon />
          <Typography variant="caption">
            {'Pinned on All Page'}
          </Typography>
        </IconButton>;
    }
  } else if (curUserAddress === props.item.ownerAddress) {
    if (!props.item.userpinned) {
      pinbutton =
        <IconButton
          aria-label="userpin"
          onClick={() => {
            setOpenUserPin(true);
          }}
        >
          <PushPinIcon />
        </IconButton>;
    } else {
      pinbutton =
        <IconButton
          aria-label="userunpin"
          onClick={() => {
            setOpenUserUnpin(true);
          }}
        >
          <PushPinIcon />
          <Typography variant="caption">
            {'Pinned on your page'}
          </Typography>
        </IconButton>;
    }
  } else {
    pinbutton = <></>;
  }

  let deletebutton;

  if (!props.item.deleted && (curUserAddress === props.item.ownerAddress || mod)) {
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

  let undeletebutton;

  if (props.item.deleted && mod) {
    undeletebutton =
      <IconButton
        aria-label="undelete"
        onClick={() => {
          setOpenUndelete(true);
        }}
      >
        <RestoreFromTrashIcon />
      </IconButton>
  } else {
    undeletebutton = <></>;
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
      } else {
        return v;
      }
    })
  };

  let parentpost;

  if (props.item.parentPost.length === 0 || props.minimum) {
    if (props.item.parentPost.length === 0) {
      parentpost = <></>;
    } else {
      if (parPost.hasOwnProperty('ownerAddress')) {
        parentpost =
          <div className={classes.parentpadding}>
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
    if (parPost.deleted || parPost.banned) {
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
        if (parShaPost.hasOwnProperty('ownerAddress')) {
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
                        <React.Fragment key={props.item.id}>
                          <Card key={props.item.id} variant="outlined" className={classes.bigAvatar}>
                            <img key={props.item.id} alt="" src={parPostOwner.socmed.avatar || noavatar} width="280" height="280" />
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
                <Typography className={classes.parentpadding} variant="body1" color="textPrimary" component="p">
                  > {HASHTAG_FORMATTER(parPost.message)}
                </Typography>
                <Card variant="outlined" className={classes.root}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <Link component={RouterLink} to={`/user/${parShaPost.username}`} style={{ color: '#FFF' }}>
                        {'@' + parShaPost.username}
                      </Link>
                    </Typography>
                    <Typography className={classes.parentcontent} variant="caption" color="textSecondary" gutterBottom>
                      {HASHTAG_FORMATTER(parShaPost.message)}
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>;
        } else {
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
                        <React.Fragment key={props.item.id}>
                          <Card key={props.item.id} variant="outlined" className={classes.bigAvatar}>
                            <img key={props.item.id} alt="" src={parPostOwner.socmed.avatar || noavatar} width="280" height="280" />
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
                <Typography className={classes.parentcontent} variant="body1" color="textSecondary" gutterBottom>
                  > {HASHTAG_FORMATTER(parPost.message)}
                </Typography>
              </CardContent>
            </Card>;
        }
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
    if (shaPost.deleted || parPost.banned) {
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
              <Card variant="outlined" className={classes.root}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <Link component={RouterLink} to={`/user/${shaParPost.username}`} style={{ color: '#FFF' }}>
                      {'@' + shaParPost.username}
                    </Link>
                  </Typography>
                  <Typography className={classes.parentcontent} variant="caption" color="textSecondary" gutterBottom>
                    > {shaParPost.message}
                  </Typography>
                </CardContent>
              </Card>
              <CardHeader
                avatar={
                  <Link
                    component={RouterLink}
                    to={`/user/${shaPost.username}`}
                  >
                    <Tooltip disableFocusListener disableTouchListener
                      placement="left"
                      title={
                        <React.Fragment key={props.item.id}>
                          <Card key={props.item.id} variant="outlined" className={classes.bigAvatar}>
                            <img key={props.item.id} alt="" src={shaPostOwner.socmed.avatar || noavatar} width="280" height="280" />
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
                <Typography className={classes.parentpadding} variant="body1" color="textPrimary" component="p">
                  {HASHTAG_FORMATTER(shaPost.message)}
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
                        <React.Fragment key={props.item.id}>
                          <Card key={props.item.id} variant="outlined" className={classes.bigAvatar}>
                            <img key={props.item.id} alt="" src={shaPostOwner.socmed.avatar || noavatar} width="280" height="280" />
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
                  {HASHTAG_FORMATTER(shaPost.message)}
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
            <React.Fragment key={props.item.id}>
              <Card key={props.item.id} variant="outlined" className={classes.bigAvatar}>
                <img key={props.item.id} alt="" src={postOwner.socmed.avatar || noavatar} width="280" height="280" />
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

  //let linkpreview;

  //if (props.item.hyperlinks.length === 0) {
  //  linkpreview = <></>;
  //} else {
  //  linkpreview =
  //    <LinkPreview url={props.item.hyperlinks[0]} 
  //      backgroundColor={blue[800]}
  //      primaryTextColor="black"
  //      secondaryTextColor="black"
  //      imageHeight="40px"
  //      height="200px"
  //    />;
  //}

  let msg;

  if (props.item.message.length === 0) {
    msg = <></>;
  } else if (props.item.parentPost.length !== 0) {
    msg =
      <Typography className={classes.parentpadding} variant="body1" color="textPrimary">
        {HASHTAG_FORMATTER(props.item.message)}
      </Typography>;
  } else {
    msg =
      <Typography className={classes.message} variant="body1" color="textPrimary">
        {HASHTAG_FORMATTER(props.item.message)}
      </Typography>;
  }

  let pinnedcolor = {};

  if (props.page === 'all') {
    if (props.item.modpinned) {
      pinnedcolor = {
        backgroundColor: "#39556b"
      }
    }
  } else if (props.page === 'account') {
    if (props.item.userpinned) {
      pinnedcolor = {
        backgroundColor: "#39556b"
      }
    }
  }

  return (
    <Card variant="outlined" className={classes.root} style={pinnedcolor}>
      {parentpost}
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
      <CardContent className={classes.content}>
        {msg}
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
          handleClose={(res) => {
            if (res === 'error') {
              setOpenShare(false);
              setOpenError(true);
            } else {
              setOpenShare(false);
            }
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
          handleClose={(res) => {
            if (res === 'error') {
              setOpenReply(false);
              setOpenError(true);
            } else {
              setOpenReply(false);
            }
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
        {undeletebutton}
        <UndeletePostDialog
          open={openUndelete}
          handleClose={() => {
            setOpenUndelete(false);
          }}
          post={props.item}
        />
        {pinbutton}
        <ModPinPostDialog
          open={openModPin}
          handleClose={() => {
            setOpenModPin(false);
          }}
          post={props.item}
        />
        <ModUnpinPostDialog
          open={openModUnpin}
          handleClose={() => {
            setOpenModUnpin(false);
          }}
          post={props.item}
        />
        <UserPinPostDialog
          open={openUserPin}
          handleClose={() => {
            setOpenUserPin(false);
          }}
          post={props.item}
        />
        <UserUnpinPostDialog
          open={openUserUnpin}
          handleClose={() => {
            setOpenUserUnpin(false);
          }}
          post={props.item}
        />
        <CreatePostErrorDialog
          open={openError}
          handleClose={() => {
            setOpenError(false);
          }}
        />
      </CardActions>
    </Card>
  );
}
