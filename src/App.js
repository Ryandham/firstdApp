import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import waveportal from './utils/WavePortal.json';

export default function App() {

  // set var for currentAccount
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x46C99C9C81734387F4c29f9c628aAc178D4DF979";

  // run async function to check if a wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
        // make sure we have access to window.ethereum
      const { ethereum } = window;
      if (!ethereum) {
        console.log("need metamask!");
        return;
      } else {
        console.log("we have the eth object", ethereum);
      }

      // request accounts from ethereum 
      const accounts = await ethereum.request({method: 'eth_accounts'});

      // if the accounts exist, then set currentAccount to the currentAccount
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  // connect wallet method
  const connectWallet = async () =>
  {
    try {
      const { ethereum } = window;

      // if window is null
      if (!ethereum) {
        alert("download metamask!");
        return
      }
      
      // asking metamask for access to the user's wallet
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // is this connected
      console.log("Connected", accounts[0]);

      // set 
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  // wave method
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const waveportalContract = new ethers.Contract(contractAddress, waveportal.abi, signer);

        // here
        console.log("test")
        let count = await waveportalContract.getTotalWaves();

        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await waveportalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await waveportalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I'm Ryan! I'm a pm by day, degen by night. Connect your Ethereum wallet and wave at me!
        </div>
        
        <div className="buttonContainer"> 
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        </div>

        
          {!currentAccount && (
            <button className = "waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        
      </div>
    </div>
  );
}
