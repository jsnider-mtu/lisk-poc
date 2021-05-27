/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const createChildPostSchema = {
  $id: "lisk/create-child-post-asset",
  type: "object",
  required: ["message", "parentPost"],
  properties: {
    message: {
      dataType: "string",
      fieldNumber: 1,
    },
    parentPost: {
      dataType: "bytes",
      fieldNumber: 2,
    },
  },
};

export const createChildPost = async ({
  message,
  parentPost,
  passphrase,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);

  const { id, ...rest } = transactions.signTransaction(
    createChildPostSchema,
    {
      moduleID: 1024,
      assetID: 1,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        message,
        parentPost: Buffer.from(parentPost, 'hex'),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createChildPostSchema), rest),
    minFee: calcMinTxFee(createChildPostSchema, minFeePerByte, rest),
  };
};
