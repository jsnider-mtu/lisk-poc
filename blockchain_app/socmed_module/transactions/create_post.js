const { BaseAsset } = require("lisk-sdk");
const {
  getAllPosts,
  setAllPosts,
  createPost,
} = require("../post");

// 1.extend base asset to implement your custom asset
class CreatePostAsset extends BaseAsset {
  // 2.define unique asset name and id
  name = "createPost";
  id = 0;
  // 3.define asset schema for serialization
  schema = {
    $id: "lisk/post/create",
    type: "object",
    required: ["message"],
    properties: {
      message: {
        dataType: "string",
        fieldNumber: 1,
      },
    },
  };
  validate({ asset }) {
    if (asset.message.length === 0) {
      throw new Error("Empty posts are not allowed.");
    } else if (asset.message.length > 512) {
      throw new Error("Posts must not exceed 512 characters.");
    }
  };
  async apply({ asset, stateStore, reducerHandler, transaction }) {
    // 4.verify if sender has enough balance (been banned?)
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    // 5.create post
    const post = createPost({
      message: asset.message,
      ownerAddress: senderAddress,
      nonce: transaction.nonce,
      username: senderAccount.socmed.name,
      avatar: senderAccount.socmed.avatar,
    });

    // 6.update sender account with unique post id
    senderAccount.socmed.posts.push(post.id);
    await stateStore.account.set(senderAddress, senderAccount);

    // 7.debit tokens from sender account to create nft
    // await reducerHandler.invoke("token:debit", {
    //   address: senderAddress,
    //   amount: asset.initValue,
    // });

    // 8.save posts
    const allPosts = await getAllPosts(stateStore);
    allPosts.push(post);
    await setAllPosts(stateStore, allPosts);
  }
}

module.exports = CreatePostAsset;
