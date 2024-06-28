# Frontend

## 🛠 Development

### Navigate into frontend folder first, if you're not with
```bash
cd frontend
```

- Then install the dependencies
```bash
npm i
```

### To use the deployed conctract
- Paste the contract's address into .env file to FUNDRAISING_CONTRACT_ADDRESS variable

### Using IPFS
This project uses web3.storage IPFS
You need to register an account, then create a space and get the secrects (IPFS_KEY and IPFS_PROOF). And then paste them into your .env file
Read documentation about web3 storage [here](https://web3.storage/docs/how-to/create-space/)
#### To get the IPFS_KEY run:
```bash
w3 key create
```
And store the private key (starting "Mg...") in environment variable IPFS_KEY

#### To get the IPFS_PROOF run:
```bash
w3 delegation create <did_from_ucan-key_command_above> --base64
```
Store the output in environment variable IPFS_PROOF

More on how to get these variables and what are they used for [here](https://web3.storage/docs/how-to/upload/#bring-your-own-delegations)

### To get the WALLET_CONNECT_PROJECT_ID
Wallet connect is a tool used for providing a good already built wallet connection UX
You need to register at [cloud.walletconnect.com](https://cloud.walletconnect.com/sign-in)
And create a project

### 🌐 Development Server
Start the development server at http://localhost:3000
```bash
npm run dev
```
