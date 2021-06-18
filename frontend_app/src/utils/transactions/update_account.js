/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const updateAccountSchema = {
  $id: "lisk/update-account-asset",
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

export const updateAccount = async ({
  address,
  bio,
  avatar,
  passphrase,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const addressFromPass = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(addressFromPass);

  const { id, ...rest } = transactions.signTransaction(
    updateAccountSchema,
    {
      moduleID: 1024,
      assetID: 13,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        address: Buffer.from(address, 'hex'),
        bio,
        avatar,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(updateAccountSchema), rest),
    minFee: calcMinTxFee(updateAccountSchema, minFeePerByte, rest),
  };
};
