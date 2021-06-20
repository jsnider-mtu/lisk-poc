import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Post from "./Post";
import { CircularProgress, Grid, Fab } from "@material-ui/core";
import { fetchAllPosts } from "../api";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

function AllPage() {
  const [Posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
    }
    if (document.cookie.split('; ').pop().split('=')[1].split(' ').length !== 12) {
      window.location.href="/signin";
    }
    fetchData();
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
