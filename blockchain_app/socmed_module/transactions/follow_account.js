const { BaseAsset } = require("lisk-sdk");

class FollowAccountAsset extends BaseAsset {
  name = "followAccount";
  id = 7;
  schema = {
    $id: "lisk/account/follow",
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

    // Error if already following this account
    const followIndex = followedAccount.socmed.following.findIndex((l) => l.equals(senderAddress));
    if (followIndex >= 0) {
      throw new Error("Account " + followedAddress + " is already followed by " + senderAddress);
    }

    // Set senderAccount.follows
    senderAccount.socmed.follows.push(followedAddress);
    await stateStore.account.set(senderAddress, senderAccount);

    // Set followedAccount.following
    followedAccount.socmed.following.push(senderAddress);
    await stateStore.account.set(followedAddress, followedAccount);

    // Credit followedAccount
    await reducerHandler.invoke("token:credit", {
      address: followedAddress,
      amount: 100000000n,
    });
  }
}

module.exports = FollowAccountAsset;
