/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const deletePostSchema = {
  $id: "lisk/delete-post-asset",
  type: "object",
  required: ["postId"],
  properties: {
    postId: {
      dataType: "string",
      fieldNumber: 1,
    },
  },
};

export const deletePost = async ({
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
    deletePostSchema,
    {
      moduleID: 1024,
      assetID: 4,
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
    tx: codec.codec.toJSON(getFullAssetSchema(deletePostSchema), rest),
    minFee: calcMinTxFee(deletePostSchema, minFeePerByte, rest),
  };
};
