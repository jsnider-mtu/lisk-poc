const { codec, cryptography } = require("lisk-sdk");

const registeredPostsSchema = {
  $id: "lisk/socmed/registeredPosts",
  type: "object",
  required: ["registeredPosts"],
  properties: {
    registeredPosts: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ["id", "message", "ownerAddress"],// "username", "timestamp"],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          message: {
            dataType: "string",
            fieldNumber: 2,
          },
          ownerAddress: {
            dataType: "bytes",
            fieldNumber: 3,
          },
          likes: {
            type: "array",
            fieldNumber: 4,
            items: {
              dataType: "bytes", // addresses
            },
          },
          sharedPost: {
            dataType: "bytes",
            fieldNumber: 5
          },
          shares: {
            type: "array",
            fieldNumber: 6,
            items: {
              dataType: "bytes", // postIds
            },
          },
          parentPost: {
            dataType: "bytes",
            fieldNumber: 7,
          },
          replies: {
            type: "array",
            fieldNumber: 8,
            items: {
              dataType: "bytes", // postIds
            },
          },
          deleted: {
            dataType: "boolean",
            fieldNumber: 9,
          },
          username: {
            dataType: "string",
            fieldNumber: 10,
          },
          timestamp: {
            dataType: "string",
            fieldNumber: 11,
          },
          avatar: {
            dataType: "string",
            fieldNumber: 12,
          },
          hashtags: {
            type: "array",
            fieldNumber: 13,
            items: {
              dataType: "string",
            },
          },
          taggedusers: {
            type: "array",
            fieldNumber: 14,
            items: {
              dataType: "string",
            },
          },
          hyperlinks: {
            type: "array",
            fieldNumber: 15,
            items: {
              dataType: "string",
            },
          },
          banned: {
            dataType: "boolean",
            fieldNumber: 16,
          },
        },
      },
    },
  },
};

const CHAIN_STATE_POSTS = "socmed:registeredPosts";

const createPost = ({ message, ownerAddress, nonce, username, avatar }) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([ownerAddress, nonceBuffer]);
  const id = cryptography.hash(seed);

  // Validate size of message
  if (message.length > 512) {
    throw new Error("Message length must not exceed 512");
  }

  const words = message.split(/^|\s+/).filter(Boolean);
  let hashtags = [];
  let taggedusers = [];
  let hyperlinks = [];
  var i = 0;
  while (i < words.length) {
    if (words[i].startsWith('#')) {
      hashtags.push(words[i].slice(1));
      ++i;
    } else if (words[i].startsWith('@')) {
      taggedusers.push(words[i].slice(1));
      ++i;
    } else if (words[i].startsWith('http')) {
      hyperlinks.push(words[i]);
      ++i;
    } else {
      ++i;
    }
  }

  // Get timestamp
  const dateobj = new Date(Date.now());
  const timestamp = dateobj.toISOString();

  return {
    id,
    message,
    ownerAddress,
    likes: [],
    sharedPost: Buffer.alloc(0),
    shares: [],
    parentPost: Buffer.alloc(0),
    replies: [],
    deleted: false,
    username,
    timestamp,
    avatar,
    hashtags,
    taggedusers,
    hyperlinks,
    banned: false,
  };
};

const createChildPost = ({ message, ownerAddress, nonce, username, avatar, parentPost }) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([ownerAddress, nonceBuffer]);
  const id = cryptography.hash(seed);

  if (message.length > 512) {
    throw new Error("Message length must not exceed 512");
  }

  const words = message.split(' ');
  let hashtags = [];
  let taggedusers = [];
  let hyperlinks = [];
  var i = 0;
  while (i < words.length) {
    if (words[i].startsWith('#')) {
      hashtags.push(words[i].slice(1));
      ++i;
    } else if (words[i].startsWith('@')) {
      taggedusers.push(words[i].slice(1));
      ++i;
    } else if (words[i].startsWith('http')) {
      hyperlinks.push(words[i]);
      ++i;
    } else {
      ++i;
    }
  }

  // Get timestamp
  const dateobj = new Date(Date.now());
  const timestamp = dateobj.toISOString();

  return {
    id,
    message,
    ownerAddress,
    parentPost,
    likes: [],
    sharedPost: Buffer.alloc(0),
    shares: [],
    replies: [],
    deleted: false,
    username,
    timestamp,
    avatar,
    hashtags,
    taggedusers,
    hyperlinks,
    banned: false,
  };
};

const createSharePost = ({ message, ownerAddress, nonce, username, avatar, sharedPost }) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([ownerAddress, nonceBuffer]);
  const id = cryptography.hash(seed);

  if (message.length > 512) {
    throw new Error("Message length must not exceed 512");
  }

  const words = message.split(' ');
  let hashtags = [];
  let taggedusers = [];
  let hyperlinks = [];
  var i = 0;
  while (i < words.length) {
    if (words[i].startsWith('#')) {
      hashtags.push(words[i].slice(1));
      ++i;
    } else if (words[i].startsWith('@')) {
      taggedusers.push(words[i].slice(1));
      ++i;
    } else if (words[i].startsWith('http')) {
      hyperlinks.push(words[i]);
      ++i;
    } else {
      ++i;
    }
  }

  // Get timestamp
  const dateobj = new Date(Date.now());
  const timestamp = dateobj.toISOString();

  return {
    id,
    message,
    ownerAddress,
    sharedPost,
    likes: [],
    shares: [],
    parentPost: Buffer.alloc(0),
    replies: [],
    deleted: false,
    username,
    timestamp,
    avatar,
    hashtags,
    taggedusers,
    hyperlinks,
    banned: false,
  };
};

const getAllPosts = async (stateStore) => {
  const registeredPostsBuffer = await stateStore.chain.get(
    CHAIN_STATE_POSTS
  );
  if (!registeredPostsBuffer) {
    return [];
  }

  const registeredPosts = codec.decode(
    registeredPostsSchema,
    registeredPostsBuffer
  );

  return registeredPosts.registeredPosts;
};

const getAllPostsAsJSON = async (dataAccess) => {
  const registeredPostsBuffer = await dataAccess.getChainState(
    CHAIN_STATE_POSTS
  );

  if (!registeredPostsBuffer) {
    return [];
  }

  const registeredPosts = codec.decode(
    registeredPostsSchema,
    registeredPostsBuffer
  );

  return codec.toJSON(registeredPostsSchema, registeredPosts)
    .registeredPosts;
};

const setAllPosts = async (stateStore, posts) => {
  const registeredPosts = {
    registeredPosts: posts.sort((a, b) => a.id.compare(b.id)),
  };

  await stateStore.chain.set(
    CHAIN_STATE_POSTS,
    codec.encode(registeredPostsSchema, registeredPosts)
  );
};

module.exports = {
  registeredPostsSchema,
  CHAIN_STATE_POSTS,
  getAllPosts,
  setAllPosts,
  getAllPostsAsJSON,
  createPost,
  createChildPost,
  createSharePost,
};
