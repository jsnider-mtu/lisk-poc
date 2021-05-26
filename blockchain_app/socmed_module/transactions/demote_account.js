const { BaseAsset } = require("lisk-sdk");

class DemoteAccountAsset extends BaseAsset {
  name = "demoteAccount";
  id = 12;
  schema = {
    $id: "lisk/account/demote",
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

    const demotedAccount = await stateStore.account.get(asset.address);

    // Exit if not allowed to be unbanned by this sender
    if (senderAccount.socmed.moderator !== true) {
      throw new Error("Account " + asset.address + " cannot be demoted by " + senderAddress);
    }

    // Exit if account is already banned
    if (demotedAccount.socmed.moderator !== false) {
        demotedAccount.socmed.moderator = false;
        await stateStore.account.set(asset.address, demotedAccount);
    } else {
        throw new Error("Account " + asset.address + " is already demoted");
    }
  }
}

module.exports = DemoteAccountAsset;
