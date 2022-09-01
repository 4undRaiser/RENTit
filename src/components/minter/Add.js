/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import {create as ipfsHttpClient} from "ipfs-http-client";
require('dotenv').config({path: '.env'});




const AddNfts = ({ save }, address) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");

  
  const [show, setShow] = useState(false);



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


  // check if all form data has been filled
  const isFormFilled = () =>
    name && description && ipfsImage;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
 
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-3 py-3"
      >
         <h1 className="fs-4 fw-bold mb-0 text-white">{"Mint"}</h1> 
        
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mint</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputName"
              label="name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Enter name of nft"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputDescription"
              label="description"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Enter description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadToIpfs(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsImage(imageUrl);
              }}
              placeholder="Product name"
            ></Form.Control>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save(
                name,
                description,
                ipfsImage,
              );
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;
