const { BaseAsset } = require("lisk-sdk");

class UnfollowAccountAsset extends BaseAsset {
  name = "unfollowAccount";
  id = 8;
  schema = {
    $id: "lisk/account/unfollow",
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
    const followedAddress = asset.address;
    const followedAccount = await stateStore.account.get(followedAddress);

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    // Exit if not currently followed by this sender
    const followIndex = followedAccount.socmed.following.findIndex((l) => l.equals(senderAddress));
    if (followIndex < 0) {
      throw new Error("Account " + followedAddress + " is not currently followed by " + senderAddress);
    }

    // Remove senderAddress from following array
    followedAccount.socmed.following.splice(followIndex, 1);
    await stateStore.account.set(followedAddress, followedAccount);

    // Set senderAccount.socmed.follows
    const followsIndex = senderAccount.socmed.follows.findIndex((m) => m.equals(followedAddress));
    senderAccount.socmed.follows.splice(followsIndex, 1);
    await stateStore.account.set(senderAddress, senderAccount);

    // Debit followedAccount
    await reducerHandler.invoke("token:debit", {
      address: followedAddress,
      amount: 10000000n,
    });
  }
}

module.exports = UnfollowAccountAsset;
