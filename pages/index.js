import React, { useState, useEffect } from "react";
import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

// import "./App.css";

const App = () => {
  const [data, setData] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (data.contract) runExample();
  }, [data]);

  const init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the data, and then proceed with an
      // example of interacting with the contract's methods.
      setData({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const runExample = async () => {
    const { accounts, contract } = data;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update data with the result.
    setData({ ...data, storageValue: response });
  };

  return !data.web3 ? (
    <div>Loading Web3, accounts, and contract...</div>
  ) : (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show a
        stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 56</strong> of index.js.
      </p>
      <div>The stored value is: {data.storageValue}</div>
    </div>
  );
};

export default App;
