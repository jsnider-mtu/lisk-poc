/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const updateNFTMinPriceSchema = {
  $id: "lisk/nft/updateminprice",
  type: "object",
  required: ["nftId", "minPrice"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    name: {
      dataType: "string",
      fieldNumber: 2,
    },
    minPrice: {
      dataType: "uint64",
      fieldNumber: 3,
    },
  },
};

export const updateNFTMinPrice = async ({
                                          name,
                                          nftId,
                                          passphrase,
                                          minPrice,
                                          fee,
                                          networkIdentifier,
                                          minFeePerByte,
                                        }) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase);
  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address.toString("hex"));

  const { id, ...rest } = transactions.signTransaction(
    updateNFTMinPriceSchema,
    {
      moduleID: 1024,
      assetID: 3,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        nftId: Buffer.from(nftId, "hex"),
        minPrice: BigInt(transactions.convertLSKToBeddows(minPrice)),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(updateNFTMinPriceSchema), rest),
    minFee: calcMinTxFee(updateNFTMinPriceSchema, minFeePerByte, rest),
  };
};
