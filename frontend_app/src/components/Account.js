import React, { useState, useEffect } from "react";
import { Container, Typography, Divider, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {Buffer, cryptography, transactions} from "@liskhq/lisk-client";
import BanAccountDialog from "./dialogs/BanAccountDialog";
import DemoteAccountDialog from "./dialogs/DemoteAccountDialog";
import FollowAccountDialog from "./dialogs/FollowAccountDialog";
import PromoteAccountDialog from "./dialogs/PromoteAccountDialog";
import UnbanAccountDialog from "./dialogs/UnbanAccountDialog";
import UnfollowAccountDialog from "./dialogs/UnfollowAccountDialog";
import UpdateAccountDialog from "./dialogs/UpdateAccountDialog";
import Post from "./Post";
import { fetchPost } from "../api";

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

export default function Account(props) {
  const [posts, setPosts] = useState([]);
  const [openBan, setOpenBan] = useState(false);
  const [openDemote, setOpenDemote] = useState(false);
  const [openFollow, setOpenFollow] = useState(false);
  const [openPromote, setOpenPromote] = useState(false);
  const [openUnban, setOpenUnban] = useState(false);
  const [openUnfollow, setOpenUnfollow] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const classes = useStyles();
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.account.address, 'hex'), 'lsk').toString('binary');

  useEffect(() => {
    async function fetchData() {
      const acctPosts = await Promise.all(
        props.account.socmed.posts.map((a) => fetchPost(a))
      )
      acctPosts.sort(function(a, b) {
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        return 0;
      });
      setPosts(acctPosts);
    }

    fetchData();
  }, [props.account.socmed.posts]);

  return (
    <Container>
      <Typography variant="h5">{base32UIAddress}</Typography>
      <Divider />
      <dl className={classes.propertyList}>
        <li>
          <dt>Balance</dt>
          <dd>
            {transactions.convertBeddowsToLSK(props.account.token.balance)}
          </dd>
          <dt>Username</dt>
          <dd>{props.account.socmed.name}</dd>
          <dt>Bio</dt>
          <dd>{props.account.socmed.bio}</dd>
          <dt>Avatar URL</dt>
          <dd>{props.account.socmed.avatar}</dd>
          <dt>Posts Count</dt>
          <dd>{props.account.socmed.posts.length}</dd>
          <dt>Follows Count</dt>
          <dd>{props.account.socmed.follows.length}</dd>
          <dt>Following Count</dt>
          <dd>{props.account.socmed.following.length}</dd>
          <dt>Nonce</dt>
          <dd>{props.account.sequence.nonce}</dd>
          <dt>Binary address</dt>
          <dd>{props.account.address}</dd>
          <dt>Moderator</dt>
          <dd>{props.account.socmed.moderator.toString()}</dd>
          <dt>Banned</dt>
          <dd>{props.account.socmed.banned.toString()}</dd>
        </li>
      </dl>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenBan(true);
          }}
        >
          Ban Account
        </Button>
        <BanAccountDialog
          open={openBan}
          handleClose={() => {
            setOpenBan(false);
          }}
          account={props.account}
        />
      </>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenUnban(true);
          }}
        >
          Unban Account
        </Button>
        <UnbanAccountDialog
          open={openUnban}
          handleClose={() => {
            setOpenUnban(false);
          }}
          account={props.account}
        />
      </>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenDemote(true);
          }}
        >
          Demote Account
        </Button>
        <DemoteAccountDialog
          open={openDemote}
          handleClose={() => {
            setOpenDemote(false);
          }}
          account={props.account}
        />
      </>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenFollow(true);
          }}
        >
          Follow Account
        </Button>
        <FollowAccountDialog
          open={openFollow}
          handleClose={() => {
            setOpenFollow(false);
          }}
          account={props.account}
        />
      </>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenUnfollow(true);
          }}
        >
          Unfollow Account
        </Button>
        <UnfollowAccountDialog
          open={openUnfollow}
          handleClose={() => {
            setOpenUnfollow(false);
          }}
          account={props.account}
        />
      </>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenPromote(true);
          }}
        >
          Promote Account
        </Button>
        <PromoteAccountDialog
          open={openPromote}
          handleClose={() => {
            setOpenPromote(false);
          }}
          account={props.account}
        />
      </>
      <>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setOpenUpdate(true);
          }}
        >
          Update Account
        </Button>
        <UpdateAccountDialog
          open={openUpdate}
          handleClose={() => {
            setOpenUpdate(false);
          }}
          account={props.account}
        />
      </>
      <Typography variant="h6">{"Posts"}</Typography>
      {posts.map((item) => (
      <Grid container spacing={4} justify="center">
          <Grid item md={4}>
            <Post item={item} key={item.id} minimum={true} />
          </Grid>
      </Grid>
      ))}
    </Container>
  );
}
