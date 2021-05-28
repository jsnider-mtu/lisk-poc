const { BaseAsset } = require("lisk-sdk");
const {
  getAllPosts,
  setAllPosts,
  createChildPost,
} = require("../post");

// 1.extend base asset to implement your custom asset
class CreateChildPostAsset extends BaseAsset {
  // 2.define unique asset name and id
  name = "createChildPost";
  id = 1;
  // 3.define asset schema for serialization
  schema = {
    $id: "lisk/post/createChild",
    type: "object",
    required: ["message", "parentPost"],
    properties: {
      message: {
        dataType: "string",
        fieldNumber: 1,
      },
      parentPost: {
        dataType: "bytes",
        fieldNumber: 2,
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

    const allPosts = await getAllPosts(stateStore);
    const parentPostIndex = allPosts.findIndex((a) => a.id.equals(asset.parentPost));
    if (parentPostIndex < 0) {
      throw new Error("Parent post does not exist.")
    }

    // 5.create post
    const post = createChildPost({
      message: asset.message,
      ownerAddress: senderAddress,
      nonce: transaction.nonce,
      parentPost: asset.parentPost,
    });

    // 6.update sender account with unique post id
    senderAccount.socmed.posts.push(post.id);
    await stateStore.account.set(senderAddress, senderAccount);

    // 7.credit parentPost account and add post.id to replies array
    allPosts[parentPostIndex].replies.push(post.id);

    // 7.debit tokens from sender account to create nft
    // await reducerHandler.invoke("token:debit", {
    //   address: senderAddress,
    //   amount: asset.initValue,
    // });

    // 8.save posts
    allPosts.push(post);
    await setAllPosts(stateStore, allPosts);

    if (allPosts[parentPostIndex].ownerAddress !== senderAddress) {
      await reducerHandler.invoke("token:credit", {
        address: allPosts[parentPostIndex].ownerAddress,
        amount: 100000000n,
      });
    }
  }
}

module.exports = CreateChildPostAsset;
