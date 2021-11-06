const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class ModUnpinPostAsset extends BaseAsset {
  name = "modUnpinPost";
  id = 16;
  schema = {
    $id: "lisk/post/modunpin",
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
      throw new Error("[MODUNPIN] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];

    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Post " + post.id + " cannot be unpinned by " + senderAddress);
    }

    post.modpinned = false;
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);
  }
}

module.exports = ModUnpinPostAsset;
