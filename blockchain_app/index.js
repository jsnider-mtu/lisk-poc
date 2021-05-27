// 1.Import lisk sdk to create the blockchain application
const {
    Application,
    configDevnet,
    genesisBlockDevnet,
    HTTPAPIPlugin,
    utils,
} = require('lisk-sdk');

// 2.Import NFT module and Plugin
// const { NFTModule } = require('./nft_module');
// const { NFTAPIPlugin } = require('./nft_api_plugin');
const { SOCMEDModule } = require('./socmed_module');
const { SOCMEDAPIPlugin } = require('./socmed_api_plugin');

// 3.Update the genesis block accounts to include socmed module attributes
genesisBlockDevnet.header.timestamp = 1605699440;
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
            },
        }),
);

// 4.Update application config to include unique label
// and communityIdentifier to mitigate transaction replay
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
    label: 'socmed',
    // forging: {
    //     waitThreshold: 1,
    // },
    genesisConfig: {
        communityIdentifier: 'SocialMediaDemo',
        // blockTime: 2,
        maxPayloadLength: 30 * 1024,
        minFeePerByte: 0,
        baseFees: [
            // {
            //     "moduleID": 5,
            //     "assetID": 0,
            //     "baseFee": "0",
            // }
        ],
        // minRemainingBalance: "0",
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
const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

// 6.Register custom NFT Module and Plugins
// app.registerModule(NFTModule);
app.registerModule(SOCMEDModule);
app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(SOCMEDAPIPlugin);
// app.registerPlugin(NFTAPIPlugin);

// 7.Run the application
app
    .run()
    .then(() => console.info('SocMed Blockchain running....'))
    .catch(console.error);
