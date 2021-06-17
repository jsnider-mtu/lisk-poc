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
import * as api from "../api";

//const useStyles = makeStyles((theme) => ({
//}));

export default function Account(props) {
  const [posts, setPosts] = useState([]);
  const [openBan, setOpenBan] = useState(false);
  const [openDemote, setOpenDemote] = useState(false);
  const [openFollow, setOpenFollow] = useState(false);
  const [openPromote, setOpenPromote] = useState(false);
  const [openUnban, setOpenUnban] = useState(false);
  const [openUnfollow, setOpenUnfollow] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  //const classes = useStyles();
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.account.address, 'hex'), 'lsk').toString('binary');
  const curUserAddress = cryptography.getAddressFromPassphrase(document.cookie.split('; ').find(r => r.startsWith('passphrase=')).split('=')[1]).toString('hex');
  const [mod, setMod] = useState(false);

  useEffect(() => {
    let curUser = {};
    async function fetchData() {
      curUser = await api.fetchAccountInfo(curUserAddress);
      setMod(curUser.socmed.moderator);
      let acctPosts = await Promise.all(
        props.account.socmed.posts.map((a) => api.fetchPost(a))
      )
      var i = 0;
      while (i < acctPosts.length) {
        if (acctPosts[i].deleted === true) {
          acctPosts.splice(i, 1);
        } else {
          ++i;
        }
      }
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

  let buttons;

  if (mod) {
    buttons =
      <div>
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
      </div>;
  } else {
    buttons = <></>;
  }

  return (
    <Container>
      <Typography variant="h5">{base32UIAddress}</Typography>
      <Divider />
      <Typography variant="h6">{"Posts"}</Typography>
      {posts.map((item) => (
      <Grid container spacing={1} justify="center" key={item.id}>
          <Grid item md={8} key={item.id}>
            <Post item={item} key={item.id} minimum={true} />
          </Grid>
      </Grid>
      ))}
    </Container>
  );
}
