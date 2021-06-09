import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link,
  Divider,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { cryptography, Buffer } from "@liskhq/lisk-client";

import LikePostDialog from "./dialogs/LikePostDialog";
import SharePostDialog from "./dialogs/SharePostDialog";
import CreateChildPostDialog from "./dialogs/CreateChildPostDialog";
import DeletePostDialog from "./dialogs/DeletePostDialog";

const useStyles = makeStyles((theme) => ({
  propertyList: {
    listStyle: "none",

    "& li": {
      margin: theme.spacing(2, 0),
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,

      "& dt": {
        display: "block",
        width: "100%",
        fontWeight: "bold",
        margin: theme.spacing(1, 0),
      },
      "& dd": {
        display: "block",
        width: "100%",
        margin: theme.spacing(1, 0),
      },
    },
  },
}));

export default function Post(props) {
  const classes = useStyles();
  const [openShare, setOpenShare] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openLike, setOpenLike] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // Get username from address
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');
  const dateobj = new Date(props.item.timestamp);
  const datetime = dateobj.toString();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{props.item.message}</Typography>
        <Divider />
        <dl className={classes.propertyList}>
          <li>
            <dt>Likes</dt>
            <dd>{props.item.likes.length}</dd>
          </li>
          <li>
            <dt>Shares</dt>
            <dd>{props.item.shares.length}</dd>
          </li>
          <li>
            <dt>Replies</dt>
            <dd>{props.item.replies.length}</dd>
          </li>
          <li>
            <dt>Shared Post</dt>
            <dd>{props.item.sharedPost}</dd>
          </li>
          <li>
            <dt>Reply To</dt>
            <dd>{props.item.parentPost}</dd>
          </li>
          <li>
            <dt>Timestamp</dt>
            <dd>{datetime}</dd>
          </li>
          <li>
            <dt>Owner</dt>
            <dd>
              <Link
                component={RouterLink}
                to={`/accounts/${base32UIAddress}`}
              >
                {props.item.username}
              </Link>
            </dd>
          </li>
        </dl>
      </CardContent>
      <CardActions>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenLike(true);
            }}
          >
            Like Post
          </Button>
          <LikePostDialog
            open={openLike}
            handleClose={() => {
              setOpenLike(false);
            }}
            post={props.item}
            />
        </>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenShare(true);
            }}
          >
            Share Post
          </Button>
          <SharePostDialog
            open={openShare}
            handleClose={() => {
              setOpenShare(false);
            }}
            post={props.item}
           />
        </>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenReply(true);
            }}
          >
            Reply to Post
          </Button>
          <CreateChildPostDialog
            open={openReply}
            handleClose={() => {
              setOpenReply(false);
            }}
            post={props.item}
          />
        </>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenDelete(true);
            }}
          >
            Delete Post
          </Button>
          <DeletePostDialog
            open={openDelete}
            handleClose={() => {
              setOpenDelete(false);
            }}
            post={props.item}
          />
        </>
      </CardActions>
    </Card>
  );
}
