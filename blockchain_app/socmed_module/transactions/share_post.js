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
    const sharedPostIndex = posts.findIndex((t) => t.id.equals(asset.postId));

    if (sharedPostIndex < 0) {
      throw new Error("[SHARE] Post ID not found: " + asset.postId);
    }

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const sharedPost = posts[sharedPostIndex];
    const postOwner = await stateStore.account.get(sharedPost.ownerAddress);

    // Exit if already shared by this sender
    const shareIndex = sharedPost.shares.findIndex((p) => p.equals(senderAddress));
    if (shareIndex >= 0) {
      throw new Error("Post " + sharedPost.id + " was already shared by " + senderAddress);
    }

    // Create share post
    const post = createSharePost({
      message: asset.message,
      ownerAddress: senderAddress,
      nonce: transaction.nonce,
      sharedPost: asset.postId,
    });

    // 6.update sender account with unique post id
    senderAccount.socmed.posts.push(post.id);
    await stateStore.account.set(senderAddress, senderAccount);

    // Add sender address to shares array on post asset 
    // and push new post to posts then setAllPosts
    sharedPost.shares.push(transaction.senderAddress);
    posts[sharedPostIndex] = sharedPost;
    posts.push(post);
    await setAllPosts(stateStore, posts);

    // Credit postOwner
    await reducerHandler.invoke("token:credit", {
      address: postOwner.address,
      amount: 100000000n,
    });
  }
}

module.exports = CreateSharePostAsset;
