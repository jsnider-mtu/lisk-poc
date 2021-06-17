import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Grid } from "@material-ui/core";
import { fetchPost } from "../api";
import Post from "./Post";


function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [replies, setReplies] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setPost(await fetchPost(postId));
      if (post.hasOwnProperty('replies')) {
        let replyArr = await Promise.all(
          post.replies.map((a) => fetchPost(a))
        );
        var i = 0;
        while (i < replyArr.length) {
          if (replyArr[i].deleted === true) {
            replyArr.splice(i, 1);
          } else {
            ++i;
          }
        }
        replyArr.sort(function(a, b) {
          if (a.timestamp < b.timestamp) {
            return -1;
          }
          if (a.timestamp > b.timestamp) {
            return 1;
          }
          return 0;
        });
        setReplies(replyArr);
        setLoaded(true);
      }
    }

    fetchData();
  }, [post]);

  if (!loaded) {
    return <Fragment><CircularProgress /></Fragment>;
  } else {
    return (
      <div>
        <Grid container spacing={1} justify="center">
          <Grid item md={8}>
            <Post item={post} />
          </Grid>
        </Grid>
        {replies.map((item) => (
        <Grid container spacing={1} justify="center" key={item.id}>
          <Grid item md={8} key={item.id}>
            <Post item={item} key={item.id} minimum={true} />
          </Grid>
        </Grid>
        ))};
      </div>
    );
  }
}

export default PostPage;
