

# 🧠 AdSpace Protocol

AdSpace is a decentralized on-chain advertising rental protocol that enables publishers to tokenize ad spaces on their websites as NFTs and allows advertisers to rent them transparently using ETH. The system ensures real-time rental pricing using Chainlink oracles and manages availability through smart contracts.

This project was built as part of the Chainlink Hackathon.

---

## 🗂 Project Structure


```
chainlink-hackathon/
├── adspace/                       # Next.js Frontend Application
├── adspace-smart-contract/        # Forge-based Smart Contracts powered by Chainlink
└── adspace-provider/              # NPM SDK package to interact with smart contracts

```


---

## 🏛️ Project Architecture

### 1. **Frontend Application - [`adspace`](./adspace)**
A [Next.js](https://nextjs.org/) application responsible for the end-user experience. It provides:

- Publisher Dashboard: Mint NFT-based ad spaces
- Advertiser Interface: Browse, view, and rent available ad spaces
- Web3 integration: Connect wallet, rent using ETH
- Real-time rental status updates based on smart contract state

**Technologies:**
- Next.js + React
- Tailwind CSS
- Ethers.js
- IPFS (for ad metadata)
- Typescript
- Solidity
- Chainlink 
---

### 2. **Smart Contracts - [`adspace-smart-contract`](./adspace-smart-contract)**
A Foundry-based smart contract system that powers the protocol’s core logic:

#### ✅ `PiqselNFT.sol` (Main Contract)

- **ERC721** NFTs represent unique ad spaces
- Publishers mint NFTs with ad metadata (URL, size, tags, rental rate)
- Advertisers rent ad spaces for a time-bound duration
- Payments are processed in ETH but calculated in **USD using Chainlink price feeds**
- Protocol fee logic implemented
- Rental overlap checks to ensure ad slot availability

🔗 **Chainlink Integration:**
```solidity
AggregatorV3Interface internal priceFeed;
...
function getETHAmountForUSD(...) uses priceFeed.latestRoundData()
```

📄 [View `PiqselNFT.sol`](./adspace-smart-contract/src/PiqselNFT.sol)

---

### 3. **AdSpace Provider SDK - [`adspace-provider`](./adspace-provider)**

A reusable JavaScript SDK published to NPM for seamless integration:

* Fetch on-chain ad space metadata
* Interact with `PiqselNFT` contract (read/write)
* Wraps common interactions (renting, minting, querying) in helper functions

📦 This allows other developers to plug AdSpace into their applications.

---

## ⚙️ Chainlink Oracle Integration

**Chainlink Price Feeds** are used to ensure fair ETH pricing for rental durations, making the payment system USD-denominated with real-time exchange rates.

🧠 Oracle Usage in [`PiqselNFT.sol`](./adspace-smart-contract/src/PiqselNFT.sol):

```solidity
AggregatorV3Interface internal priceFeed;

function getETHAmountForUSD(uint256 usdAmountIn18Decimals) public view returns (uint256) {
    (, int256 price, , , ) = priceFeed.latestRoundData();
    ...
}

```
---

## 🪙 How It Works

1. **Publishers** mint NFTs representing ad spaces on their websites.
2. They define:

   * Page URL
   * Space ID
   * Dimensions
   * Hourly Rental Rate in USD
   * Tags & categories
3. **Advertisers** browse and rent ad spaces using ETH.
4. **Smart contract logic** ensures:

   * No time conflicts
   * Transparent rental history
   * ETH amounts calculated from USD via Chainlink oracles
   * Automatic payout to publishers and protocol treasury
5. **All data and transactions are stored on-chain**, ensuring full transparency and immutability.

---

## 📦 Contract Directory

| Contract        | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `PiqselNFT.sol` | Core NFT logic, rental management, pricing, payments |

🛠 Built with [Foundry](https://book.getfoundry.sh/)
📍 Source: [`adspace-smart-contract/src/PiqselNFT.sol`](./adspace-smart-contract/src/PiqselNFT.sol)

---
```bash
## 📚 Developer Guide

### Install Dependencies

bash
# Frontend
cd adspace
npm install

# Smart Contracts
cd ../adspace-smart-contract
forge install

# Provider SDK
cd ../adspace-provider
npm install
```

### Run Local Development Server

```bash
cd adspace
npm run dev

```
### Compile and Deploy Contracts

```bash
cd ../adspaceContract
forge build
forge deploy
```

---

## 🔐 Security Considerations

* Proper overflow checks and access control (`Ownable`)
* Safe ETH transfers with `.call{}`
* Chainlink price feed reliability
* Prevention of double-booked rentals with overlap checks

---

## 📈 Future Enhancements

* Dynamic pricing based on views (via Chainlink Functions)
* Decentralized arbitration for content violations
* Multi-chain support

---

## 👨‍💻 Authors

* **Rahul Sahani/Shorya Baj/Kanak Poddar** — [GitHub]((https://github.com/devilopers-united))

---

## 🛠 Tools & Frameworks

| Tool         | Role                   |
| ------------ | ---------------------- |
| Chainlink    | Price Oracle           |
| OpenZeppelin | ERC721, Ownable        |
| Foundry      | Smart Contract Toolkit |
| Next.js      | Frontend Framework     |
| TailwindCSS  | UI Styling             |
| IPFS         | Ad Metadata Storage    |

---


## ⭐️ Show your support

If you like this project, give it a star ⭐️ on [GitHub](https://github.com/rahulsahani1137/chainlink-hackathon.git)!



