import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button, Form } from "react-bootstrap";
import { useState } from "react";




const NftCard = ({ nft, RentNft, BuyNft, setforSale, setforRent, SetbuyPrice, SetrentPrice, endRent, isOwner, address}) => {
  const {index, owner, name, description, image, rentPrice, buyPrice, forSale, forRent, isRented, timeUnit, expires  } = nft;


  const [buyprice, setBuyprice] = useState("");
  const [rentprice, setRentprice] = useState("");
  const [duration, setDuration] = useState("");

 
  const handleRentNft = ()=>{
    RentNft(index, duration);
}
  const handleBuyNft = ()=>{
    BuyNft(index);
}
  
  const handleSetBuyPrice = ()=>{
    SetbuyPrice(index, buyprice);
}

const handleSetRentPrice = ()=>{
  SetrentPrice(index, rentprice);
}

const handleSetForsale = ()=>{
  setforSale(index);
}

const handleSetForrent = ()=>{
  setforRent(index);
}

  const handleEndRent = () => {
		endRent(index);
	};


  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1">{description}</Card.Text>
          <Card.Text className="flex-grow-1">expires at {expires}</Card.Text>
          <Card.Text className="flex-grow-1">Time Unit: {timeUnit}</Card.Text>

          {isOwner !== true && forSale === true && buyPrice > 0 && (
  <div className="d-flex m-2 justify-content-center">
    <button onClick={()=> handleBuyNft()} className= "btn btn-primary"
  >
    Buy NFT
    </button>
  </div>
)}


{isOwner !== true && forRent === true && rentPrice > 0 &&  (
  <>
  <Form.Control
    className={"pt-2 mb-1"}
    type="text"
    placeholder="Enter duration"
    onChange={(e) => {
      setDuration(e.target.value);
    }}
  />
  <Button
    variant="primary"
    onClick={() => handleRentNft()}
  >
    Rent Nft
  </Button>
</>
)}



{isOwner && (
  <div className="d-flex m-2 justify-content-center">
    <Button 
    variant = "primary"
    onClick={()=> handleSetForsale()} 
    className= {"mb-4"}
  >
     {forSale ? "toggle not for sale" : "toggle for sale"} 
    </Button>
    <div className="d-flex m-2 justify-content-center">
    <p>{forSale ? "This NFT is set to for Sale": "This nft is set to not forsale"}</p>
    </div>
  </div>
)}


{isOwner && (
  <div className="d-flex m-2 justify-content-center">
    <button onClick={()=> handleSetForrent()} className= "btn btn-primary"
  >
     {forRent ? "toggle not for rent" : "toggle for rent"} 
    </button>
    <div className="d-flex m-2 justify-content-center">
    <p>{forRent ? "This NFT is set to for Rent": "This nft is set to not forRent"}</p>
    </div>
  </div>
)}

{isOwner === true && (
  <>
    <Form.Control
      className={"pt-2 mb-1"}
      type="text"
      placeholder="Enter buy price"
      onChange={(e) => {
        setBuyprice(e.target.value);
      }}
    />
    <Button
      variant="primary"
      onClick={() => handleSetBuyPrice()}
    >
      Set buy price
    </Button>
  </>
)}


{isOwner === true && (
  <>
    <Form.Control
      className={"pt-2 mb-1"}
      type="text"
      placeholder="Enter rent price"
      onChange={(e) => {
        setRentprice(e.target.value);
      }}
    />
    <Button
      variant="primary"
      onClick={() => handleSetRentPrice()}
    >
      Set rent price
    </Button>
  </>
)}




{isOwner === true && isRented === true && (
  <div className="d-flex m-2 justify-content-center">
    <button onClick={()=> handleEndRent ()} className= "btn btn-primary"
  >
    End Rent
    </button>
  </div>
)}
        </Card.Body>
      </Card>
    </Col>
  );
};









NftCard.propTypes = {

  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
