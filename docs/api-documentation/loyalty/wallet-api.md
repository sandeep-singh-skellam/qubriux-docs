---
id: wallet-api
title: Wallet API
sidebar_label: Wallet API
sidebar_position: 4
---

## Overview

The Qubriux Wallet API enables external systems to manage customers' digital wallet balances — crediting funds, debiting purchases, retrieving current balances, and browsing transaction history. All endpoints sit under the `ezloyal-web/mobile-wallet/v2` path and follow the same authentication model as the rest of the Loyalty & Rewards API.

## Base URL

```
https://app.qubriux.com/ezloyal-web
```

## Authentication

Every request requires a **merchant-level API Key** passed as the `apiKey` field inside the request body.

Most endpoints additionally accept a **JWT Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Obtain a token from `POST /auth/getAccessToken`. The JWT is validated against the merchant context — if the merchant derived from the API key does not match the JWT claims, the request is rejected with `401`.

:::note
Wallet endpoints validate JWT claims using `OpenApiServiceCaribou.isClaimsValid()`, which is distinct from the POS-level check used by loyalty endpoints. Ensure the token is issued against the correct merchant context.
:::

## Response Envelope

All responses use a standard wrapper:

```json
{
  "status": "success",
  "data": { ... }
}
```

On error, `status` is `"failure"` and `data` contains a human-readable message.

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/mobile-wallet/v2/get-wallet-balance` | Get a customer's current wallet balance |
| `POST` | `/mobile-wallet/v2/add-to-wallet` | Credit funds to a customer's wallet |
| `POST` | `/mobile-wallet/v2/deduct-balance-ledger` | Debit funds from a customer's wallet |
| `POST` | `/mobile-wallet/v2/get-wallet-history` | Get paginated wallet transaction history |
| `POST` | `/mobile-wallet/v2/get-topic-ledger-map` | List wallet topics and their associated ledgers |

---

## POST /mobile-wallet/v2/get-wallet-balance

Returns the current spendable balance in a customer's digital wallet.

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
| `data.availableBalance` | number | Current spendable wallet balance |
| `data.currency` | string | ISO 4217 currency code |
| `data.walletId` | string | Wallet identifier |

### Response Example

```json
{
  "status": "success",
  "data": {
    "walletId": "WALLET-00123456",
    "availableBalance": 142.50,
    "currency": "AED"
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Unexpected server error |

---

## POST /mobile-wallet/v2/add-to-wallet

Credits funds to a customer's digital wallet. Use for promotional top-ups, welcome credits, campaign rewards, or refund processing.

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
| `amount` | number | Yes | Amount to credit | `50.00` |
| `transactionRef` | string | No | Your reference for this credit (for reconciliation) | `"PROMO-CREDIT-001"` |
| `ledgerId` | string | No | Target ledger for the credit | `"GENERAL"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "amount": 50.00,
  "transactionRef": "PROMO-CREDIT-001",
  "ledgerId": "GENERAL"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.updatedBalance` | number | New wallet balance after credit |
| `data.transactionId` | string | Qubriux transaction identifier |

### Response Example

```json
{
  "status": "success",
  "data": {
    "transactionId": "TXN-00789012",
    "updatedBalance": 192.50
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Wallet not provisioned for this customer, or credit rejected |
| `500` | Unexpected server error |

:::tip
If the customer's wallet has not been provisioned, call `POST /createCustomer` with `isWalletRequired: true` before attempting any wallet operations.
:::

---

## POST /mobile-wallet/v2/deduct-balance-ledger

Debits funds from a customer's digital wallet. Use for purchases paid by wallet cash, fee deductions, or admin corrections.

:::warning
A `401` on this endpoint can indicate either an **authentication failure** or a **failed deduction** (e.g. insufficient balance — `WalletMoneyNotDeductedException`). Always inspect the `data` message in the response body to distinguish the two cases before retrying.
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
| `amount` | number | Yes | Amount to debit | `25.00` |
| `transactionRef` | string | No | Your reference for this debit (e.g. order ID) | `"ORD-20240401-0012"` |
| `ledgerId` | string | No | Source ledger to debit from | `"GENERAL"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "amount": 25.00,
  "transactionRef": "ORD-20240401-0012"
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.updatedBalance` | number | Remaining wallet balance after deduction |
| `data.transactionId` | string | Qubriux transaction identifier |

### Response Example

```json
{
  "status": "success",
  "data": {
    "transactionId": "TXN-00789013",
    "updatedBalance": 117.50
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key, JWT mismatch, or insufficient balance |
| `500` | Unexpected server error |

---

## POST /mobile-wallet/v2/get-wallet-history

Returns paginated transaction history for a customer's wallet — credits, debits, and their references — ordered by most recent first.

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
| `page` | integer | No | Page number, 0-indexed. Default: `0` | `0` |
| `size` | integer | No | Number of records per page. Default: `20` | `20` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "userId": "APP-CUST-001234",
  "page": 0,
  "size": 20
}
```

### Response - 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `data.transactions` | array | Paginated list of wallet transactions |
| `data.transactions[].transactionId` | string | Unique transaction identifier |
| `data.transactions[].date` | string | ISO 8601 transaction timestamp |
| `data.transactions[].amount` | number | Positive for credits, negative for debits |
| `data.transactions[].balance` | number | Running balance after this transaction |
| `data.transactions[].reference` | string | External reference (e.g. order ID) |
| `data.transactions[].description` | string | Human-readable reason |
| `data.totalCount` | integer | Total number of transactions across all pages |

### Response Example

```json
{
  "status": "success",
  "data": {
    "totalCount": 47,
    "transactions": [
      {
        "transactionId": "TXN-00789013",
        "date": "2024-04-01T12:35:00Z",
        "amount": -25.00,
        "balance": 117.50,
        "reference": "ORD-20240401-0012",
        "description": "Purchase deduction"
      },
      {
        "transactionId": "TXN-00789012",
        "date": "2024-03-28T09:10:00Z",
        "amount": 50.00,
        "balance": 142.50,
        "reference": "PROMO-CREDIT-001",
        "description": "Promotional credit"
      }
    ]
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Unexpected server error |

---

## POST /mobile-wallet/v2/get-topic-ledger-map

Returns the list of wallet topics (categories) and their associated ledgers configured for the merchant. Use this to understand the available ledger structure before making targeted credits or debits against a specific ledger.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `status` | string | No | Filter by ledger status (`"ACTIVE"`, `"INACTIVE"`) | `"ACTIVE"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "status": "ACTIVE"
}
```

### Response - 200 OK

Returns an array of `LedgerTopicResponse` objects:

| Field | Type | Description |
|-------|------|-------------|
| `topicId` | string | Topic identifier |
| `topicName` | string | Human-readable topic name |
| `ledgers` | array | Associated ledgers — each with `ledgerId`, `ledgerName`, and `status` |

### Response Example

```json
{
  "status": "success",
  "data": [
    {
      "topicId": "TOPIC-001",
      "topicName": "General Wallet",
      "ledgers": [
        {
          "ledgerId": "GENERAL",
          "ledgerName": "Main Balance",
          "status": "ACTIVE"
        }
      ]
    }
  ]
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Unexpected server error |

---

## Common Error Codes

| HTTP Status | Cause |
|-------------|-------|
| `401` | Invalid API key, expired JWT, merchant/JWT context mismatch, or insufficient wallet balance (deduct endpoint only) |
| `422` | Wallet not provisioned, or credit operation rejected |
| `500` | Unhandled server error |
