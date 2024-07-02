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
This project uses Pinata IPFS
You need to register an account [here](https://www.pinata.cloud/), then follow the instructions and get your API Key. And then paste it into your .env file (IPFS_TOKEN)
You can read documentation about Pinata [here](https://docs.pinata.cloud/introduction)

### To get the WALLET_CONNECT_PROJECT_ID
Wallet connect is a tool used for providing a good already built wallet connection UX
You need to register at [cloud.walletconnect.com](https://cloud.walletconnect.com/sign-in)
And create a project

### 🌐 Development Server
Start the development server at http://localhost:3000
```bash
npm run dev
```
