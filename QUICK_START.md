# BYD Marketplace MVP - Quick Start (30 minutes)

## Step 1: Create Firebase Project (5 min)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create project" → Name it `byd-marketplace`
3. **Enable these services**:
   - ✓ Authentication (Email/Password)
   - ✓ Realtime Database (Start in test mode)
   - ✓ Storage (Allow read/write for authenticated users)

4. **Get credentials**:
   - Go to Settings → Project Settings
   - Copy these values:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_DATABASE_URL
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     ```

---

## Step 2: Setup Next.js Project (10 min)

### Option A: Clone My Repo (Recommended for testing)

```bash
# Clone the complete setup
git clone https://github.com/YOUR_USERNAME/byd-marketplace.git
cd byd-marketplace

# Install dependencies
npm install

# Create .env.local and paste Firebase credentials
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_url_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
EOF

# Test locally
npm run dev
# Visit http://localhost:3000
```

### Option B: Start from Scratch

```bash
# Create new Next.js project
npx create-next-app@latest byd-marketplace \
  --typescript \
  --tailwind \
  --eslint \
  --no-git

cd byd-marketplace

# Install dependencies
npm install firebase axios zustand react-hot-toast

# Create .env.local with Firebase credentials
```

Then copy the code from `nextjs_marketplace_full_app.md` into respective files.

---

## Step 3: Firebase Security Rules (2 min)

In Firebase Console → Realtime Database → Rules, paste:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "listings": {
      ".read": true,
      ".write": "auth != null",
      "$listingId": {
        ".validate": "newData.hasChildren(['sellerId', 'carData', 'price'])"
      }
    },
    "conversations": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$convId": {
        "messages": {
          ".read": "root.child('conversations').child($convId).child('participants').child(auth.uid).exists()",
          ".write": "root.child('conversations').child($convId).child('participants').child(auth.uid).exists()"
        }
      }
    },
    "offers": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    ".defaultRule": {
      ".read": false,
      ".write": false
    }
  }
}
```

And Storage Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Step 4: Deploy to Vercel (10 min)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/byd-marketplace.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your `byd-marketplace` repo
   - Add environment variables (from .env.local)
   - Click "Deploy"

3. **Your site is live** at `byd-marketplace.vercel.app`

---

## Step 5: Test the MVP

### As a Seller:
1. Visit your-domain/auth/signup
2. Create account (email: test@seller.com, name: "Juan Pérez")
3. Select "Vendedor" (Seller)
4. Go to /sell
5. Register a BYD with:
   - Model: Seagull
   - Year: 2023
   - VIN: LSFPK4200000001 (test VIN)
   - Price: 2,500,000 ARS
   - Upload 3+ photos
6. Submit

### As a Buyer:
1. Open incognito window → signup as buyer (test@buyer.com)
2. Go to /browse
3. See the listing you just created
4. Click listing → click "Contactar vendedor"
5. Send message

### Check Database:
- Firebase Console → Realtime Database
- Should see:
  - `/users/{uid}` with your profile
  - `/listings/{listingId}` with car data
  - `/conversations/{convId}/messages` with chat

---

## Troubleshooting

### Images not uploading?
- Check Firebase Storage is enabled
- Check permissions in Storage Rules (above)
- Check browser console for errors

### Can't login?
- Check Firebase Auth enabled
- Check email/password correct
- Check .env.local has all Firebase keys

### Database empty?
- Check Realtime Database is created (not Firestore)
- Check you're in correct Firebase project
- Check database URL in .env.local

### Vercel deployment fails?
- Run `npm run build` locally to test
- Check all .env variables are set in Vercel
- Check Next.js version compatible (use 14+)

---

## File Checklist

After setup, you should have:

```
byd-marketplace/
├── app/
│   ├── page.tsx                    ✓ Home
│   ├── layout.tsx                  ✓ Root layout
│   ├── browse/
│   │   └── page.tsx                ✓ Browse listings
│   ├── sell/
│   │   └── page.tsx                ✓ Create listing (needs ListingForm component)
│   ├── listing/
│   │   └── [id]/page.tsx           ✓ Listing detail
│   ├── auth/
│   │   ├── signup/page.tsx         ✓ Signup
│   │   └── login/page.tsx          ✓ Login
│   └── dashboard/
│       └── page.tsx                ✓ User dashboard (seller/buyer)
├── components/
│   ├── ListingCard.tsx             ✓ Card component
│   ├── ListingForm.tsx             ✓ Seller form
│   └── Navigation.tsx              ✓ Header nav
├── lib/
│   ├── firebase.ts                 ✓ Firebase config
│   ├── types.ts                    ✓ TypeScript types
│   └── renaper.ts                  ✓ Mock RENAPER API
├── hooks/
│   ├── useAuth.ts                  ✓ Auth hook
│   ├── useListings.ts              ✓ Listings hook
│   ├── useMessages.ts              ✓ Messaging hook
│   └── useOffers.ts                ✓ Offers hook
├── store/
│   └── marketplace.ts              ✓ Zustand state
├── .env.local                      ✓ Firebase keys (DON'T commit!)
├── package.json                    ✓ Dependencies
└── vercel.json                     ✓ Deployment config
```

---

## What's Working Right Now

✅ User authentication (email/password)
✅ Create listings with photo upload
✅ Browse listings with filters
✅ View listing details
✅ Start conversations (basic messaging)
✅ Real-time updates (Firebase)
✅ Mobile responsive

## What You Need to Add

🔧 Offers system (make bid on listing)
🔧 Escrow mock (deposit holding)
🔧 Inspection booking
🔧 VAT calculation refinement
🔧 Insurance quote integration
🔧 Payment processing
🔧 Referral tracking

---

## Next: Validate with Real Users

Now that you have a working MVP:

1. **Create test accounts** for 5 sellers + 5 buyers
2. **Give them the live URL**
3. **Ask them to**:
   - List a car (seller)
   - Browse and contact seller (buyer)
   - Message back and forth
4. **Collect feedback**:
   - "What was confusing?"
   - "What feature would help?"
   - "Would you use this for real?"

After 1-2 weeks of testing, you'll know if the model works.

---

## Quick Commands

```bash
# Development
npm run dev          # Start local server

# Production build
npm run build        # Build for production
npm run start        # Run production build

# Deploy to Vercel
vercel deploy        # Deploy (requires Vercel CLI)

# Database backups
firebase database:get /          # Download all data
firebase database:restore <file> # Restore from backup
```

---

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)
- [Vercel Deployment](https://vercel.com/docs/platforms/vercel)
- [Tailwind CSS](https://tailwindcss.com)

---

## Support

If something breaks:

1. Check browser console (Cmd+Opt+J on Mac, F12 on Windows)
2. Check Firebase console for errors
3. Check .env.local has all keys
4. Restart local server (Ctrl+C, npm run dev)

Good luck! 🚀

Questions? The code structure is self-documented. Each file has clear patterns you can follow.
