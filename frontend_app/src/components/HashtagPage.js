import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { useParams } from "react-router-dom";
import { Fab, Typography, CircularProgress, Grid } from "@material-ui/core";
import * as api from "../api";
import Post from "./Post";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


function HashtagPage() {
  const { hashtag } = useParams();
  const [hashtagPosts, setHashtagPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let allPosts = await api.fetchAllPosts();
      let hashtagposts = [];
      var i = 0;
      while (i < allPosts.length) {
        if (allPosts[i].deleted === true) {
          allPosts.splice(i, 1);
        } else {
          ++i;
        }
      }
      var x = 0;
      while (x < allPosts.length) {
        if (allPosts[x].hashtags.includes(hashtag)) {
          hashtagposts.push(allPosts[x]);
          ++x;
        } else {
          ++x;
        }
      }
      hashtagposts.sort(function(a, b) {
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        return 0;
      });
      setHashtagPosts(hashtagposts);
      setLoaded(true);
    }

    fetchData();
  }, [hashtag]);

  if (!loaded) {
    return <Fragment><CssBaseline /><CircularProgress /></Fragment>;
  } else {
    if (hashtagPosts.length > 0) {
      return (
        <div>
          <CssBaseline />
          {hashtagPosts.map((item) => (
          <div>
            <Grid container spacing={1} justify="center" key={item.id}>
              <Grid item md={8} key={item.id}>
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
        </div>
      );
    } else {
      return (
        <Typography variant="h5">
          {'No posts contain the hashtag: ' + hashtag}
        </Typography>
      );
    }
  }
}

export default HashtagPage;
