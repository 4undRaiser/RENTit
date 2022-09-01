import './App.css';
import React from "react";
import { useState, useCallback } from 'react';
import Cover from "./components/Cover";
import {Notification} from "./components/ui/Notifications";
import Wallet from "./components/wallet";
import Nfts from "./components/minter";
import {Container, Nav} from "react-bootstrap";
import RENTitAbi from "./contracts/RENTit.json";
import RENTitAddress from "./contracts/RENTit-address.json";
import MinterAbi from "./contracts/Minter.json";
import MinterAddress from "./contracts/Minter-address.json";
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import {create as ipfsHttpClient} from "ipfs-http-client";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
require('dotenv').config({path: '.env'});


function App() {

  const [address, setAddress] = useState('');


  const web3 = createAlchemyWeb3(`https://eth-goerli.g.alchemy.com/v2/xiHtgd59SRD24sRMW9wQiUsLsikMmD0v`);

  const minterContract = new web3.eth.Contract(MinterAbi.abi, MinterAddress.Minter);

  const RentitContract = new web3.eth.Contract(RENTitAbi.abi, RENTitAddress.RENTit);


  const auth =
    "Basic " +
    Buffer.from(
      "2DoIlLS4PrP7nU82OIXiVnW09wo" +
            ":" +
            "c26281c5d482c10c67351f138d38c25e"
    ).toString("base64");

  const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  }
})
 

   const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(addressArray[0]);
        const obj = {
          status: "",
          address: addressArray[0],
        };
       
        console.log(address);
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😞" + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href="https://metamask.io/download.html">
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


  const addNFT = async ({name, description, ipfsImage})=>{


    const data = JSON.stringify({
      name,
      description,
      image: ipfsImage,
    });

    
     try {   

      // save NFT metadata to IPFS
			const added = await client.add(data);

			// IPFS url for uploaded metadata
			const url =  `https://RentIt.infura-ipfs.io/ipfs/${added.path}`;
        // mint the NFT and save the url to the blockchain
         let transaction = await minterContract.methods
         .mint(url)
         .send({ from: address });
         console.log(transaction);
         console.log(url);

         let nftCount = BigNumber.from(transaction.events.Transfer.returnValues.tokenId);

         await minterContract.methods
        .approve(RENTitAddress.RENTit, nftCount)
        .send({ from: address });

      await RentitContract.methods
        .list(MinterAddress.Minter, nftCount)
        .send({ from: address });

      return transaction;


     } catch (error) {
         console.log("Error uploading file: ", error);
     }

  }

 


  const getNfts = useCallback( async () => {
   
    try {
        const nfts = [];
        const nftsLength = await RentitContract.methods.getNftCount().call();
        for (let i = 0; i < Number(nftsLength); i++) {
                const nft = new Promise(async (resolve) => {
                const nfts = await RentitContract.methods.getNFTs(i).call();
                const res = await minterContract.methods.tokenURI(i).call();
                const meta = await fetchNftMeta(res);
                const owner = await fetchNftOwner(i);
             
              
                resolve({
                    index: i,
                    owner: owner,
                    name: meta.data.name,
                    description: meta.data.description,
                    image: meta.data.image,
                    rentPrice: nfts.rentPrice,
                    buyPrice: nfts.buyPrice,
                    forSale: nfts.forSale,
                    forRent: nfts.forRent,
                    isRented: nfts.isRented,
                    timeUnit: nfts.timeUnit,
                    expires: nfts.expires,

            
                });
            });
            nfts.push(nft);
        }
        return Promise.all(nfts);
    } catch (e) {
        console.log({e});
    }
});

  
  

const Rent = async (_index, _duration) => {
  try {
    return await RentitContract.rent(_index, _duration).call();
  } catch (e) {
    console.log({ e });
  }
};  


const buy = async (_index) => {
  try {
    return await RentitContract.buy(_index).call();
  } catch (e) {
    console.log({ e });
  }
};  


const toggleforRent = async (_index) => {
  try {
    return await RentitContract.toggleForRent(_index).call();
  } catch (e) {
    console.log({ e });
  }
};  

const toggleforSale = async (_index) => {
  try {
    return await RentitContract.toggleForSale(_index).call();
  } catch (e) {
    console.log({ e });
  }
};  


const setbuyPrice = async (_index, _buyprice) => {
  try {
    return await RentitContract.setbuyPrice(_index, _buyprice).call();
  } catch (e) {
    console.log({ e });
  }
}; 


const setrentPrice = async (_index, _rentprice) => {
  try {
    return await RentitContract.setRentPrice(_index, _rentprice).call();
  } catch (e) {
    console.log({ e });
  }
}; 

const endrent = async (_index) => {
  try {
    return await RentitContract.endRent(_index).call();
  } catch (e) {
    console.log({ e });
  }
}; 
  
      // get the metedata for an NFT from IPFS
 const fetchNftMeta = async (ipfsUrl) => {
  try {
      if (!ipfsUrl) return null;
      const meta = await axios.get(ipfsUrl);
      return meta;
  } catch (e) {
      console.log({e});
  }
};


const uploadToIpfs = async (e) => {
	const file = e.target.files[0];
	if (!file) return;
	try {
		const added = await client.add(file);
		return `https://RentIt.infura-ipfs.io/ipfs/${added.path}`;
	} catch (error) {
		console.log("Error uploading file: ", error);
	}
};


const fetchNftOwner = async (tokenId) => {
  try {
    return await minterContract.minterContract.ownerOf(tokenId).call();
  } catch (e) {
    console.log({ e });
  }
};

    return (
        <>
            <Notification/>

            {address ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                            {/*display user wallet*/}
                            <Wallet
                                address={address}
                            />
                        </Nav.Item>
                    </Nav>
                    <main>

                        {/*list NFTs*/}
                        <Nfts
                            addNFT={addNFT}
                            getNfts={getNfts}
                            name="RENTit"
                            address={address} 
                            Rent={Rent}
                            buy={buy}
                            toggleforRent={toggleforRent}
                            toggleforSale={toggleforSale}
                            setbuyPrice={setbuyPrice}
                            setrentPrice={setrentPrice}
                            endrent={endrent}
                        />
                    </main>
                </Container>
            ) : (
                //  if user wallet is not connected display cover page
                <Cover name="RENTit" coverImg="data:image/jpeg;base64,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" connect={connectWallet}/>
            )}
        </>
    );
}

export default App;
