import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { cryptography } from "@liskhq/lisk-client";
import Post from "./Post";
import { Zoom, Button, Fab, CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { fetchAllPosts, fetchAccountInfo } from "../api";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles((theme) => ({
  newposts: {
    position: 'fixed',
    top: theme.spacing(9),
    left: 0,
    right: 0,
    'margin-left': 'auto',
    'margin-right': 'auto',
  },
}));

function HomePage() {
  const classes = useStyles();
  const [Posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [newPosts, setNewPosts] = useState(false);
  const [intervalIds, setIntervalIds] = useState([]);
  const passp = document.cookie.split('passphrase')[1].slice(1).split('; ')[0];
  const curUserAddress = cryptography.getAddressFromPassphrase(passp).toString('hex');

  const fetchNewPosts = async (curposts) => {
    let curUser = await fetchAccountInfo(curUserAddress);
    let allNewPosts = await fetchAllPosts();
    var i = 0;
    while (i < allNewPosts.length) {
      if (allNewPosts[i].deleted === true || (!curUser.socmed.follows.includes(allNewPosts[i].ownerAddress) && !allNewPosts[i].taggedusers.includes(curUser.socmed.name) && !curUser.socmed.posts.includes(allNewPosts[i].id))) {
        allNewPosts.splice(i, 1);
      } else {
        ++i;
      }
    }
    if (allNewPosts.length > curposts) {
      setNewPosts(true);
    }
  }

  useEffect(() => {
    let curUser = {};
    async function fetchData() {
      curUser = await fetchAccountInfo(curUserAddress);
      if (curUser.socmed.follows.length === 0) {
        window.location.href = "/all";
      }
      let allPosts = await fetchAllPosts();
      var i = 0;
      while (i < allPosts.length) {
        if (allPosts[i].deleted === true || (!curUser.socmed.follows.includes(allPosts[i].ownerAddress) && !allPosts[i].taggedusers.includes(curUser.socmed.name) && !curUser.socmed.posts.includes(allPosts[i].id))) {
          allPosts.splice(i, 1);
        } else {
          ++i;
        }
      }
      allPosts.sort(function(a, b) {
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        return 0;
      });
      setPosts(allPosts);
      if (intervalIds.length === 0) {
        let intervalid = setInterval(fetchNewPosts, 10000, allPosts.length);
        setIntervalIds(arr => [...arr, intervalid]);
      }
    }
    if (document.cookie.split('passphrase')[1].slice(1).split('; ')[0].split(' ').length !== 12) {
      window.location.href="/signin";
    }
    fetchData();
    setNewPosts(false);
    setLoaded(true);
  }, [loaded, curUserAddress]);

  if (!loaded) {
    return <Fragment><CssBaseline /><CircularProgress /></Fragment>;
  } else {
    return (
      <Fragment>
        <CssBaseline />
        {Posts.map((item) => (
        <div key={item.id}>
          <Grid key={item.id} container spacing={1} justify="center">
              <Grid key={item.id} item md={10}>
                <Post item={item} key={item.id} minimum={false} />
              </Grid>
          </Grid>
          <br />
        </div>
        ))}
        <Zoom in={newPosts}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              intervalIds.forEach(clearInterval);
              setIntervalIds([]);
              setLoaded(false)
            }}
            className={classes.newposts}
          >
            {'Load more posts'}
          </Button>
        </Zoom>
        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Fragment>
    );
  }
}

export default HomePage;
