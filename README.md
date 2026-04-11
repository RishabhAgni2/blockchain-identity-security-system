# Blockchain Identity Security System

This project is a blockchain-backed document security application. Users can register, log in, upload documents, store each document's SHA-256 proof on-chain, and later verify whether a file still matches the blockchain record.

## What the application does

- Authenticates users with email, password, and JWT-based sessions
- Uploads documents through the React frontend
- Hashes uploaded files on the backend
- Stores document proofs on an Ethereum smart contract
- Saves document metadata and verification history in MongoDB
- Lets users verify whether a document is authentic or tampered


## Main flow

1. A user registers or logs in.
2. The frontend sends requests to the Express API.
3. On document upload, the backend hashes the file with SHA-256.
4. The hash is checked against the smart contract and stored on-chain if needed.
5. The app stores document metadata in MongoDB.
6. On verification, the backend hashes the uploaded file again and compares it with the blockchain proof.

## Tech stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, JWT, bcryptjs, Multer, Mongoose
- Database: MongoDB
- Blockchain: Solidity, Hardhat, Ethers.js
- Security primitives: SHA-256 hashing, JWT authentication

## Setup

### 1. Install dependencies

```powershell
cd frontend
npm install
cd ..\backend
npm install
cd ..\blockchain
npm install
```

### 2. Configure environment variables

Create a `.env` file for the backend with values like:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RPC_URL=your_blockchain_rpc_url
BLOCKCHAIN_PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
BCRYPT_SALT_ROUNDS=8
```

For the frontend, you can set:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is not set, the frontend now falls back to `http://<current-host>:5000`.

## Running the project

Start the backend:

```powershell
cd backend
npm run dev
```

Start the frontend:

```powershell
cd frontend
npm run dev
```

Deploy or update the smart contract from the `blockchain/` folder according to your network setup before testing upload and verification.

## Available API areas

- `/api/auth`: register and login
- `/api/documents`: upload, list, delete, and stats
- `/api/verify`: verify uploaded files against blockchain proofs

## Current status

The application already includes:

- Working authentication pages
- Protected dashboard access
- Document upload and blockchain proof storage
- Document verification tracking
- Basic dashboard statistics

## Notes

- Upload and verification speed can depend on blockchain RPC latency and transaction confirmation time.
- Authentication is much faster than document upload because auth only uses MongoDB and password hashing, while uploads may wait for blockchain confirmation.
