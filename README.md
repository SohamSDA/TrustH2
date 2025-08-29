# 🌱 TrustH2 - Green Hydrogen Credits System

A decentralized platform for trading verified green hydrogen credits on Polygon blockchain, enabling transparent carbon offsetting through renewable hydrogen production.

![TrustH2 Banner](https://via.placeholder.com/800x200/4ade80/ffffff?text=🌱+TrustH2+Green+Hydrogen+Credits)

## 🎯 **Overview**

TrustH2 revolutionizes the green hydrogen market by providing:
- **🔗 Transparent Credit Tracking**: Blockchain-based verification of green hydrogen credits
- **👥 Role-Based Access**: Secure workflow for Producers, Certifiers, and Buyers
- **♻️ Carbon Offsetting**: Direct retirement of credits for environmental impact
- **⚡ Real-time Trading**: Instant transfers with wallet integration

## 🏗️ **Project Structure**

```
TrustH2/
├── trusth2/                    # Smart Contract Backend
│   ├── contracts/              # Solidity smart contracts
│   │   └── GreenH2Credits.sol
│   ├── scripts/               # Deployment & utility scripts
│   │   ├── deploy.js
│   │   ├── setup-roles.js
│   │   └── smoke-test.js
│   ├── hardhat.config.cjs     # Hardhat configuration
│   └── package.json
│
├── trusth2-frontend/          # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── page.js       # Main application page
│   │   │   ├── layout.js     # Root layout
│   │   │   └── providers.js  # Web3 providers
│   │   └── config/
│   │       └── web3.js       # Web3 configuration
│   └── package.json
└── README.md
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Polygon Amoy testnet MATIC tokens

### Smart Contract Setup
```bash
cd trusth2
npm install
npm run compile
npm run deploy
npm run setup-roles
npm run smoke-test
```

### Frontend Setup
```bash
cd trusth2-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 **Smart Contract Features**

- **🎭 Multi-Role System**: Producer, Certifier, Buyer roles with access control
- **📝 Mint Request Workflow**: Structured request → approve → mint process
- **💰 Credit Management**: Transfer, retire, and track credits with precision
- **📜 Certificate Integration**: Link credits to verification certificates
- **🔒 Security**: Role-based permissions and secure transfers

## 🌐 **Deployed Contract**

**Polygon Amoy Testnet**: `0x3262E890a4404e9D84Cd600421fD98322066d969`

[🔍 View on PolygonScan](https://amoy.polygonscan.com/address/0x3262E890a4404e9D84Cd600421fD98322066d969)

## 🎨 **Frontend Features**

- **🔌 Wallet Integration**: RainbowKit + Wagmi for seamless Web3 connectivity
- **🎭 Role Management**: Easy switching between Producer/Certifier/Buyer roles
- **⚡ Credit Operations**: Mint, transfer, retire with real-time balance updates
- **📱 Responsive Design**: Clean, professional UI that works on all devices
- **🔄 Real-time Updates**: Live contract state synchronization

## 🛠️ **Tech Stack**

### Backend
- **Solidity** - Smart contract development
- **Hardhat** - Development environment
- **Polygon** - Layer 2 blockchain for low fees

### Frontend
- **Next.js 15** - React framework with App Router
- **TailwindCSS** - Utility-first CSS framework
- **RainbowKit** - Wallet connection interface
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum

## 📈 **Demo Flow**

1. **🔗 Connect Wallet** to Polygon Amoy testnet
2. **🏭 Producer Mode**: Request mint for new green hydrogen credits
3. **✅ Certifier Mode**: Approve and mint the requested credits
4. **🔄 Transfer Credits** between different accounts/roles
5. **♻️ Retire Credits** for carbon offsetting with detailed reasons

## 🎮 **How to Use**

### For Producers (Green Hydrogen Generators)
1. Set your role to "Producer"
2. Request mint with desired credit amount
3. Wait for certifier approval
4. Transfer credits to buyers

### For Certifiers (Verification Bodies)
1. Set your role to "Certifier"
2. Review pending mint requests
3. Approve verified green hydrogen production
4. Monitor credit issuance

### For Buyers (Companies/Individuals)
1. Set your role to "Buyer"
2. Purchase credits from producers
3. Retire credits for carbon offsetting
4. Track environmental impact

## 🚀 **Deployment**

### Frontend (Vercel/Netlify)
```bash
cd trusth2-frontend
npm run build
# Deploy to your preferred platform
```

### Smart Contract (Polygon Mainnet)
```bash
cd trusth2
# Update .env with mainnet RPC URL
npm run deploy:polygon
```

## 🌍 **Environmental Impact**

TrustH2 contributes to:
- **🌱 Green Energy Adoption**: Incentivizing renewable hydrogen production
- **📊 Transparent Reporting**: Blockchain-verified carbon offset tracking
- **🏭 Industrial Decarbonization**: Enabling companies to offset emissions
- **🔄 Circular Economy**: Creating value from clean energy production

## 🏆 **Hackathon Achievement**

Built in 24 hours with:
- ✅ Fully functional smart contract on testnet
- ✅ Complete frontend with wallet integration
- ✅ End-to-end tested workflow
- ✅ Professional UI/UX design
- ✅ Ready for production deployment

## 👥 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Polygon team for the excellent L2 infrastructure
- RainbowKit & Wagmi for outstanding Web3 developer experience
- The green hydrogen community for inspiration

---

**🌱 Building a sustainable future, one credit at a time.**

[Demo](https://trusth2.vercel.app) • [Contract](https://amoy.polygonscan.com/address/0x3262E890a4404e9D84Cd600421fD98322066d969) • [Documentation](https://github.com/SohamSDA/TrustH2/wiki)
