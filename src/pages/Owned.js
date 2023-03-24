import React from 'react';
import {ethers} from 'ethers';
import NFTMarket from './NFTMarket.json';


const Owned = () => {
	const NFTMarketAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";

	async function listNFT(Tokenid,Price){
		if (typeof window.ethereum !== "undefined") {
			//ethereum is usable get reference to the contract
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
			const Tokenid2 = parseInt(Tokenid,10);
			const weiValue = ethers.utils.parseEther(Price)
			console.log(weiValue);
			const transaction = await contract.listNFT(Tokenid2,weiValue);
			await transaction.wait();
		}
	
	}
		async function requestAccount() {
			await window.ethereum.request({method: 'eth_requestAccounts'});
	}
	async function fetchownedNFTs() {
		await requestAccount();
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
		const totalNFTs = await contract.getCurrentID();
		const nftInfoDiv = document.getElementById('nft-info');
		nftInfoDiv.innerHTML="";
		let nftowner;
		contract.getCallerAddress().then((result) => {
			// The address of the caller
			nftowner=result;
		})
		console.log("totalnfts:",totalNFTs);
		for (let i = 1; i <= totalNFTs; i++) {
			const price = await contract.getListingprice(i);
			console.log("price",price)
			if (price > 0) {
				contract.fetchNFTowner(i)
				.then(owner => {
					console.log(typeof owner);
					console.log(owner);
					console.log(typeof nftowner);
					console.log(nftowner);
				if(owner===nftowner){
				contract.tokenURI(i)
					.then(tokenURI => {
					const nftInfo = document.createElement('div');
					nftInfo.innerHTML = `<br>Token ID: ${i}<br><span>Price:</span> ${price/1000000000000000000}<span> ETH</span><br><span>Listed On Marketplace!</span><br>`;
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
				})
			}
			})
				console.log(`NFT ${i} is listed for ${price} ether`);
			}
			else{
			contract.ownerOf(i)
				.then(owner => {
					console.log("in else");
					console.log(typeof owner);
					console.log(owner);
					console.log(typeof nftowner);
					console.log(nftowner);
				if(owner===nftowner){
				contract.tokenURI(i)
					.then(tokenURI => {
					const nftInfo = document.createElement('div');
					nftInfo.innerHTML = `<br>Token ID: ${i}<br><span>Price:</span> ${price/1000000000000000000}<span> ETH</span><br><span>Not Listed!</span><br>`;
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
				})
			}
			})
		}
	}
}
return (
	<div>
	<h1>List your NFT</h1>
	<label>Token ID:</label>
	<input type="number" id="tokenID" name="tokenID"></input>
	<label>Price:</label>
	<input type="number" step="0.01" id="price" name="price"></input>
	<button onClick={() => {
                const Price = document.getElementById("price").value;
				const Tokenid = document.getElementById("tokenID").value;
                listNFT(Tokenid,Price);
            }}>Submit</button><br></br>
	<button onClick={() => {
                fetchownedNFTs();
            }}>Fetch your NFTs</button>
	<div id="nft-info"></div>
	</div>
);
};

export default Owned;
