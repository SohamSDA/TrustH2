# TrustH2 Dashboard Setup Guide

## 🚀 Quick Start

1. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:

   - `VITE_CONTRACT`: Your deployed contract address on Polygon Amoy
   - `VITE_RPC`: Polygon Amoy RPC URL (optional, defaults to public RPC)
   - `VITE_WC_ID`: WalletConnect Project ID (optional, get from https://cloud.walletconnect.com/)

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:5174

## 🎯 Features Implemented

### ✅ Core Functionality

- **Role-based UI**: Shows different options based on user role (Producer/Certifier/Buyer/None)
- **Network Detection**: Prompts to switch to Polygon Amoy if on wrong network
- **Balance Display**: Shows H2 Credits balance for connected wallet
- **Transaction Tracking**: Shows last transaction with Polygonscan link

### ✅ Producer Actions

- **Request Mint**: Submit mint requests with amount and optional certificate CID
- Only available to users with Producer role

### ✅ Certifier Actions

- **Approve & Mint**: Approve pending mint requests by ID
- Only available to users with Certifier role

### ✅ General Actions (All Roles)

- **Transfer Credits**: Send H2 Credits to another address
- **Retire Credits**: Permanently retire credits with reason
- Available to all roles except "None"

### ✅ Design System

- **Dark Theme**: Modern dark UI with neutral-950 background
- **Inter Font**: Clean typography with tracking-tight
- **White Buttons**: Primary actions use white buttons with black text
- **Glass Cards**: Backdrop-blur cards with white/5 background
- **Toast Notifications**: Transaction feedback with styled toasts

## 🔧 Technical Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS v4
- **Web3**: wagmi + RainbowKit + viem + ethers
- **Network**: Polygon Amoy (Chain ID: 80002)
- **Query**: React Query for state management

## 📝 Contract Integration

The dashboard connects to your `GreenH2Credits` smart contract with these functions:

- `roles(address)` - Get user role (0=None, 1=Producer, 2=Certifier, 3=Buyer)
- `balance(address)` - Get H2 Credits balance
- `requestMint(bytes32, uint256)` - Request new credits (Producer only)
- `approveAndMint(uint256)` - Approve mint request (Certifier only)
- `transfer(address, uint256)` - Transfer credits
- `retire(uint256, string)` - Retire credits permanently

## 🎨 Customization

The design follows your specified requirements:

- Global dark theme with `bg-neutral-950`
- White primary buttons (`bg-white text-black`)
- Card style: `rounded-2xl p-5 bg-white/5 backdrop-blur shadow-lg border border-white/10`
- Input style: `rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-white/30`

## 🔗 Next Steps

1. Deploy your contract to Polygon Amoy testnet
2. Set the contract address in `.env`
3. Assign roles to test addresses using the contract owner functions
4. Test the full flow: Producer requests → Certifier approves → Transfer/Retire

Enjoy your TrustH2 dashboard! 🌟
