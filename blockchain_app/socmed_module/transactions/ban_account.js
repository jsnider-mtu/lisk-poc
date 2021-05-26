const { BaseAsset } = require("lisk-sdk");

class BanAccountAsset extends BaseAsset {
  name = "banAccount";
  id = 9;
  schema = {
    $id: "lisk/account/ban",
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

    // Exit if not allowed to be deleted by this sender
    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Account " + asset.address + " cannot be banned by " + senderAddress);
    }

    // Exit if account is already banned
    if (bannedAccount.socmed.banned !== true) {
        bannedAccount.socmed.banned = true;
        await stateStore.account.set(asset.address, bannedAccount);
    } else {
        throw new Error("Account " + asset.address + " is already banned");
    }
  }
}

module.exports = BanAccountAsset;
