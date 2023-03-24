import React from "react";
import {ethers} from 'ethers';
import NFTMarket from './NFTMarket.json';

const Market = () => {
	const NFTMarketAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";

	async function buyNFT(tokenid){
		if (typeof window.ethereum !== "undefined") {
			//ethereum is usable get reference to the contract
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
			const Tokenid2 = parseInt(tokenid,10);
			let listingprice;
			contract.getListingprice(Tokenid2).then((price) => {
				console.log(price);
				const listingprice = price;
			console.log("there",listingprice)
			const listingprice2 = listingprice.toString(); 
			console.log("here",listingprice2)
			const transaction = contract.buyNFT(Tokenid2,{value:listingprice2});
			transaction.wait();
			});
		}
	
	}
	async function requestAccount() {
		await window.ethereum.request({method: 'eth_requestAccounts'});
	}
	
	async function fetchListedNFTs() {
		//ethereum is usable get reference to the contract
		await requestAccount();
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
		const totalNFTs = await contract.getCurrentID();
		const nftInfoDiv = document.getElementById('nft-info');
		nftInfoDiv.innerHTML="";
		const processedNFTs = {};
		for (let i = 1; i <= totalNFTs; i++) {
			const price = await contract.getListingprice(i);
			if (price > 0 && !processedNFTs[i]) {
				contract.ownerOf(i)
				.then(owner => {
				contract.tokenURI(i)
					.then(tokenURI => {
					const nftInfo = document.createElement('div');
					nftInfo.innerHTML = `<br>Token ID: ${i}<br><span>Price:</span> ${price/1000000000000000000}<span> ETH</span><br>`;
					const nftImage = document.createElement('img');
					nftImage.src = tokenURI;
					nftImage.alt = `NFT image for Token ID: ${i}`;
					nftImage.style.width = '120px';
					nftImage.style.height = '120px';
					const nftThumbnail = document.createElement('div');
					nftThumbnail.style.width = '120px';
					nftThumbnail.style.height = '120px';
					nftThumbnail.style.overflow = 'hidden';
					nftThumbnail.appendChild(nftImage);
					nftInfo.appendChild(nftThumbnail);
					nftInfoDiv.appendChild(nftInfo);
					console.log('Token ID: %s, Owner: %s, URI:%s',i,owner,tokenURI);
					processedNFTs[i] = true;
				})
			})
				console.log(`NFT ${i} is listed for ${price} ether`);
			}
		}
}
// var count =(fetchListedNFTs() { var exe=false;
// 	return fetchListedNFTs(){
// 	if(!exe){
// 	exe=true;
// 	}
// 	};
// 	})():

// fetchListedNFTs();
// let isFetchListedNFTsCalled = false;

// document.addEventListener('DOMContentLoaded', () => {
// if (!isFetchListedNFTsCalled) {
// 	fetchListedNFTs();
// 	isFetchListedNFTsCalled = true;
// }
// });
return (
	<div>
	<h1>
		NFT Market
	</h1>
	<label>Token ID:</label>
	<input type="number" id="tokenid" name="tokenid"></input>
	<button onClick={() => {
                const tokenID = document.getElementById("tokenid").value;
                buyNFT(tokenID);
            }}>Submit</button><br></br>
	<button onClick={() => {
                fetchListedNFTs();
            }}>Fetch NFTs on Sale</button>
	<div id="nft-info"></div>
	</div>
);
};

export default Market;
