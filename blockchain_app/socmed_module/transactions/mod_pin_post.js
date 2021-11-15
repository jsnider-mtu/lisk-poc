const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class ModPinPostAsset extends BaseAsset {
  name = "modPinPost";
  id = 15;
  schema = {
    $id: "lisk/post/modpin",
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
      throw new Error("[MODPIN] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];

    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Post " + post.id + " cannot be pinned by " + senderAddress);
    }

    post.modpinned = true;
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);
  }
}

module.exports = ModPinPostAsset;
