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
| **Staging** | `https://qa.qubriux.com/ezloyal-web/qubriux/loyalty` |
| **Production** | `https://app.qubriux.com/ezloyal-web/qubriux/loyalty` |

:::tip
Use the staging environment during development — it is isolated from live merchant data and safe for test transactions.
:::

:::note
The base URL shown above may change if a partner or merchant integration requires a custom request/response contract (e.g., a bespoke endpoint path, a white-labeled domain, or a non-standard payload shape). In such cases, Qubriux will provide the specific base URL and any deviations from this reference as part of that integration's onboarding documentation. Unless explicitly told otherwise, assume the staging and production URLs above apply.
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
| `POST` | `/getCustomerOffers` | Get available offers, loyalty balance, and tier status |
| `POST` | `/getCustomerLoyaltyPointsTx` | Retrieve loyalty points transaction history |
| `POST` | `/getLoyaltyDetails` | Get full loyalty programme details for a customer |
| `POST` | `/cartUpdate` | Validate and preview reward deductions on a live cart |
| `POST` | `/redeemReward` | Execute reward redemption at POS/KIOSK/WEB/APP |
| `POST` | `/voidRedemption` | Void/cancel a previously applied redemption |
| `POST` | `/cartClosure` | Register order completion and trigger loyalty accrual |


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
"message": "SUCCESS",
"body": {
"accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJjbGllbnRJZCI6ImNlZmJkMmVjLqUa0Wk0zZ4arJqNC4VRf9ntc1-oqT457p33OptUg",
"expires_in": 3600
},
"messageKey": null
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

Registers a new customer in the Qubriux loyalty platform. On success, Qubriux creates a customer record and returns the internal customer ID alongside a customer-scoped key. Call this endpoint the first time you encounter a customer — typically at sign-up or first purchase.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key. Store this. | `"9e2d7c1a-5b8f-43e0-a2d6-4c9b1f8e7a25"` |
| `preferredStoreApiKey` | string | No | API key of the customer's preferred store, if applicable | `"sdfdsfdsfds5b8f-43e0-fbgngntgdfg7a25"` |
| `customerInfo` | object | Yes | Customer profile (see below) | — |

#### customerInfo Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `userId` | string \| null | Recommended | Your system's unique customer identifier — links the Qubriux record back to your DB | `null` |
| `firstName` | string | No | First name | `"Abhishek1"` |
| `lastName` | string | No | Last name | `"Kumar1"` |
| `mobile` | string | Recommended | Mobile number. Primary identifier. | `"457790530"` |
| `dob` | string | No | Date of birth (YYYY-MM-DD). Triggers birthday rewards. | `"1993-11-11"` |
| `anniversaryDate` | string | No | Anniversary date (YYYY-MM-DD) | `"2024-02-16"` |
| `email` | string | Recommended | Email address. Secondary identifier. | `"abhishekk530@skellam.ai"` |
| `source` | string | No | Origin channel of the customer record (e.g., `"POS"`) | `"POS"` |
| `isSMSMarketingConsentGiven` | boolean | No | SMS marketing consent | `true` |
| `isEmailMarketingConsentGiven` | boolean | No | Email marketing consent | `true` |
| `isProfileComplete` | boolean | No | Marks the profile as complete; triggers customer onboarding | `true` |
| `isLoyaltyConsentGiven` | boolean | No | Loyalty programme participation consent | `true` |
| `gender` | string | No | Customer gender (`male` / `female`) | `"male"` |
| `countryCode` | string | No | Country code of the customer | `"US"` |
| `countryDialCode` | string | No | Country code of the customer in dial in code| `"+1"` |
| `nationality` | string | No | Customer nationality | `"US"` |
| `hobbies` | array | No | List of hobbies | `["Cycling", "Swimming"]` |
| `occupation` | string | No | Customer occupation | `"Software Engineer"` |
| `instagramId` | string | No | Customer's Instagram handle | `"randomid"` |
| `tikTokId` | string | No | Customer's TikTok handle | `"randomtiktoid"` |
| `address` | object | No | Customer address (see below) | — |
| `createdAt` | string | No | Customer creation timestamp in your system (YYYY-MM-DD HH:MM:SS) | `"2026-04-17 07:55:10"` |

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
  "apiKey": "9e2d7c1a-5b8f-43e0-a2d6-4c9b1f8e7a25",
  "preferredStoreApiKey": "sdfdsfdsfds5b8f-43e0-fbgngntgdfg7a25",
  "customerInfo": {
    "userId": null,
    "firstName": "Abhishek1",
    "lastName": "Kumar1",
    "mobile": "457790530",
    "dob": "1993-11-11",
    "anniversaryDate": "2024-02-16",
    "email": "abhishekk530@skellam.ai",
    "source": "POS",
    "isSMSMarketingConsentGiven": true,
    "isEmailMarketingConsentGiven": true,
    "isProfileComplete": true,
    "isLoyaltyConsentGiven": true,
    "gender": "male",
    "countryCode": "US",
    "countryDialCode": "+966",
    "nationality": "US",
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
    "createdAt": "2026-04-17 07:55:10"
  }
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body.customerId` | string | Qubriux internal customer ID. **Store this.** |
| `body.urlOfCustomerQR` | string | URL of the customer's loyalty QR code image |
| `body.customerKey` | string | Customer-scoped signed key for subsequent calls |
| `messageKey` | string \| null | Localization key for the message, if applicable |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": {
    "customerId": "01m1gvdgq0cp2bnx8zp1pys66k",
    "urlOfCustomerQR": "https://qubriux-public-assets-qa.s3.amazonaws.com/qr/1282/customer/01m1gvdgq0cp2bnx8zp1pys66k.png",
    "customerKey": "eyJhbGciOiJIUzUxMiJ9.eyJjdXN0b21lcklkIjoiMDFtMWd2ZGdxMGNwMmJueDh6cDFweXM2NmsiLCJjbGllbnRJZCI6ImNlZmJkMmVjLTJlNjEtNGMzZS05YTBkLTA1MTc4MWU0MjY2MSIsImNsaWVudFNlY3JldCI6ImE2ZDhjZjdmLWE5MzUtNGRhNS1iYTQ3LTRiZDI0MmEyMDJmNyIsIm1lcmNoYW50SWQiOjEyODIsInBsYXRmb3JtIjoiYWxvaGEiLCJpYXQiOjE3ODgzNDU3NjR9.IYGuSd-OxZcIhZ2naqBxzdtNrcFSpGcc7ero60KtAIPCdFn015LGGbAA6hu9yMuBVea4b9tHo4BLDZ6qc9KMFQ"
  },
  "messageKey": null
}
```
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
| `source` | string | One of three | Show offers per channel | `"APP, POS, WEB"` |
| `platform` | string | One of three | For APP Source | `"IOS, ANDROID"` |

