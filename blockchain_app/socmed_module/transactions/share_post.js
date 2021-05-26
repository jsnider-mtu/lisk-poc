const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts, createSharePost } = require("../post");

class CreateSharePostAsset extends BaseAsset {
  name = "sharePost";
  id = 3;
  schema = {
    $id: "lisk/post/share",
    type: "object",
    required: ["postId"],
    properties: {
      postId: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      message: {
        dataType: "string",
        fieldNumber: 2,
      },
    },
  };

  validate({ asset }) {
    if (asset.message.length > 512) {
      throw new Error("Post must not exceed 512.");
    }
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const posts = await getAllPosts(stateStore);
    const postIndex = posts.findIndex((t) => t.id.equals(asset.postId));

    if (postIndex < 0) {
      throw new Error("[SHARE] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const post = posts[postIndex];
    const postOwner = await stateStore.account.get(post.ownerAddress);

    // Exit if already shared by this sender
    const shareIndex = post.shares.findIndex((p) => p.equals(senderAddress));
    if (shareIndex >= 0) {
      throw new Error("Post " + post.id + " was already shared by " + senderAddress);
    }

    // Create share post
    const sharePost = createSharePost({
      message: asset.message,
      ownerAddress: senderAddress,
      nonce: transaction.nonce,
      sharedPost: asset.postId,
    });

    // 6.update sender account with unique post id
    senderAccount.socmed.posts.push(post.id);
    await stateStore.account.set(senderAddress, senderAccount);

    // Add sender address to shares array on post asset then setAllPosts
    post.shares.push(transaction.senderAddress);
    posts[postIndex] = post;
    await setAllPosts(stateStore, posts);

    // Credit postOwner
    await reducerHandler.invoke("token:credit", {
      address: postOwner.address,
      amount: 1n,
    });
  }
}

module.exports = CreateSharePostAsset;
