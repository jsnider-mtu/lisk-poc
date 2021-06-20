const {DPoSModule, KeysModule, SequenceModule, TokenModule} = require('lisk-framework');
const {
    Application,
    configDevnet,
    genesisBlockDevnet,
    HTTPAPIPlugin,
    utils,
} = require('lisk-sdk');

const { SOCMEDModule } = require('./socmed_module');
const { SOCMEDAPIPlugin } = require('./socmed_api_plugin');

// 3.Update the genesis block accounts to include socmed module attributes
genesisBlockDevnet.header.timestamp = 1605699440;
genesisBlockDevnet.header.asset.accounts.push({address:'6577b5898d1448857a2928f4bce4d3d866378113',token:{balance:"0"},sequence:{nonce:"0"},keys:{mandatoryKeys:[],optionalKeys:[],numberOfSignatures:0},dpos:{delegate:{username:"moderator",pomHeights:[],consecutiveMissedBlocks:0,lastForgedHeight:0,isBanned:false,totalVotesReceived:"0"},sentVotes:[{delegateAddress:"03f6d90b7dbd0497dc3a52d1c27e23bb8c75897f",amount:"0"}],unlocking:[]}});
genesisBlockDevnet.header.asset.accounts.sort(function(a, b) {
  if (a.address < b.address) {
    return -1;
  }
  if (a.address > b.address) {
    return 1;
  }
  return 0;
});
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
    (a) =>
        utils.objects.mergeDeep({}, a, {
            socmed: {
                name: "",
                bio: "",
                avatar: "",
                posts: [],
                follows: [],   // accounts that this account follows
                following: [], // accounts following this one
                moderator: false,
                banned: false,
                displayname: "",
            },
        }),
);
const modAccountIndex = genesisBlockDevnet.header.asset.accounts.findIndex((a) => a.address === '6577b5898d1448857a2928f4bce4d3d866378113');
genesisBlockDevnet.header.asset.accounts[modAccountIndex].socmed.moderator = true;
genesisBlockDevnet.header.asset.accounts[modAccountIndex].socmed.name = 'afsa';

const genAccountIndex = genesisBlockDevnet.header.asset.accounts.findIndex((a) => a.address === 'd04699e57c4a3846c988f3c15306796f8eae5c1c');
genesisBlockDevnet.header.asset.accounts[genAccountIndex].token.balance = 0;

// 4.Update application config to include unique label
// and communityIdentifier to mitigate transaction replay
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
    label: 'socmed',
    // forging: {
    //     waitThreshold: 1,
    // },
    genesisConfig: {
        communityIdentifier: 'SocialMediaDemo',
        blockTime: 5,
        maxPayloadLength: 30 * 1024,
        minFeePerByte: 0,
        baseFees: [
            {
                "moduleID": 5,
                "assetID": 0,
                "baseFee": "0",
            }
        ],
        minRemainingBalance: "0",
    },
    // rpc: {
    //     enable: true,
    //     mode: 'ws',
    //     port: 4000,
    // },
    logger: {
        consoleLogLevel: 'info',
    },
});

// 5.Initialize the application with genesis block and application config
const app = new Application(genesisBlockDevnet, appConfig);

app._registerModule(SOCMEDModule, false);
app._registerModule(TokenModule, false);
app._registerModule(SequenceModule, false);
app._registerModule(KeysModule, false);
app._registerModule(DPoSModule, false);

app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(SOCMEDAPIPlugin);

// 7.Run the application
app
    .run()
    .then(() => console.info('SocMed Blockchain running....'))
    .catch(console.error);
