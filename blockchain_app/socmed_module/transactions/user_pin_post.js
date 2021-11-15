const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class UserPinPostAsset extends BaseAsset {
  name = "userPinPost";
  id = 17;
  schema = {
    $id: "lisk/post/userpin",
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
      throw new Error("[USERPIN] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];
    const postOwner = await stateStore.account.get(post.ownerAddress);

    if (!senderAddress.equals(postOwner.address)) {
      throw new Error("Post " + post.id + " cannot be pinned by " + senderAddress);
    }

    post.userpinned = true;
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);
  }
}

module.exports = UserPinPostAsset;
