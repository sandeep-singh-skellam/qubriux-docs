---
id: gamification-api
title: Gamification API
sidebar_label: Gamification API
sidebar_position: 2
---

## Overview

The Qubriux Gamification API exposes challenge-based engagement features to external apps and POS systems. Challenges are time-bound goals — visit streaks, spend milestones, category-specific purchases — that customers opt into and track progress against. Completing a challenge rewards the customer with points, offers, or [badges](./badges-api.md). All endpoints sit under the `/ezloyal-web` path.

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

On error, `status` is `"failure"` and `data` contains a human-readable error message. An optional `errorKey` integer maps to a localised error string.

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/games/app/getChallenges` | List all active challenges (no customer context required) |
| `POST` | `/games/app/getCustomerChallenges` | List challenges with the customer's individual progress |
| `POST` | `/games/app/challenge/activate/\{challengeId\}` | Opt a customer into a specific challenge |
| `POST` | `/games/app/challenge/details/\{challengeId\}` | Get full configuration and customer progress for a challenge |

:::note
Each endpoint above also has a `/v2` variant (`/games/app/getCustomerChallenges/v2`, `/games/app/challenge/activate/v2/\{challengeId\}`, `/games/app/challenge/details/v2/\{challengeId\}`). Both versions call the same underlying service and return identical responses. Use the non-versioned paths for new integrations.
:::

---

## POST /games/app/getChallenges

Returns all currently active challenges for the merchant. Does not require a customer identifier — suitable for an unauthenticated browse view where customers can see what challenges are running before logging in.

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

Returns an array of active `ChallengeAppResponse` objects:

| Field | Type | Description |
|-------|------|-------------|
| `challengeId` | integer | Unique challenge identifier |
| `challengeName` | string | Display name |
| `description` | string | What the customer needs to do |
| `rewardDescription` | string | What they earn on completion |
| `challengeType` | string | Category (e.g. `"STREAK"`, `"MILESTONE"`, `"SPEND"`) |
| `targetValue` | number | The goal the customer must reach |
| `startDate` | string | ISO 8601 start date |
| `endDate` | string | ISO 8601 end date |
| `imageUrl` | string \| null | Challenge banner image |

### Response Example

```json
{
  "status": "success",
  "data": [
    {
      "challengeId": 15,
      "challengeName": "Visit 5 Times This Month",
      "description": "Visit any branch 5 times before the end of the month",
      "rewardDescription": "Earn 300 bonus points",
      "challengeType": "MILESTONE",
      "targetValue": 5,
      "startDate": "2024-04-01T00:00:00Z",
      "endDate": "2024-04-30T23:59:59Z",
      "imageUrl": "https://cdn.qubriux.com/challenges/visit-5.png"
    }
  ]
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Data validation failure |
| `500` | Unexpected server error |

---

## POST /games/app/getCustomerChallenges

Returns all active challenges with the authenticated customer's individual progress overlaid on each. Call this for logged-in users — it surfaces which challenges are activated, how far along the customer is, and which are completed.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customerId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |

### Request Example

```json
{
  "apiKey": "pk_live_abc123def456",
  "customerId": "APP-CUST-001234"
}
```

### Response - 200 OK

Returns an array of `CustomerChallengeResponse` objects — the base challenge fields extended with per-customer progress:

| Field | Type | Description |
|-------|------|-------------|
| `challengeId` | integer | Challenge identifier |
| `challengeName` | string | Display name |
| `challengeType` | string | Challenge category |
| `targetValue` | number | Goal to reach |
| `isActivated` | boolean | Whether the customer has opted in |
| `currentProgress` | number | Customer's current progress value |
| `progressPercentage` | number | `currentProgress / targetValue × 100` |
| `isCompleted` | boolean | Whether the challenge has been completed |
| `rewardDescription` | string | Reward the customer will earn on completion |
| `endDate` | string | ISO 8601 expiry |

### Response Example

```json
{
  "status": "success",
  "data": [
    {
      "challengeId": 15,
      "challengeName": "Visit 5 Times This Month",
      "challengeType": "MILESTONE",
      "targetValue": 5,
      "isActivated": true,
      "currentProgress": 3,
      "progressPercentage": 60.0,
      "isCompleted": false,
      "rewardDescription": "Earn 300 bonus points",
      "endDate": "2024-04-30T23:59:59Z"
    }
  ]
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or data validation failure |
| `500` | Unexpected server error |

---

## POST /games/app/challenge/activate/\{challengeId\}

Opts a customer into a specific challenge. Call this when the customer explicitly taps "Join Challenge" in your app. Some challenges track progress automatically from the moment they are activated; others require activation before any progress is recorded at all.

:::warning
For challenges that require activation before progress tracking, failing to call this endpoint means the customer's qualifying actions will not be counted — even if the challenge is active and they are eligible.
:::

### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `challengeId` | integer | Yes | Challenge to activate | `15` |

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customerId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |

### Request Example

```
POST /games/app/challenge/activate/15
```

```json
{
  "apiKey": "pk_live_abc123def456",
  "customerId": "APP-CUST-001234"
}
```

### Response - 200 OK

Returns a localised confirmation string in `data` (e.g. `"Challenge activated"`) alongside a numeric `errorKey` for localisation lookup.

```json
{
  "status": "success",
  "data": "Challenge activated",
  "errorKey": 1042
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, challenge not found, or challenge is no longer active |
| `500` | Unexpected server error |

:::tip
If the challenge is already activated for the customer, this call is a no-op and returns a success response — it is safe to call idempotently.
:::

---

## POST /games/app/challenge/details/\{challengeId\}

Returns the full configuration and the authenticated customer's detailed progress for a specific challenge — including step-level breakdown for multi-step or streak challenges. Use this for a challenge detail screen.

### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `challengeId` | integer | Yes | Challenge to retrieve | `15` |

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | No | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `apiKey` | string | Yes | Merchant-level API key | `"pk_live_abc123def456"` |
| `customerId` | string | Yes | Customer identifier | `"APP-CUST-001234"` |

### Request Example

```
POST /games/app/challenge/details/15
```

```json
{
  "apiKey": "pk_live_abc123def456",
  "customerId": "APP-CUST-001234"
}
```

### Response - 200 OK

Returns a `CustomerDetailedChallengeResponse` with full metadata and per-step breakdown:

| Field | Type | Description |
|-------|------|-------------|
| `challengeId` | integer | Challenge identifier |
| `challengeName` | string | Display name |
| `description` | string | Full challenge description |
| `challengeType` | string | Category |
| `isActivated` | boolean | Whether the customer has opted in |
| `isCompleted` | boolean | Whether the challenge is fully completed |
| `currentProgress` | number | Overall progress value |
| `targetValue` | number | Overall goal |
| `progressPercentage` | number | Overall completion percentage |
| `steps` | array | Step-level breakdown for multi-step challenges |
| `steps[].stepId` | integer | Step identifier |
| `steps[].description` | string | What this step requires |
| `steps[].isCompleted` | boolean | Whether this step is done |
| `steps[].completedAt` | string \| null | ISO 8601 timestamp when completed |
| `reward` | object | Reward granted on full completion |
| `reward.type` | string | Reward type (`"POINTS"`, `"OFFER"`, `"BADGE"`) |
| `reward.value` | number \| string | Reward value |
| `startDate` | string | Challenge start date |
| `endDate` | string | Challenge end date |

### Response Example

```json
{
  "status": "success",
  "data": {
    "challengeId": 15,
    "challengeName": "Visit 5 Times This Month",
    "description": "Visit any branch 5 times before the end of the month to earn 300 bonus points.",
    "challengeType": "MILESTONE",
    "isActivated": true,
    "isCompleted": false,
    "currentProgress": 3,
    "targetValue": 5,
    "progressPercentage": 60.0,
    "steps": [
      { "stepId": 1, "description": "Visit 1", "isCompleted": true, "completedAt": "2024-04-02T11:00:00Z" },
      { "stepId": 2, "description": "Visit 2", "isCompleted": true, "completedAt": "2024-04-05T14:30:00Z" },
      { "stepId": 3, "description": "Visit 3", "isCompleted": true, "completedAt": "2024-04-09T09:15:00Z" },
      { "stepId": 4, "description": "Visit 4", "isCompleted": false, "completedAt": null },
      { "stepId": 5, "description": "Visit 5", "isCompleted": false, "completedAt": null }
    ],
    "reward": {
      "type": "POINTS",
      "value": 300
    },
    "startDate": "2024-04-01T00:00:00Z",
    "endDate": "2024-04-30T23:59:59Z"
  }
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Invalid API key or JWT mismatch |
| `422` | Customer not found, or challenge not found |
| `500` | Unexpected server error |

---

## Common Error Codes

| HTTP Status | Cause |
|-------------|-------|
| `401` | Invalid API key, expired JWT, or merchant/JWT mismatch |
| `422` | Customer or challenge not found, or business rule violation |
| `500` | Unhandled server error |
