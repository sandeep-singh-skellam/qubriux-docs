---
sidebar_position: 1
title: Partner Pools
---

# Partner Pools

A Partner Pool is a pre-generated collection of unique coupon codes, each carrying a reward that a customer receives when they present the code. Unlike standard offers - where a single code is sent directly to a customer - Partner Pools let you generate thousands of unique, one-use-only codes in advance and distribute them through external channels: partners, affiliates, printed marketing materials, external websites, or bulk campaigns.

Every code in a pool is different, every code can only be redeemed once, and every code delivers a reward when used. Partner Pools are the right tool when you need to hand off codes to someone outside your platform - a retail partner, an events organiser, a third-party app - and trust that each code will work exactly once.

---

## How Partner Pools Work

1. **You configure the pool** - give it a name, define the code format, set the total number of codes, and attach a reward
2. **The system generates the codes** - all codes are created automatically in the background based on your format settings, ensuring every code is unique
3. **You export the codes** - download the full list as a CSV or Excel file, ready to distribute to your partners or embed in your campaigns
4. **Customers use the codes** - when a customer presents a valid code, they receive the attached reward. The code is immediately marked as used and cannot be redeemed again

---

## The Reward on Each Code

Every code in a pool carries a reward. You choose one of two types when you set up the pool:

---

### Offer

The code delivers an offer from your Offers library - a discount, free product, points, cashback, or any other offer type. When a customer presents the code at checkout, the offer is applied automatically.

**When to use it:**
Use an offer reward when you want to give partners a discount or promotional incentive to distribute to their audience. The code acts as the delivery mechanism for the offer.

**Example:**

> *A fashion brand partners with a popular influencer. They create a Partner Pool of 5,000 unique codes, each delivering a **20% off** offer. The influencer shares codes with their followers. Each follower gets a unique code - when they shop, their code is applied at checkout, and the discount is applied. No two followers share the same code, which prevents code sharing and means the brand knows exactly how many conversions came from this partnership.*

---

### Gift Code

The code delivers a monetary gift code - a specific cash value credited directly to the customer's wallet when the code is redeemed.

**When to use it:**
Use a gift code reward when you want to give partners a monetary incentive to distribute. Each code is worth a fixed amount, making it feel like a voucher or prepaid gift.

**Example:**

> *A grocery delivery app partners with a corporate client running an employee rewards programme. They create a Partner Pool of 1,000 codes, each worth $10 in wallet credit. The company distributes the codes to their staff. Each employee redeems their code once, adding $10 to their wallet to spend on groceries. The app tracks redemptions per code, giving both parties a clear view of uptake.*

---

## Code Format

The format of every code in the pool is defined by you. The system generates all codes according to this format and guarantees every code is unique before the pool goes live.

---

### Prefix and Suffix

Optional fixed text added to the start or end of every code. Prefixes and suffixes are the same across all codes in the pool - they help identify which partner or campaign a code belongs to when it's used.

**Example:**

> *A brand creates a pool for their UAE partner with the prefix `UAE-`. Every code in the pool starts with `UAE-`, so when a code is redeemed, the team immediately knows it came from the UAE campaign - without needing to look it up.*

---

### Code Length

The number of random characters in the variable part of the code (not counting the prefix or suffix). Longer codes are harder to guess and provide more possible unique combinations - important when generating large pools.

---

### Character Set

Choose which characters the random part of the code is built from:

- **Alphabets only** - uppercase letters A–Z
- **Numbers only** - digits 0–9
- **Alphabets and Numbers** - the full alphanumeric set

**Example:**

> *A brand generating 10,000 codes with a 6-character alphabets-only set has 26⁶ (around 308 million) possible combinations - far more than enough. A brand that wants codes that are easy for customers to type manually might choose numbers-only to avoid confusion between letters like O and 0.*

---

### Disallowed Characters

Specific characters you want to exclude from the generated codes. Use this to avoid characters that are visually ambiguous (like O and 0, or I and 1) when codes are printed and read by humans.

---

### Uniqueness Guarantee

