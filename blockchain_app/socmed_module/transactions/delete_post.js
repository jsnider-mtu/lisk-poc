const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class DeletePostAsset extends BaseAsset {
  name = "deletePost";
  id = 4;
  schema = {
    $id: "lisk/post/delete",
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
      throw new Error("[DELETE] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];
    const postOwner = await stateStore.account.get(post.ownerAddress);

    // Exit if not allowed to be deleted by this sender
    if (senderAddress !== postOwner.address && senderAccount.socmed.moderator !== true) {
      throw new Error("Post " + post.id + " cannot be deleted by " + senderAddress);
    }

    // Set deleted flag on post asset then setAllPosts
    post.deleted = true;
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);
  }
}

module.exports = DeletePostAsset;
