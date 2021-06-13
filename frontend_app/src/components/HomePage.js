import React, { Fragment, useEffect, useState } from "react";
import Post from "./Post";
import { Grid } from "@material-ui/core";
import { fetchAllPosts } from "../api";

function HomePage() {
  const [Posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setPosts(await fetchAllPosts());
    }
    fetchData();
  }, []);

  return (
    <Fragment>
      {Posts.map((item) => (
      <Grid container spacing={4} justify="center">
          <Grid item md={4}>
            <Post item={item} key={item.id} />
          </Grid>
      </Grid>
      ))}
    </Fragment>
  );
}

export default HomePage;
