# TrustH2 - Green Hydrogen Carbon Credits

A blockchain platform for trading green hydrogen carbon credits with role-based access control.

## What it does

- **Producers** request minting of carbon credits for green hydrogen production
- **Certifiers** verify and approve mint requests
- **Buyers** purchase credits in the marketplace
- **All users** can transfer and retire credits

## Tech Stack

**Frontend:**

- React + Vite
- Tailwind CSS
- RainbowKit (Web3 wallet connection)
- wagmi + viem (Ethereum interactions)

**Backend:**

- Solidity smart contracts
- Hardhat development environment
- Polygon Amoy testnet

## Quick Start

1. Install dependencies:

```bash
npm install
cd trusth2 && npm install && cd ..
```

2. Deploy contract:

```bash
cd trusth2
npm run deploy
npm run setup-roles
```

3. Start frontend:

```bash
npm run dev
```

## Contract

**Address:** `0x4A84Be8d54C1fF9abd01B54b2861318c046d93e4`  
**Network:** Polygon Amoy Testnet

Built for sustainable blockchain solutions 🌱
