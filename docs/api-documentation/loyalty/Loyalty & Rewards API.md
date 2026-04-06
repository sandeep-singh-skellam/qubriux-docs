---
id: loyalty-rewards-api
title: Loyalty & Rewards API
sidebar_label: Loyalty & Rewards API
sidebar_position: 1
---

## Overview

The Qubriux Loyalty & Rewards API is the primary integration surface for POS systems, mobile apps, and third-party ordering platforms. It covers the core customer loyalty lifecycle: registration, offer retrieval, cart validation, reward redemption, order closure, and coupon management. All endpoints share a single base path under `/shawarmer` and authenticate via a merchant-level API key combined with an optional JWT Bearer token.

:::note
Badges, gamification challenges, and wallet operations are documented in their own dedicated references:
- [Badges API](./Badges%20API) — badge catalogues and customer badge progress
- [Gamification API](./Gamification%20API) — challenges, activation, and progress tracking
- [Wallet API](./Wallet%20API) — digital wallet balance, credits, debits, and history
:::

## Base URL

```
https://app.qubriux.com/ezloyal-web
```

## Authentication

Every request requires a **merchant-level API Key** passed as the `apiKey` field inside the request body. This key is issued by Qubriux during integration setup and identifies the calling merchant.

Most endpoints additionally accept a **JWT Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Obtain a token from [`POST /auth/getAccessToken`](#post-shawarmerauthgetaccesstoken). The JWT is validated against the merchant context derived from the `apiKey` — if they do not match, the request is rejected with a `401`.

:::tip
The JWT layer is optional for basic integrations but strongly recommended for production. It binds each request to a specific merchant and optionally a customer, preventing API key misuse across merchant boundaries.
:::

## Response Envelope

All responses use a standard wrapper:

```json
{
  "status": "success",
  "data": { ... }
}
```

On error, `status` is `"failure"` and `data` contains a human-readable error message string. An optional `errorKey` integer is included for localised error lookup.

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/getAccessToken` | Issue a JWT access token |
| `POST` | `/createCustomer` | Register a new customer |
| `POST` | `/updateCustomer` | Update an existing customer profile |
| `POST` | `/deleteCustomer` | Delete a customer record |
| `POST` | `/migrateCustomerData` | Migrate a customer from a legacy system |
| `POST` | `/getCustomerOffers` | Get available offers, loyalty balance, and tier status |
| `POST` | `/getCustomerLoyaltyPointsTx` | Retrieve loyalty points transaction history |
| `POST` | `/loyaltyTierInfo` | Get tier information for a customer |
| `POST` | `/getLoyaltyDetails` | Get full loyalty programme details for a customer |
| `POST` | `/getTierDescription` | Get textual tier rule descriptions |
| `POST` | `/allocateLoyaltyPointsToCustomer` | Manually allocate loyalty points to a customer |
| `POST` | `/cartUpdate` | Validate and preview reward deductions on a live cart |
| `POST` | `/redeemReward` | Execute reward redemption at point of sale |
| `POST` | `/voidRedemption` | Void/cancel a previously applied redemption |
| `POST` | `/cartClosure` | Register order completion and trigger loyalty accrual |
| `POST` | `/apply-coupon` | Apply a coupon code to a cart and compute discounts |
| `POST` | `/add-coupon` | Assign a coupon directly to a customer |
| `POST` | `/getCouponDetails` | Look up offer details by coupon code |

---

## POST /auth/getAccessToken

Exchanges merchant credentials for a short-lived JWT. The token is scoped to the merchant derived from the API key and, optionally, to a specific customer when `customerId` is supplied. Use this token as the Bearer on all subsequent calls requiring JWT validation. A token issued for one merchant is rejected if used with a different merchant's `apiKey`.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `clientId` | string | Yes | OAuth client identifier from integration setup | `"client_7f8a9b2c"` |
| `clientSecret` | string | Yes | OAuth client secret | `"secret_x9y8z7w6"` |
| `customerId` | string | No | When provided, scopes the token to this customer | `"APP-CUST-001234"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "clientId": "client_7f8a9b2c",
  "clientSecret": "secret_x9y8z7w6",
  "customerId": "APP-CUST-001234"
}
```

### Response - 200 OK

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | `apiKey` is invalid, or `clientId`/`clientSecret` do not match |
| `422` | Validation failure on request fields |
| `500` | Unexpected server error |

:::warning
Tokens expire. Handle `401` responses from downstream endpoints by re-fetching a token rather than retrying the failed request directly.
:::

---

## POST /createCustomer

Registers a new customer in the Qubriux loyalty platform. On success, Qubriux creates a customer record, optionally provisions a digital wallet, and returns the internal customer ID alongside a customer-scoped JWT. Call this endpoint the first time you encounter a customer — typically at sign-up or first purchase.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_info` | object | Yes | Customer profile (see below) | — |
| `createdAt` | string | No | ISO 8601 registration timestamp in your system | `"2024-04-01T10:30:00Z"` |
| `customer_source` | string | No | Channel where the customer registered | `"mobile_app"` |

