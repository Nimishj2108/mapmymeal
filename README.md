# Map My Meal (SIH 2026 - SIH26234)
> **"Locate · Share · Reduce · Nourish"**
> *AI-Powered Smart Food Waste Reduction & Sustainable Redistribution Ecosystem for Institutional Kitchens and Food Processing Units*
> **Team:** Prompt!Please

---

## 🇮🇳 Project Overview

**Map My Meal** is a production-quality, mobile-first web app prototype built for the **Smart India Hackathon 2026** under Problem Statement **SIH26234**.

Institutional kitchens in universities (such as Delhi Technological University - DTU), corporate cafeterias, and banquet halls generate surplus food daily. Traditional redistribution suffers from coordination latency, safety uncertainty, and a lack of auditability. Map My Meal solves this with:

1. **Custom Hand-Drawn Delhi SVG Map**: Interactive vector map with Yamuna River, Ring Road, GT Karnal corridor, and DTU Campus callout. Features pulsating saffron pins for meals, navy pins for NGOs, and green pins for community kitchens.
2. **3-Tap AI Food Classification Wizard**: Multi-modal simulated scanner determining freshness, shelf life, allergens, and allocating batches into 4 distinct bins:
   - **DONATE**: Fresh, high-protein/caloric meals dispatched to NGOs and shelters.
   - **SHELF LIFE**: Near-threshold meals routed via express 90-minute hot-hold logistics.
   - **RECYCLE**: Peels and prep trimmings diverted to campus biogas digesters and composting.
   - **THROW AWAY**: Microbiologically compromised batches sent for safe disposal.
3. **Immutable Decision Ledger (SHA-256)**: Real browser-based WebCrypto SHA-256 blockchain tracking every AI classification, routing decision, claim, and kitchen inventory item. Includes a live **Chain Tampering Simulator** and **One-Click Cryptographic Restoration**.
4. **Waste Minimization Loss Function ($L$) Playground**:
   $$L = \alpha W + \beta E + \gamma M + \delta T - \eta Q - \lambda R$$
   With calibratable sliders ($\alpha=0.30, \beta=0.25, \gamma=0.20, \delta=0.15, \eta=0.10, \lambda=0.05$) and preloaded academic reference examples ($L = 0.0875$).
5. **Real-Time Delivery & NFT Verification**: Live vehicle movement along Delhi corridors, NFT package QR code sticker generation, and post-delivery volunteer rating chips.
6. **Bilingual Hindi & English UI**: Full Devanagari Hindi localization with instant language toggle.

---

## 🎨 Design System: Indian Tricolor

- **Saffron (`#FF9933`)**: Primary actions, surplus food pins, badges.
- **White (`#FFFFFF`) / Off-White (`#FFFDF8`)**: Clean neutral surfaces.
- **India Green (`#138808`)**: Verified states, community kitchens, success triggers.
- **Ashoka Chakra Navy (`#000080`)**: Headings, links, NGO nodes, 24-spoke chakra motifs.
- **Tricolor Accent Stripe**: Clean header borders and loading animations.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build
```bash
npm run build
```
Builds a static, 100% offline-ready bundle into the `dist/` directory.

---

## ☁️ Zero-Config Vercel Deployment

Map My Meal requires **zero environment variables** and runs entirely client-side.

1. Push this repository to GitHub or GitLab.
2. Import the repository into [Vercel](https://vercel.com).
3. The included `vercel.json` automatically configures the single-page application rewrite:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Click **Deploy**. The app is instantly live globally!

---

## 🧑‍⚖️ 5-Step Judge Evaluation Script

When evaluating on desktop, the **Judge Guided Script** panel on the left provides 1-click access to each core module:
1. **Namaste Splash & Role Switch**: 1-tap role selector without passwords (Donor, Recipient, NGO).
2. **Delhi SVG Live Grid**: Tappable meal pins with route polyline, distance/ETA, and 1-tap claim.
3. **AI Food Scan Wizard**: Multi-modal inspection, freshness rating, and 4-bin classification.
4. **SHA-256 Blockchain Ledger**: Live chain verification and tamper-proof demonstration.
5. **Loss Function & Live Transit**: Mathematical optimization playground and moving EV package delivery.

---

## 📜 License
Apache-2.0 · Smart India Hackathon 2026 · Team Prompt!Please.
