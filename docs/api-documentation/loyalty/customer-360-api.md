---
id: customer-360-api
title: Customer 360 API
sidebar_label: Customer 360 API
sidebar_position: 5
---

## Overview

The Qubriux Customer 360 API returns a comprehensive behavioural and transactional profile for a single customer. In one call you get lifetime spend, order frequency, favourite products and categories, preferred visit times, day-of-week patterns, and a ranked list of recent purchases — everything needed to power personalised experiences, targeted campaigns, or a CRM customer card.

:::note
This API is read-only. It does not modify the customer's loyalty balance, offers, or profile.
:::

## Base URL

| Environment | Base URL |
|-------------|----------|
| **Staging** | `https://qa.qubriux.com/ezloyal-web` |
| **Production** | `https://app.qubriux.com/ezloyal-web` |

## Authentication

Every request requires a **JWT Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Obtain a token from `POST /auth/getAccessToken` using your `apiKey`, `clientId`, and `clientSecret`.

## Response Envelope

This endpoint uses a different response wrapper from other Qubriux APIs:

```json
{
  "message": "success",
  "body": [ { ... } ]
}
```

`body` is an array containing a single customer object. On error, `message` is `"failure"` and `body` contains an error description.

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/customer360/\{merchantId\}/\{customerId\}` | Retrieve full 360 profile for a customer |

---

## GET /analytics/customer360/\{merchantId\}/\{customerId\}

Returns the complete Customer 360 profile — purchase history, behavioural patterns, and product preferences — for the specified customer under the given merchant.

### Request Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | Yes | `Bearer <jwt_token>` |
| `Content-Type` | Yes | `application/json` |

### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `merchantId` | string | Yes | Your Qubriux merchant ID. This is returned in the `merchant` field of any Customer 360 response and is also visible in the Qubriux dashboard under your account settings. | `"1116"` |
| `customerId` | string | Yes | The customer's Qubriux ID — returned as `customer_id` in the Customer 360 response, and as `customerId` in the `createCustomer` response. | `"da3df4412ba593695f3edd80ca401810"` |

:::tip
Your `merchantId` is fixed per integration — store it as a constant in your environment config rather than fetching it at runtime.
:::

### Request Example

```
GET /analytics/customer360/1116/da3df4412ba593695f3edd80ca401810
Authorization: Bearer <jwt_token>
```

---

### Response - 200 OK

The `body` array contains one object with the following fields, grouped by concern:

#### Identity & Lifetime Value

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `customer_id` | string | Qubriux customer identifier | `"da3df4412ba..."` |
| `merchant` | string | Merchant ID this profile belongs to | `"1116"` |
| `cltv` | string | Customer Lifetime Value — total spend rounded to the nearest whole unit | `"3010"` |
| `segment` | string (JSON array) | IDs of the segments this customer belongs to | `"[5317, 5318, ...]"` |

#### Order Summary

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `total_orders` | string | Total number of orders placed | `"1905"` |
| `total_order_amount` | string | Cumulative spend across all orders | `"3010.57"` |
| `average_order_amount` | string | Mean order value | `"1.1650813"` |
| `avg_items_per_order` | string | Average number of line items per order | `"1.4"` |
| `avg_days_between_purchases` | string | Average gap in days between consecutive purchases | `"0.38"` |

#### Product & Category Breadth

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `unique_product_name_count` | string | Number of distinct products ever ordered | `"93"` |
| `unique_product_names` | string (JSON array) | Full list of distinct product names ordered | `"[\"sm cold press\", ...]"` |
| `unqiue_product_category_count` | string | Number of distinct categories ever ordered | `"44"` |
| `unqiue_product_categories` | string (JSON array) | Full list of distinct category names ordered | `"[\"SM ICED COFFEE/NON COFFEE\", ...]"` |

:::note
`unique_product_names`, `unqiue_product_categories`, `top_products`, `top_categories`, and `past_five_orders` are returned as JSON-encoded strings. Parse them before use.
:::

#### Top Products & Categories

| Field | Type | Description |
|-------|------|-------------|
| `top_products` | string (JSON array) | Ranked list of the customer's most-ordered products. Each entry contains `rank`, `count`, `foodid`, and `name`. |
| `top_categories` | string (JSON array) | Ranked list of the customer's most-ordered categories. Each entry contains `rank`, `count`, and `category`. |

**`top_products` item shape:**

| Field | Type | Description |
|-------|------|-------------|
| `rank` | integer | Rank by order count (1 = most ordered) |
| `count` | integer | Number of times ordered |
| `foodid` | string | Normalised product identifier |
| `name` | string | Display product name |

**`top_categories` item shape:**

| Field | Type | Description |
|-------|------|-------------|
| `rank` | integer | Rank by order count |
| `count` | integer | Number of times ordered |
| `category` | string | Category name |

#### Recent Purchase History

| Field | Type | Description |
|-------|------|-------------|
| `past_five_orders` | string (JSON array) | The most recent order line items (up to the last 5 orders). Each entry contains the fields below. |

**`past_five_orders` item shape:**

| Field | Type | Description |
|-------|------|-------------|
| `orderid` | string | Order identifier |
| `orderdate` | string | Order timestamp (`YYYY-MM-DD HH:MM:SS`) |
| `storeid` | string | Store identifier |
| `storename` | string | Store display name |
| `foodid` | string | Normalised product identifier |
| `name` | string | Product display name |
| `category` | string | Product category |
| `quantity` | integer | Units ordered |
| `subtotal` | number | Line item total |

#### Behavioural Patterns

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `fav_store` | string | The store this customer visits most frequently | `"Andalous-Coop"` |
| `fav_day_of_week` | string | The day of week with the highest visit count | `"Sunday"` |
| `fav_day_part` | string | The day part with the highest visit count: `Morning`, `Afternoon`, `Evening`, or `Night` | `"Night"` |
| `fav_hour_bracket` | string | Hour range (24h) with the most visits | `"21-23"` |
| `last_transaction_day_of_week` | string | Day of week of the customer's most recent transaction | `"Tuesday"` |

#### Visit Distribution

| Field | Type | Description |
|-------|------|-------------|
| `visits_by_daypart` | string (JSON object) | Visit counts split by `morning`, `afternoon`, `evening`, `night` |
| `visits_by_day_of_week` | string (JSON object) | Visit counts keyed by day abbreviation (`mon`–`sun`) |
| `visits_by_day_and_daypart` | string (JSON object) | Visit counts keyed by day, then by day part |

#### Spend Patterns

| Field | Type | Description |
|-------|------|-------------|
| `avg_order_each_day` | string (JSON array) | Average order value for each day of the week, keyed by day abbreviation |
| `avg_order_value_by_daypart` | string (JSON object) | Average order value split by `morning`, `afternoon`, `evening`, `night` |
| `weekday_vs_weekend_order_value` | string (JSON object) | Comparison of weekday vs weekend — contains `weekday_orders`, `weekday_total`, `weekday_avg`, `weekend_orders`, `weekend_total`, `weekend_avg` |

#### Product Affinity by Time

| Field | Type | Description |
|-------|------|-------------|
| `fav_items_on_each_day` | string (JSON array) | Most-ordered product for each day of the week, keyed by day abbreviation |
| `favourite_product_by_daypart` | string (JSON object) | Most-ordered product for each day part |
| `favourite_category_by_daypart` | string (JSON object) | Most-ordered category for each day part |

---

### Response Example

```json
{
  "message": "success",
  "body": [
    {
      "customer_id": "da3df4412ba593695f3edd80ca401810",
      "merchant": "1116",
      "cltv": "3010",
      "segment": "[5317, 5318, 5509, 5524]",
      "total_orders": "1905",
      "total_order_amount": "3010.57",
      "average_order_amount": "1.1650813",
      "avg_items_per_order": "1.4",
      "avg_days_between_purchases": "0.38",
      "unique_product_name_count": "93",
      "unqiue_product_category_count": "44",
      "top_products": "[{\"rank\":1,\"count\":1038,\"foodid\":\"smcoldpress\",\"name\":\"sm cold press\"},{\"rank\":2,\"count\":342,\"foodid\":\"orangejuice\",\"name\":\"orange juice\"}]",
      "top_categories": "[{\"rank\":1,\"category\":\"SM ICED COFFEE/NON COFFEE\",\"count\":1038},{\"rank\":2,\"category\":\"JUICE\",\"count\":345}]",
      "past_five_orders": "[{\"orderid\":\"0c41bec4...\",\"orderdate\":\"2026-03-30 11:28:35\",\"storename\":\"Andalous-Coop\",\"name\":\"halloumi kashkaval wrap\",\"category\":\"SANDWICH\",\"quantity\":1,\"subtotal\":1.85}]",
      "fav_store": "Andalous-Coop",
      "fav_day_of_week": "Sunday",
      "fav_day_part": "Night",
      "fav_hour_bracket": "21-23",
      "last_transaction_day_of_week": "Tuesday",
      "visits_by_daypart": "{\"morning\":364,\"afternoon\":484,\"evening\":413,\"night\":644}",
      "visits_by_day_of_week": "{\"mon\":221,\"tue\":315,\"wed\":240,\"thu\":306,\"fri\":291,\"sat\":210,\"sun\":322}",
      "avg_order_each_day": "[{\"mon\":1.22,\"tue\":1.21,\"wed\":1.12,\"thu\":1.21,\"fri\":1.19,\"sat\":1.23,\"sun\":1.19}]",
      "avg_order_value_by_daypart": "{\"morning\":1.78,\"afternoon\":1.74,\"evening\":1.41,\"night\":1.46}",
      "weekday_vs_weekend_order_value": "{\"weekday_orders\":1149.0,\"weekday_total\":1815.72,\"weekday_avg\":1.58,\"weekend_orders\":546.0,\"weekend_total\":863.77,\"weekend_avg\":1.58}",
      "fav_items_on_each_day": "[{\"mon\":\"SM Cold Press\",\"tue\":\"SM Cold Press\",\"wed\":\"SM Cold Press\",\"thu\":\"SM Cold Press\",\"fri\":\"SM Cold Press\",\"sat\":\"SM Cold Press\",\"sun\":\"SM Cold Press\"}]",
      "favourite_product_by_daypart": "{\"morning\":\"SM Cold Press\",\"afternoon\":\"None\",\"evening\":\"None\",\"night\":\"None\"}",
      "favourite_category_by_daypart": "{\"morning\":\"SM ICED COFFEE/NON COFFEE\",\"afternoon\":\"None\",\"evening\":\"None\",\"night\":\"None\"}"
    }
  ]
}
```

### Error Responses

| Status | When It Happens |
|--------|-----------------|
| `401` | Missing or expired JWT token |
| `404` | `merchantId` or `customerId` not found |
| `500` | Unexpected server error |

---

## Related APIs

- [Loyalty & Rewards API](./loyalty-rewards-api.md) — customer registration, offers, cart, and redemption
- [Badges API](./badges-api.md) — badge catalogues and customer badge progress
- [Gamification API](./gamification-api.md) — challenges, activation, and progress tracking
- [Wallet API](./wallet-api.md) — digital wallet balance, credits, debits, and history
