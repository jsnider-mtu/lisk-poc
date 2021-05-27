/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const unlikePostSchema = {
  $id: "lisk/unlike-post-asset",
  type: "object",
  required: ["postId"],
  properties: {
    postId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

export const unlikePost = async ({
  postId,
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
    unlikePostSchema,
    {
      moduleID: 1024,
      assetID: 5,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        postId,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(unlikePostSchema), rest),
    minFee: calcMinTxFee(unlikePostSchema, minFeePerByte, rest),
  };
};
