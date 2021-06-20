import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { cryptography } from "@liskhq/lisk-client";
import Post from "./Post";
import { Fab, CircularProgress, Grid } from "@material-ui/core";
import { fetchAllPosts, fetchAccountInfo } from "../api";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

function HomePage() {
  const [Posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const passp = document.cookie.split('; ').pop();
  const curUserAddress = cryptography.getAddressFromPassphrase(passp.split('=')[1]).toString('hex');

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
    }
    if (document.cookie.split('; ').pop().split('=')[1].split(' ').length !== 12) {
      window.location.href="/signin";
    }
    fetchData();
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
              <Grid key={item.id} item md={8}>
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
      </Fragment>
    );
  }
}

export default HomePage;
