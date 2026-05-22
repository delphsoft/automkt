# BYD Marketplace MVP - Argentina

A peer-to-peer marketplace for selling Chinese EVs (BYD, Li Auto, etc.) in Argentina.

## 🚀 Quick Start (30 minutes)

### 1. Setup Firebase (5 min)
- Go to [console.firebase.google.com](https://console.firebase.google.com)
- Create project: `byd-marketplace`
- Enable: Authentication, Realtime Database, Storage
- Copy credentials to `.env.local`

### 2. Install & Run (5 min)
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### 3. Deploy to Vercel (10 min)
```bash
git push origin main
# Connect to vercel.com, add env vars, deploy
```

## 📋 Project Structure

```
app/                    # Next.js pages
├── page.tsx           # Home
├── browse/page.tsx    # Browse listings
├── sell/page.tsx      # Create listing
└── listing/[id]/page.tsx  # Listing detail

components/            # React components
├── ListingCard.tsx
└── ListingForm.tsx

lib/                    # Utilities
├── firebase.ts       # Firebase config
├── types.ts          # TypeScript types
└── renaper.ts        # RENAPER mock API

hooks/                  # Custom hooks
├── useAuth.ts
├── useListings.ts
├── useMessages.ts
└── useOffers.ts

store/                  # Zustand store
└── marketplace.ts
```

## ✨ Features

✅ User authentication (email/password)
✅ Create listings with photo upload
✅ Browse listings with filters
✅ View listing details
✅ Start conversations
✅ Real-time updates
✅ Mobile responsive

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 🎯 MVP Goals

- Get 5-10 real transactions in 2 weeks
- Validate seller + buyer demand
- Prove unit economics (3% commission)
- Test regulatory workflows (RENAPER, AFIP, insurance)

## 📚 Documentation

- **QUICK_START.md** - Step-by-step setup guide
- **EXECUTION_ROADMAP.md** - 2-week validation plan
- **GITHUB_SETUP.md** - Repository configuration
- **argentina_chinese_ev_marketplace_ops.md** - Complete business playbook
- **referral_program_mechanics.md** - Growth strategy

## 🚦 Deployment Checklist

- [ ] Firebase project created
- [ ] `.env.local` filled with credentials
- [ ] `npm install` completes
- [ ] `npm run dev` works locally
- [ ] GitHub repo created
- [ ] Vercel connected
- [ ] Environment variables set in Vercel
- [ ] Deploy button works

## 📞 Support

Check the docs folder for comprehensive guides:
1. Read QUICK_START.md first
2. Follow EXECUTION_ROADMAP.md daily
3. Reference argentina_chinese_ev_marketplace_ops.md for business questions

## 💡 Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Realtime DB, Storage)
- **State**: Zustand
- **Deployment**: Vercel

## 📈 Next Steps After MVP

1. Add offers system + escrow
2. Integrate real payments (Stripe)
3. Dealer partnership program
4. Insurance quote APIs
5. Mobile app

## 🎯 Success Metrics

After 2 weeks:
- 5-10 completed transactions
- 30%+ repeat seller rate
- 40+ NPS score
- <50K ARS CAC

## 📝 License

Private project - Argentina market focus

---

**Built for Argentina's EV revolution** 🇦🇷⚡
