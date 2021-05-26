const { BaseAsset } = require("lisk-sdk");

class PromoteAccountAsset extends BaseAsset {
  name = "promoteAccount";
  id = 11;
  schema = {
    $id: "lisk/account/promote",
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

    const promotedAccount = await stateStore.account.get(asset.address);

    // Exit if not allowed to be unbanned by this sender
    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Account " + asset.address + " cannot be promoted by " + senderAddress);
    }

    // Exit if account is already banned
    if (promotedAccount.socmed.moderator !== true) {
        promotedAccount.socmed.moderator = true;
        await stateStore.account.set(asset.address, promotedAccount);
    } else {
        throw new Error("Account " + asset.address + " is already promoted");
    }
  }
}

module.exports = PromoteAccountAsset;
