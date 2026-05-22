# Referral Program: Detailed Mechanics & Implementation

## Overview

**Goal**: Grow sellers organically without spending heavily on paid ads. Use 4 parallel referral loops to bootstrap network effect.

**Core insight**: In a two-sided marketplace, referral economics work because:
- Referrer (your power user) has huge incentive to grow network (more buyers = higher prices they get)
- Referee (new user) values the referrer's endorsement (reduces trust uncertainty)
- You profit from every new user, so you can afford to pay for growth

---

## Referral Loop #1: Dealer Referral Program (B2B)

### **Mechanic**

**Who**: BYD authorized dealers + independent importers
**What they do**: Refer individual car sellers to your platform
**What they get**: Cash + ongoing commission

### **Incentive Structure**

#### **Tier 1: Small Dealer (1-2 cars/month typical sales)**
- **Referral bonus**: 30,000 ARS per referred seller (one-time)
- **Ongoing commission**: 3% of that seller's first 5 transactions on platform
  - Example: Referred seller sells car for 2M ARS
  - Dealer gets: 30K (upfront) + (2M × 3% × 5 sales) = 30K + 300K = 330K ARS over 12 months
- **Minimum requirement**: Referred seller must complete 1 transaction within 60 days (else referral bonus not paid)

#### **Tier 2: Medium Dealer (3-5 cars/month)**
- **Referral bonus**: 40,000 ARS per referred seller
- **Ongoing commission**: 4% on first 5 transactions
- **Bonus**: If dealer refers 5+ sellers in one quarter, get 50K ARS additional bonus

#### **Tier 3: Large Dealer (5+ cars/month)**
- **Referral bonus**: 50,000 ARS per referred seller
- **Ongoing commission**: 5% on first 5 transactions
- **Bonus**: If dealer refers 10+ sellers in one quarter, get 100K ARS additional bonus + co-marketing allowance (5K ARS/month advertising credit)

### **Why This Works**

**For dealer**:
- Recurring revenue (3-5% on every referred seller = passive income stream)
- Low effort (already talking to customers, just give them referral link)
- Builds relationship with platform (they become invested in your success)

**For you**:
- Qualified seller supply (dealer vets sellers = low fraud risk)
- Predictable growth (dealer does 3-5 cars/month → will refer 5-10 over 6 months)
- Competitive moat (dealers won't refer competitors to other platforms if you're paying them)

### **Implementation Steps**

1. **Create dealer dashboard** (Month 1)
   - Login: CUIT + password
   - View: Active referrals, completed sales, earnings, payout history
   - Action: Generate unique referral link (shares with customers)
   - Action: Invite customer via form (email sent automatically)

2. **Onboard first 3 dealers** (Weeks 2-4)
   - Cold call: "We pay dealers to send customers to our platform"
   - Show spreadsheet: "You get 30-50K ARS per seller + ongoing commission"
   - Get signed dealer agreement (1-page, covers Terms of Service + payment terms)
   - Set up dealer account + send first referral link

3. **Email automation**
   - When dealer invites seller:
     - Email to seller: "Your dealership [name] referred you to our platform. Complete your first sale and get 10K ARS credit."
     - Tracking link embeds referral code
   - When seller completes first sale:
     - Email to dealer: "Your referral, [seller name], completed a sale. Bonus payment of 30K ARS will hit your account in 5 business days."

4. **Payout mechanics**
   - Platform holds dealer payouts until end of month (consolidate all commissions + referral bonuses)
   - Payout via bank transfer (Mercado Pago or direct wire)
   - Dealer can redeem as credit toward platform ads (if dealer wants to run co-marketing campaigns)

### **Financial Impact (Year 1)**

**Assumptions**:
- You target 10 dealers across Córdoba + CABA
- Each dealer refers 8 sellers over 12 months
- Each referred seller does 2-3 transactions on platform
- Avg transaction value: 1.8M ARS
- Your transaction fee: 3% of sale

**Calculation**:
- 10 dealers × 8 referrals = 80 referred sellers
- 80 sellers × 2.5 avg transactions = 200 total sales
- 200 sales × 1.8M avg price = 360M ARS gross value
- 360M × 3% = 10.8M ARS revenue from dealer referrals

