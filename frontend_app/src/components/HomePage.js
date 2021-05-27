import React, { Fragment, useEffect, useState } from "react";
import Post from "./Post";
import { Grid } from "@material-ui/core";
import { fetchAllPosts } from "../api";

function HomePage() {
  const [NFTAccounts, setNFTAccounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setNFTAccounts(await fetchAllPosts());
    }
    fetchData();
  }, []);

  return (
    <Fragment>
      <Grid container spacing={4}>
        {NFTAccounts.map((item) => (
          <Grid item md={4}>
            <Post item={item} key={item.id} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default HomePage;