### Request Example

```json
{
  "apiKey": "39fb4bd2-cd35-480f-a9ac-4459669cf882",
  "userId": null,
  "mobile": "11124650",
  "email": null,
  "source": "APP",
  "platform": "IOS"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body.customerId` | string | Qubriux internal customer ID |
| `body.couponDetails` | array | Available offers/coupons for the customer — see fields below |
| `messageKey` | string \| null | Localization key for the message, if applicable |

#### couponDetails Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `orderType` | array\<string\> | Order channels the offer applies to (e.g., `DINEIN`, `TAKEAWAY`, `DELIVERY`, `DRIVETHRU`, `CARHOP`) |
| `discountScope` | string | Scope the discount applies at — `CART` or `ITEM` |
| `giftCodeType` | string \| null | Type of gift code, if this is a gift-code offer |
| `giftCodeValue` | number | Value associated with the gift code |
| `termsAndCondition` | array | Terms and conditions text blocks |
| `description` | array | Offer description text blocks |
| `termsAndConditionAlias` | array | Localized/alias terms and conditions |
| `descriptionAlias` | array | Localized/alias description |
| `redemptionCount` | number | Number of times this offer has been redeemed by the customer |
| `usageLimit` | number \| null | Max redemptions allowed, or null if unlimited |
| `platform` | array\<object\> | Platforms the offer is valid on — each has `platformName` and `platformInfo` |
| `maxDiscount` | number \| null | Maximum discount cap, if any |
| `offerTags` | array | Tags associated with the offer |
| `offerType` | string | Type of offer (e.g., `COUPON`) |
| `pointsToRedeem` | number \| null | Loyalty points required to redeem, if points-based |
| `requireAllItems` | boolean | Whether all prerequisite items must be present in cart |
| `discountCodeVariants` | array | Variant codes for this discount, if applicable |
| `collections` | null | Product collections tied to the offer |
| `preRequisiteProduct` | null | Product(s) required in cart to trigger the offer |
| `entitledProduct` | null | Product(s) the discount applies to |
| `prerequisiteExcludedProducts` | array\<object\> | Products excluded from prerequisite matching — each has `productId`, `productName`, `productCategoryId`, `productCategory`, `level`, `type` |
| `prerequisiteExcludedCategories` | array | Categories excluded from prerequisite matching |
| `entitledExcludedProducts` | null | Products excluded from the entitled/discounted set |
| `qrCodeImageLink` | string | URL of the offer's QR code image |
| `offerImageLink` | string \| null | URL of the offer's display image |
| `offerAliasImageLink` | string \| null | URL of the offer's localized/alias display image |
| `startTime` | string \| null | Offer start time, if time-restricted |
| `endTime` | string \| null | Offer end time, if time-restricted |
| `limitedTimeOfferInfo` | array | Limited-time-offer scheduling details |
| `giftCode` | string \| null | Gift code value, if applicable |
| `limitedTime` | boolean | Whether this is a limited-time offer |
| `giveAway` | boolean | Whether this is a giveaway offer |
| `hiddenItemOffer` | boolean | Whether this offer hides its entitled item |
| `continuous` | boolean | Whether the offer runs continuously (no fixed window) |
| `freeItem` | boolean | Whether this offer grants a free item |
| `isGiftCode` | boolean \| null | Whether this offer is redeemed via gift code |
| `productsInfo` | array | Additional product metadata tied to the offer |
| `discountValue` | number | Discount value (percentage or amount, per `discountType`) |
| `offerBarrier` | array | Minimum spend/qualification barriers for the offer |
| `offerCode` | string | Unique offer/coupon code |
| `discountOn` | string | What the discount applies to — `ORDER` or `ITEM` |
| `discountType` | string | `PERCENTAGE` or a fixed-amount type |
| `offerName` | string | Offer display name |
| `offerNameAlias` | string | Localized/alias offer name |
| `expiryDate` | string | Offer expiry timestamp |
| `lastModifiedDate` | string | Last modified timestamp |
| `posCouponIdentifier` | string \| null | Identifier used to match this coupon in the POS system |
| `comment` | string \| null | Internal comment on the offer |
| `status` | string | Offer status (e.g., `ACTIVE`) |
| `toApplyOnMultipleProduct` | boolean | Whether the discount can apply across multiple products |
| `isBestOffer` | boolean | Whether this is flagged as the customer's best available offer |
| `discountAmount` | number | Fixed discount amount, if `discountType` is amount-based |
| `isUnlimitedUsage` | boolean | Whether the offer has no usage cap |
| `priorityRank` | number \| null | Priority rank used when multiple offers are stackable/competing |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": {
    "customerId": "abhi",
    "couponDetails": [
      {
        "orderType": ["DINEIN", "TAKEAWAY", "DELIVERY", "DRIVETHRU", "CARHOP"],
        "discountScope": "CART",
        "giftCodeType": null,
        "giftCodeValue": 0,
        "termsAndCondition": [],
        "description": [],
        "termsAndConditionAlias": [],
        "descriptionAlias": [],
        "redemptionCount": 1,
        "usageLimit": null,
        "platform": [
          { "platformName": "POS", "platformInfo": null },
          { "platformName": "KIOSK", "platformInfo": null }
        ],
        "maxDiscount": null,
        "offerTags": [],
        "offerType": "COUPON",
        "pointsToRedeem": null,
        "requireAllItems": false,
        "discountCodeVariants": [],
        "collections": null,
        "preRequisiteProduct": null,
        "entitledProduct": null,
        "prerequisiteExcludedProducts": [
          {
            "productId": "887000",
            "productName": "**POWR**",
            "productCategoryId": null,
            "productCategory": null,
            "level": null,
            "type": "item"
          },
          {
            "productId": "888000",
            "productName": "**GoldenBrown**",
            "productCategoryId": null,
            "productCategory": null,
            "level": null,
            "type": "item"
          }
        ],
        "prerequisiteExcludedCategories": [],
        "entitledExcludedProducts": null,
        "qrCodeImageLink": "https://qubriux-public-assets-qa.s3.amazonaws.com/qr/1282/offers/DSADASDW_qr.png",
        "offerImageLink": null,
        "offerAliasImageLink": null,
        "startTime": null,
        "endTime": null,
        "limitedTimeOfferInfo": [],
        "giftCode": null,
        "limitedTime": false,
        "giveAway": false,
        "hiddenItemOffer": false,
        "continuous": true,
        "freeItem": false,
        "isGiftCode": null,
        "productsInfo": [],
        "discountValue": 22,
        "offerBarrier": [],
        "offerCode": "DSADASDW",
        "discountOn": "ORDER",
        "discountType": "PERCENTAGE",
        "offerName": "dsadadwd",
        "offerNameAlias": "",
        "expiryDate": "2026-09-03 23:59:59",
        "lastModifiedDate": "2026-08-13 13:21:03",
        "posCouponIdentifier": null,
        "comment": null,
        "status": "ACTIVE",
        "toApplyOnMultipleProduct": false,
        "isBestOffer": false,
        "discountAmount": 0,
        "isUnlimitedUsage": true,
        "priorityRank": null
      },
      {
        "orderType": ["TAKEAWAY"],
        "discountScope": "ITEM",
        "giftCodeType": null,
        "giftCodeValue": 0,
        "termsAndCondition": [],
        "description": [],
        "termsAndConditionAlias": [],
        "descriptionAlias": [],
        "redemptionCount": null,
        "usageLimit": null,
        "platform": [],
        "maxDiscount": null,
        "offerTags": [],
        "offerType": "COUPON",
        "pointsToRedeem": null,
        "requireAllItems": false,
        "discountCodeVariants": [],
        "collections": null,
        "preRequisiteProduct": null,
        "entitledProduct": null,
        "prerequisiteExcludedProducts": [],
        "prerequisiteExcludedCategories": [],
        "entitledExcludedProducts": null,
        "qrCodeImageLink": null,
        "offerImageLink": null,
        "offerAliasImageLink": null,
        "startTime": null,
        "endTime": null,
        "limitedTimeOfferInfo": [],
        "giftCode": null,
        "limitedTime": false,
        "giveAway": false,
        "hiddenItemOffer": false,
        "continuous": true,
        "freeItem": false,
        "isGiftCode": null,
        "productsInfo": [],
        "discountValue": 100,
        "offerBarrier": [],
        "offerCode": "TEST TT AZHAR",
        "discountOn": "ITEM",
        "discountType": "PERCENTAGE",
        "offerName": "10 Discount on Pick Up Orders",
        "offerNameAlias": "10 Discount on Pick Up Orders",
        "expiryDate": "2026-09-18 23:59:59",
        "lastModifiedDate": "2026-08-27 18:17:35",
        "posCouponIdentifier": "Test TT Azhar_clone_clone_clone",
        "comment": null,
        "status": "ACTIVE",
        "toApplyOnMultipleProduct": false,
        "isBestOffer": false,
        "discountAmount": 0,
        "isUnlimitedUsage": true,
        "priorityRank": null
      }
    ]
  },
  "messageKey": null
}
```

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
| `apiKey` | string | Yes | Merchant-level API key | `"28fb4bd2-cd35-480f-a9ac-4459669cf782"` |
| `userId` | string | One of three | Customer ID | `"Ravina26"` |
| `mobile` | string | One of three | Customer's mobile number | `"+971501234567"` |
| `email` | string | One of three | Customer's email address | `"sarah.khan@example.com"` |
| `recordsPerPage` | number | No | Number of transactions to return per page. Defaults if omitted. | `10` |
| `pageNumber` | number | No | Page number to retrieve (1-indexed) | `1` |
| `sortingOrder` | string | No | Sort direction by transaction date — `asc` or `desc` | `"desc"` |
| `transactionType` | string | No | Filter by transaction type — `All`, `Credited`, `Debited`, or `Expired` | `"All"` |

### Request Example

```json
{
  "apiKey": "28fb4bd2-cd35-480f-a9ac-4459669cf782",
  "userId": "Ravina26",
  "mobile": "",
  "email": "",
  "recordsPerPage": 10,
  "pageNumber": 1,
  "sortingOrder": "desc",
  "transactionType": "All"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body.customerId` | string | Qubriux internal customer ID |
| `body.totalTransaction` | number | Total number of transactions across all pages |
| `body.recordsPerPage` | number | Number of records returned per page |
| `body.totalPage` | number | Total number of pages available |
| `body.transactions` | array | List of transaction records — see fields below |
| `body.secondaryLoyaltyTransactions` | array | Transactions under a secondary loyalty currency/program, if configured |
| `messageKey` | string \| null | Localization key for the message, if applicable |

#### transactions Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `transactionId` | string \| null | Unique transaction identifier. Null for system-generated events like expirations. |
| `points` | number | Points involved in the transaction |
| `transactionType` | string | `Credited`, `Debited`, or `Expired` |
| `applicableDateTime` | string | Timestamp the transaction applies to (YYYY-MM-DD HH:MM:SS) |
| `expiryDate` | string \| null | Expiry date for the points credited in this transaction, if applicable |
| `rule` | string \| null | Description of the rule that triggered this transaction |
| `events` | string \| null | Associated event data, if any |
| `balance` | number | Points balance after this transaction |
| `offerCount` | number \| null | Number of offers tied to this transaction, if applicable |
| `userName` | string \| null | Name of the user/agent associated with the transaction, if applicable |
| `userEmail` | string \| null | Email of the user/agent associated with the transaction, if applicable |
| `storeName` | string \| null | Store where the transaction occurred, if applicable |
| `orderId` | string \| null | Associated order ID, if applicable |
| `earningSource` | string | Source category of the transaction (e.g., `Redeemed`, `Offer`, `Expired`) |
| `earningSourceDesc` | string | Description of the earning source |
| `earningSourceAliasDesc` | string \| null | Localized/alias description of the earning source |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": {
    "customerId": "4cac42348c2849fbbfa8ac0fa99c12cd",
    "totalTransaction": 19,
    "recordsPerPage": 10,
    "totalPage": 2,
    "transactions": [
      {
        "transactionId": null,
        "points": 60.0,
        "transactionType": "Expired",
        "applicableDateTime": "2025-09-27 03:00:00",
        "expiryDate": null,
        "rule": null,
        "events": null,
        "balance": 0.0,
        "offerCount": null,
        "userName": null,
        "userEmail": null,
        "storeName": null,
        "orderId": null,
        "earningSource": "Expired",
        "earningSourceDesc": "",
        "earningSourceAliasDesc": null
      },
      {
        "transactionId": "053dd7a9-5d03-4a6b-b141-6ec5a8d7fcaf",
        "points": 20.0,
        "transactionType": "Debited",
        "applicableDateTime": "2025-04-02 11:41:44",
        "expiryDate": null,
        "rule": "Thomcoins redeemed for an order",
        "events": null,
        "balance": 0.0,
        "offerCount": null,
        "userName": null,
        "userEmail": null,
        "storeName": "lab-new menu",
        "orderId": "34444",
        "earningSource": "Redeemed",
        "earningSourceDesc": "34444",
        "earningSourceAliasDesc": "34444"
      },
      {
        "transactionId": "0583380a-31fa-4095-8f0b-ba2cb8b64f57",
        "points": 20.0,
        "transactionType": "Credited",
        "applicableDateTime": "2025-03-27 15:39:49",
        "expiryDate": "2025-09-27 15:39:49",
        "rule": "Thomcoins earned via FIXED LOYALTY POINTS GAIN_8",
        "events": null,
        "balance": 0.0,
        "offerCount": null,
        "userName": null,
        "userEmail": null,
        "storeName": null,
        "orderId": null,
        "earningSource": "Offer",
        "earningSourceDesc": "FIXED LOYALTY POINTS GAIN_8",
        "earningSourceAliasDesc": "FIXED LOYALTY POINTS GAIN_8"
      }
    ],
    "secondaryLoyaltyTransactions": []
  },
  "messageKey": null
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found |
| `500` | Unexpected server error |

---
## POST /getLoyaltyDetails

Returns comprehensive loyalty programme details for a customer, including points summary, tier data, and conversion rates. Use this for a deep programme details screen or onboarding explainer.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"28fb4bd2-cd35-480f-a9ac-4459669cf782"` |
| `userId` | string | One of three | Your system's customer ID | `"APP-CUST-001234"` |
| `mobile` | string | One of three | Customer's mobile number | `"11124650"` |
| `email` | string | One of three | Customer's email address | `"user@example.com"` |

### Request Example

```json
{
  "apiKey": "28fb4bd2-cd35-480f-a9ac-4459669cf782",
  "userId": null,
  "mobile": "11124650",
  "email": null
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body.availablePoints` | number | Customer's current redeemable points balance |
| `body.totalPointsEarned` | number | Lifetime points earned |
| `body.totalPointsBurned` | number | Lifetime points burned (redeemed + expired, combined) |
| `body.totalPointsRedeemed` | number | Lifetime points redeemed against orders/rewards |
| `body.totalPointsExpired` | number | Lifetime points that expired unused |
| `body.accumulatedPoints` | number | Points accumulated toward tier progression |
| `body.pointsAccumulatedAfterTierChange` | number | Points accumulated since the customer's last tier change |
| `body.pointsConversionRate` | object | Points-to-currency conversion rate — see fields below |
| `body.pointsToBeExpired` | number | Points due to expire soon |
| `body.savingsFromPoints` | number | Total monetary savings the customer has realized from redeeming points |
| `body.savingsFromOffers` | number | Total monetary savings the customer has realized from offers |
| `body.totalWalletBalance` | number | Customer's current wallet cash balance |
| `body.currentTierData` | object | Customer's current tier details — see fields below |
| `body.customerDetails` | object \| null | Additional customer profile data, if returned |
| `body.loyaltySignUpDate` | string | Timestamp the customer joined the loyalty programme (YYYY-MM-DD HH:MM:SS) |
| `body.secondaryAvailablePoints` | number | Available points under a secondary loyalty currency/programme, if configured |
| `body.secondaryTotalPointsEarned` | number | Lifetime points earned under the secondary loyalty programme |
| `body.secondaryTotalPointsRedeemed` | number | Lifetime points redeemed under the secondary loyalty programme |
| `body.secondaryTotalPointsExpired` | number | Lifetime points expired under the secondary loyalty programme |
| `messageKey` | string \| null | Localization key for the message, if applicable |

#### pointsConversionRate Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `points` | number | Number of points this rate applies to |
| `amount` | number | Currency amount equivalent to `points` |
| `currency` | string | Currency code (e.g., `"SAR"`) |
| `country` | string | Country code the rate applies to (e.g., `"SA"`) |
| `brandId` | string \| null | Brand-specific override, if applicable |

#### currentTierData Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `tierId` | number | Internal tier ID |
| `tierName` | string | Tier display name |
| `tierEntryPoints` | number | Points threshold required to enter this tier |
| `description` | string | Tier description |
| `level` | number | Numeric tier level/rank |
| `conversion` | object \| null | Tier-specific conversion override, if any |
| `colorCode` | string | Hex color code associated with the tier |
| `tierNameAlias` | string | Localized/alias tier name |
| `descriptionAlias` | string | Localized/alias tier description |
| `isHighestTier` | boolean | Whether this is the top tier in the programme |
| `pointsRequiredToReachThisTier` | number | Points needed to reach this tier from the previous one |
| `milestoneInCurrentTier` | string \| null | Milestone marker within the current tier, if any |
| `totalPointsEarned` | number \| null | Points earned while in this tier (null when reported only at the top level) |
| `totalPointsRedeemed` | number \| null | Points redeemed while in this tier |
| `totalPointsExpired` | number \| null | Points expired while in this tier |
| `totalPointsBurned` | number \| null | Points burned while in this tier |
| `accumulatedPoints` | number \| null | Points accumulated while in this tier |
| `pointsAccumulatedAfterTierChange` | number \| null | Points accumulated since entering this tier |
| `availablePoints` | number \| null | Available points scoped to this tier |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": {
    "availablePoints": 300.0,
    "totalPointsEarned": 7960.0,
    "totalPointsBurned": 5317.0,
    "totalPointsRedeemed": 70.0,
    "totalPointsExpired": 2273.0,
    "accumulatedPoints": 2643.0,
    "pointsAccumulatedAfterTierChange": 490.0,
    "pointsConversionRate": {
      "points": 10.0,
      "amount": 0.7,
      "currency": "SAR",
      "country": "SA",
      "brandId": null
    },
    "pointsToBeExpired": 0.0,
    "savingsFromPoints": 6.25,
    "savingsFromOffers": 355.0,
    "totalWalletBalance": 866.00,
    "currentTierData": {
      "tierId": 60,
      "tierName": "Pro",
      "tierEntryPoints": 1500.0,
      "description": "Gold Description",
      "level": 2,
      "conversion": null,
      "colorCode": "#aa142c",
      "tierNameAlias": "ذهب",
      "descriptionAlias": "ذهب",
      "isHighestTier": false,
      "pointsRequiredToReachThisTier": 0.0,
      "milestoneInCurrentTier": null,
      "totalPointsEarned": null,
      "totalPointsRedeemed": null,
      "totalPointsExpired": null,
      "totalPointsBurned": null,
      "accumulatedPoints": null,
      "pointsAccumulatedAfterTierChange": null,
      "availablePoints": null
    },
    "customerDetails": null,
    "loyaltySignUpDate": "2026-01-02 07:23:17",
    "secondaryAvailablePoints": 0.0,
    "secondaryTotalPointsEarned": 0.0,
    "secondaryTotalPointsRedeemed": 0.0,
    "secondaryTotalPointsExpired": 0.0
  },
  "messageKey": null
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found |
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
| `apiKey` | string | Yes | Merchant-level API key | `"9e2d7c1a-5b8f-43e0-a2d6-4c9b1f8e7a25"` |
| `userId` | string | One of three | Your system's unique customer ID | `null` |
| `mobile` | string | One of three | Customer's mobile number | `"457790235"` |
| `email` | string | One of three | Customer's email address | `null` |
| `order` | object | Yes | Current basket (see [Order Fields](#order-fields)) | — |

### Order Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `cartId` | string | Yes | Unique cart identifier, used to identify the cart's product info | `"20088"` |
| `orderId` | string | Yes | Unique order identifier | `"20088"` |
| `invoiceNumber` | string/number | No | Invoice reference, if any | `904` |
| `orderType` | string | Yes | Order channel: `DELIVERY`, `TAKEAWAY`, `DINEIN`, `DRIVETHRU` | `"DELIVERY"` |
| `screen` | string | Yes | Screen context where the call originates | `"CART"` |
| `grossAmount` | number | Yes | Subtotal + delivery (before loyalty/wallet discounts) | `67` |
| `netAmount` | number | Yes | Subtotal + delivery minus offer/loyalty discount and wallet amount applied | `67` |
| `subTotal` | number | Yes | Item total, includes tax | `70` |
| `tax` | number | Yes | Tax amount | `1` |
| `source` | string | Yes | Integration source: `APP`, `POS`, `WEB`, `KIOSK` | `"POS"` |
| `platformName` | string | No | Platform: `ANDROID`, `IOS` | `"IOS"` |
| `platformVersion` | string | No | Platform version string | `"1.2.3.2"` |
| `isLoyaltyToggleOn` | boolean | Yes | Whether the customer chose to use loyalty points | `false` |
| `loyaltyPoints` | number | Conditional | Points to apply — only send when `isLoyaltyToggleOn` is `true` | `5` |
| `isWalletToggleOn` | boolean | Yes | Whether the customer chose to use their wallet balance | `false` |
| `walletAmount` | number | Conditional | Wallet amount to apply — only send when `isWalletToggleOn` is `true` | `10` |
| `discount` | object | Yes | Coupon/offer applied to the order (see below) | — |
| `items` | array | Yes | Line items (see below) | — |
| `deliveryInfo` | object | No | Delivery charge details (see below) | — |

#### discount Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `discountId` | string \| null | Offer/coupon code, if the customer has one applied | `"DESSERT"` |
| `discountAmt` | number \| null | Discount amount — populated in `redeemReward` only | `null` |

#### items Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sequenceId` | integer | Line item sequence number | `1` |
| `productId` | string | SKU or product identifier | `"50002"` |
| `productName` | string | Display name | `"Brownie"` |
| `rate` | number | Unit price | `1.0` |
| `quantity` | integer | Units ordered | `2` |
| `level` | integer | Size level: `0` = Regular, `1` = Medium, `2` = High | `0` |
| `type` | string | Line type: `item` or `combo` | `"item"` |
| `subtotal` | number | Product amount | `20.0` |
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
  "mobile": "457790235",
  "email": null,
  "apiKey": "9e2d7c1a-5b8f-43e0-a2d6-4c9b1f8e7a25",
  "order": {
    "cartId": "20088",
    "orderId": "20088",
    "invoiceNumber": 904,
    "orderType": "DELIVERY",
    "screen": "CART",
    "grossAmount": 67,
    "netAmount": 67,
    "subTotal": 70,
    "tax": 1,
    "source": "POS",
    "platformName": "IOS",
    "loyaltyPoints": 5,
    "walletAmount": 10,
    "platformVersion": "1.2.3.2",
    "isLoyaltyToggleOn": false,
    "isWalletToggleOn": false,
    "discount": {
      "discountId": "DESSERT",
      "discountAmt": null
    },
    "items": [
      {
        "sequenceId": 1,
        "productName": "Brownie",
        "productId": "50002",
        "rate": 1.0,
        "quantity": 2,
        "level": 0,
        "type": "item",
        "subtotal": 20.0,
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
      },
      {
        "sequenceId": 1,
        "productName": "7 up Medium",
        "productId": "50001",
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
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body.userId` | string | Customer identifier |
| `body.discountDetails` | array | Offers/coupons evaluated against the cart — see fields below |
| `body.customRedemptionTransactionDetails` | object \| null | Details of a custom redemption transaction, if applicable |
| `body.discountOnPoints` | number | Discount amount attributable to points redemption |
| `body.pointsToRedeem` | number | Points that would be consumed |
| `body.totalDiscount` | number | Total projected discount across offers, points, and wallet. Pass this value into `discount.discountAmt` on the `redeemReward` call and use it to update the order's net amount. |
| `body.walletInfo` | object \| null | Wallet redemption details, if wallet was applied |
| `body.giftCodeResponse` | object \| null | Gift code redemption details, if a gift code was applied |
| `body.pointsCustomerCanEarn` | number | Points the customer would earn if this order is completed as-is |
| `messageKey` | string \| null | Localization key for the message, if applicable |

#### discountDetails Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `itemId` | string \| null | Item the discount applies to, if item-scoped |
| `itemName` | string \| null | Name of the item the discount applies to, if item-scoped |
| `discountCode` | string | Offer/coupon code |
| `discountAmount` | number | Projected discount amount for this offer |
| `discountType` | string | `PERCENTAGE` or a fixed-amount type |
| `orderType` | array\<string\> | Order channels this offer applies to |
| `discountScope` | string | Scope the discount applies at — `CART` or `ITEM` |
| `cashbackAmount` | number \| null | Cashback amount, if this offer grants cashback |
| `pointsToRedeem` | number \| null | Points required for this specific offer, if points-based |
| `lineItemDiscountMap` | object | Per-line-item discount breakdown, keyed by line item |
| `posCouponIdentifier` | string \| null | Identifier used to match this coupon in the POS system |
| `giveAway` | boolean | Whether this is a giveaway offer |
| `hiddenItemOffer` | boolean | Whether this offer hides its entitled item |
| `freeItem` | boolean | Whether this offer grants a free item |
| `loyaltyPointsGain` | number | Points the customer gains from this offer specifically |
| `productInfo` | object \| null | Product metadata tied to the offer, if applicable |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": {
    "userId": "1316x",
    "discountDetails": [
      {
        "itemId": null,
        "itemName": null,
        "discountCode": "CART20",
        "discountAmount": 2.6,
        "discountType": "PERCENTAGE",
        "orderType": ["TAKEAWAY", "DELIVERY", "CARHOP"],
        "discountScope": "CART",
        "cashbackAmount": null,
        "pointsToRedeem": null,
        "lineItemDiscountMap": {},
        "posCouponIdentifier": null,
        "giveAway": false,
        "hiddenItemOffer": false,
        "freeItem": false,
        "loyaltyPointsGain": 0.0,
        "productInfo": null
      }
    ],
    "customRedemptionTransactionDetails": null,
    "discountOnPoints": 0.0,
    "pointsToRedeem": 0.0,
    "totalDiscount": 2.6,
    "walletInfo": null,
    "giftCodeResponse": null,
    "pointsCustomerCanEarn": 294.8
  },
  "messageKey": null
}
```

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
This endpoint makes immediate changes to the customer's loyalty balance. Always call `/cartUpdate` first to preview the impact, then call this endpoint only when the customer explicitly confirms and the POS is ready to settle. If the transaction is later cancelled, use `/voidRedemption` to reverse the deduction — do not attempt to manually re-credit points or wallet balance.
:::

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

Same schema as `/cartUpdate`. Include the final confirmed basket in `order`.

**Before calling this endpoint:**

1. Set `discount.discountAmt` to the value returned in `/cartUpdate`'s `body.totalDiscount`.
2. Subtract `discount.discountAmt` from `netAmount` before sending — `netAmount` in the request must already reflect the discount applied (i.e. `netAmount = grossAmount - discount.discountAmt`).

### Request Example

Using the `/cartUpdate` response from earlier (`body.totalDiscount = 2.6`), the `/redeemReward` request would be:

```json
{
  "userId": null,
  "mobile": "457790235",
  "email": null,
  "apiKey": "9e2d7c1a-5b8f-43e0-a2d6-4c9b1f8e7a25",
  "order": {
    "cartId": "20088",
    "orderId": "20088",
    "invoiceNumber": 904,
    "orderType": "DELIVERY",
    "screen": "CART",
    "grossAmount": 67,
    "netAmount": 64.4,
    "subTotal": 70,
    "tax": 1,
    "source": "POS",
    "platformName": "IOS",
    "loyaltyPoints": 5,
    "walletAmount": 10,
    "platformVersion": "1.2.3.2",
    "isLoyaltyToggleOn": false,
    "isWalletToggleOn": false,
    "discount": {
      "discountId": "DESSERT",
      "discountAmt": 2.6
    },
    "items": [
      {
        "sequenceId": 1,
        "productName": "Brownie",
        "productId": "50002",
        "rate": 1.0,
        "quantity": 2,
        "level": 0,
        "type": "item",
        "subtotal": 20.0,
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
      },
      {
        "sequenceId": 1,
        "productName": "7 up Medium",
        "productId": "50001",
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

**What changed from the `/cartUpdate` request:**

| Field | `/cartUpdate` value | `/redeemReward` value | Why |
|-------|---------------------|------------------------|-----|
| `discount.discountAmt` | `null` | `2.6` | Copied from `/cartUpdate`'s `body.totalDiscount` |
| `netAmount` | `67` | `64.4` | `grossAmount (67) - discountAmt (2.6)` |

All other fields (`items`, `grossAmount`, `subTotal`, `tax`, etc.) remain as confirmed in the final cart.

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body.couponRedeemed` | string \| null | Offer/coupon code that was redeemed, if any |
| `body.loyaltyDeductionSuccess` | boolean | Whether loyalty points were successfully deducted |
| `body.loyaltyPointsDeducted` | number | Loyalty points actually consumed |
| `body.walletDeductionSuccess` | boolean | Whether wallet balance was successfully deducted |
| `body.walletInfo` | object \| null | Wallet redemption details, if wallet was applied |
| `body.message` | string \| null | Additional status or error detail |
| `body.isCouponRedeemed` | boolean | Whether the coupon/offer was successfully redeemed |
| `messageKey` | string \| null | Localization key for the message, if applicable |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": {
    "couponRedeemed": "CART20",
    "loyaltyDeductionSuccess": false,
    "loyaltyPointsDeducted": 0.0,
    "walletDeductionSuccess": false,
    "walletInfo": null,
    "message": null,
    "isCouponRedeemed": true
  },
  "messageKey": null
}
```

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

Same schema as `/redeemReward` — pass the full order object for the transaction being voided. Supply the same `cartId`, `orderId`, and amounts as the original redemption call.

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

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body` | string | Confirmation string indicating the void was successful |
| `messageKey` | string \| null | Localization key for the message, if applicable |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": "SUCCESS",
  "messageKey": null
}
```

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

Same schema as `/redeemReward`. Pass the final completed order — same `discount.discountAmt` and `netAmount` values used when settling the transaction.

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
    "grossAmount": 55,
    "netAmount": 55,
    "subTotal": 45,
    "tax": 1,
    "source": "APP",
    "platformName": "ANDROID",
    "platformVersion": "13",
    "isLoyaltyToggleOn": false,
    "loyaltyPoints": 0,
    "isWalletToggleOn": false,
    "walletAmount": 0,
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
        "level": 0,
        "type": "item",
        "subtotal": 45.0,
        "categoryName": "Drink",
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

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Response status indicator (e.g., `"SUCCESS"`) |
| `body` | string | Confirmation string indicating cart closure was registered |
| `messageKey` | string \| null | Localization key for the message, if applicable |

### Response Example

```json
{
  "message": "SUCCESS",
  "body": "SUCCESS",
  "messageKey": null
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or order data malformed |
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
