export const fetchNodeInfo = async () => {
  return fetch("http://"+window.location.hostname+":4000/api/node/info")
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const fetchAccountInfo = async (address) => {
  return fetch(`http://`+window.location.hostname+`:4000/api/accounts/${address}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const sendTransactions = async (tx) => {
  return fetch("http://"+window.location.hostname+":4000/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tx),
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const fetchAllPosts = async () => {
  return fetch("http://"+window.location.hostname+":8080/api/posts")
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const fetchPost = async (id) => {
  return fetch(`http://`+window.location.hostname+`:8080/api/posts/${id}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const getAllAccounts = async () => {
  return fetch(`http://`+window.location.hostname+`:8080/api/accounts`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const getAllTransactions = async () => {
  return fetch("http://"+window.location.hostname+":8080/api/transactions")
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    })
    .catch((error) => console.log(error));
};
