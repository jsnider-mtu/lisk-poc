/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const createPostSchema = {
  $id: "lisk/create-post-asset",
  type: "object",
  required: ["message"],
  properties: {
    message: {
      dataType: "string",
      fieldNumber: 1,
    },
  },
};

export const createPost = async ({
  message,
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
    createPostSchema,
    {
      moduleID: 1024,
      assetID: 0,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        message,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createPostSchema), rest),
    minFee: calcMinTxFee(createPostSchema, minFeePerByte, rest),
  };
};
