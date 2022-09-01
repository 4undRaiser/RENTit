import Web3 from "web3";
import MyNFTAbi from "./contracts/MyNFT.json";
import MyNFTAddress from "./contracts/MyNFT-address.json";



import React from 'react'

const Web3Client = async () => {

    let provider = window.ethereum;
    const web3 = new Web3(provider);
    const minterContract = new web3.eth.Contract(MyNFTAbi.abi, MyNFTAddress.MyNFT); 




  return (
    <div>Web3Client</div>
  )
}

export default Web3Client