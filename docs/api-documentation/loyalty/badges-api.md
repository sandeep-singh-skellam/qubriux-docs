---
id: badges-api
title: Badges API
sidebar_label: Badges API
sidebar_position: 3
---

## Overview

The Qubriux Badges API allows external apps and POS systems to retrieve badge catalogues, inspect a customer's earned and in-progress badges, and fetch detailed badge configurations. Badges are achievement-style rewards that customers unlock by meeting specific behavioural criteria — visit frequency, spend thresholds, [challenge](./gamification-api.md) completions, and more. All endpoints sit under the `/ezloyal-web` path.

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

Every request requires a **merchant-level API Key** passed as the `apiKey` field inside the request body.

Most endpoints additionally accept a **JWT Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Obtain a token from `POST /auth/getAccessToken`. The JWT is validated against the merchant context derived from the `apiKey` — a mismatch returns `401`.

## Response Envelope

All responses use a standard wrapper:

```json
{
  "status": "success",
  "data": { ... }
}
```

On error, `status` is `"failure"` and `data` contains a human-readable error message.

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/getAllBadges` | List all active badges for the merchant |
| `POST` | `/getAllCustomerBadges` | Get earned and in-progress badges for a customer |
| `POST` | `/getBadgeDetails/\{badgeId\}` | Get full configuration for a specific badge |

---

## POST /getAllBadges

Returns all active badges configured for the merchant — including each badge's name, earn criteria, and customer adoption count. Use this to render a programme-wide badges catalogue where customers can see what they can unlock.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456"
}
```

### Response - 200 OK

Returns an array of badge objects:

| Field | Type | Description |
|-------|------|-------------|
| `badgeId` | long | Unique badge identifier |
| `badgeName` | string | Display name |
| `description` | string | What this badge represents |
| `imageUrl` | string | Badge image asset URL |
| `customerCount` | number | Total customers who have earned this badge |

### Response Example

```json
{
  "status": "success",
  "data": [
    {
      "badgeId": 42,
      "badgeName": "Coffee Loyalist",
      "description": "Awarded for 10 consecutive visits",
      "imageUrl": "https://cdn.qubriux.com/badges/coffee-loyalist.png",
      "customerCount": 1284
    },
    {
      "badgeId": 43,
      "badgeName": "Big Spender",
      "description": "Awarded for spending over AED 500 in a single month",
      "imageUrl": "https://cdn.qubriux.com/badges/big-spender.png",
      "customerCount": 392
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

## POST /getAllCustomerBadges

Returns a specific customer's badge status — earned badges and badges currently in progress — grouped by category. Use this to render a personalised badge wall in the customer's account screen.

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

Returns a map with badge group keys. Each group contains an array of badge objects with customer-specific progress metadata:

| Field | Type | Description |
|-------|------|-------------|
| `earned` | array | Badges the customer has fully unlocked |
| `inProgress` | array | Badges the customer is actively working towards |
| `earned[].badgeId` | long | Badge identifier |
| `earned[].badgeName` | string | Display name |
| `earned[].imageUrl` | string | Asset URL |
| `earned[].earnedAt` | string | ISO 8601 timestamp when the badge was unlocked |
| `inProgress[].badgeId` | long | Badge identifier |
| `inProgress[].badgeName` | string | Display name |
| `inProgress[].currentProgress` | number | Customer's current progress value |
| `inProgress[].targetProgress` | number | Value required to unlock |
| `inProgress[].progressPercentage` | number | `currentProgress / targetProgress × 100` |

### Response Example

```json
{
  "status": "success",
  "data": {
    "earned": [
      {
        "badgeId": 42,
        "badgeName": "Coffee Loyalist",
        "imageUrl": "https://cdn.qubriux.com/badges/coffee-loyalist.png",
        "earnedAt": "2024-03-15T08:22:00Z"
      }
    ],
    "inProgress": [
      {
        "badgeId": 43,
        "badgeName": "Big Spender",
        "imageUrl": "https://cdn.qubriux.com/badges/big-spender.png",
        "currentProgress": 320.00,
        "targetProgress": 500.00,
        "progressPercentage": 64.0
      }
    ]
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found |
| `500` | Unexpected server error |

---

## POST /getBadgeDetails/\{badgeId\}

Returns the full configuration and earn rules for a specific badge. Use this to populate a badge detail screen when a customer taps on a badge to learn more about how to earn it.

### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `badgeId` | long | Yes | Badge identifier from `/getAllBadges` | `42` |

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |

### Request Example

```
POST /getBadgeDetails/42
```

```json
{
  "apiKey": "pk_live_abc123def456"
}
```

### Response - 200 OK

Returns a `BadgeEntity` with full badge configuration:

| Field | Type | Description |
|-------|------|-------------|
| `badgeId` | long | Unique badge identifier |
| `badgeName` | string | Display name |
| `description` | string | What the badge represents |
| `imageUrl` | string | Badge image asset URL |
| `earnCriteria` | object | Rules that must be met to unlock the badge |
| `earnCriteria.type` | string | Criteria type (e.g. `"VISIT_COUNT"`, `"SPEND_THRESHOLD"`, `"CHALLENGE_COMPLETION"`) |
| `earnCriteria.targetValue` | number | Threshold required |
| `earnCriteria.period` | string | Evaluation window (e.g. `"MONTHLY"`, `"ALL_TIME"`) |
| `linkedReward` | object \| null | Reward automatically granted on badge earn, if configured |
| `startDate` | string | ISO 8601 date from which the badge is active |
| `endDate` | string \| null | ISO 8601 expiry date, or null if evergreen |

### Response Example

```json
{
  "status": "success",
  "data": {
    "badgeId": 42,
    "badgeName": "Coffee Loyalist",
    "description": "Awarded for 10 consecutive visits",
    "imageUrl": "https://cdn.qubriux.com/badges/coffee-loyalist.png",
    "earnCriteria": {
      "type": "VISIT_COUNT",
      "targetValue": 10,
      "period": "ALL_TIME"
    },
    "linkedReward": {
      "rewardType": "POINTS",
      "rewardValue": 200
    },
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `500` | Badge not found or unexpected server error |

---

## Common Error Codes

| HTTP Status | Cause |
|-------------|-------|
| `401` | Invalid API key, expired JWT, or merchant/JWT mismatch |
| `422` | Customer not found |
| `500` | Unhandled server error |
