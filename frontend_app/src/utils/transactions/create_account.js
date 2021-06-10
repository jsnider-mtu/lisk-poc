/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
// import { fetchAccountInfo } from "../../api";

export const createAccountSchema = {
  $id: "lisk/create-account-asset",
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

export const createAccount = async ({
  address,
  name,
  passphrase,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  // const addressFromPass = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

  // const {
  //   sequence: { nonce },
  // } = await fetchAccountInfo(addressFromPass);

  const { id, ...rest } = transactions.signTransaction(
    createAccountSchema,
    {
      moduleID: 1024,
      assetID: 14,
      nonce: BigInt(0),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        address: Buffer.from(address, 'hex'),
        name,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createAccountSchema), rest),
    minFee: calcMinTxFee(createAccountSchema, minFeePerByte, rest),
  };
};
