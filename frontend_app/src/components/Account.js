import React, { useState, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { Card, Fab, Avatar, Container, Typography, Divider, Grid, Button, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import { cryptography, transactions } from "@liskhq/lisk-client";
import BanAccountDialog from "./dialogs/BanAccountDialog";
import DemoteAccountDialog from "./dialogs/DemoteAccountDialog";
import FollowAccountDialog from "./dialogs/FollowAccountDialog";
import PromoteAccountDialog from "./dialogs/PromoteAccountDialog";
import UnbanAccountDialog from "./dialogs/UnbanAccountDialog";
import UnfollowAccountDialog from "./dialogs/UnfollowAccountDialog";
import UpdateAccountDialog from "./dialogs/UpdateAccountDialog";
import Post from "./Post";
import * as api from "../api";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import noavatar from '../noavatar.png';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  bigAvatar: {
    backgroundColor: blue[500],
    width: theme.spacing(35),
    height: theme.spacing(35),
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
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  const curUserAddress = cryptography.getAddressFromPassphrase(passp).toString('hex');
  const [mod, setMod] = useState(false);

  useEffect(() => {
    let curUser = {};
    async function fetchData() {
      curUser = await api.fetchAccountInfo(curUserAddress);
      setMod(curUser.socmed.moderator);
      let allPosts = await api.fetchAllPosts();
      let acctPosts = allPosts.filter((p) => props.account.socmed.posts.includes(p.id) || p.taggedusers.includes(props.account.socmed.name));
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
  }, [curUserAddress, props.account.socmed.posts, props.account.socmed.name]);

  let acctdetails;

  if (mod) {
    acctdetails =
      <Typography variant="body2" color="textPrimary">
        {'Address: ' + cryptography.getBase32AddressFromAddress(props.account.address, 'hex')}
        <br />
        {'Banned: ' + props.account.socmed.banned.toString() + '  Moderator: ' + props.account.socmed.moderator.toString()}
      </Typography>
  } else {
    acctdetails =
      <Typography variant="body2" color="textPrimary">
        {'Address: ' + cryptography.getBase32AddressFromAddress(Buffer.from(props.account.address, 'hex'))}
      </Typography>;
  }

  let modbuttons;

  if (mod) {
    modbuttons =
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
      </div>;
  } else {
    modbuttons = <></>;
  }

  let updatebutton;

  if (props.account.address === curUserAddress) {
    updatebutton =
      <div>
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
    if (!props.account.socmed.following.includes(curUserAddress)) {
      updatebutton =
        <div>
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
        </div>;
    } else {
      updatebutton =
        <div>
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
        </div>;
    }
  }

  return (
    <Container>
      <CssBaseline />
      <Grid container>
        <Grid item xs>
          <Tooltip disableFocusListener disableTouchListener
            placement="left"
            title={
              <React.Fragment>
                <Card variant="outlined" className={classes.bigAvatar}>
                  <img alt="" src={props.account.socmed.avatar || noavatar} width="280" height="280" />
                </Card>
              </React.Fragment>
            }
          >
            <Avatar aria-label="avatar" className={classes.avatar} src={props.account.socmed.avatar} />
          </Tooltip>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h5">{props.account.socmed.displayname}</Typography>
          <Typography variant="body1">{'@' + props.account.socmed.name}</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {props.account.socmed.bio}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="body2" color="textPrimary">
            {'Karma'}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            {transactions.convertBeddowsToLSK(props.account.token.balance)}
          </Typography>
        </Grid>
      </Grid>
      {acctdetails}
      {modbuttons}
      {updatebutton}
      <Divider />
      <br /><Typography variant="h5">{"Posts"}</Typography><br />
      {posts.map((item) => (
      <div key={item.id}>
        <Grid container spacing={1} justify="center" key={item.id}>
            <Grid item md={10} key={item.id}>
              <Post item={item} key={item.id} minimum={false} />
            </Grid>
        </Grid>
        <br />
      </div>
      ))}
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Container>
  );
}
