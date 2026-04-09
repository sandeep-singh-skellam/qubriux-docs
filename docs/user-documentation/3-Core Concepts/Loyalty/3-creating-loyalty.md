---
sidebar_position: 3
title: Setting Up Your Loyalty Programme
---

# Setting Up Your Loyalty Programme

This guide walks you through configuring your loyalty programme in Qubriux - from the core programme settings and tier structure to earn rules and redemption controls.

Your loyalty programme is configured once and runs continuously. Think of this as building the engine: you set the rules, and the system handles everything automatically from that point forward.

---

## Step 1 - Open the Loyalty Section

Navigate to **Loyalty** in the main menu. If you're setting up for the first time, you'll land on a blank configuration screen. If you've configured loyalty before, your existing settings will be loaded.

---

## Step 2 - Configure Programme Settings

Start with the foundational settings for your programme:

**Programme name**
The name customers see when they interact with your loyalty programme in the app. Choose something that fits your brand - "Rewards," "Club," "Points Programme," or something more branded.

**Programme logo**
Upload your loyalty programme logo. This appears on the customer-facing loyalty card and in the app wherever the programme is displayed.

**Tier evaluation parameter**
Choose what metric the system uses to determine which tier a customer belongs to:

- **Points-based** - tier is determined by how many loyalty points the customer has earned
- **Spend-based** - tier is determined by how much the customer has spent in total
- **Subscription-based** - tier is determined by the customer's subscription status

This setting applies across your entire programme and cannot be changed after earn rules and tiers have been configured without reconfiguring the whole programme.

---

## Step 3 - Set Up Your Tiers

Define the tier structure for your programme. Each tier represents a level of loyalty status, with its own earn rate, redemption limit, conversion rate, and expiry rules.

Click **Add Tier** to create your first tier, then repeat for each additional level.

**For each tier, configure:**

**Tier name**
The name customers see - Bronze, Silver, Gold, Platinum, or any custom names that fit your brand.

**Entry threshold**
The minimum value a customer must reach to qualify for this tier. The unit depends on your tier evaluation parameter:
- For points-based: the number of lifetime points earned
- For spend-based: the total lifetime spend
- For subscription-based: select the subscription plan that qualifies for this tier

**Points earn rate**
How many points the customer earns per qualifying transaction when they are in this tier. Higher tiers typically have a better earn rate, giving loyal customers more points for the same spend.

**Points conversion rate**
How many points equal one unit of currency for customers in this tier. For example, 100 points = $1. Set this per tier - your most loyal customers can get a better rate, meaning their points are worth more at redemption.

If you operate in multiple markets, you can set separate conversion rates per country for each tier.

**Redemption limit**
The maximum amount a customer in this tier can redeem per transaction. Set this as:
- A **percentage of order value** (e.g. up to 20% of the order can be paid with points)
- A **fixed coin amount** (e.g. up to 500 points per transaction)

You can also set a minimum redemption amount to prevent customers from redeeming tiny balances one point at a time.

**Points expiry**
Configure when points expire for customers in this tier:
- Set a duration (e.g. 12 months from the date of last activity)
- Optionally set a fixed calendar expiry date (e.g. December 31st each year for an annual reset)
- Higher tiers typically have longer or no expiry - this is a meaningful tier benefit

**Tier validity and downgrade**
Set how long a customer stays in a tier before the system re-evaluates whether they still qualify:
- **Monthly** - re-evaluated at the start of each month
- **Quarterly** - re-evaluated every three months
- **Annually** - re-evaluated once per year

Choose where customers go if they no longer meet the threshold:
- Back to the base tier
- One tier below their current tier
- A specific tier you define

---

## Step 4 - Add Earn Rules

Earn rules define when and how customers receive points. Navigate to the **Earn Rules** section and click **Add Rule**.

Choose the type of rule you want to create:

---

### Basic Earn Rule

A straightforward rule that fires automatically on every qualifying event - no conditions required.

**Configure:**
- **Points awarded** - how many points the customer receives each time the rule fires
- **Rule validity** - optional start and end date; the rule is only active within this window
- **Rule frequency** - how often the rule can fire per customer: every time, daily, weekly, or monthly

---

### Advanced Earn Rule

A conditional rule that only fires when the customer meets specific criteria. Layered on top of a basic earn rate.

**Configure:**
- **Points awarded** - the points or multiplier applied when the rule fires
- **Targeting** - who the rule applies to ([segments](../Segments/Segments.md), tiers, customer lists, countries, specific products or categories)
- **Exclusions** - any targeting criteria that should be excluded from the rule
- **Rule validity and frequency** - same as basic rules

Use advanced rules to award bonus points to specific segments, on specific products, or in specific regions - while your basic rule handles everyone else.

---

### Milestone Earn Rule

A rule that fires once when a customer reaches a specific cumulative target - not on every transaction.

**Configure:**
- **Milestone target** - the cumulative value the customer must reach (e.g. spend $500 in a month, or earn 1,000 points)
- **Points awarded** - the bonus awarded when the customer crosses the milestone
- **Rule validity** - the period in which the cumulative target is measured

---

### Recurring Earn Rule

A rule that resets at the end of each period and fires again in the next cycle if the customer meets the condition.

**Configure:**
- **Condition** - what the customer must do in each period (e.g. place at least one order per month)
- **Points awarded** - the recurring reward for meeting the condition each period
- **Period** - how often the rule resets (monthly, weekly)

---

## Step 5 - Configure Product-Based Redemption (Optional)

By default, customers can redeem points against any product in your catalogue. If you want to restrict this, configure product-based redemption in the **Redemption** section:

- **All products** - no restriction; points can be used on anything
- **Specific products or categories** - only the products you select are eligible for redemption
- **Partial redemption** - when enabled, customers can apply points to eligible items in a mixed basket; when disabled, the entire basket must qualify

---

## Step 6 - Save Your Programme Configuration

Click **Save** to save your loyalty programme settings. Your earn rules, tiers, conversion rates, and redemption settings are all saved together as your programme configuration.

---

## Step 7 - Activate the Programme

Once your configuration is saved, activate the programme so it begins running. Use the **Activate** toggle in the Loyalty settings. From this point, customers automatically start earning points, moving between tiers, and redeeming their balances based on the rules you've set.

---

## Updating Your Programme

You can update loyalty rules and configuration at any time. Changes take effect from the moment they are saved and do not apply retroactively. For example, if you change the earn rate, customers earn at the new rate on all future transactions - points already earned remain unchanged.

When updating tiers, the system will re-evaluate all customers against the new thresholds at the next scheduled evaluation period.

---

## Enabling and Disabling the Programme

You can toggle your loyalty programme on or off at any time from the Loyalty settings. Disabling the programme stops all point earning and tier evaluation - customers keep their existing balance but no new points are awarded until the programme is re-enabled.
