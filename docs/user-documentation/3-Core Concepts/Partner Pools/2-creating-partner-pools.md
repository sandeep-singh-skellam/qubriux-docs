---
sidebar_position: 2
title: Creating a Partner Pool
---

# Creating a Partner Pool

This guide walks you through setting up a Partner Pool in Qubriux - from configuring the code format and reward to generating codes and exporting them for distribution.

---

## Step 1 - Open Partner Pools

Navigate to **Partner Pools** in the main menu. Your pool library lists all existing pools with their current status and code counts. Click **Create Pool** to begin.

---

## Step 2 - Name and Describe the Pool

**Pool name**
Give the pool a name that identifies the campaign or partner it's for. This is internal - customers don't see it. Be specific: "UAE Partner - Q2 2025" is more useful than "Pool 1."

**Description**
An optional note about the purpose of this pool. Useful for your team to understand the context when reviewing pools later.

---

## Step 3 - Configure the Code Format

Define what the generated codes will look like. Every code in the pool follows this format - you configure it once and the system generates all codes accordingly.

**Prefix** (optional)
Fixed text added to the start of every code. For example, `UAE-` or `SPRING25-`. Use prefixes to identify which pool or partner a code came from when it's redeemed.

**Suffix** (optional)
Fixed text added to the end of every code. Works the same way as a prefix but appended at the end.

**Code length**
The number of random characters in the variable part of the code - not counting the prefix or suffix. Longer codes mean more possible unique combinations, which is important for large pools.

A practical guide:
- Up to 1,000 codes: length 4–5 is usually sufficient
- Up to 100,000 codes: length 6–7
- 100,000+ codes: length 8 or more

**Character set**
What the random characters are drawn from:
- **Alphabets** - uppercase A–Z only
- **Numbers** - digits 0–9 only
- **Alphabets and Numbers** - full alphanumeric set

Choose based on readability: if customers will type codes manually, numbers-only or a restricted character set reduces errors.

**Disallowed characters**
Specific characters to exclude from generation. Common exclusions: `O`, `0`, `I`, `1` - characters that look similar when printed. Enter them as a string (e.g. `O0I1`).

**Total codes**
How many unique codes to generate for this pool. The system validates that your format can produce at least this many unique combinations before proceeding. If not, you'll be prompted to adjust the prefix, suffix, code length, or character set.

---

## Step 4 - Attach a Reward

Choose what customers receive when they redeem a code from this pool. This is the pool-level default - every code delivers this reward unless you override it later for individual codes.

**Option A: Offer**
Select or configure an offer from your Offers library. When a customer redeems a code, the offer is applied to their purchase - a discount, points, cashback, or any other offer type.

Configure the offer reward exactly as you would when creating a standard offer: reward type, value, validity, usage limits, and excluded products.

**Option B: Gift Code**
Configure a monetary gift code. When a customer redeems a pool code, a gift code of the configured amount is issued to them and credited to their wallet.

Set the gift code amount and any relevant settings.

---

## Step 5 - Save the Pool

Choose how you want to proceed:

**Save as Draft**
Saves the pool configuration without generating codes yet. Use this when you want to review the setup before committing to code generation, or when you need approval before proceeding. The pool will be in **Draft** status.

**Save and Generate Codes**
Saves the pool and immediately triggers code generation. The pool moves into **Populating** status while codes are generated in the background. Once generation completes, the pool becomes **Active** and codes are ready to export.

For large pools (tens of thousands of codes), generation may take a few minutes. You can navigate away and return when the status updates to Active.

---

## Step 6 - Generate Codes for a Draft Pool

If you saved as a Draft and want to generate codes later, open the pool from your list and click **Generate Codes**. The pool moves into Populating status and codes are generated asynchronously. Return to the pool once it shows Active status.

---

## Step 7 - Export the Codes

Once the pool is Active, click **Export** to download the full list of generated codes.

**Format options:**
- **CSV** - a plain text file, easy to import into spreadsheets or partner systems
- **XLSX** - a formatted Excel workbook

The export includes each code, its status, and associated metadata. Share the exported file with your partner, embed the codes in your campaign system, or use them however your distribution workflow requires.

---

## Managing Individual Codes

After a pool is active, you can manage individual codes from the **Coupons** view within the pool:

**Search and filter**
Find specific codes by searching the code string directly, or filter by status (active, deactivated, redeemed) or by redemption state.

**Deactivate a code**
Turn off a specific code so it will be rejected if presented. Use this if a code has been compromised, shared publicly, or needs to be voided.

**Activate a code**
Re-enable a previously deactivated code.

**Override a code's reward**
Assign a specific offer or gift code to an individual coupon, replacing the pool's default reward for that code only. To do this, open the code from the list and update its reward configuration.

---

## Activating and Deactivating a Pool

**Deactivate a pool**
Marks the entire pool as inactive. All codes in the pool will be rejected if presented, regardless of their individual status.

**Activate a pool**
Re-enables a deactivated pool. Codes that were previously active (not redeemed or individually deactivated) become valid again.

---

## Viewing Analytics

Navigate to the **Analytics** tab within the pool or from the Partner Pools overview to see performance data:

- Total codes generated
- Redeemed codes and redemption rate
- Expired and unredeemed codes
- Codes still available (unredeemed and unexpired)

For a per-pool view, select the specific pool. For an overview across all pools, use the overall analytics view.

The **Redemption Curve** shows how quickly codes are being redeemed over time - useful for understanding whether a campaign is generating immediate action or a slow burn.
