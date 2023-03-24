import React from 'react';
import {ethers} from 'ethers';
import NFTMarket from './NFTMarket.json';

// const NFTMarketAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";

// async function createNFT(imgurl){
// 	if (typeof window.ethereum !== "undefined") {
//         //ethereum is usable get reference to the contract
// 		await this.requestAccount();
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
// 		const signer = provider.getSigner();
//         const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
// 	}
// 	const transaction = await contract.createNFT(imgurl);
// 	await transaction.wait();

// }
// async function requestAccount() {
// 	await window.ethereum.request({method: 'eth_requestAccounts'});
// }

const Create = () => {
	const NFTMarketAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";

	async function createNFT(imgurl){
	if (imgurl && typeof window.ethereum !== "undefined") {
        //ethereum is usable get reference to the contract
		await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
        const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
		const transaction = await contract.createNFT(imgurl);
		await transaction.wait();
		
	}

}
	async function requestAccount() {
		await window.ethereum.request({method: 'eth_requestAccounts'});
}
async function displaynft(){
	await requestAccount();
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
	const startID = 1;
	const endID = await contract.getCurrentID();
	const nftInfoDiv = document.getElementById('nft-info');
	nftInfoDiv.innerHTML="";

// Loop through all token IDs and retrieve the owner and URI for each one
	console.log("endId:",endID);
	// contract.methods.totalSupply().call((error, result) => {
	// 	if (!error) {
	// 	console.log(`Total NFTs minted: ${result}`);
	// 	}
	// });
for (let i = startID; i <= endID; i++) {
	contract.ownerOf(i)
	.then(owner => {
		contract.minteraddress(i)
		.then(minter =>{
			contract.getCallerAddress()
			.then(currentaccount =>{
				if(currentaccount==minter){
			contract.tokenURI(i)
			.then(tokenURI => {
			const nftInfo = document.createElement('div');
			nftInfo.innerHTML = `<br>Token ID: ${i}<br><span>Owner:</span> ${owner}<br><span>Minter:</span> ${minter}<br><span>URI:</span> ${tokenURI}<br>`;
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
	})
	})
}
}
async function getaccount(){
	await requestAccount();
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
	let result;
	contract.getCallerAddress().then((result) => {
		// The address of the caller
		document.getElementById("address").innerHTML=result;
	})
}
return (
	<div>
	<h1>Create your NFT</h1>
	<label>Image URL:</label>
    <input type="text" id="ImageURL" name="ImageURL"></input>
	<button onClick={() => {
                const imgurl = document.getElementById("ImageURL").value;
                createNFT(imgurl);
            }}>Submit</button><br></br>
	<button onClick={() => {
                getaccount();
            }}>Current Address</button><br></br>
	<h3 id="address"></h3><br></br>
	<button onClick={() => {
                displaynft();
            }}>Minted NFTs</button>
	<div id="nft-info"></div>
	</div>
);
};

export default Create;
