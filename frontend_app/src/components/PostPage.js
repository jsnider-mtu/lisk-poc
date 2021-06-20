import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { useParams } from "react-router-dom";
import { Fab, CircularProgress, Grid } from "@material-ui/core";
import { fetchPost } from "../api";
import Post from "./Post";
import ScrollTop from "./ScrollTop";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [replies, setReplies] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
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
      } else {
        setPost(await fetchPost(postId));
      }
    }
    fetchData();
  }, [loaded, post, postId]);

  if (!loaded) {
    return <Fragment><CssBaseline /><CircularProgress /></Fragment>;
  } else {
    return (
      <div>
        <CssBaseline />
        <Grid container spacing={1} justify="center">
          <Grid item md={8}>
            <Post item={post} minimum={false} />
          </Grid>
        </Grid>
        <br />
        {replies.map((item) => (
        <div key={item.id}>
          <Grid container spacing={1} justify="center" key={item.id}>
            <Grid item md={8} key={item.id}>
              <Post item={item} key={item.id} minimum={true} />
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
  }
}

export default PostPage;
