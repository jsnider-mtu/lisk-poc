/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const modPinPostSchema = {
  $id: "lisk/mod-pin-post-asset",
  type: "object",
  required: ["postId"],
  properties: {
    postId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

export const modPinPost = async ({
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
    modPinPostSchema,
    {
      moduleID: 1024,
      assetID: 15,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        postId: Buffer.from(postId, 'hex'),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(modPinPostSchema), rest),
    minFee: calcMinTxFee(modPinPostSchema, minFeePerByte, rest),
  };
};
