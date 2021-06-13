const { BaseModule } = require("lisk-sdk");
const { getAllPostsAsJSON } = require('./post');

const BanAccount = require('./transactions/ban_account');
const CreateChildPost = require('./transactions/create_child_post');
const CreatePost = require('./transactions/create_post');
const DeletePost = require('./transactions/delete_post');
const DemoteAccount = require('./transactions/demote_account');
const FollowAccount = require('./transactions/follow_account');
const LikePost = require('./transactions/like_post');
const PromoteAccount = require('./transactions/promote_account');
const SharePost = require('./transactions/share_post');
const UnbanAccount = require('./transactions/unban_account');
const UndeletePost = require('./transactions/undelete_post');
const UnfollowAccount = require('./transactions/unfollow_account');
const UnlikePost = require('./transactions/unlike_post');
const UpdateAccount = require('./transactions/update_account');
const CreateAccount = require('./transactions/create_account');

// Extend base module to implement your custom module
class SOCMEDModule extends BaseModule {
  name = "socmed";
  id = 1024;
  accountSchema = {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        dataType: "string",
        fieldNumber: 1,
      },
      bio: {
        dataType: "string",
        fieldNumber: 2,
      },
      avatar: {
        dataType: "string",
        fieldNumber: 3,
      },
      posts: {
        type: "array",
        fieldNumber: 4,
        items: {
          dataType: "bytes",
        },
      },
      follows: {
        type: "array",
        fieldNumber: 5,
        items: {
          dataType: "bytes",
        },
      },
      following: {
        type: "array",
        fieldNumber: 6,
        items: {
          dataType: "bytes",
        },
      },
      moderator: {
        dataType: "boolean",
        fieldNumber: 7,
      },
      banned: {
        dataType: "boolean",
        fieldNumber: 8,
      },
    },
    default: {
      bio: "",
      avatar: "",
      posts: [],
      follows: [],
      following: [],
      moderator: false,
      banned: false,
    },
  };
  beforeTransactionApply = async ({ transaction, stateStore, reducerHandler }) => {
    if (transaction.moduleID === 1024 && transaction.assetID === 14) {
      console.log("started beforeTransactionApply");
      const sender = await stateStore.account.getOrDefault(transaction.senderAddress);
      console.log("got default");
      await stateStore.account.set(transaction.senderAddress, sender);
      console.log("Set account in stateStore");
      console.log(sender);
      if (!sender.hasOwnProperty('token')) {
        await reducerHandler.invoke("token:credit", {
          address: transaction.senderAddress,
          amount: BigInt(100000000),
        });
      }
      console.log("ended beforeTransactionApply");
    }
  }
  transactionAssets = [new BanAccount(), new CreateChildPost(), new CreatePost(), new DeletePost(), new DemoteAccount(), new FollowAccount(), new LikePost(), new PromoteAccount(), new SharePost(), new UnbanAccount(), new UndeletePost(), new UnfollowAccount(), new UnlikePost(), new UpdateAccount(), new CreateAccount()];
  actions = {
    // get all the registered posts from blockchain
    getAllPosts: async () => getAllPostsAsJSON(this._dataAccess),
  };
}

module.exports = { SOCMEDModule };
