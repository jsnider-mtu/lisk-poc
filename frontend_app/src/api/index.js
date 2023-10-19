let apihost = window.location.hostname;

if (process.env.NODE_ENV === 'production') {
  apihost = 'tinyhippo.ninja';
};

const scheme = apihost === 'tinyhippo.ninja' && 'https' || 'http';
const apiport = apihost === 'tinyhippo.ninja' && '4001' || '4000';
const socmedapiport = apihost === 'tinyhippo.ninja' && '8081' || '8080';

export const fetchNodeInfo = async () => {
  return fetch(`${scheme}://${apihost}:${apiport}/api/node/info`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const fetchAccountInfo = async (address) => {
  return fetch(`${scheme}://${apihost}:${apiport}/api/accounts/${address}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const sendTransactions = async (tx) => {
  return fetch(`${scheme}://${apihost}:${apiport}/api/transactions`, {
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
  return fetch(`${scheme}://${apihost}:${socmedapiport}/api/posts`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const fetchPost = async (id) => {
  return fetch(`${scheme}://${apihost}:${socmedapiport}/api/posts/${id}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const getAllAccounts = async () => {
  return fetch(`${scheme}://${apihost}:${socmedapiport}/api/accounts`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => console.log(error));
};

export const getAllTransactions = async () => {
  return fetch(`${scheme}://${apihost}:${socmedapiport}/api/transactions`)
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    })
    .catch((error) => console.log(error));
};
