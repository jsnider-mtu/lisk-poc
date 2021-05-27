/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const sharePostSchema = {
  $id: "lisk/share-post-asset",
  type: "object",
  required: ["postId"],
  properties: {
    postId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    message: {
      dataType: "string",
      fieldNumber: 2,
    },
  },
};

export const sharePost = async ({
  postId,
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
    sharePostSchema,
    {
      moduleID: 1024,
      assetID: 3,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        postId,
        message,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(sharePostSchema), rest),
    minFee: calcMinTxFee(sharePostSchema, minFeePerByte, rest),
  };
};
