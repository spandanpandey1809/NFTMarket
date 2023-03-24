import { ethers } from 'ethers';

async function connect() {
  // Check if the user is already logged in to a wallet
  if (window.ethereum && window.ethereum.selectedAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(`Connected to wallet with address ${await signer.getAddress()}`);
  } else {
    try {
      // Request access to the user's wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(`Connected to wallet with address ${await signer.getAddress()}`);
    } catch (err) {
      console.error(err);
    }
  }
}

const connectButton = document.createElement('button');
connectButton.textContent = 'Connect Wallet';
connectButton.addEventListener('click', connect);

const body = document.getElementsByTagName('body')[0];
connectButton.style.position = 'fixed';
connectButton.style.top = '10px';
connectButton.style.right = '10px';
body.appendChild(connectButton);