**Referral payout**:
- 80 referral bonuses × 40K ARS avg = 3.2M ARS
- 200 sales × 3.5% avg ongoing commission = 21M ARS value
  - But you only pay this from *your* cut (not seller's), so effective cost is ~700K ARS (2% of revenue)
- Total payout: ~3.9M ARS
- **Net profit from dealer channel**: 10.8M - 3.9M = **6.9M ARS**

---

## Referral Loop #2: Buyer-to-Buyer Referral (Viral Growth)

### **Mechanic**

**Who**: Buyers who complete a purchase on your platform
**What they do**: Share unique link with friends; friends buy a car via that link
**What they get**: Cash credit or discount

### **Incentive Structure**

**Standard tier** (all buyers):
- **Referrer (original buyer)**: 8,000 ARS credit or 5% of purchase value (whichever is higher)
  - Can use credit toward next transaction or redeem as cash (via Mercado Pago)
- **Referee (friend)**: 8,000 ARS discount on their purchase (applied at checkout)

**Viral bonus** (if referrer gets 3+ referrals in 6 months):
- Additional 15,000 ARS "ambassador" bonus
- Featured badge on profile: "Trusted Referrer" (increases trust score for their future listings)

### **Why This Works**

**Psychology**: 
- Buyer who just got a great deal wants to tell friends (already motivated)
- You're paying them to do what they'd do anyway
- Discount for friend lowers friction (friend buys because price is better)

**Network effect**:
- Each buyer has 10-20 friends (loose network)
- 1 in 20 might actually buy a car in the next 12 months
- So 100 buyers = 5-10 referral conversions

**Viral dynamics**:
- 100 buyers in Month 1 = 5-10 referrals in Month 2-3
- 150 buyers in Month 2 = 10-15 referrals in Month 3-4
- Growth accelerates as buyer base grows

### **Implementation Steps**

1. **Post-purchase email (Day 1 after close)**
   ```
   Subject: Comparte y gana 8,000 ARS (Share and earn)
   
   Body:
   Hola [buyer_name],
   
   ¡Felicidades por tu compra! Ya completaste tu transacción en [platform_name].
   
   Ahora ayuda a tus amigos a encontrar el BYD perfecto y gana 8,000 ARS.
   
   [Click here to share your unique referral link]
   
   Tu link: https://[platform]/ref/XXXXX
   
   ¿Cómo funciona?
   1. Comparte este link con tus amigos
   2. Tu amigo usa el link para comprar un auto
   3. ¡Ganas 8,000 ARS! (Tu amigo también obtiene 8,000 ARS descuento)
   
   [Referral tracking dashboard]
   
   Gracias,
   [Platform] team
   ```

2. **Referral tracking**
   - Generate unique short link per buyer (UUID-based or utm)
   - Database logs: referrer_id, referee_id, timestamp, referral_link, status (pending/completed)
   - On checkout: detect if referee used referral link → auto-apply discount
   - On payment success: trigger payout to referrer

3. **Referral dashboard**
   - Accessible from buyer account
   - Shows: Unique referral link, number of clicks, number of conversions, pending credits, available to redeem
   - CTA: "Copy to clipboard" or "Share on WhatsApp / Facebook"

4. **Redemption**
   - Buyer can redeem credits anytime:
     - Use toward next transaction (auto-deduct from price)
     - Or cash out via Mercado Pago (2% fee, instant transfer)
     - Or donate to charity (for brand good-will)

### **Financial Impact (Year 1)**

**Assumptions**:
- Month 1-3: 100 buyers
- Month 4-6: 200 buyers
- Month 7-12: 350 buyers
- Average conversion rate: 1 referral per 20 buyers (5%)
- Average credit redemption: 70% (some users forget, some never refer)

**Calculation**:
- Year 1 total buyers: 650
- 650 × 5% conversion = 32.5 referrals
- 32.5 × 70% redemption × 8,000 ARS = ~182K ARS payout
- **Revenue impact**: 32.5 new buyers (via referral) = 32.5 × (avg 3% fee on 1.8M) = ~1.76M ARS
- **Net profit from viral channel**: 1.76M - 182K = **1.58M ARS**

**Higher impact if viral coefficient > 1**:
- If 1 buyer → 2 referral conversions (higher virality), then:
  - 650 buyers × 10% conversion = 65 referrals = ~464K ARS payout
  - 65 new buyers = ~3.5M ARS revenue
  - **Net profit**: 3.5M - 464K = **3.04M ARS**

---

## Referral Loop #3: Seller-to-Seller Referral

### **Mechanic**

**Who**: Existing sellers (high-volume dealers, repeat individual sellers)
**What they do**: Refer new sellers to the platform
**What they get**: Cash bonus (smaller than dealer referral, but still significant)

### **Incentive Structure**

**Requirement**: Seller must have completed 2+ transactions on platform (proven user)

**Referral tiers**:
- **Referral bonus**: 25,000 ARS per new seller (one-time)
- **Ongoing commission**: 2% on referred seller's first 3 transactions
  - Example: Referred seller does 2 sales = 2 × 1.8M × 2% = 72K ARS

**Bonus structure**:
- Refer 3 sellers in 6 months: 15,000 ARS additional bonus
- Refer 5 sellers in 6 months: 30,000 ARS additional bonus + 1% commission hike to 3% on future referred sellers

### **Why This Works**

**For seller**:
- Sellers talk to each other (dealer networks, social circles, Facebook groups)
- They have incentive to grow the marketplace (more buyers = higher prices)
- 25K per referral is meaningful (equivalent to 1-2% of a typical sale)

**For you**:
- Sellers are your best marketers (they understand the pain points + value prop)
- Referred sellers are typically high-quality (existing seller vouches for them)
- Seller-to-seller trust reduces onboarding friction

### **Implementation Steps**

1. **Post-sale email to all sellers**
   ```
   Subject: Gana 25,000 ARS refiriendo a otros vendedores
   
   Body:
   Hola [seller_name],
   
   Ya completaste [N] ventas exitosas en nuestra plataforma. ¡Felicidades!
   
   Ahora te ofrecemos una forma de ganar dinero extra: refiere a otros vendedores y obtén:
   - 25,000 ARS por cada vendedor que refierres
   - 2% de comisión en sus primeras 3 ventas
   
   [Referral dashboard + link to generate unique referral code]
   
   ¿Cómo funciona?
   1. Genera tu link de referencia personalizado
   2. Comparte con amigos/colegas que venden autos
   3. Ellos usan tu link para registrarse
   4. Cuando venden, ¡tú ganas!
   
   [Example: "Referí a Juan, ganaste 25,000 ARS"]
   ```

2. **Seller dashboard additions**
   - "Earn" section showing referral potential
   - Unique referral code (shareable via WhatsApp, email, etc.)
   - Tracking: Pending referrals, conversions, earnings, payout history

3. **Seller community** (optional, Month 3+)
   - Create WhatsApp group or Discord for power sellers
   - Share referral tips, competitive intel, market insights
   - Recognition: Monthly leaderboard ("Top referrers") with prizes

### **Financial Impact (Year 1)**

**Assumptions**:
- By Month 6, you have 30 active sellers (completed 2+ transactions)
- Each seller refers 2 new sellers over next 6 months (conservative)
- 30 × 2 = 60 new referred sellers
- Each referred seller does 1.5 transactions on platform

**Calculation**:
- 60 referred sellers × 1.5 transactions = 90 transactions
- 90 × 1.8M ARS × 3% fee = 4.86M ARS revenue
- Referral payout: 60 × 25K = 1.5M ARS + (90 × 1.8M × 2% × 0.5) = 1.5M + 1.62M = ~3.1M ARS
- **Net profit from seller referrals**: 4.86M - 3.1M = **1.76M ARS**

---

## Referral Loop #4: Factory/0km Referral (BYD Partnership)

### **Mechanic**

**Who**: Buyers who purchase a 0km (new) BYD vehicle
**What they do**: Refer friends to buy a 0km BYD (or used car on your platform)
**What they get**: Service credit or referral bonus from BYD partnership

### **Incentive Structure**

**Standard referral** (0km → used car):
- Buyer A purchases 0km BYD Seagull
- Buyer A refers Buyer B (friend) to buy used BYD on platform
- Buyer A gets: 12,000 ARS service credit at authorized BYD dealer (good for tires, oil, inspection, etc.)
- Buyer B gets: 5% discount on used car (8K min)

**Premium referral** (0km → 0km):
- Buyer A purchases 0km BYD
- Buyer A refers Buyer B to buy another 0km BYD
- Buyer A gets: 20,000 ARS service credit + 1% discount on next 0km purchase
- BYD incentivizes this: "Every 0km buyer who refers another 0km buyer → free extended warranty (6 years instead of 3)"

### **Why This Works**

**For buyer**:
- Service credit is valuable (saves 1-2K ARS annually)
- Incentivizes them to buy 0km (higher margin for BYD + you)
- Creates positive word-of-mouth (buyer recommends to friends)

**For BYD**:
- Increases 0km volume (each referral = incremental sale)
- Builds customer loyalty (service credit + extended warranty = stickiness)
- Reduces customer acquisition cost (referral is cheaper than dealer marketing)

**For you**:
- 0km sales are high-margin (you take 2.5% of 2.8M = 70K per 0km sale)
- Each 0km referral creates used-car pipeline (buyer → uses car → trades in/sells 2-3 years later)

### **Implementation Steps**

1. **Integration with BYD distributor**
   - When 0km car is delivered → auto-register buyer in BYD's referral program
   - BYD sends buyer email: "Referir a un amigo → service credit + extended warranty"
   - BYD's system tracks 0km referrals; your platform tracks used-car referrals

2. **Your platform**
   - 0km buyers see: "Refer a friend, get 12K ARS service credit"
   - Referral link generated, tracked in your dashboard
   - If friend buys used car via referral → you credit the 0km buyer's account (eventually cashed out)

3. **Messaging**
   ```
   Subject: Tu BYD Seagull 0km está aquí. ¿Refiere a un amigo?
   
   Body:
   Hola [buyer_name],
   
   ¡Tu BYD nuevo ya está en la ruta!
   
   Ahora que comparte tu entusiasmo con amigos, BYD + [platform] te recompensa:
   
   - Refiere a un amigo → obtén 12,000 ARS en servicio (mantenimiento gratuito)
   - Refiere a otro 0km → 20,000 ARS en servicio + 1% descuento en tu próxima compra
   
   [Share link]
   ```

### **Financial Impact (Year 1)**

**Assumptions**:
- BYD partnership launches Month 3
- 20 0km cars sold in Month 3-4
- 50 0km cars sold in Month 5-6
- 100 0km cars sold in Month 7-12
- Average referral rate: 20% (1 in 5 0km buyers refer)
- Average referred used-car sale: 1.8M ARS

**Calculation**:
- Total 0km sales Year 1: ~170 cars
- 170 × 20% = 34 referrals to used-car platform
- 34 × 1.8M × 3% = 1.84M ARS revenue
- Service credit cost to BYD (not you): ~408K ARS
- **Net profit from factory referrals**: ~1.84M ARS (not including 0km sales themselves)

---

## Summary: Total Referral Revenue Impact (Year 1)

| Referral Loop | Channels | Revenue | Payout | Net Profit |
|---|---|---|---|---|
| **Dealer B2B** | 10 dealers, 80 referrals | 10.8M ARS | 3.9M ARS | **6.9M ARS** |
| **Buyer-to-Buyer** | 650 buyers, 32 referrals | 1.76M ARS | 182K ARS | **1.58M ARS** |
| **Seller-to-Seller** | 30 sellers, 60 referrals | 4.86M ARS | 3.1M ARS | **1.76M ARS** |
| **Factory 0km** | 170 0km sales, 34 referrals | 1.84M ARS | 0 ARS (BYD pays) | **1.84M ARS** |
| **TOTAL** | — | **19.26M ARS** | **7.19M ARS** | **12.07M ARS** |

---

## Key Success Metrics (Track These)

### **Referral Metrics**

| Metric | Target (Year 1) | How to Track |
|--------|-----------------|--------------|
| **Dealer referral rate** | 8-10 sellers per dealer | Dashboard reports |
| **Buyer viral coefficient** | 0.05-0.10 (5-10% convert) | UTM tracking, referral codes |
| **Seller referral rate** | 2 sellers per active seller | Dashboard reports |
| **Factory referral rate** | 20% of 0km buyers | BYD partnership reporting |
| **Overall CAC reduction** | 40% lower vs. paid ads | Compare channel CAC |
| **Repeat referrers** | 30% of referrers do 2+ | Cohort analysis |

### **LTV Impact**

Referred users have higher LTV because:
- They trust the platform (referred by someone they know)
- They have higher repeat purchase rate (40% do 2+ transactions)
- They are lower support burden (already familiar with process)

**Calculation**:
- Direct user LTV: 5,400 ARS (3% fee × 1.8M avg transaction)
- Referred user LTV: 8,100 ARS (higher repeat rate = higher lifetime value)
- **LTV uplift**: 50% higher for referred users

---

## Operational Requirements (What You Need to Build)

### **Tech**

- [ ] Unique referral link generation (UUID-based or short URL)
- [ ] Tracking: referrer → referee → conversion → payout
- [ ] Dashboard: referral stats, earnings, redemption
- [ ] Email automation: referral invitations, conversion notifications, payout receipts
- [ ] Analytics: cohort analysis (are referred users stickier?), viral coefficient calculation

### **Legal**

- [ ] Referral terms of service (are referrals taxable income? Typically no for gift/credit, but check with AFIP)
- [ ] Dealer agreement (governs referral payments, commission structure)
- [ ] BYD partnership agreement (covers service credit allocation, referral tracking)

### **Operations**

- [ ] Payouts system (monthly bank transfers or instant via Mercado Pago)
- [ ] Fraud detection (detect fake referrals, self-referrals, etc.)
- [ ] Support playbook (how to handle disputes: "I referred someone but didn't get paid")

---

## Quick Implementation Checklist

**Month 1**:
- [ ] Design referral mechanics (which loops to launch first?)
- [ ] Build unique referral link generation
- [ ] Set up tracking database
- [ ] Draft referral terms of service

**Month 2**:
- [ ] Launch dealer referral program (onboard 3-5 dealers manually)
- [ ] Launch buyer referral program (activate all buyers post-purchase)
- [ ] Set up payouts infrastructure (Mercado Pago integration)

**Month 3**:
- [ ] Launch seller referral program (activate all 2+ transaction sellers)
- [ ] Sign BYD partnership agreement
- [ ] Integrate BYD factory referral loop

**Month 4+**:
- [ ] Monitor metrics, optimize conversion rates
- [ ] A/B test referral incentive amounts
- [ ] Scale based on what's working

---

## Pro Tips

1. **Start with dealer referral**: Easiest to execute, highest LTV (dealers refer 5-10 sellers consistently)
2. **Viral loop is secondary**: Don't expect buyer referrals to drive growth initially (conversion is low). But set it up early because it scales.
3. **Monitor fraud**: Fake referrals are tempting (create dummy accounts, refer yourself, get credits). Use IP detection + phone verification.
4. **Celebrate referrers**: Public leaderboard ("Top 10 Referrers") creates competition + free marketing.
5. **Over-pay early**: First 10 dealers get 2x referral bonus (to prove concept). Once you have data, reduce to market rate.

---

## Expected Growth Curve

```
Month 1: 0 referrals (program not launched)
Month 2: 5 referrals (dealer program live, testing)
Month 3: 15 referrals (buyer + seller programs live)
Month 4: 25 referrals (scaling dealer onboarding)
Month 5: 40 referrals (viral effect starting)
Month 6: 60 referrals (factory integration live)
Month 7-12: 100+ referrals/month (network effect, compounding)
```

If you hit these numbers, your platform grows from 50 total users (Month 1) to 500+ (Month 6) to 1,000+ (Month 12) organically, with negative CAC (referral payouts offset by higher margins on referred users).
