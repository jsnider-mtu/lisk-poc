const express = require("express");
const cors = require("cors");
const { BasePlugin, codec } = require("lisk-sdk");
const pJSON = require("../package.json");
const { getDBInstance, getAllAccounts, getAllTransactions, saveTransactions } = require("./db");

// 1.plugin can be a daemon/HTTP/Websocket service for off-chain processing
class SOCMEDAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;
  _channel = undefined;
  _db = undefined;
  _nodeInfo = undefined;

  static get alias() {
    return "SOCMEDHttpApi";
  }

  static get info() {
    return {
      author: pJSON.author,
      version: pJSON.version,
      name: pJSON.name,
    };
  }

  get defaults() {
    return {};
  }

  get events() {
    return [];
  }

  get actions() {
    return {};
  }

  async load(channel) {
    this._app = express();
    this._channel = channel;
    this._db = await getDBInstance();
    this._nodeInfo = await this._channel.invoke("app:getNodeInfo");


    this._app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));
    this._app.use(express.json());

    this._app.get("/api/posts", async (_req, res) => {
      const posts = await this._channel.invoke("socmed:getAllPosts");
      const data = await Promise.all(posts.map(async token => {
        const dbKey = `socmed:${token.id}`;
        // let tokenHistory = await getNFTHistory(this._db, dbKey);
        // tokenHistory = tokenHistory.map(h => h.toString('binary'));
        // tokenHistory = tokenHistory.map(h => {
        //   const addy = h.address.toString('binary');
        //   const pric = h.salePrice.toString();
        //   return {
        //     address: addy,
        //     salePrice: pric,
        //   }
        // });
        return {
          ...token,
          // tokenHistory,
        }
      }));

      res.json({ data });
    });

    this._app.get("/api/posts/:id", async (req, res) => {
      const posts = await this._channel.invoke("socmed:getAllPosts");
      const token = posts.find((t) => t.id === req.params.id);
      const dbKey = `socmed:${token.id}`;
      // let tokenHistory = await getNFTHistory(this._db, dbKey);
      // tokenHistory = tokenHistory.map(h => h.toString('binary'));
      // tokenHistory = tokenHistory.map(h => {
      //   const addy = h.address.toString('binary');
      //   const pric = h.salePrice.toString();
      //   return {
      //     address: addy,
      //     salePrice: pric,
      //   }
      // });

      // res.json({ data: { ...token, tokenHistory } });
      res.json({ data: { ...token } });
    });

    this._app.get("/api/transactions", async (_req, res) => {
      const transactions = await getAllTransactions(this._db, this.schemas);

      const data = transactions.map(trx => {
        const module = this._nodeInfo.registeredModules.find(m => m.id === trx.moduleID);
        const asset = module.transactionAssets.find(a => a.id === trx.assetID);
        return {
          ...trx,
          ...trx.asset,
          moduleName: module.name,
          assetName: asset.name,
        }
      })
      res.json({ data });
    });

    this._app.get("/api/accounts", async (_req, res) => {
      const accounts = await getAllAccounts(this._db, this.schemas);

      const data = accounts.map(trx => {
        const module = this._nodeInfo.registeredModules.find(m => m.id === trx.moduleID);
        const asset = module.transactionAssets.find(a => a.id === trx.assetID);
        return {
          ...trx,
          ...trx.asset,
          moduleName: module.name,
          assetName: asset.name,
        }
      })
      res.json({ data });
    });

    this._subscribeToChannel();

    this._server = this._app.listen(8080, "0.0.0.0");
  }

  _subscribeToChannel() {
    // listen to application events and enrich blockchain data for UI/third party application
    this._channel.subscribe('app:block:new', async (data) => {
      const { block } = data;
      const { payload } = codec.decode(
        this.schemas.block,
        Buffer.from(block, 'hex'),
      );
      if (payload.length > 0) {
        await saveTransactions(this._db, payload);
        // const decodedBlock = this.codec.decodeBlock(block);
        // save NFT transaction history
        // await saveNFTHistory(this._db, decodedBlock, this._nodeInfo.registeredModules, this._channel);
      }
    });
  }

  async unload() {
    // close http server
    await new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    // close database connection
    await this._db.close();
  }
}

module.exports = { SOCMEDAPIPlugin };
