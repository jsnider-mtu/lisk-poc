export const fetchNodeInfo = async () => {
  return fetch("https://"+window.location.hostname+":4000/api/node/info")
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAccountInfo = async (address) => {
  return fetch(`https://`+window.location.hostname+`:4000/api/accounts/${address}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const sendTransactions = async (tx) => {
  return fetch("https://"+window.location.hostname+":4000/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tx),
  })
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAllPosts = async () => {
  return fetch("https://"+window.location.hostname+":8080/api/posts")
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchPost = async (id) => {
  return fetch(`https://`+window.location.hostname+`:8080/api/posts/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const getAllTransactions = async () => {
  return fetch("https://"+window.location.hostname+":8080/api/transactions")
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
};
