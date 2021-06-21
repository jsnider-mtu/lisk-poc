import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Post from "./Post";
import { Zoom, Button, CircularProgress, Grid, Fab } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { fetchAllPosts } from "../api";
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

function AllPage() {
  const classes = useStyles();
  const [Posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [newPosts, setNewPosts] = useState(false);
  const [intervalIds, setIntervalIds] = useState([]);

  const fetchNewPosts = async (curposts) => {
    let allNewPosts = await fetchAllPosts();
    var i = 0;
    while (i < allNewPosts.length) {
      if (allNewPosts[i].deleted === true) {
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
    async function fetchData() {
      let allPosts = await fetchAllPosts();
      var i = 0;
      while (i < allPosts.length) {
        if (allPosts[i].deleted === true) {
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
    if (document.cookie.split('; ').pop().split('=')[1].split(' ').length !== 12) {
      window.location.href="/signin";
    }
    fetchData();
    setNewPosts(false);
    setLoaded(true);
  }, [loaded]);

  if (!loaded) {
    return <Fragment><CssBaseline /><CircularProgress /></Fragment>;
  } else {
    return (
      <Fragment>
        <CssBaseline />
        {Posts.map((item) => (
        <div key={item.id}>
          <Grid key={item.id} container spacing={1} justify="center">
              <Grid key={item.id} item md={8}>
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

export default AllPage;
