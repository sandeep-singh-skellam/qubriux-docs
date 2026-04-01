---
id: loyalty-api
title: Loyalty API
sidebar_label: Loyalty API
---

## Overview

The Qubriux Loyalty Open API enables external POS systems, mobile applications, and third-party integrations to participate in the Qubriux loyalty lifecycle. It covers everything from customer registration and offer retrieval through to reward validation and post-transaction redemption confirmation. All endpoints are under the `/openapi` base path and authenticate via a merchant-level API key combined with an optional JWT Bearer token.

## Base URL

```
https://api.qubriux.com/openapi
```

## Authentication

Every request requires a **merchant-level API Key** passed as the `api_key` field inside the request body. This key is issued by Qubriux during integration setup and identifies both the merchant and the calling application.

Most endpoints additionally accept a **JWT Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Obtain a token from [`POST /openapi/auth/getAccessToken`](#post-openapiauthgetaccesstoken). The JWT is validated against the merchant context derived from the `api_key` - if they do not match, the request is rejected with a `401`.

:::tip
The JWT layer is optional for basic integrations but recommended for production. It provides an additional binding between the request and a specific merchant/customer context, preventing API key misuse.
:::

## Response Envelope

All responses (except [`getLoyaltyTierDescription`](#post-openapirewardgetloyaltytierdescription)) use a standard wrapper:

```json
{
  "status": "success",
  "data": { ... }
}
```

On error, `status` is `"failure"` and `data` contains a human-readable error message string.

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/openapi/auth/getAccessToken` | Issue a JWT access token |
| `POST` | `/openapi/createCustomer` | Register a new customer |
| `POST` | `/openapi/updateCustomer` | Update an existing customer's profile |
| `POST` | `/openapi/reward/getCustomerOffers` | Get available offers and loyalty status |
| `POST` | `/openapi/reward/validateReward` | Validate reward eligibility before checkout |
| `POST` | `/openapi/reward/applyCoupon` | Apply a specific coupon code to an order |
| `POST` | `/openapi/reward/rewardRedeemed` | Confirm redemption after transaction completion |
| `POST` | `/openapi/reward/getCustomerLoyaltyPointsTx` | Retrieve loyalty points transaction history |
| `POST` | `/openapi/reward/getLoyaltyTierBenefits` | Retrieve tier benefit definitions |
| `POST` | `/openapi/reward/getLoyaltyTierDescription` | Retrieve descriptive tier rules |
| `POST` | `/openapi/getMerchantDetails` | Retrieve merchant admin configuration |

---

## POST /openapi/auth/getAccessToken

Exchanges merchant credentials for a short-lived JWT access token. The token is scoped to the merchant derived from the API key and, optionally, to a specific customer when `customerId` is supplied. Use this token as the Bearer token on all subsequent calls requiring customer-level JWT validation. A token issued for one merchant cannot be used with a different merchant's API key.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key issued by Qubriux | `"pk_live_abc123def456"` |
| `clientId` | string | Yes | OAuth client identifier from integration setup | `"client_7f8a9b2c"` |
| `clientSecret` | string | Yes | OAuth client secret corresponding to `clientId` | `"secret_x9y8z7w6"` |
| `customerId` | string | No | When provided, scopes the token to this customer | `"APP-CUST-001234"` |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "clientId": "client_7f8a9b2c",
  "clientSecret": "secret_x9y8z7w6",
  "customerId": "APP-CUST-001234"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"success"` |
| `data` | object | Token payload. Inspect the actual response during integration - structure is determined by the JWT provider configuration. |

### Response Example

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
| `401` | `api_key` is invalid or `clientId`/`clientSecret` do not match |
| `500` | Unexpected server error |

:::warning
Store the issued token securely. Do not expose it client-side in environments where it can be intercepted. Tokens expire - handle `401` responses from other endpoints by re-fetching a token.
:::

---

## POST /openapi/createCustomer

Registers a new customer in the Qubriux loyalty platform. On success, Qubriux creates a customer record, optionally provisions a digital wallet, and returns the internal customer ID along with a customer-scoped JWT. Call this endpoint the first time you encounter a customer - typically at sign-up or first purchase. Supply your system's customer ID in `customer_info.id` to link the Qubriux record back to your own database for all future lookups.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_info` | object | Yes | Customer profile data (see below) | - |
| `createdAt` | string | No | ISO 8601 registration timestamp in your system | `"2024-04-01T10:30:00Z"` |
| `customer_source` | string | No | Channel or system where the customer registered | `"mobile_app"` |

#### customer_info Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Recommended | Your system's customer ID - links the Qubriux record to your database | `"APP-CUST-001234"` |
| `mobile` | string | Recommended | Mobile number with country code. Primary identifier. | `"+971501234567"` |
| `email` | string | Recommended | Email address. Secondary identifier. | `"sarah.khan@example.com"` |
| `firstName` | string | No | First name | `"Sarah"` |
| `lastName` | string | No | Last name | `"Khan"` |
| `name` | string | No | Full name - alternative to firstName + lastName | `"Sarah Khan"` |
| `dob` | string | No | Date of birth (YYYY-MM-DD). Triggers birthday rewards. | `"1990-06-15"` |
| `anniversary_date` | string | No | Anniversary date (YYYY-MM-DD). Triggers anniversary rewards. | `"2018-03-20"` |
| `gender` | string | No | Gender identifier | `"F"` |
| `nationality` | string | No | ISO 3166-1 alpha-2 country code | `"AE"` |
| `country_code` | string | No | International dialling code for the mobile number | `"+971"` |
| `customerTitle` | string | No | Honorific (Mr, Mrs, Dr, Ms) | `"Ms"` |
| `referralCode` | string | No | Referral code assigned to this customer for sharing | `"REF-SK-7789"` |
| `referredBy` | string | No | Referral code of the customer who referred this one | `"REF-AM-4412"` |
| `isSMSMarketingConsentGiven` | boolean | No | SMS marketing consent | `true` |
| `isEmailMarketingConsentGiven` | boolean | No | Email marketing consent | `true` |
| `isLoyaltyConsentGiven` | boolean | No | Loyalty programme participation consent | `true` |
| `isWalletRequired` | boolean | No | Provision a digital wallet on registration. Default: `false`. | `false` |
| `isProfileComplete` | boolean | No | Whether the profile is complete - drives app-side prompts | `true` |
| `createdAt` | string | No | Registration timestamp in your system (ISO 8601) | `"2024-04-01T10:30:00Z"` |
| `address.line_1` | string | No | Primary address line | `"Villa 12, Al Barsha"` |
| `address.line_2` | string | No | Secondary address line | `"Street 4"` |
| `address.city` | string | No | City | `"Dubai"` |
| `address.state` | string | No | State or emirate | `"Dubai"` |
| `address.country` | string | No | ISO 3166-1 alpha-2 country code | `"AE"` |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
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
    "isWalletRequired": false,
    "isProfileComplete": true,
    "address": {
      "line_1": "Villa 12, Al Barsha",
      "city": "Dubai",
      "country": "AE"
    }
  }
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.customerId` | string | Qubriux internal customer ID. **Store this alongside your own ID.** |
| `data.walletId` | string \| null | Digital wallet ID, if wallet was provisioned |
| `data.availableBalance` | number | Current wallet balance - zero for new customers |
| `data.userJwtToken` | string \| null | Customer-scoped JWT for use as Bearer token on subsequent calls |

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
| `401` | Invalid API key or JWT token mismatch |
| `422` | Customer already exists, or required fields failed validation |
| `500` | Unexpected server error |

:::tip
Persist `customerId` from the response in your database. Supplying it on future requests (instead of mobile/email) is the most reliable identifier since contact details can change.
:::

---

## POST /openapi/updateCustomer

Updates profile data for an existing Qubriux customer. Use this to sync changes from your system - name corrections, consent withdrawals, or new contact details - into Qubriux. The customer must already exist. Supply at least one identifier (`id`, `mobile`, or `email`) alongside the fields to update. The endpoint returns the same shape as `createCustomer` with the customer's current balance and a refreshed JWT.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

Same schema as `createCustomer`. Include only the fields that have changed alongside one customer identifier.

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customer_info": {
    "id": "APP-CUST-001234",
    "mobile": "+971501234567",
    "email": "sarah.k.updated@example.com",
    "isEmailMarketingConsentGiven": false
  }
}
```

### Response - 200 OK

Same as `createCustomer` response. `availableBalance` reflects the customer's current balance at time of update.

### Response Example

```json
{
  "status": "success",
  "data": {
    "customerId": "QBX-CUST-00456789",
    "walletId": "WALLET-00123456",
    "availableBalance": 142.50,
    "userJwtToken": null
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or updated contact details conflict with another existing customer |
| `500` | Unexpected server error |

:::warning
Qubriux enforces uniqueness on mobile and email. If the updated value already belongs to a different customer record, the update will be rejected with a `422`.
:::

---

## POST /openapi/reward/getCustomerOffers

Returns the complete set of active offers available to a customer alongside their current loyalty balance, tier status, tier progression data, and redemption limits - all in a single call. Call this at the start of a transaction or when rendering a customer's wallet screen. Optionally include the live basket in the `order` field to enable dynamic offer eligibility evaluation against the current items. Use `beansExpiryAfterDays` to surface expiring points and motivate redemption.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_mobile` | string | One of these three | Customer's mobile with country code | `"+971501234567"` |
| `customer_email` | string | One of these three | Customer's email address | `"sarah.khan@example.com"` |
| `customerId` | string | One of these three | App-level or Qubriux customer ID | `"APP-CUST-001234"` |
| `beansExpiryAfterDays` | integer | No | Show points expiring within N days | `30` |
| `order` | object | No | Live basket for dynamic eligibility evaluation (see [Order Fields](#order-fields)) | - |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customer_mobile": "+971501234567",
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
| `data.customer_mobile` | string | Customer's mobile as stored in Qubriux |
| `data.customer_email` | string | Customer's email |
| `data.customerId` | string | Qubriux internal customer ID |
| `data.loyalty_points` | number | Current redeemable points balance |
| `data.loyalty_points_multiplier` | number | Current earn multiplier (e.g. `1.5` = 1.5× points) |
| `data.loyalty_tier` | integer | Numeric tier level (1 = lowest) |
| `data.loyalty_tier_name` | string | Display name of current tier |
| `data.next_loyalty_tier` | string \| null | Name of next tier; null if on highest tier |
| `data.next_loyalty_tier_entry_points` | number \| null | Points needed to reach the next tier |
| `data.next_loyalty_tier_order_value` | number \| null | Cumulative spend needed for next tier (spend-based programmes) |
| `data.isHighestTier` | boolean | True if customer is on the programme's highest tier |
| `data.totalAmountToRedeem` | number | Max monetary value redeemable from current points balance |
| `data.totalAccumulatedOrderValue` | number | Cumulative spend in the current evaluation window |
| `data.max_loyalty_points` | number | Max points redeemable per transaction |
| `data.min_loyalty_points` | number | Min points required to redeem |
| `data.max_percentage_bill_value` | number | Max % of the bill coverable by points |
| `data.min_percentage_bill_value` | number | Min % of the bill when points redemption is active |
| `data.loyalty_points_bracket` | number | Points-to-currency conversion rate |
| `data.pointsToBeExpiredInXDays` | number | Points expiring within the requested window |
| `data.firstOrderDate` | string \| null | Customer's first order date (ISO 8601) |
| `data.tierChangeDate` | string \| null | Date of most recent tier change (ISO 8601) |
| `data.tierMismatch` | boolean | True if tier is pending recalculation |
| `data.offers` | array | Active offers for this customer (see [Offer Object](#offer-object)) |

### Response Example

```json
{
  "status": "success",
  "data": {
    "customer_mobile": "+971501234567",
    "customerId": "QBX-CUST-00456789",
    "loyalty_points": 350.00,
    "loyalty_points_multiplier": 1.5,
    "loyalty_tier": 2,
    "loyalty_tier_name": "Gold",
    "next_loyalty_tier": "Platinum",
    "next_loyalty_tier_entry_points": 1000.00,
    "isHighestTier": false,
    "totalAmountToRedeem": 35.00,
    "max_loyalty_points": 500.00,
    "min_loyalty_points": 50.00,
    "max_percentage_bill_value": 20.00,
    "min_percentage_bill_value": 5.00,
    "loyalty_points_bracket": 10.00,
    "pointsToBeExpiredInXDays": 100.00,
    "offers": [
      {
        "offer_code": "SUMMER25",
        "offer_name": "Summer Discount 25%",
        "discount_type": "percentage_cashback",
        "discount_value": 25.00,
        "discount_on": "total_bill",
        "status": "active",
        "expiryDate": "2024-08-31"
      }
    ]
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found for the provided identifier |
| `500` | Unexpected server error |

---

## POST /openapi/reward/validateReward

Evaluates reward eligibility for a customer's current order and returns the exact discount breakdown - both at order level and per item. This is a **read-only** call: it calculates what discount will apply but does not commit any redemption. Always call this before finalising payment to show the customer their pre-discount total. Follow up with [`rewardRedeemed`](#post-openapirewardrewardredeemed) after the transaction completes to commit the deduction.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_mobile` / `customer_email` / `customerId` | string | Yes (one of) | Customer identifier | - |
| `order` | object | Yes | Order details including items and requested points (see [Order Fields](#order-fields)) | - |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customer_mobile": "+971501234567",
  "order": {
    "order_id": "ORD-20240401-0012",
    "gross_amount": 185.00,
    "net_amount": 175.00,
    "tax": 10.00,
    "order_type": "dine_in",
    "loyaltyPoints": 100.00,
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

| Field | Type | Description |
|-------|------|-------------|
| `data.customerMobile` | string | Customer's mobile |
| `data.customerEmail` | string | Customer's email |
| `data.discountOnPoints` | number | Monetary value of the points redemption portion |
| `data.pointsToRedeem` | number | Points that will be deducted when `rewardRedeemed` is called |
| `data.totalDiscount` | number | Combined total discount (offers + points) |
| `data.availableLoyaltyPoints` | number | Points balance before this redemption |
| `data.discountOn` | string | Scope of the discount (e.g. `total_bill`, `specific_item`) |
| `data.discountDetails` | array | Discount breakdown per item (see [Discount Details](#discount-details-object)) |
| `data.itemLevelRedemptionDetails` | array \| null | Per-item redemption breakdown when discount is distributed across items |
| `data.giftCodeResponse` | object \| null | Gift code outcome if a gift code was applied (see [Gift Code Response](#gift-code-response)) |

### Response Example

```json
{
  "status": "success",
  "data": {
    "customerMobile": "+971501234567",
    "discountOnPoints": 10.00,
    "pointsToRedeem": 100.00,
    "totalDiscount": 25.00,
    "availableLoyaltyPoints": 350.00,
    "discountOn": "total_bill",
    "discountDetails": [
      {
        "itemId": "PROD-001",
        "itemName": "Flat White",
        "discountCode": "SUMMER25",
        "discountAmount": 11.00,
        "discountType": "percentage_cashback",
        "rate": 22.00,
        "quantity": 2
      }
    ]
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, insufficient points balance, or offer eligibility not met |
| `500` | Unexpected server error |

:::warning
This endpoint does not record a redemption. If you display the discounted total to the customer and they complete payment, you must call `rewardRedeemed` to commit the points deduction. Failing to call `rewardRedeemed` will leave the customer's balance inflated.
:::

---

## POST /openapi/reward/applyCoupon

Validates and applies a single coupon code explicitly entered by a customer, returning the discount breakdown. Unlike `validateReward` which evaluates all eligible rewards automatically, this endpoint targets only the coupon code in `couponCode`. Use this for coupon entry flows where the customer types or scans a code. Like `validateReward`, this call is non-committing - call `rewardRedeemed` after payment to finalise.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_mobile` / `customer_email` / `customerId` | string | Yes (one of) | Customer identifier | - |
| `couponCode` | string | Yes | Coupon code entered by the customer | `"WELCOME10"` |
| `order` | object | Yes | Order details for eligibility evaluation (see [Order Fields](#order-fields)) | - |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customer_mobile": "+971501234567",
  "couponCode": "WELCOME10",
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
        "rate": 22.00,
        "subtotal": 44.00
      }
    ]
  }
}
```

### Response - 200 OK

Same response shape as `validateReward`.

### Response Example

```json
{
  "status": "success",
  "data": {
    "customerMobile": "+971501234567",
    "totalDiscount": 18.50,
    "discountOn": "total_bill",
    "pointsToRedeem": 0.00,
    "availableLoyaltyPoints": 350.00,
    "discountDetails": [
      {
        "discountCode": "WELCOME10",
        "discountAmount": 18.50,
        "discountType": "fixed_cashback"
      }
    ]
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Coupon code not found, expired, already used, or eligibility conditions not met |
| `500` | Unexpected server error |

---

## POST /openapi/reward/rewardRedeemed

Commits a reward redemption after a transaction has been completed and payment accepted. This is the **mandatory confirmation step** that deducts loyalty points and records offer redemptions on the customer's record. Pass the same `order` object used in the preceding `validateReward` or `applyCoupon` call for consistency. Do not call this endpoint if the transaction was cancelled or payment failed.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_mobile` / `customer_email` / `customerId` | string | Yes (one of) | Customer identifier | - |
| `order` | object | Yes | Completed order including applied discounts at item level (see [Order Fields](#order-fields)) | - |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customer_mobile": "+971501234567",
  "order": {
    "order_id": "ORD-20240401-0012",
    "gross_amount": 185.00,
    "net_amount": 160.00,
    "tax": 10.00,
    "order_type": "dine_in",
    "loyaltyPoints": 100.00,
    "items": [
      {
        "product_id": "PROD-001",
        "product_name": "Flat White",
        "quantity": 2,
        "rate": 22.00,
        "subtotal": 44.00,
        "discount": {
          "discountAmt": 11.00,
          "discountType": "percentage_cashback"
        }
      }
    ]
  }
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"success"` |
| `data` | string | Confirmation message |

### Response Example

```json
{
  "status": "success",
  "data": "Reward redeemed successfully"
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `400` | Missing or invalid order data |
| `401` | Invalid API key or JWT mismatch |
| `404` | Loyalty record not found for the customer |
| `500` | Unexpected server error |

:::warning
This is the only endpoint that returns `404` - it indicates the customer does not have a loyalty record (e.g. they never enrolled). Handle this gracefully in your integration - do not block the transaction, just skip the loyalty deduction.
:::

---

## POST /openapi/reward/getCustomerLoyaltyPointsTx

Returns a paginated list of loyalty point transactions for a customer, covering both earn and burn events. Use this to build a points history view in your app or customer portal. The response schema for the `data` object varies by merchant configuration - inspect the actual response during your integration.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customer_mobile` / `customer_email` / `customerId` | string | Yes (one of) | Customer identifier | - |
| `recordsPerPage` | integer | No | Results per page | `20` |
| `pageNumber` | integer | No | Page number (1-based) | `1` |
| `sortingOrder` | string | No | Sort direction: `ASC` or `DESC` | `"DESC"` |
| `transactionType` | string | No | Filter by type (e.g. `earn`, `burn`) | `"earn"` |
| `beansExpiryAfterDays` | integer | No | Show only points expiring within N days | `90` |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customer_mobile": "+971501234567",
  "recordsPerPage": 20,
  "pageNumber": 1,
  "sortingOrder": "DESC",
  "transactionType": "earn"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"success"` |
| `data` | object | Paginated transaction history. Inspect actual response during integration. |

### Response Example

```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "transactionId": "TXN-20240401-001",
        "type": "earn",
        "points": 35.00,
        "orderId": "ORD-20240401-0012",
        "date": "2024-04-01T10:35:00Z",
        "description": "Points earned on purchase"
      },
      {
        "transactionId": "TXN-20240331-007",
        "type": "burn",
        "points": -100.00,
        "orderId": "ORD-20240331-0044",
        "date": "2024-03-31T18:20:00Z",
        "description": "Points redeemed"
      }
    ],
    "totalRecords": 47,
    "currentPage": 1
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found or invalid filter values |
| `500` | Unexpected server error |

---

## POST /openapi/reward/getLoyaltyTierBenefits

Returns the configured benefits for each loyalty tier in the merchant's programme as a list of tier objects. Use this to display what perks a customer currently enjoys and what awaits them upon upgrading - an effective driver of tier aspiration. The schema of each tier object varies by merchant programme configuration; inspect the actual response during integration.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customerId` | string | No | Customer identifier if you want customer-scoped data | `"APP-CUST-001234"` |

### Request Example

```json
{
  "api_key": "pk_live_abc123def456",
  "customerId": "APP-CUST-001234"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"success"` |
| `data` | array | List of tier benefit objects |

### Response Example

```json
{
  "status": "success",
  "data": [
    {
      "tierName": "Silver",
      "tierLevel": 1,
      "pointsMultiplier": 1.0,
      "benefits": ["Birthday bonus points", "Early access to promotions"]
    },
    {
      "tierName": "Gold",
      "tierLevel": 2,
      "pointsMultiplier": 1.5,
      "benefits": ["1.5x points on all purchases", "Free delivery on orders above AED 100"]
    },
    {
      "tierName": "Platinum",
      "tierLevel": 3,
      "pointsMultiplier": 2.0,
      "benefits": ["2x points on all purchases", "Dedicated support line", "Exclusive events"]
    }
  ]
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Validation failure |
| `500` | Unexpected server error |

---

## POST /openapi/reward/getLoyaltyTierDescription

Returns a human-readable description of the loyalty programme's earn structure and tier rules. Use this to power an "About the Programme" or "How It Works" screen in your app. This endpoint returns its response **directly** - it does not wrap the body in the standard `{ status, data }` envelope. The schema varies by merchant configuration.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customerId` | string | No | Customer identifier | `"APP-CUST-001234"` |

### Response - 200 OK

Raw response object. No `status`/`data` wrapper. Schema varies by merchant programme.

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Validation failure |
| `500` | Unexpected server error |

:::warning
This is the only endpoint in this API that does not use the standard `{ "status", "data" }` response envelope. Check for this in your response handling logic to avoid deserialization errors.
:::

---

## POST /openapi/getMerchantDetails

Returns the full admin configuration object for a given merchant. Typically used during integration setup to verify programme settings or retrieve flags that drive client-side behaviour - for example, determining which loyalty features are active for a merchant. Requires the merchant ID as a query parameter in addition to the API key in the request body.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `merchantId` | integer | Yes | Qubriux internal merchant ID | `12345` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `api_key` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |

### Request Example

```
POST /openapi/getMerchantDetails?merchantId=12345
```

```json
{
  "api_key": "pk_live_abc123def456"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"success"` |
| `data` | object | Merchant admin configuration entity. Schema varies by merchant setup - inspect during integration. |

### Response Example

```json
{
  "status": "success",
  "data": {
    "merchantId": 12345,
    "merchantName": "The Coffee House",
    "loyaltyEnabled": true,
    "offersEnabled": true,
    "currency": "AED"
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Unexpected server error or merchant not found |

---

## Shared Object Reference

### Order Fields

Used in `getCustomerOffers`, `validateReward`, `applyCoupon`, and `rewardRedeemed`.

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `order_id` | string | Recommended | Your system's order identifier | `"ORD-20240401-0012"` |
| `invoice_number` | string | No | Invoice or receipt number | `"INV-2024-0012"` |
| `order_type` | string | No | Order type (e.g. `dine_in`, `takeaway`, `delivery`, `online`) | `"dine_in"` |
| `gross_amount` | number | Yes | Order total before discounts and tax | `185.00` |
| `net_amount` | number | Yes | Order total after discounts, before tax | `175.00` |
| `tax` | number | No | Tax amount | `10.00` |
| `loyaltyPoints` | number | No | Points the customer wants to redeem against this order | `100.00` |
| `source` | string | No | Origin channel (e.g. `mobile_app`, `kiosk`, `web`) | `"mobile_app"` |
| `platformName` | string | No | Platform name | `"custom_app"` |
| `platformVersion` | string | No | Platform version string | `"3.2.1"` |
| `discount` | object | No | Order-level discount (see [Discount Object](#discount-object)) | - |
| `items` | array | Recommended | Line items (see [Product Fields](#product-fields)) | - |
| `delivery_info` | object | No | Delivery details - pass fields as available | - |

### Product Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `product_id` | string | Recommended | Your system's product ID | `"PROD-001"` |
| `product_name` | string | Recommended | Product display name | `"Flat White"` |
| `quantity` | integer | Yes | Units ordered | `2` |
| `category_id` | string | No | Category identifier | `"CAT-DRINKS"` |
| `category_name` | string | No | Category display name | `"Beverages"` |
| `rate` | number | Yes | Unit price | `22.00` |
| `subtotal` | number | Yes | Line subtotal (rate × quantity, before item discounts) | `44.00` |
| `discount` | object | No | Item-level discount (see [Discount Object](#discount-object)) | - |
| `modifiers` | array | No | Add-ons or customisations applied to this item | - |

### Discount Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `discountAmt` | number | Monetary discount amount | `25.00` |
| `discountId` | string | Identifier of the discount rule or offer | `"OFFER-SUMMER25"` |
| `discountType` | string | One of: `fixed_cashback`, `percentage_cashback`, `give_away`, `hidden_item_offer`, `burn_loyalty_points` | `"percentage_cashback"` |

### Offer Object

Returned within `getCustomerOffers` response as items in `data.offers`.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `offer_code` | string | Unique offer code - use in `applyCoupon` requests | `"SUMMER25"` |
| `offer_name` | string | Internal offer name | `"Summer Discount 25%"` |
| `offerNameAlias` | string \| null | Customer-facing display name | `"Beat the Heat - 25% Off"` |
| `discount_type` | string | Discount mechanism (see Discount Object) | `"percentage_cashback"` |
| `discount_value` | number | Discount magnitude (amount or percentage) | `25.00` |
| `discount_on` | string | Discount scope (e.g. `total_bill`, `specific_item`) | `"total_bill"` |
| `expiryDate` | string | Offer expiry date (YYYY-MM-DD) | `"2024-08-31"` |
| `status` | string | `active`, `inactive`, or `expired` | `"active"` |
| `comment` | string \| null | Optional terms or notes | `"Valid on dine-in only"` |
| `toApplyOnMultipleProduct` | boolean | Whether the offer applies across multiple qualifying items | `false` |

### Discount Details Object

Returned as items in `discountDetails` and `itemLevelRedemptionDetails`.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `itemId` | string | Product ID this discount applies to | `"PROD-001"` |
| `itemName` | string | Product name | `"Flat White"` |
| `discountCode` | string | Offer or coupon code generating this discount | `"SUMMER25"` |
| `discountAmount` | number | Monetary discount for this line | `11.00` |
| `rate` | number | Unit price before discount | `22.00` |
| `quantity` | integer | Units | `2` |
| `discountType` | string | Discount type | `"percentage_cashback"` |
| `cashbackAmount` | string \| null | Cashback amount formatted as string for display | `"11.00"` |
| `pointsToRedeem` | number \| null | Points redeemed against this specific line | `0.00` |
| `free_product` | array \| null | Complimentary products from a give-away offer | - |

### Gift Code Response

Populated in `validateReward` / `applyCoupon` responses when the customer redeems a gift code voucher.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `giftCodeMessage` | string | Human-readable outcome message | `"Gift code applied. AED 50 credited to your wallet."` |
| `giftCodeType` | string | Where the value was credited (`wallet`, `loyalty`) | `"wallet"` |
| `messageKey` | integer | Internal key for message localisation | `201` |
| `walletInfo` | object \| null | Wallet transaction details | - |
| `loyaltyInfo` | object \| null | Loyalty transaction details | - |

---

## Error Reference

| HTTP Status | When It Occurs | Notes |
|-------------|----------------|-------|
| `400` | Bad request - missing or malformed required data | Only returned by `rewardRedeemed` |
| `401` | Authentication failed | Invalid `api_key`, or JWT token mismatch with merchant context |
| `404` | Resource not found | Only returned by `rewardRedeemed` when no loyalty record exists |
| `422` | Business rule validation failure | Customer not found, insufficient points, coupon not eligible, duplicate record |
| `500` | Unexpected server error | Retry after a brief interval; escalate to Qubriux support if persistent |

All error responses follow the same envelope:

```json
{
  "status": "failure",
  "data": "Human-readable error message"
}
```

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-04-01 | Initial documentation |
