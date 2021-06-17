import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Post from "./Post";
import { Grid } from "@material-ui/core";
import { fetchAllPosts } from "../api";

function HomePage() {
  const [Posts, setPosts] = useState([]);

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
  }, []);

  return (
    <Fragment>
      <CssBaseline />
      {Posts.map((item) => (
      <div>
        <Grid key={item.id} container spacing={1} justify="center">
            <Grid key={item.id} item md={8}>
              <Post item={item} key={item.id} minimum={false} />
            </Grid>
        </Grid>
        <br />
      </div>
      ))}
    </Fragment>
  );
}

export default HomePage;
