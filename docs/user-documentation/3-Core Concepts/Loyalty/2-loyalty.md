---
sidebar_position: 2
title: Loyalty Programme Setup
---

# Loyalty Programme Setup

The loyalty programme is the engine behind how your customers earn points, move between tiers, and redeem their balance for rewards. This guide covers everything you configure to build your programme - earn rules, redemption limits, tier structure, points conversion, and expiry settings.

Every element here works together. A customer earns points by following your earn rules, their balance grows over time, the system evaluates which tier they belong to, and when they redeem, the limits you've set control how much they can use at once. Getting these settings right creates a programme that feels fair, rewarding, and worth engaging with.

---

## Earn Rules

Earn rules define exactly when and how many points your customers receive. Every time a qualifying event happens - a purchase, a badge earned, a challenge completed - the system checks which earn rules apply to that customer and awards points accordingly.

---

### Basic Earn Rules

Basic rules are the foundation of your points programme. They define a straightforward earn rate that applies automatically to qualifying customers without needing any additional conditions.

**What you configure:**
- **Points awarded** - how many points the customer receives when this rule fires
- **Rule validity** - an optional start and end date for the rule; outside this window, the rule is inactive
- **Rule frequency** - how often the rule can fire per customer (daily, weekly, monthly, or every time)

**Examples:**

> *A café sets a basic earn rule: **5 points per purchase**. Every customer who makes any purchase earns 5 points automatically. There are no conditions - it fires every single time.*

> *A retailer wants to run a holiday earn promotion. They create a basic rule giving **3x points** that is only valid from December 1st to December 31st. Outside that window, the standard rate applies and the holiday rule is ignored.*

---

### Advanced Earn Rules

Advanced rules let you layer conditions on top of a basic earn rate. Instead of awarding points on every qualifying event, an advanced rule only fires when the customer meets a specific set of criteria - such as being in a particular segment, reaching a certain spend threshold, or purchasing a specific product.

**What you can target:**
- Specific customer [segments](../Segments/Segments.md)
- Specific loyalty tiers
- A curated customer list
- Specific products or product categories
- Specific countries

You can also combine targeting with exclusions - for example, award bonus points to a segment but exclude a particular product category from earning those points.

**Examples:**

> *A brand creates an advanced earn rule that awards **50 bonus points** to any customer in the "VIP Spenders" segment who makes a purchase above $100. Regular customers earn standard points; only VIPs who hit the threshold get the bonus.*

> *A grocery chain wants to promote their new organic range. They create a rule that awards **2x points on all purchases from the Organic category**. The rule targets all customers but includes only the Organic product category - purchases from other categories earn the standard rate.*

> *A fashion brand sells across multiple countries. They configure country-wise earn rules - customers in the UAE earn **10 points per purchase** while customers in the UK earn **15 points per purchase**, reflecting local currency differences.*

---

### Milestone Earn Rules

A milestone earn rule fires once a customer reaches a specific cumulative target rather than on every transaction. The points are awarded as a bonus when the customer crosses the milestone, not continuously.

**When to use it:**
Milestone rules are ideal when you want to reward customers for reaching a meaningful total - a spending milestone, a visit count, or a cumulative points balance - rather than rewarding every individual transaction equally.

**Example:**

> *A restaurant creates a milestone rule: **earn 500 bonus points when you spend a total of $500 this month**. Customers who are close to the milestone feel motivated to visit one more time to hit it. The bonus points feel like a surprise reward rather than an expected transaction-level earn.*

---

### Recurring Earn Rules

A recurring rule fires on a regular cadence, not just once. The rule resets at the end of each period and the customer can earn the reward again in the next cycle.

**Example:**

> *A subscription box brand sets a recurring rule: **earn 200 points every month you place at least one order**. Customers who order regularly automatically receive their 200-point bonus at the start of each new month. Missing a month resets the clock - the points are only awarded if the customer orders in that specific period.*

---

## Points Conversion

Points only feel valuable when customers understand what they're worth. The points conversion rate defines how many points equal one unit of currency, and you can set this at the tier level - meaning your most loyal customers can get a better redemption rate than others.

**How it works:**
You set a conversion rate per tier, for example:
- 100 points = $1

This rate applies when a customer chooses to redeem their points at checkout. A customer with 500 points at a 100:1 rate has $5 to spend.

**Country-wise conversion:**
If you operate across multiple markets with different currencies, you can set separate conversion rates for each country. This means a customer in one country doesn't get an unintended advantage or disadvantage simply because of currency differences.

**Examples:**

> *A loyalty programme sets a base conversion rate of **100 points = $1** for Bronze and Silver tier customers. Gold tier customers get a better rate of **80 points = $1** - meaning Gold members get more value from every point they earn. This is a meaningful tier benefit that goes beyond just a badge.*

