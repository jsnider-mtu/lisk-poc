const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class UnlikePostAsset extends BaseAsset {
  name = "unlikePost";
  id = 5;
  schema = {
    $id: "lisk/post/unlike",
    type: "object",
    required: ["postId"],
    properties: {
      postId: {
        dataType: "bytes",
        fieldNumber: 1,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const posts = await getAllPosts(stateStore);
    const postIndex = posts.findIndex((t) => t.id.equals(asset.postId));

    if (postIndex < 0) {
      throw new Error("[UNLIKE] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];
    const postOwner = await stateStore.account.get(post.ownerAddress);

    // Exit if not currently liked by this sender
    const likeIndex = post.likes.findIndex((l) => l.equals(senderAddress));
    if (likeIndex < 0) {
      throw new Error("Post " + post.id + " is not currently liked by " + senderAddress);
    }

    // Remove senderAddress from likes array then setAllPosts
    post.likes.splice(likeIndex, 1);
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);

    // Debit postOwner
    await reducerHandler.invoke("token:debit", {
      address: postOwner.address,
      amount: 100000000n,
    });
  }
}

module.exports = UnlikePostAsset;
