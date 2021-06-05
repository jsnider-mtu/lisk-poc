const { BaseAsset } = require("lisk-sdk");

class UpdateAccountAsset extends BaseAsset {
  name = "updateAccount";
  id = 13;
  schema = {
    $id: "lisk/account/update",
    type: "object",
    required: ["address", "name", "bio", "avatar"],
    properties: {
      address: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      name: {
        dataType: "string",
        fieldNumber: 2,
      },
      bio: {
        dataType: "string",
        fieldNumber: 3,
      },
      avatar: {
        dataType: "string",
        fieldNumber: 4,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const updatedAddress = asset.address;
    const updatedAccount = await stateStore.account.get(updatedAddress);

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    // Error if trying to update someone else
    if (updatedAddress.notEquals(senderAddress)) {
      throw new Error("No updating someone else");
    }

    // Set updatedAccount properties
    updatedAccount.socmed.name = asset.name;
    updatedAccount.socmed.bio = asset.bio;
    updatedAccount.socmed.avatar = asset.avatar;
    await stateStore.account.set(updatedAddress, updatedAccount);
  }
}

module.exports = UpdateAccountAsset;
