---
sidebar_position: 4
title: Loyalty Setup
---

# Loyalty Program

## Overview

The Loyalty Program tracks customer activity over time and assigns loyalty tiers based on predefined rules.  
Customers earn loyalty points through eligible activity, and their tier is evaluated automatically based on recent engagement.

The system operates in the background and requires no manual setup or intervention.

---

## Core Concepts

### Loyalty Points
- Loyalty points are recorded for eligible customer activity
- Points accumulate on the customer account automatically
- Points are used internally to evaluate tier eligibility
- Customers are not required to manually redeem or manage points

---

### Loyalty Tiers
- Each customer is associated with a single loyalty tier at any given time
- Tiers represent the customer’s recent level of engagement and value
- Tier definitions and thresholds are configured at the system level

---

### Evaluation Window
- Tier eligibility is calculated using customer activity since the last tier change
- Lifetime activity is not used for tier evaluation
- This ensures tiers reflect recent and ongoing customer behavior

---

### Tier Thresholds
- Each tier has predefined thresholds based on spend or activity
- Thresholds determine whether a customer qualifies for:
  - A tier upgrade
  - Tier retention
  - A tier downgrade

---

## How the Loyalty Program Works

### 1. Activity Recording
- Eligible customer actions are recorded automatically
- All qualifying activity contributes to loyalty point accumulation
- No action is required from the customer

---

### 2. Point Accumulation
- Loyalty points are added to the customer account as activity occurs
- The points balance is continuously updated
- Points remain associated with the customer account

---

### 3. Tier Evaluation
- At evaluation time, the system calculates total qualifying activity since the last tier change
- The calculated value is compared against configured tier thresholds
- Based on the comparison, the system determines whether a tier change is required

---

### 4. Tier Update
- If a tier change is required, it is applied automatically
- Tier updates take effect immediately
- Customers are notified when their tier changes

---

## User Visibility

Customers can view the following information:
- Current loyalty tier
- Current loyalty points balance
- Progress toward the next tier
- Benefits associated with the active tier

All information is updated automatically and reflects the latest evaluation state.

---

## What the User Does Not Need to Do

- No enrollment or opt-in is required
- No manual tracking of points or tiers
- No requests or actions to trigger tier upgrades
- No maintenance actions beyond normal product usage

---

## Example Scenarios

### Scenario 1: Tier Upgrade

- A customer is currently in the **Silver** tier
- The customer completes multiple qualifying transactions
- Their total activity since the last tier change exceeds the **Gold** threshold
- During evaluation:
  - The system upgrades the customer to **Gold**
  - The tier change is applied immediately
  - Gold-tier benefits become active

---

### Scenario 2: Tier Retention

- A customer is currently in the **Bronze** tier
- Their activity remains within the Bronze threshold range
- During evaluation:
  - The system confirms continued eligibility
  - No tier change is applied

---

### Scenario 3: Tier Downgrade

- A customer is currently in the **Gold** tier
- Their activity drops below the Gold threshold over time
- During evaluation:
  - The system determines the customer no longer qualifies for Gold
  - The customer is downgraded to **Silver**
  - The updated tier becomes active immediately

---

## Summary

The Loyalty Program follows the same design principles as the Wallet module:
- Automatic state management
- Clear user visibility
- Rule-based evaluation
- No manual intervention

Customer activity drives loyalty outcomes, while the system ensures consistency and accuracy.



