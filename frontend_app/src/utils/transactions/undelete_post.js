/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const undeletePostSchema = {
  $id: "lisk/undelete-post-asset",
  type: "object",
  required: ["postId"],
  properties: {
    postId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

export const undeletePost = async ({
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
    undeletePostSchema,
    {
      moduleID: 1024,
      assetID: 6,
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
    tx: codec.codec.toJSON(getFullAssetSchema(undeletePostSchema), rest),
    minFee: calcMinTxFee(undeletePostSchema, minFeePerByte, rest),
  };
};