Before generating any codes, the system validates that your chosen format (prefix + suffix + length + character set) can produce enough unique combinations to fulfil your requested pool size - with a safety buffer. If there aren't enough possible combinations (for example, too many codes already exist with the same effective length), the system will ask you to adjust your format before proceeding.

---

## Pool-Level and Coupon-Level Rewards

Every code in a pool inherits the pool's default reward. But individual codes can be given their own override reward that replaces the pool default for that code only.

**Pool-level reward**
The default offer or gift code that all codes in the pool deliver. When a customer redeems any standard code from the pool, they receive this reward.

**Coupon-level reward (override)**
A specific offer or gift code assigned to an individual code. When a customer redeems that specific code, they receive the override reward instead of the pool's default.

**When to use overrides:**
Use coupon-level overrides when you want most codes to deliver a standard reward, but a few specific codes to deliver something different - for example, a limited set of premium codes hidden inside a larger general pool, or specific codes pre-assigned to VIP partners.

**Example:**

> *A brand creates a pool of 10,000 codes, all delivering a 15% off offer. They manually assign 50 of those codes a premium override: a 30% off offer. These 50 codes are given to top-tier partners. The remaining 9,950 codes deliver the standard discount. All codes come from the same pool but certain ones carry a more valuable reward.*

---

## Pool Status

| Status | What it means |
|--------|---------------|
| **Draft** | The pool has been configured but codes have not yet been generated |
| **Populating** | Codes are being generated in the background - the pool is not yet ready to distribute |
| **Active** | Codes are fully generated and the pool is live - codes can be exported and used |
| **Deactivated** | The pool has been manually deactivated - codes in this pool will not be accepted |

---

## Individual Code Status

Each code in a pool has its own status, independent of the pool:

| Status | What it means |
|--------|---------------|
| **Active** | The code is valid and can be redeemed |
| **Deactivated** | The code has been manually disabled - it will be rejected if presented |
| **Redeemed** | The code has been used - it cannot be redeemed again |
| **Reserved** | The code has been allocated but not yet redeemed |

---

## Analytics

Partner Pools include built-in analytics so you can track how codes are performing across all your pools:

**Per-pool metrics:**
- Total codes in the pool
- Redeemed codes
- Expired and unredeemed codes
- Unredeemed and unexpired codes (still available)
- Redemption rate (%)

**Overall metrics across all pools:**
- Combined totals across all pools
- Average redemption rate
- Average expiry rate

**Redemption curve:**
- Average time from code distribution to redemption
- Redemption rate over time - showing how quickly codes are being used after distribution

---

## Putting It All Together - Real Scenarios

### Partner Campaign with Unique Codes

A beauty brand is running a campaign with 20 influencer partners. Each partner will post their own unique codes so the brand can track performance per partner. Rather than giving all influencers the same code, they create 20 separate pools - one per influencer - each with 500 unique codes and a 15% off offer reward. Each pool is prefixed with the influencer's name abbreviation (e.g., `SARA-`).

After generating, the brand exports each pool as a CSV and sends it directly to the relevant influencer. Followers get individual codes, use them once, and the brand can see exactly how many redemptions came from each partner.

---

### Gift Code Voucher Distribution

A corporate HR platform wants to give employees a holiday bonus in the form of store credit. They create a Partner Pool of 2,000 codes, each carrying a $25 gift code reward. After export, they share the codes with the HR platform's system, which distributes one code per employee. Each employee redeems their code through the app, and $25 lands in their wallet immediately.

The brand tracks redemptions in real time - knowing how many employees have used their code, how many haven't, and the average time between receiving and redeeming.

---

### Premium Code Overlay

A brand runs a mass promotional campaign with a pool of 50,000 general codes, each giving $5 off. Within that pool, they configure 200 codes as overrides - each delivering $50 off instead. These premium codes are placed inside specially marked prize envelopes distributed in-store. Customers who find the right envelope get a much bigger reward, while all other codes from the pool deliver the standard discount. Everything comes from one pool, managed in one place.
