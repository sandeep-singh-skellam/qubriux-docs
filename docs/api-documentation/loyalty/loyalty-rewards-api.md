---
id: loyalty-rewards-api
title: Loyalty & Rewards API
sidebar_label: Loyalty & Rewards API
sidebar_position: 1
---

## Overview

The Qubriux Loyalty & Rewards API is the primary integration surface for POS systems, mobile apps, and third-party ordering platforms. It covers the core customer loyalty lifecycle: registration, offer retrieval, cart validation, reward redemption, order closure, and coupon management. All endpoints share a single base path under `/ezloyal-web` and authenticate via a merchant-level API key combined with an optional JWT Bearer token.

:::note
Badges, gamification challenges, and wallet operations are documented in their own dedicated references:
- [Badges API](./badges-api.md) — badge catalogues and customer badge progress
- [Gamification API](./gamification-api.md) — challenges, activation, and progress tracking
- [Wallet API](./wallet-api.md) — digital wallet balance, credits, debits, and history
:::

## Base URL

Start your integration against the **staging** environment and switch to **production** once tested.

| Environment | Base URL |
|-------------|----------|
| **Staging** | `https://qa.qubriux.com/ezloyal-web` |
| **Production** | `https://app.qubriux.com/ezloyal-web` |

:::tip
Use the staging environment during development — it is isolated from live merchant data and safe for test transactions.
:::

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


### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "clientId": "client_7f8a9b2c",
  "clientSecret": "secret_x9y8z7w6"
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
| `apiKey` | string | Yes | Merchant-level API key | `"28fb4bd2-cd35-480f-a9ac-4459669cf782"` |
| `customerInfo` | object | Yes | Customer profile (see below) | — |

#### customerInfo Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `userId` | string | Recommended | Your system's unique customer identifier — links the Qubriux record back to your DB | `"APP-CUST-001234"` |
| `firstName` | string | No | First name | `"Henry"` |
| `lastName` | string | No | Last name | `"John"` |
| `mobile` | string | Recommended | Mobile number. Primary identifier. | `"758665533"` |
| `dob` | string | No | Date of birth (YYYY-MM-DD). Triggers birthday rewards. | `"2025-11-11"` |
| `anniversaryDate` | string | No | Anniversary date (YYYY-MM-DD) | `"2026-02-16"` |
| `email` | string | Recommended | Email address. Secondary identifier. | `"user@example.com"` |
| `isSMSMarketingConsentGiven` | boolean | No | SMS marketing consent | `true` |
| `isEmailMarketingConsentGiven` | boolean | No | Email marketing consent | `true` |
| `isProfileComplete` | boolean | No | Marks the profile as complete; triggers customer onboarding | `true` |
| `isLoyaltyConsentGiven` | boolean | No | Loyalty programme participation consent | `true` |
| `gender` | string | No | Customer gender (`male` / `female`) | `"male"` |
| `countryCode` | string | No | ISO 3166-1 alpha-2 country code | `"SA"` |
| `nationality` | string | No | Customer nationality | `"Saudi Arabia"` |
| `hobbies` | array | No | List of hobbies | `["Cycling", "Swimming"]` |
| `occupation` | string | No | Customer occupation | `"Software Engineer"` |
| `instagramId` | string | No | Customer's Instagram handle | `"randomid"` |
| `tikTokId` | string | No | Customer's TikTok handle | `"randomtiktoid"` |
| `address` | object | No | Customer address (see below) | — |
| `createdAt` | string | No | Customer creation timestamp in your system (YYYY-MM-DD HH:MM:SS) | `"2026-02-12 07:55:10"` |

#### address Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `line1` | string | Address line 1 | `"House no 5"` |
| `line2` | string | Address line 2 | `"Phase 1"` |
| `city` | string | City | `"New York"` |
| `state` | string | State or province | `"New York"` |
| `country` | string | Country | `"USA"` |

### Request Example

