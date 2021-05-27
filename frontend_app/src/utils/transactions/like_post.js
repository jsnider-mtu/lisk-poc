/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const likePostSchema = {
  $id: "lisk/like-post-asset",
  type: "object",
  required: ["postId", "likerAddress"],
  properties: {
    postId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    likerAddress: {
      dataType: "bytes",
      fieldNumber: 2,
    },
  },
};

export const likePost = async ({
  postId,
  likerAddress,
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
    likePostSchema,
    {
      moduleID: 1024,
      assetID: 2,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        postId,
        likerAddress,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(likePostSchema), rest),
    minFee: calcMinTxFee(likePostSchema, minFeePerByte, rest),
  };
};
