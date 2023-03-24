// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


struct NFTListing {
  uint256 price;
  address seller;
}

contract NFTMarket is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  using SafeMath for uint256;
  Counters.Counter private _tokenIDs;
  uint256 public nftCount = 0;
  mapping(uint256 => address) public originalOwner;
  mapping(uint256 => NFTListing) private _listings;

  // if tokenURI is not an empty string => an NFT was created
  // if price is not 0 => an NFT was listed
  // if price is 0 && tokenURI is an empty string => NFT was transferred (either bought, or the listing was canceled)
  event NFTTransfer(uint256 tokenID, address from, address to, string tokenURI, uint256 price);

  constructor() ERC721("MyNFTs", "MNFT") {}

  function createNFT(string calldata tokenURI) public  {
      _tokenIDs.increment();
      uint256 currentID = _tokenIDs.current();
      _safeMint(msg.sender, currentID);
      _setTokenURI(currentID, tokenURI);
      console.log("token id: ", currentID);
      nftCount+=1;
      console.log("NFT present right now: ",nftCount);
      originalOwner[currentID] = msg.sender;
      emit NFTTransfer(currentID, address(0),msg.sender, tokenURI, 0);
  }

  function listNFT(uint256 tokenID, uint256 price) public {
    require(price > 0, "NFTMarket: price must be greater than 0");
    //transferFrom(msg.sender, address(this), tokenID);
    _listings[tokenID] = NFTListing(price, msg.sender);
    //emit NFTTransfer(tokenID, msg.sender, address(this), "", price);
  }

  function buyNFT(uint256 tokenID) public payable {
     NFTListing memory listing = _listings[tokenID];
     require(listing.price > 0, "NFTMarket: nft not listed for sale");
     require(msg.value == listing.price, "NFTMarket: incorrect price");
     require(listing.seller != msg.sender, "NFTMarket: Owner cannot buy his own NFT");
     //ERC721(address(this)).transferFrom(address(this), msg.sender, tokenID);
     _transfer(listing.seller, msg.sender, tokenID);
     clearListing(tokenID);
     payable(listing.seller).transfer(listing.price.mul(95).div(100));
     //emit NFTTransfer(tokenID, address(this), msg.sender, "", 0);
     emit NFTTransfer(tokenID, listing.seller, msg.sender, "", 0);
  }

  function getCurrentID() public view returns (uint256) {
   // return _tokenIDs.current();
   return nftCount;
}

  function getCallerAddress() public view returns (address) {
    return msg.sender;
  }

  function getListingprice(uint256 tokenID) public view returns (uint256) {
    return _listings[tokenID].price;
  }

  function fetchNFTowner(uint256 tokenID) public view returns (address) {
    return _listings[tokenID].seller;
  }

  function minteraddress(uint256 tokenID) public view returns (address) {
    return originalOwner[tokenID];
  }

  function cancelListing(uint256 tokenID) public {
     NFTListing memory listing = _listings[tokenID];
     require(listing.price > 0, "NFTMarket: nft not listed for sale");
     require(listing.seller == msg.sender, "NFTMarket: you're not the seller");
     //ERC721(address(this)).transferFrom(address(this), msg.sender, tokenID);
     clearListing(tokenID);
     //emit NFTTransfer(tokenID, address(this), msg.sender, "", 0);
  }

  function withdrawFunds() public onlyOwner {
    uint256 balance =  address(this).balance;
    require(balance > 0, "NFTMarket: balance is zero");
    payable(msg.sender).transfer(balance); 
  }

  function clearListing(uint256 tokenID) private {
    _listings[tokenID].price = 0;
    _listings[tokenID].seller= address(0);
  }
}