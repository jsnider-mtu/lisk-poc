import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { useParams } from "react-router-dom";
import { Divider, Fab, Typography, CircularProgress, Grid } from "@material-ui/core";
import * as api from "../api";
import Post from "./Post";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import LazyLoad from 'react-lazyload';


function SearchPage() {
  const { searchValue } = decodeURIComponent(useParams());
  const [foundPosts, setFoundPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let allPosts = await api.fetchAllPosts();
      let foundposts = [];
      var i = 0;
      while (i < allPosts.length) {
        if (allPosts[i].deleted === true || allPosts[i].banned === true) {
          allPosts.splice(i, 1);
        } else {
          ++i;
        }
      }
      var x = 0;
      while (x < allPosts.length) {
        if (allPosts[x].message.includes(searchValue)) {
          foundposts.push(allPosts[x]);
          ++x;
        } else {
          ++x;
        }
      }
      foundposts.sort(function(a, b) {
        if (a.timestamp < b.timestamp) {
          return 1;
        }
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        return 0;
      });
      setFoundPosts(foundposts);
      setLoaded(true);
    }

    fetchData();
  }, [searchValue]);

  if (!loaded) {
    return <Fragment><CssBaseline /><CircularProgress /></Fragment>;
  } else {
    if (foundPosts.length > 0) {
      return (
        <div>
          <CssBaseline />
          <Typography variant="h5" align="center" paragraph>{'Search: ' + searchValue}</Typography>
          <br /><Divider /><br />
          {foundPosts.map((item) => (
          <LazyLoad once key={item.id} placeholder={<CircularProgress />}>
            <div>
              <Grid container spacing={1} justify="center" key={item.id}>
                <Grid item md={10} key={item.id}>
                  <Post item={item} key={item.id} minimum={false} />
                </Grid>
              </Grid>
              <br />
            </div>
          </LazyLoad>
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
        <div>
          <CssBaseline />
          <Typography variant="h5" align="center" paragraph>
            {'No posts contain the string: ' + searchValue}
          </Typography>
        </div>
      );
    }
  }
}

export default SearchPage;
