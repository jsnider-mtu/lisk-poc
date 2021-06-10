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
    const createdAddress = asset.address;
    const createdAccount = await stateStore.account.get(createdAddress);

    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    // Error if trying to update someone else
    if (!createdAddress.equals(senderAddress)) {
      throw new Error("Error creating account: createdAddress !== senderAddress");
    }

    // Initialize account
    await reducerHandler.invoke("token:credit", {
      address: createdAddress,
      amount: 100000000n,
    });

    // Set username
    createdAccount.socmed.name = asset.name;
    await stateStore.account.set(createdAddress, createdAccount);
  }
}

module.exports = CreateAccountAsset;
