const { BaseAsset } = require("lisk-sdk");

class CreateAccountAsset extends BaseAsset {
  name = "createAccount";
  id = 14;
  schema = {
    $id: "lisk/account/create",
    type: "object",
    required: ["address", "name"],
    properties: {
      address: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      name: {
        dataType: "string",
        fieldNumber: 2,
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
    updatedAccount.socmed.name = asset.name;
    await stateStore.account.set(updatedAddress, updatedAccount);
  }
}

module.exports = CreateAccountAsset;
