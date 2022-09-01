// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RENTit is Ownable {
    address contractor = payable(address(this));

    uint256 public listOfNft = 0;
    

    struct NftDetails {
        uint256 tokenId;
        IERC721 nftAddress;
        address payable owner;
        address user;
        uint256 rentPrice; 
        uint256 buyPrice;
        bool forSale;
        bool forRent;
        bool isRented;
        uint256 timeUnit;
        uint256 expires;
    }

    mapping(uint256 => NftDetails) public nftDetail;

  

    modifier nftOwner(uint256 _index) {
        require(nftDetail[_index].owner == msg.sender);
        _;

    }

    

    function list(IERC721 _nft, uint256 _tokenId) external {
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        nftDetail[_tokenId] = NftDetails(
            _tokenId,
            _nft,
            payable(msg.sender),
            address(0),
            0,
            0,
            false,
            false,
            false,
            0,
            0
        );
    }

    function rent(uint256 _index, uint256 _duration) public payable {
        NftDetails storage nft = nftDetail[_index];
        require(msg.sender != nft.owner, "You can't rent your NFT");
        require(nft.forRent == true, "Not for rent");

        uint256 _rentPrice = nft.rentPrice * _duration;
        nft.owner.transfer(_rentPrice);
        nft.user = msg.sender;
        nft.isRented = true;

        uint256 currentTime = block.timestamp;
        nft.expires = currentTime + _duration;
    }

    function buy(uint256 _index) public payable {
        NftDetails storage nft = nftDetail[_index];
        require(msg.sender != nft.owner, "You can't buy your NFT");
        require(nft.forSale == true, "Not for sale");
        require(nft.buyPrice > 0, "Price must be greater than zero");
        require(_index <= listOfNft, "NFT does not exist");

        nft.owner.transfer(nft.buyPrice);
        nft.nftAddress.transferFrom(address(this), msg.sender, nft.tokenId);

        nft.owner = payable(msg.sender);
        nft.forSale = false;
        nft.buyPrice = 0;
    }
    
    function getNfts(uint256 _index) public view returns(NftDetails memory) {
        return nftDetail[_index];
    }

    function toggleForRent(uint256 _index) public nftOwner(_index) {
        NftDetails storage nft = nftDetail[_index];
        require(nft.isRented == false, "The NFT is rented");
        nft.forRent = !nft.forRent;
    }

    function toggleForSale(uint256 _index) public  nftOwner(_index){
        NftDetails storage nft = nftDetail[_index];
        require(nft.buyPrice > 0, "Price should be greater than zero");
        nft.forSale = !nft.forSale;
    }

    function setBuyPrice(uint256 _index, uint256 _price) public nftOwner(_index){
        NftDetails storage nft = nftDetail[_index];
        require(_price > 0, "Price should be greater than zero");
        nft.buyPrice = _price;
    }

    function setRentPrice(uint256 _index, uint256 _price) public nftOwner(_index) {
        NftDetails storage nft = nftDetail[_index];
        require(_price > 0, "Price should be greater than zero");
        nft.rentPrice = _price;
    }

    function endRent(uint256 _index) public nftOwner(_index) {
        NftDetails storage nft = nftDetail[_index];
        require(msg.sender == nft.user, "Not authorized");
        require(block.timestamp >= nft.expires, "Rent has not expired");
        nft.expires = 0;
        nft.user = address(0);
        nft.isRented = false;
    }

     function getNftCount() public view returns (uint256) {
        return (listOfNft);
    }

    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw Matic");
    } 
}