/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const followAccountSchema = {
  $id: "lisk/follow-account-asset",
  type: "object",
  required: ["address"],
  properties: {
    address: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

export const createPost = async ({
  address,
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
    followAccountSchema,
    {
      moduleID: 1024,
      assetID: 7,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        address,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(followAccountSchema), rest),
    minFee: calcMinTxFee(followAccountSchema, minFeePerByte, rest),
  };
};
