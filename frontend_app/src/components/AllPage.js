import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Post from "./Post";
import { Zoom, Button, CircularProgress, Grid, Fab } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { fetchAllPosts } from "../api";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { handleViewport } from 'react-in-viewport';

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
  const [postIndex, setPostIndex] = useState(0);

  // const bottomreached = () => {
  //   setPostIndex(postIndex+1);
  // }

  const circle = () => {
    return (
      <CircularProgress />
    );
  }

  const CircleViewport = handleViewport(circle);

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
      console.log('Entered fetchData');
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
      setPosts(allPosts.slice(postIndex*5, postIndex*5+5));
      if (intervalIds.length === 0) {
        let intervalid = setInterval(fetchNewPosts, 10000, allPosts.length);
        setIntervalIds(arr => [...arr, intervalid]);
      }
      console.log('Exiting fetchData');
    }
    if (document.cookie.split('passphrase')[1].slice(1).split('; ')[0].split(' ').length !== 12) {
      window.location.href="/signin";
    }
    console.log('Running fetchData');
    fetchData();
    setNewPosts(false);
    setLoaded(true);
  }, [loaded, postIndex]);

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
        <CircleViewport onEnterViewport={setPostIndex(postIndex+1)} />
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
