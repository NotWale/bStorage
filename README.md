WIP

# Bstorage
Blockchain file storage interface. Using arweave as file storage, bundlr to interact with it and the Polygon Blockchain.
Deployed on the Mumbai testnet, so the files only stay up for like about a week, feel free to deploy this on the mainnet for real usage..

Live version on [On Vercel](https://b-storage.vercel.app/)

(Requires testnet Mumbai MATIC and MetaMask installed)
Please make sure you're on Mumbai Testnet before using this dApp,
while I implement an error handling for this :')

How to use:
1. Click Initialize Bundlr and Sign in your Metamask
2. Fund bundlr Wallet (top left) through your (testnet) MATIC
3. Upload Files to Arweave through bundlr

WIP TODO:
- Play Button for music/videos
- Implement tipping.
- Rewrite smart contract in DVM-BASIC and deploy on Dero Stargate Testnet

BUGS TO BE FIXED:
- The upload might take a while to do.. patience required
- Loading doesn't wait for transaction finish. (even though it did before?)

Requirements(atm) for compiling:

Truffle: https://trufflesuite.com/

How to use(developer):

1. Compile smart contract with 'truffle compile --network mumbai'
2. Deploy smart contract with 'truffle deploy --network mumbai --reset'
2. Install dependencies using "yarn" in the main project folder
3. Afterwards run the frontend with "yarn run start"