```json
{
  "apiKey": "28fb4bd2-cd35-480f-a9ac-4459669cf782",
  "customerInfo": {
    "userId": "APP-CUST-001234",
    "firstName": "Henry",
    "lastName": "John",
    "mobile": "758665533",
    "dob": "2025-11-11",
    "anniversaryDate": "2026-02-16",
    "email": "user@example.com",
    "isSMSMarketingConsentGiven": true,
    "isEmailMarketingConsentGiven": true,
    "isProfileComplete": true,
    "isLoyaltyConsentGiven": true,
    "gender": "male",
    "countryCode": "SA",
    "nationality": "Saudi Arabia",
    "hobbies": ["Cycling", "Swimming"],
    "occupation": "Software Engineer",
    "instagramId": "randomid",
    "tikTokId": "randomtiktoid",
    "address": {
      "line1": "House no 5",
      "line2": "Phase 1",
      "city": "New York",
      "state": "New York",
      "country": "USA"
    },
    "createdAt": "2026-02-12 07:55:10"
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

Same schema as `createCustomer`. Include only the fields to update alongside at least one customer identifier (`userId`, `mobile`, or `email`).

### Request Example

```json
{
  "apiKey": "28fb4bd2-cd35-480f-a9ac-4459669cf782",
  "customerInfo": {
    "userId": "APP-CUST-001234",
    "mobile": "758665533",
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

## POST /getCustomerOffers

Returns the complete set of active offers available to a customer alongside their current loyalty balance, tier status, tier progression data, and redemption limits — all in a single call. Call this at the start of a transaction or when rendering a customer's wallet screen. Optionally include the live basket in the `order` field to enable dynamic offer eligibility evaluation against current items.


### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"39fb4bd2-cd35-480f-a9ac-4459669cf882"` |
| `userId` | string | One of three | Your system's customer ID | `"APP-CUST-001234"` |
| `mobile` | string | One of three | Customer's mobile number | `"11124650"` |
| `email` | string | One of three | Customer's email address | `"user@example.com"` |
| `source` | string | One of three | Show offers per channel | `"APP, POS, WEB` |
| `platform` | string | One of three | For APP Source | `"IOS, ANDROID"` |

### Request Example

```json
{
  "apiKey": "39fb4bd2-cd35-480f-a9ac-4459669cf882",
  "userId": null,
  "mobile": "11124650",
  "email": null,
  "source": "APP",
  "platform" : "IOS"
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
| `mobile` | string | One of three | Customer's mobile number | `"+971501234567"` |
| `email` | string | One of three | Customer's email address | `"sarah.khan@example.com"` |

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
| `mobile` | string | One of three | Customer's mobile number | `"+971501234567"` |
| `email` | string | One of three | Customer's email address | `"sarah.khan@example.com"` |

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

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"28fb4bd2-cd35-480f-a9ac-4459669cf782"` |
| `userId` | string | One of two | Your system's customer ID | `"APP-CUST-001234"` |
| `mobile` | string | One of two | Customer's mobile number | `"11124650"` |

### Request Example

```json
{
  "apiKey": "28fb4bd2-cd35-480f-a9ac-4459669cf782",
  "userId": null,
  "mobile": "11124650"
}
```

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


### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"39fb4bd2-cd35-480f-a9ac-4459669cf882"` |
| `userId` | string | One of three | Your system's customer ID | `"APP-CUST-001234"` |
| `mobile` | string | One of three | Customer's mobile number | `"11124650"` |
| `email` | string | One of three | Customer's email address | `"user@example.com"` |
| `order` | object | Yes | Current basket (see [Order Fields](#order-fields)) | — |

### Order Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `cartId` | string | Yes | Unique cart identifier | `"20088"` |
| `orderId` | string | Yes | Unique order identifier | `"20088"` |
| `invoiceNumber` | string/number | No | Invoice reference, if any | `904` |
| `orderType` | string | Yes | Order channel: `DELIVERY`, `TAKEAWAY`, `DINEIN`, `DRIVETHRU` | `"DELIVERY"` |
| `screen` | string | Yes | Screen context where the call originates | `"CART"` |
| `grossAmount` | number | Yes | Subtotal + delivery (before loyalty/wallet discounts) | `55` |
| `netAmount` | number | Yes | Subtotal + delivery minus all applied discounts | `55` |
| `subTotal` | number | Yes | Item total including tax, excluding delivery | `45` |
| `tax` | number | Yes | Tax amount | `1` |
| `source` | string | Yes | Integration source: `APP`, `POS`, `WEB` | `"POS"` |
| `platformName` | string | No | Platform: `ANDROID`, `IOS` | `"IOS"` |
| `platformVersion` | string | No | Platform version string | `"1.2.3.2"` |
| `isLoyaltyToggleOn` | boolean | Yes | Whether the customer chose to use loyalty points | `false` |
| `loyaltyPoints` | number | Conditional | Points to apply — required when `isLoyaltyToggleOn` is `true` | `5` |
| `isWalletToggleOn` | boolean | Yes | Whether the customer chose to use their wallet balance | `false` |
| `walletAmount` | number | Conditional | Wallet amount to apply — required when `isWalletToggleOn` is `true` | `10` |
| `discount` | object | Yes | Coupon/offer applied to the order (see below) | — |
| `items` | array | Yes | Line items (see below) | — |
| `deliveryInfo` | object | No | Delivery charge details (see below) | — |

#### discount Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `discountId` | string \| null | Offer/coupon code, if any | `"GIFT50"` |
| `discountAmt` | number \| null | Discount amount — populated in `redeemReward` only | `null` |

#### items Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sequenceId` | integer | Line item sequence number | `1` |
| `productId` | string | SKU or product identifier | `"18042"` |
| `productName` | string | Display name | `"7 up Medium"` |
| `rate` | number | Unit price | `45.00` |
| `quantity` | integer | Units ordered | `1` |
| `level` | integer | Size level: `0` = Regular, `1` = Medium, `2` = High | `0` |
| `type` | string | Line type: `item` or `combo` | `"item"` |
| `subtotal` | number | Product amount (`rate × quantity`) | `45.00` |
| `categoryName` | string | Category display name | `"Drink"` |
| `categoryId` | string | Category identifier | `"888000"` |
| `modifiers` | array | Selected modifiers (see below) | — |

#### modifiers Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `modifierId` | string | Modifier identifier | `"64d8bc8cccc1395649653f2c"` |
| `modifierName` | string | Modifier display name | `"Regular"` |
| `quantity` | integer | Modifier quantity | `1` |
| `rate` | number | Modifier unit price | `0.00` |
| `subtotal` | number | Modifier total | `0.00` |

#### deliveryInfo Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `deliveryCharge` | number | Delivery fee | `10` |
| `discount` | object | Discount applied to delivery — same shape as order-level `discount` | — |

### Request Example

```json
{
  "userId": null,
  "mobile": "11124650",
  "email": null,
  "apiKey": "39fb4bd2-cd35-480f-a9ac-4459669cf882",
  "order": {
    "cartId": "20088",
    "orderId": "20088",
    "invoiceNumber": 904,
    "orderType": "DELIVERY",
    "screen": "CART",
    "grossAmount": 55,
    "netAmount": 55,
    "subTotal": 45,
    "tax": 1,
    "source": "POS",
    "platformName": "IOS",
    "platformVersion": "1.2.3.2",
    "isLoyaltyToggleOn": false,
    "loyaltyPoints": 0,
    "isWalletToggleOn": false,
    "walletAmount": 0,
    "discount": {
      "discountId": "GIFT50",
      "discountAmt": null
    },
    "items": [
      {
        "sequenceId": 1,
        "productName": "7 up Medium",
        "productId": "18042",
        "rate": 45.0,
        "quantity": 1,
        "level": 0,
        "type": "item",
        "subtotal": 45.0,
        "categoryName": "Drink",
        "categoryId": "888000",
        "modifiers": [
          {
            "modifierName": "Regular",
            "quantity": 1,
            "rate": 0.0,
            "subtotal": 0.0,
            "modifierId": "64d8bc8cccc1395649653f2c"
          }
        ]
      }
    ],
    "deliveryInfo": {
      "deliveryCharge": 10,
      "discount": {
        "discountId": null,
        "discountAmt": null
      }
    }
  }
}
```

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


### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

Same schema as `/cartUpdate`. Include the final confirmed basket in `order`. Set `discount.discountAmt` to the actual computed discount amount when a coupon is being applied.

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

Same schema as `/cartUpdate` — pass the full order object for the transaction being voided. Supply the same `cartId`, `orderId`, and amounts as the original redemption call.

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"39fb4bd2-cd35-480f-a9ac-4459669cf882"` |
| `userId` | string | One of three | Your system's customer ID | `"APP-CUST-001234"` |
| `mobile` | string | One of three | Customer's mobile number | `"11124650"` |
| `email` | string | One of three | Customer's email address | `"user@example.com"` |
| `order` | object | Yes | The original order to void (see [Order Fields](#order-fields)) | — |

### Request Example

```json
{
  "userId": null,
  "mobile": "11124650",
  "email": null,
  "apiKey": "39fb4bd2-cd35-480f-a9ac-4459669cf882",
  "order": {
    "cartId": "20088",
    "orderId": "20088",
    "invoiceNumber": null,
    "orderType": "DELIVERY",
    "screen": "CART",
    "grossAmount": 61,
    "netAmount": 90,
    "subTotal": 90,
    "tax": 1.0,
    "source": "APP",
    "platformName": null,
    "isLoyaltyToggleOn": false,
    "loyaltyPoints": 0.0,
    "isWalletToggleOn": false,
    "walletAmount": 90.0,
    "discount": {
      "discountId": "GIFT50",
      "discountAmt": 40
    },
    "items": [
      {
        "productName": "productC",
        "productId": "14",
        "rate": 20.0,
        "quantity": 1,
        "subtotal": 20.0,
        "categoryName": "categoryc",
        "categoryId": "26",
        "modifiers": []
      }
    ],
    "deliveryInfo": {
      "deliveryCharge": 150,
      "discount": {
        "discountId": null,
        "discountAmt": null
      }
    }
  }
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
| `apiKey` | string | Yes | Merchant-level API key | `"39fb4bd2-cd35-480f-a9ac-4459669cf882"` |
| `userId` | string | One of three | Your system's customer ID | `"APP-CUST-001234"` |
| `mobile` | string | One of three | Customer's mobile number | `"11124650"` |
| `email` | string | One of three | Customer's email address | `"user@example.com"` |
| `order` | object | Yes | Completed order — same schema as [Order Fields](#order-fields) | — |

### Request Example

```json
{
    "userId": null,// unique customer id
    "mobile" : "11124650",
    "email" : null,
    "apiKey": "39fb4bd2-cd35-480f-a9ac-4459669cf882",
    "order": {
        "cartId": "20088",
        "orderId": "20088",
        "invoiceNumber": null,
        "orderType": "DELIVERY",
        "screen": "CART",
        "grossAmount": 55, //subtotal + delivery
        "netAmount": 55, //subtotal + delivery - (offer/loyalty disocunt + ewallet)
        "subTotal": 45, //includes tax
        "tax": 1,
        "source": "APP",
        "platformName": "ANDROID",
        "platformVersion": "13",
        "isLoyaltyToggleOn": false, // whether qubriux loyalty points was used
        "loyaltyPoints":0, //loyalty points applied on the order
        "isWalletToggleOn": false, //whether qubriux wallet was used
        "walletAmount": 0, // wallet amount used on the order
        "discount": {
            "discountId": null,
            "discountAmt": null
        },
         "items": [
            {
                "sequenceId": 1,
                "productName": "7 up Medium",
                "productId": "18042",
                "rate": 45.0,
                "quantity": 1,
                "level": 0, // 0/1/2 0-Reg, 1- Med ,2 -High
                "type": "item", // item/combo
                "subtotal": 45.0, //product amount
                "categoryName": "Drink", //
                "categoryId": "888000",
                "discount": { 
                    "discountId": null,
                    "discountAmt": null
                },
                "modifiers": [
                    {
                        "modifierName": "Regular",
                        "quantity": 1,
                        "rate": 0.0,
                        "subtotal": 0.0,
                        "modifierId": "64d8bc8cccc1395649653f2c"
                    }
                ]
            }
        ],
        "deliveryInfo": {
            "deliveryCharge": 10,
            "discount": {
                "discountId": null,
                "discountAmt": null
            }
        }
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

Returns with the offer's metadata, including `offerName`, `offerType`, `discountValue`, `startDate`, `endDate`, and eligibility conditions.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Coupon code not found |
| `500` | Unexpected server error |

---

## Related APIs

- [Badges API](./badges-api.md) — badge catalogues, customer badge status, and badge details
- [Gamification API](./gamification-api.md) — challenges, activation, and per-step progress tracking
- [Wallet API](./wallet-api.md) — digital wallet balance, credits, debits, and transaction history

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