> *A brand operating in both the US and UK sets separate conversion rates: **100 points = $1** in the US and **100 points = £0.85** in the UK, reflecting the exchange rate and making the programme feel fair and locally relevant to each market.*

---

## Redemption

Redemption controls how and when customers can spend their points. You don't just set the rate - you also set limits to make sure redemptions are sustainable for your business and feel meaningful for your customers.

---

### Redemption Limits

Each tier can have its own redemption limits. Limits can be set in two ways:

**Percentage of order value**
The customer can redeem points worth up to a set percentage of their order total. For example, a 20% limit on a $50 order means a maximum of $10 can be paid with points.

**Fixed coin amount**
The customer can redeem up to a fixed number of points per transaction, regardless of order size.

You can also set **minimum and maximum redemption limits** - making sure customers redeem at least a meaningful amount (so they don't burn one point at a time) and no more than a set ceiling.

**Examples:**

> *A coffee brand allows **up to 30% of any order value** to be paid with points. A customer buying a $10 coffee can use up to $3 worth of points. This keeps the programme sustainable while still letting customers feel they're getting real value from their balance.*

> *A high-end retailer sets a **maximum of 500 coins per transaction** for Bronze tier customers, but increases this to **1,000 coins** for Gold tier customers. This makes the top tier feel meaningfully different at the checkout.*

> *A restaurant sets a **minimum redemption of 100 points** per visit. This prevents customers from redeeming tiny amounts constantly and ensures that when they do redeem, the value is noticeable.*

---

### Product-Based Redemption

You can restrict which products customers are allowed to redeem points against. Rather than allowing points to be burned on any item in your catalogue, you can specify exactly which products or categories are eligible.

**Options:**
- **All products** - points can be redeemed against any item
- **Specific products or categories** - only selected items are eligible for redemption
- **Partial redemption** - when enabled, customers can apply points to part of their order even if some items aren't eligible; when disabled, the entire order must qualify

**Example:**

> *A grocery chain allows points redemption on all products except tobacco and alcohol. They mark those categories as excluded from redemption. A customer with a basket containing milk, bread, and a bottle of wine can redeem points against the milk and bread but not the wine.*

> *A fashion brand only allows redemption on full-price items. Sale items are excluded, ensuring that discounted products don't get a double discount through points redemption.*

---

## Loyalty Tiers

Tiers give your most loyal customers a status that reflects how much they've engaged with your brand. Each tier comes with its own earn rate, conversion rate, redemption limits, and benefits - creating a real reason for customers to climb higher.

---

### How Tiers Are Evaluated

You choose what metric the system uses to determine which tier a customer belongs to:

**Points-based**
Tier placement is determined by how many loyalty points the customer has earned. Customers who earn more points move into higher tiers.

**Spend-based**
Tier placement is based on how much the customer has spent in total. A customer who has spent $1,000 lifetime reaches the Gold tier; someone who has spent $200 stays in Silver.

**Subscription-based**
Tier placement is based on the customer's subscription status rather than earn activity. Subscribing to a premium plan automatically places the customer in a higher tier, and cancelling drops them back down.

---

### Tier Entry Thresholds

Each tier has an entry threshold - the minimum value a customer must reach to qualify for that tier. You set this threshold per tier, and tiers are ranked by level from lowest to highest.

**Example:**

> *A restaurant chain has three tiers:*
> - *Bronze: 0–999 points earned*
> - *Silver: 1,000–4,999 points earned*
> - *Gold: 5,000+ points earned*
>
> *A customer who has earned 1,200 points is automatically placed in Silver. If they earn enough to reach 5,000, they move to Gold at the next evaluation.*

You can also use lifetime order value or lifetime order count as the entry threshold instead of points, giving you full flexibility to define loyalty in the way that makes most sense for your business.

---

### Tier-Specific Benefits

Each tier can have its own:
- **Points earn rate** - higher tiers can earn more points per transaction
- **Points conversion rate** - higher tiers get better value when they redeem
- **Redemption limit** - higher tiers can redeem more per transaction
- **Points expiry** - higher tiers may have their points expire more slowly, or not at all

This means every step up the tier ladder feels materially better, not just cosmetically different.

---

### Tier Validity and Downgrade

A customer doesn't stay in their tier forever by default. You can configure how long a tier lasts before the system re-evaluates whether the customer still qualifies.

**Tier validity period**
Set a window (monthly, quarterly, or annually) after which the system checks whether the customer's recent activity still meets the tier threshold. If it doesn't, they are downgraded.

**Downgrade configuration**
You choose where a customer goes when they are downgraded - back to the base tier, to their previous tier, or to a specific tier you define.

**Example:**

> *A loyalty programme evaluates Gold tier status annually. A customer who earned Gold in January is reassessed the following January. If they haven't maintained the required activity level over the past year, they drop to Silver. If they have, they remain in Gold for another year.*

> *A café chain evaluates tiers monthly. Customers who don't meet the Silver threshold in any given month drop back to Bronze at the start of the following month. This creates urgency to stay active - and a strong reason to visit once more before the month ends.*

---

## Points Expiry

Points expiry keeps your programme fresh and creates urgency for customers to stay engaged. Without expiry, long-dormant customers accumulate large balances they may never use - expiry encourages active redemption.

**How you configure it:**
- **Timeframe** - choose whether points expire after a number of days, weeks, months, or years
- **Duration** - set the specific number of periods (e.g., 12 months)
- **Fixed date expiry** - optionally set a hard calendar date on which all points expire, useful for annual resets
- **Per-tier expiry** - configure different expiry rules for each tier (Gold members' points might last 2 years; Bronze members' points expire after 6 months)

**Examples:**

> *A brand sets points to expire after **12 months** of inactivity. Customers who haven't earned or redeemed any points in the past year see their balance cleared. An automated email is sent 30 days before expiry to prompt them to take action.*

> *A seasonal retailer sets a hard expiry of December 31st each year, so all outstanding points reset at the start of every new year. This creates a natural urgency in Q4 as customers rush to spend their balance before it disappears.*

> *A premium brand gives Gold tier members **36-month point validity** while Bronze members have only **6 months**. This makes tier membership tangibly valuable - not just a badge, but a real financial benefit that protects the balance customers have worked to build.*

---

## Putting It All Together - Real Scenarios

### A Points-Based Programme for a Café Chain

A café chain wants a simple, engaging loyalty programme that rewards frequent visitors and makes it easy to understand what points are worth.

**Earn rules:**
- Basic rule: **1 point per $1 spent** on any purchase
- Advanced rule: **3x points on Fridays** (targeting all customers, no segment restriction)
- Milestone rule: **200 bonus points when you spend $50 in a calendar month**

**Tiers:**
- Bronze: 0–499 points earned → 100 points = $0.50
- Silver: 500–1,999 points earned → 100 points = $0.75
- Gold: 2,000+ points earned → 100 points = $1.00

**Redemption:** Up to 25% of any order value, minimum 50 points per redemption

**Points expiry:** 12 months from date of last activity

**Result:** Customers earn points naturally with every purchase, have an incentive to visit on Fridays, and work toward a monthly spend milestone. As they move up tiers, their points are worth more at redemption - creating a clear, compelling reason to stay loyal.

---

### A Spend-Based Programme for a Fashion Brand

A fashion retailer wants tier status to reflect real customer spending, not just point accumulation, so their VIP programme feels exclusive and earned.

**Tier structure (spend-based):**
- Standard: $0–$499 lifetime spend
- Silver: $500–$1,999 lifetime spend → 5% redemption limit per order
- Gold: $2,000–$4,999 lifetime spend → 10% redemption limit per order, 80 points = $1
- Platinum: $5,000+ lifetime spend → 15% redemption limit per order, 70 points = $1, no points expiry

**Earn rules:**
- All customers: **10 points per $1 spent**
- Gold and Platinum only: **5 bonus points per $1 spent on new arrivals**
- Advanced rule: **Double points during sale periods for Platinum members only**

**Redemption:** Only applicable on full-price items; sale items excluded

**Tier validity:** Annual re-evaluation - customers who don't meet their tier's lifetime threshold with new spending in the past year are downgraded one level

**Result:** Customers know exactly what level of spending unlocks each tier. The higher the tier, the better the conversion rate and the more they can redeem per order - making the Platinum tier genuinely aspirational and worth chasing.

---

### A Subscription-Based Programme for a Grocery App

A grocery delivery app uses subscription tiers to immediately differentiate the experience for paying subscribers from free users.

**Tier structure (subscription-based):**
- Free: standard earn rate, 100 points = $0.75, points expire after 6 months
- Premium subscriber: 1.5x earn rate, 100 points = $1.00, points expire after 24 months

**Earn rules:**
- Free customers: **5 points per $1 spent**
- Premium customers: **7.5 points per $1 spent** (same rule with tier multiplier applied)
- Premium only: **100 bonus points on first order each month**

**Redemption:** Applicable on all products; partial redemption allowed

**Result:** Subscribing immediately unlocks better earn rates, a higher conversion at redemption, and points that last four times as long. The benefits are clear and compelling at the moment a customer decides whether to subscribe - and the loyalty programme becomes a key reason to stay subscribed.