#### customer_info Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Recommended | Your system's customer ID — links the Qubriux record back to your DB | `"APP-CUST-001234"` |
| `mobile` | string | Recommended | Mobile number with country code. Primary identifier. | `"+971501234567"` |
| `email` | string | Recommended | Email address. Secondary identifier. | `"sarah.khan@example.com"` |
| `firstName` | string | No | First name | `"Sarah"` |
| `lastName` | string | No | Last name | `"Khan"` |
| `dob` | string | No | Date of birth (YYYY-MM-DD). Triggers birthday rewards. | `"1990-06-15"` |
| `gender` | string | No | Gender identifier | `"F"` |
| `nationality` | string | No | ISO 3166-1 alpha-2 country code | `"AE"` |
| `country_code` | string | No | International dialling prefix | `"+971"` |
| `referralCode` | string | No | Referral code assigned to this customer for sharing | `"REF-SK-7789"` |
| `referredBy` | string | No | Referral code of the customer who referred this one | `"REF-AM-4412"` |
| `isSMSMarketingConsentGiven` | boolean | No | SMS marketing consent | `true` |
| `isEmailMarketingConsentGiven` | boolean | No | Email marketing consent | `true` |
| `isLoyaltyConsentGiven` | boolean | No | Loyalty programme participation consent | `true` |
| `isWalletRequired` | boolean | No | Provision a digital wallet on registration. Default: `false`. | `false` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "customer_source": "mobile_app",
  "createdAt": "2024-04-01T10:30:00Z",
  "customer_info": {
    "id": "APP-CUST-001234",
    "firstName": "Sarah",
    "lastName": "Khan",
    "mobile": "+971501234567",
    "email": "sarah.khan@example.com",
    "dob": "1990-06-15",
    "gender": "F",
    "country_code": "+971",
    "nationality": "AE",
    "isSMSMarketingConsentGiven": true,
    "isEmailMarketingConsentGiven": true,
    "isLoyaltyConsentGiven": true,
    "isWalletRequired": false
  }
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.customerId` | string | Qubriux internal customer ID. **Store this.** |
| `data.walletId` | string \| null | Digital wallet ID, if wallet was provisioned |
| `data.availableBalance` | number | Wallet balance (zero for new customers) |
| `data.userJwtToken` | string \| null | Customer-scoped JWT for subsequent calls |

### Response Example

```json
{
  "status": "success",
  "data": {
    "customerId": "QBX-CUST-00456789",
    "walletId": "WALLET-00123456",
    "availableBalance": 0.00,
    "userJwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer already exists, or required fields failed validation |
| `500` | Unexpected server error |

:::tip
Persist `customerId` from the response in your database. Supplying it on future requests is the most reliable lookup since contact details can change.
:::

---

## POST /updateCustomer

Updates profile data for an existing Qubriux customer. Use this to sync changes from your system — name corrections, consent withdrawals, or updated contact details. The customer must already exist. Supply at least one identifier (`id`, `mobile`, or `email`) alongside the fields to update.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

Same schema as `createCustomer`. Include only the fields to update alongside one customer identifier.

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "customer_info": {
    "id": "APP-CUST-001234",
    "mobile": "+971501234567",
    "email": "sarah.updated@example.com",
    "isEmailMarketingConsentGiven": false
  }
}
```

### Response - 200 OK

Same structure as `createCustomer`. `availableBalance` reflects the customer's current balance at time of update.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or updated contact details conflict with another customer |
| `500` | Unexpected server error |

:::warning
Qubriux enforces uniqueness on mobile and email. Updating to a value that already belongs to a different customer record returns a `422`.
:::

---

## POST /deleteCustomer

Removes a customer record from the Qubriux platform. This action is irreversible — use it only for GDPR deletion requests or explicit customer removal workflows, not routine operations.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | Yes | Your system's customer ID or the Qubriux `customerId` | `"APP-CUST-001234"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234"
}
```

### Response - 200 OK

```json
{
  "status": "success",
  "data": "Deleted"
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Customer not found or deletion failed |

---

## POST /migrateCustomerData

Migrates a customer record from a legacy loyalty system into Qubriux, preserving their historical points balance and profile. Use this during platform onboarding to port existing members without requiring them to re-register. If the customer already exists in Qubriux, their profile is updated with the migrated data.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_info` | object | Yes | Customer profile (same schema as `createCustomer`) | — |
| `loyaltyPoints` | number | No | Legacy points balance to carry over | `1250` |
| `legacyId` | string | No | Customer ID in the source system | `"LEGACY-4892"` |

### Response - 200 OK

Same structure as `createCustomer`, including the assigned `customerId` and current balance after migration.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Validation failure on customer data |
| `500` | Unexpected server error |

---

## POST /getCustomerOffers

Returns the complete set of active offers available to a customer alongside their current loyalty balance, tier status, tier progression data, and redemption limits — all in a single call. Call this at the start of a transaction or when rendering a customer's wallet screen. Optionally include the live basket in the `order` field to enable dynamic offer eligibility evaluation against current items.

:::note
This endpoint is also available as `POST /getCustomerOffersV2` — both call the same underlying service and return identical responses.
:::

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | One of three | Your system's customer ID | `"APP-CUST-001234"` |
| `customer_mobile` | string | One of three | Customer's mobile with country code | `"+971501234567"` |
| `customer_email` | string | One of three | Customer's email address | `"sarah.khan@example.com"` |
| `beansExpiryAfterDays` | integer | No | Show points expiring within N days | `30` |
| `order` | object | No | Live basket for dynamic eligibility evaluation (see [Order Fields](#order-fields)) | — |

### Order Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `order_id` | string | Your POS order identifier | `"ORD-20240401-0012"` |
| `gross_amount` | number | Total before discounts | `185.00` |
| `net_amount` | number | Total after existing discounts | `175.00` |
| `tax` | number | Tax amount | `10.00` |
| `order_type` | string | Order channel (e.g. `dine_in`, `takeaway`, `delivery`) | `"dine_in"` |
| `items` | array | Line items (see below) | — |

#### items Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `product_id` | string | SKU or product identifier | `"PROD-001"` |
| `product_name` | string | Display name | `"Flat White"` |
| `quantity` | integer | Units ordered | `2` |
| `category_id` | string | Category identifier | `"CAT-DRINKS"` |
| `rate` | number | Unit price | `22.00` |
| `subtotal` | number | `rate × quantity` | `44.00` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "beansExpiryAfterDays": 30,
  "order": {
    "order_id": "ORD-20240401-0012",
    "gross_amount": 185.00,
    "net_amount": 175.00,
    "tax": 10.00,
    "order_type": "dine_in",
    "items": [
      {
        "product_id": "PROD-001",
        "product_name": "Flat White",
        "quantity": 2,
        "category_id": "CAT-DRINKS",
        "rate": 22.00,
        "subtotal": 44.00
      }
    ]
  }
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.loyaltyPoints` | number | Current points balance |
| `data.walletBalance` | number | Current wallet cash balance |
| `data.currentTier` | string | Active loyalty tier name |
| `data.nextTier` | string \| null | Next tier to unlock, or null if at top tier |
| `data.pointsToNextTier` | number | Points required to reach the next tier |
| `data.offers` | array | Available offers — each contains `offerId`, `offerName`, `offerType`, `discountValue`, and eligibility flags |
| `data.expiringPoints` | number \| null | Points expiring within `beansExpiryAfterDays`, if requested |

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or no identifier supplied |
| `500` | Unexpected server error |

---

## POST /getCustomerLoyaltyPointsTx

Returns the paginated loyalty points transaction history for a customer — credits, debits, expirations, and redemptions. Use this to power a customer-facing points history screen.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | One of three | Customer ID | `"APP-CUST-001234"` |
| `customer_mobile` | string | One of three | Mobile with country code | `"+971501234567"` |
| `customer_email` | string | One of three | Email address | `"sarah.khan@example.com"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.transactions` | array | List of transaction records |
| `data.transactions[].transactionDate` | string | ISO 8601 timestamp |
| `data.transactions[].points` | number | Points credited (positive) or debited (negative) |
| `data.transactions[].description` | string | Human-readable reason (e.g. `"Purchase earned"`, `"Redeemed"`) |
| `data.transactions[].orderId` | string \| null | Associated order ID if applicable |

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found |
| `500` | Unexpected server error |

---

## POST /loyaltyTierInfo

Returns the current tier, tier progress, and tier benefits for a specific customer. Use this to render a customer's tier status card or membership dashboard.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | One of three | Customer ID | `"APP-CUST-001234"` |
| `customer_mobile` | string | One of three | Mobile with country code | `"+971501234567"` |
| `customer_email` | string | One of three | Email address | `"sarah.khan@example.com"` |

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.currentTier` | string | Current tier name (e.g. `"Gold"`) |
| `data.currentPoints` | number | Points balance contributing to tier status |
| `data.nextTier` | string \| null | Next tier name, or null if at top |
| `data.pointsToNextTier` | number | Points required to reach the next tier |
| `data.tierBenefits` | array | List of benefit descriptions for the current tier |

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found |
| `500` | Unexpected server error |

---

## POST /getLoyaltyDetails

Returns comprehensive loyalty programme details for a customer, including full tier hierarchy, accrual rules, and redemption thresholds. Use this for a deep programme details screen or onboarding explainer.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

Same as `/loyaltyTierInfo`.

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.programName` | string | Loyalty programme name |
| `data.tiers` | array | All configured tiers, each containing `tierName`, `minPoints`, `benefits` |
| `data.accrualRate` | number | Points earned per unit spend |
| `data.redemptionRate` | number | Points required per currency unit of discount |
| `data.customerTier` | string | Customer's current tier |
| `data.customerPoints` | number | Customer's current balance |

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found |
| `500` | Unexpected server error |

---

## POST /getTierDescription

Returns the textual description and qualifying rules for each tier in the merchant's loyalty programme. Use this to populate an informational tier breakdown in the app without requiring a specific customer context.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |

### Response - 200 OK

Returns a string containing the tier description content, wrapped in the standard envelope.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Tier description not configured or server error |

---

## POST /allocateLoyaltyPointsToCustomer

Manually credits loyalty points to a customer's balance outside the normal earn-on-purchase flow. Intended for promotional campaigns, welcome bonuses, compensation credits, or admin corrections.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | Yes | Customer ID in your system or Qubriux `customerId` | `"APP-CUST-001234"` |
| `points` | number | Yes | Number of points to allocate | `500` |
| `reason` | string | No | Description of why points were allocated | `"Welcome bonus"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "points": 500,
  "reason": "Welcome bonus"
}
```

### Response - 200 OK

Returns a success confirmation string in `data`.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or invalid points value |
| `500` | Unexpected server error |

---

## POST /cartUpdate

Validates a live cart against the customer's available rewards and returns the projected discount breakdown before the customer commits to redemption. Call this each time the cart changes to keep the discount preview up to date. This endpoint does not finalise anything — it is read-only from a loyalty perspective.

:::note
Also available as `POST /cartUpdateV2` — both endpoints call the same underlying service and return identical responses.
:::

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | One of three | Customer identifier | `"APP-CUST-001234"` |
| `customer_mobile` | string | One of three | Mobile with country code | `"+971501234567"` |
| `customer_email` | string | One of three | Email address | `"sarah.khan@example.com"` |
| `order` | object | Yes | Current basket contents (see [Order Fields](#order-fields)) | — |
| `rewardType` | string | No | Reward category to evaluate (e.g. `"POINTS"`, `"WALLET"`, `"OFFER"`) | `"POINTS"` |

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.discountAmount` | number | Projected discount that would be applied |
| `data.pointsToRedeem` | number | Points that would be consumed |
| `data.walletAmountToRedeem` | number | Wallet cash that would be consumed |
| `data.netAmount` | number | Cart total after the projected discount |
| `data.offerApplied` | object \| null | Offer details if an offer would be applied |

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or order data is malformed |
| `500` | Unexpected server error |

---

## POST /redeemReward

Finalises reward redemption at point of sale. Call this after the customer has confirmed they want to apply their rewards and the transaction is about to be settled. This endpoint deducts the appropriate points, wallet balance, or offer from the customer's account and returns the final adjusted cart.

:::warning
This endpoint makes irreversible changes to the customer's loyalty balance. Always call `/cartUpdate` first to preview the impact, then call this endpoint only when the customer explicitly confirms and the POS is ready to settle.
:::

:::note
Also available as `POST /redeemRewardV2` — both call the same underlying service.
:::

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

Same schema as `/cartUpdate`. Include the final confirmed basket in `order` and the `rewardType` the customer confirmed.

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.redemptionId` | string | Unique reference for this redemption event. **Store for void eligibility.** |
| `data.discountApplied` | number | Actual discount value deducted |
| `data.pointsDeducted` | number | Loyalty points consumed |
| `data.walletAmountDeducted` | number | Wallet cash consumed |
| `data.updatedLoyaltyBalance` | number | Remaining loyalty points after deduction |
| `data.updatedWalletBalance` | number | Remaining wallet cash after deduction |

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Insufficient balance, offer no longer valid, or data validation failure |
| `500` | Unexpected server error |

---

## POST /voidRedemption

Cancels a previously completed redemption and returns the consumed points or wallet balance to the customer. Use this when an order is cancelled after redemption has been finalised, or when a POS error requires rollback.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |
| `orderId` | string | Yes | The order ID associated with the redemption to void | `"ORD-20240401-0012"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "orderId": "ORD-20240401-0012"
}
```

### Response - 200 OK

Returns a confirmation string in `data` indicating the void was successful.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Redemption not found or already voided |
| `500` | Wallet credit-back failed or unexpected error |

---

## POST /cartClosure

Registers the successful completion of an order with Qubriux. This is the trigger for loyalty point accrual — points earned from the purchase are credited to the customer's balance only after this call. Always call this endpoint when an order is finalised at the POS, regardless of whether any rewards were redeemed.

:::warning
Loyalty point accrual is deferred until `cartClosure` is called. Do not skip this call even for orders with zero discount — failure to call it means the customer does not earn points for the transaction.
:::

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |
| `order` | object | Yes | Completed order (same schema as Order Fields) | — |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "order": {
    "order_id": "ORD-20240401-0012",
    "gross_amount": 185.00,
    "net_amount": 150.00,
    "tax": 10.00,
    "order_type": "dine_in",
    "items": [
      {
        "product_id": "PROD-001",
        "product_name": "Flat White",
        "quantity": 2,
        "rate": 22.00,
        "subtotal": 44.00
      }
    ]
  }
}
```

### Response - 200 OK

Returns a success confirmation string in `data`.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or order data malformed |
| `500` | Unexpected server error |

---

## POST /apply-coupon

Validates a customer-submitted coupon code against the current cart and, if eligible, applies the discount. Returns the updated cart with the discount breakdown. This endpoint is for interactive coupon entry at checkout — the customer provides a code and the POS applies it.

:::note
Also available as `POST /apply-couponV2` — both call the same underlying service.
:::

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |
| `couponCode` | string | Yes | The coupon code entered by the customer | `"WELCOME20"` |
| `order` | object | Yes | Current basket (see [Order Fields](#order-fields)) | — |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "couponCode": "WELCOME20",
  "order": {
    "order_id": "ORD-20240401-0012",
    "gross_amount": 185.00,
    "net_amount": 185.00,
    "tax": 10.00,
    "order_type": "dine_in",
    "items": []
  }
}
```

### Response - 200 OK

Same structure as `/cartUpdate` — returns the updated discount breakdown after the coupon is applied.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Coupon code invalid, expired, customer ineligible, or cart does not meet minimum spend |
| `500` | Wallet operation failed or unexpected server error |

---

## POST /add-coupon

Assigns a specific coupon directly to a customer's account — typically used for bulk issuance from a campaign or back-office assignment, rather than interactive entry.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `userId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |
| `couponCode` | string | Yes | Coupon code to assign | `"BIRTHDAY50"` |

### Response - 200 OK

Returns a success confirmation string in `data`.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer or coupon not found |
| `500` | Unexpected server error |

---

## POST /getCouponDetails

Returns the full details of an offer associated with a given coupon code — name, description, discount value, eligibility rules, and validity period. Use this to show a preview before applying.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `couponCode` | string | Yes | Coupon code to look up | `"WELCOME20"` |

### Response - 200 OK

Returns a `ShawarmerGetCustomerOfferResponse` with the offer's metadata, including `offerName`, `offerType`, `discountValue`, `startDate`, `endDate`, and eligibility conditions.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Coupon code not found |
| `500` | Unexpected server error |

---

## Related APIs

- [Badges API](./Badges%20API) — badge catalogues, customer badge status, and badge details
- [Gamification API](./Gamification%20API) — challenges, activation, and per-step progress tracking
- [Wallet API](./Wallet%20API) — digital wallet balance, credits, debits, and transaction history

---

## Common Error Codes

| HTTP Status | Cause |
|-------------|-------|
| `401` | Invalid API key, expired JWT, or merchant/JWT context mismatch |
| `422` | Business rule violation — customer not found, insufficient balance, offer ineligible, duplicate record |
| `500` | Unhandled server error — check your integration team's alert channel |

:::note
All `422` errors include a human-readable message in `data` and a numeric `errorKey` that maps to a localised error string in Qubriux's error catalogue.
:::
