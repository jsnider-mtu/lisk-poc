const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class LikePostAsset extends BaseAsset {
  name = "likePost";
  id = 2;
  schema = {
    $id: "lisk/post/like",
    type: "object",
    required: ["postId", "likerAddress"],
    properties: {
      postId: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      likerAddress: {
        dataType: "bytes",
        fieldNumber: 2,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const posts = await getAllPosts(stateStore);
    const postIndex = posts.findIndex((t) => t.id.equals(asset.postId));

    if (postIndex < 0) {
      throw new Error("Post ID not found: " + asset.postId);
    }

    const post = posts[postIndex];
    const postOwner = await stateStore.account.get(post.ownerAddress);

    // Exit if already liked by this sender
    const likeIndex = post.likes.findIndex((p) => p.equals(transaction.senderAddress));
    if (likeIndex >= 0) {
      throw new Error("Post " + post.id + " was already liked by " + transaction.senderAddress);
    }

    // Add sender address to likes array on post asset then setAllPosts
    post.likes.push(transaction.senderAddress);
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);

    // Credit postOwner
    await reducerHandler.invoke("token:credit", {
      address: postOwner.address,
      amount: 1n,
    });
  }
}

module.exports = LikePostAsset;
