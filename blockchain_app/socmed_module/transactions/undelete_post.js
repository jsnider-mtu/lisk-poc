const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class UndeletePostAsset extends BaseAsset {
  name = "undeletePost";
  id = 6;
  schema = {
    $id: "lisk/post/undelete",
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
      throw new Error("[UNDELETE] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];

    // Exit if not allowed to be undeleted by this sender
    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Post " + post.id + " cannot be undeleted by " + senderAddress);
    }

    // Set deleted flag on post asset then setAllPosts
    post.deleted = false;
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);
  }
}

module.exports = UndeletePostAsset;
