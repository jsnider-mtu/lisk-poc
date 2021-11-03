const { BaseAsset } = require("lisk-sdk");
const { getAllPosts, setAllPosts } = require("../post");

class UnbanAccountAsset extends BaseAsset {
  name = "unbanAccount";
  id = 10;
  schema = {
    $id: "lisk/account/unban",
    type: "object",
    required: ["address"],
    properties: {
      address: {
        dataType: "bytes",
        fieldNumber: 1,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    const bannedAccount = await stateStore.account.get(asset.address);

    // Exit if not allowed to be unbanned by this sender
    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Account " + asset.address + " cannot be unbanned by " + senderAddress);
    }

    // Exit if account is already banned
    if (bannedAccount.socmed.banned !== false) {
        bannedAccount.socmed.banned = false;
        await stateStore.account.set(asset.address, bannedAccount);
    } else {
        throw new Error("Account " + asset.address + " is not already banned");
    }

    // Set all bannedAccount's posts as no longer banned
    const posts = await getAllPosts(stateStore);
    bannedAccount.socmed.posts.forEach((p) => {
      let pIndex = posts.findIndex((t) => t.id.equals(p));
      posts[pIndex].banned = false;
    });
    await setAllPosts(stateStore, posts);
  }
}

module.exports = UnbanAccountAsset;
