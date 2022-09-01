
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from ".././ui/Loader";
import { NotificationSuccess, NotificationError } from ".././ui/Notifications";
import { Row } from "react-bootstrap";
import { ethers } from "ethers";

const NftList = ({addNFT, getNfts, Rent, buy, toggleforRent, toggleforSale, setbuyPrice, setrentPrice, endrent, name, address}) => {


  

  /* performActions : used to run smart contract interactions in order
  *  address : fetch the address of the connected wallet
  */
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);


  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts();
      if (!allNfts) return
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  const createNft = async (data) => {
    try {
      setLoading(true);
      await addNFT(data);

     
      toast(<NotificationSuccess text="Updating NFT list...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };



  const RentNft = async (_index, _duration) => {
    try {
      setLoading(true);
      await Rent(_index, _duration);
      toast(<NotificationSuccess text="Renting NFT...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to rent NFT" />);
    } finally {
      setLoading(false);
    }
  };


  const BuyNft = async (_index) => {
    try {
      setLoading(true);
    
      await buy(_index);
      toast(<NotificationSuccess text="Buying NFT...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to buy NFT" />);
    } finally {
      setLoading(false);
    }
  };


  const forRent = async (_index) => {
    try {
      setLoading(true);
      await toggleforRent(_index);
      toast(<NotificationSuccess text="Changing for rent status...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change for rent status" />);
    } finally {
      setLoading(false);
    }
  };


  const forSale = async (_index) => {
    try {
      setLoading(true);
      await toggleforSale(_index);
      toast(<NotificationSuccess text="Changing for sale status...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change for sale NFT status" />);
    } finally {
      setLoading(false);
    }
  };


  const SetbuyPrice = async (_index, _price) => {
    try {
      setLoading(true);

      const price_ = await ethers.utils.parseUnits(String(_price), "ether");
      await setbuyPrice(_index, price_);
      toast(<NotificationSuccess text="Setting up the buy price...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to setup buy price" />);
    } finally {
      setLoading(false);
    }
  };


  const SetrentPrice = async (_index, _price) => {
    try {
      setLoading(true);
      const price_ = ethers.utils.parseUnits(String(_price), "ether");
      await setrentPrice(_index, price_);
    
      toast(<NotificationSuccess text="Setting up the rent price...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to setup rent price" />);
    } finally {
      setLoading(false);
    }
  };

  const endRent = async (_index) => {
    try {
      setLoading(true);
      await endrent(_index);
    // 
      toast(<NotificationSuccess text="ending rent..."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to end rent" />);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    try {
      if (address) {
        getAssets();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [address, getAssets]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{name}</h1>

                  <AddNfts save={createNft} address={address}/>
                  
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">

              {/* display all NFTs */}
              {nfts.map((_nft) => (
                  <Nft
                      key={_nft.index}
                      nft={{
                        ..._nft,
                      }}

                      RentNft={RentNft}
                      BuyNft={BuyNft}
                      setforSale={forSale}
                      setforRent={forRent}
                      SetbuyPrice={SetbuyPrice}
                      SetrentPrice={SetrentPrice}
                      endRent={endRent}
                      isOwner={_nft.owner === address}
                 

                      isForsale = {_nft.forSale}
                      isForrent = {_nft.forRent}
                      
                  />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {

  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;
