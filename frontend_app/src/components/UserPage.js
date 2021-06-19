import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { useParams } from "react-router-dom";
import { fetchAccountInfo, getAllTransactions } from "../api";
import Account from "./Account";

function UserPage() {
  const { username } = useParams();
  const [account, setAccount] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const allTransactions = await getAllTransactions();
      const cuTransactions = allTransactions.filter((tx) => tx['moduleID'] === 1024 && tx['assetID'] === 14);
      const address = cuTransactions.find((t) => t['name'] === username)['address'];
      setAccount(await fetchAccountInfo(address));
      setLoaded(true);
    }

    fetchData();
  }, [username]);

  return loaded ? <Account account={account} /> : <Fragment><CssBaseline /></Fragment>;
}

export default UserPage;
