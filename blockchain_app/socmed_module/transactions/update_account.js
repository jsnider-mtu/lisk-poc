const { BaseAsset } = require("lisk-sdk");

class UpdateAccountAsset extends BaseAsset {
  name = "updateAccount";
  id = 13;
  schema = {
    $id: "lisk/account/update",
    type: "object",
    required: ["address"],
    properties: {
      address: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      bio: {
        dataType: "string",
        fieldNumber: 2,
      },
      avatar: {
        dataType: "string",
        fieldNumber: 3,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const updatedAddress = asset.address;
    const updatedAccount = await stateStore.account.get(updatedAddress);

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    // Error if trying to update someone else
    if (!updatedAddress.equals(senderAddress)) {
      throw new Error("No updating someone else");
    }

    // Set updatedAccount properties
    updatedAccount.socmed.bio = asset.bio;
    updatedAccount.socmed.avatar = asset.avatar;
    await stateStore.account.set(updatedAddress, updatedAccount);
  }
}

module.exports = UpdateAccountAsset;
