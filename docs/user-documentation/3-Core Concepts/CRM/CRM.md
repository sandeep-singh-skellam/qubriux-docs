---
sidebar_position: 1
title: CRM
---

# CRM

The CRM module in Qubriux gives you a 360° view of every customer — their profile, purchase history, loyalty activity, survey responses, and behavioural trends. From the same interface you can manage customer data, handle support requests by adjusting loyalty balances, and explore analytics that help you understand who your best customers are and which ones you're at risk of losing.

## Customer List

The customer list is your starting point for browsing and managing all customers registered to your account.

### Viewing Customers

1. Navigate to **CRM > Customers**.
2. The list displays all customers, paginated for performance.
3. Use the controls to configure:
   - **Records per page** — how many customers to show at once.
   - **Page number** — navigate through the full list.
   - **Revenue time window** — filter customers based on their revenue contribution within a selected time period.
   - **Order count window** — filter customers based on order frequency within a selected period.

### Filtering by Segment or Store

You can narrow the customer list to a specific audience:

- **Filter by Segment** — select one or more segments to display only customers who belong to those groups.
- **Filter by Store** — for multi-location brands, filter the list to customers associated with a specific store.

Both filters can be combined with the time window controls for precise targeting.

## Searching for Customers

### Basic Search

Type a customer name in the search bar to find matching customers. Results are paginated and can be filtered by segment and store at the same time.

### Advanced Search

The advanced search lets you look up customers using multiple identifiers at once — such as phone number, email address, or external customer ID. You can also toggle to search within the **Leads** list instead of confirmed customers.

Advanced search supports all the same filters as the customer list: segment, store, revenue window, and order window.

## Customer Profile

Clicking on any customer in the list opens their full profile. The profile shows:

| Section | What It Shows |
|---------|--------------|
| **Profile Details** | Name, email, phone, registration date, store association, customer tags |
| **Loyalty Summary** | Current tier, points balance, points earned and redeemed lifetime |
| **Recent Orders** | Last purchases — items, value, date, store |
| **Recent Activity** | Timeline of loyalty events, offer redemptions, campaign interactions |
| **Survey Responses** | Feedback submitted by the customer, NPS scores, review content |
| **Segment Membership** | Which segments this customer belongs to |

## Customer 360° View

The **Customer 360°** view provides a deep analytical breakdown of an individual customer's purchase behaviour over time:

- **Order and revenue trend** — a multiline chart showing order count and revenue side by side, grouped by day, week, or month.
- **Lifetime value breakdown** — total spend, average order value, and order frequency.

Access the 360° view by opening a customer's profile and clicking **View Analytics**.

## Updating Customer Details

You can edit customer information directly from the CRM:

1. Open the customer's profile.
2. Click **Edit**.
3. Update the relevant fields — name, phone, email, or other profile attributes.
4. Click **Save**.

:::warning
Before saving, Qubriux checks whether the updated phone or email already belongs to another customer. If a duplicate is found, the update is blocked and you are notified.
:::

## Deleting a Customer

To remove a customer from the system:

1. Open the customer's profile.
2. Click **Delete Customer**.
3. Confirm the action.

:::warning
Deleting a customer is permanent. All associated loyalty history, orders, and activity data tied to that customer record will be removed.
:::

You can also bulk-remove **bounced customers** — customers whose email addresses have bounced — from the CRM settings.

## Leads

Leads are prospective customers who have expressed interest but have not yet made a purchase or completed registration. They are tracked separately from confirmed customers.

1. Navigate to **CRM > Leads**.
2. The leads list is paginated and can be filtered by store.
3. Use the advanced search to find specific leads by name, email, or phone.

### Hot Leads

**Hot Leads** are customers identified by Qubriux's analytics as having high purchase intent — for example, customers who have browsed recently, interacted with campaigns, or are close to redemption thresholds.

Navigate to **CRM > Hot Leads** to see a ranked, paginated list of hot leads with the signals driving their score.

## Customer Analytics

The CRM includes a suite of built-in analytics charts to help you understand your customer base at a glance.

### Sales Overview

View revenue and transaction trends across your customer base, filtered by date range, store, and other dimensions. Compare current period performance against the previous period to identify growth or decline.

### Loyalty Overview

Track how your loyalty programme is performing:
- Total loyalty customers vs. non-loyalty customers
- Revenue contribution comparison — loyalty vs. non-loyalty
- Loyalty customer growth trend over time

### RFM Analysis

RFM (Recency, Frequency, Monetary) analysis segments your customers into behavioural buckets based on:

- **Recency** — how recently a customer made a purchase
- **Frequency** — how often they buy
- **Monetary** — how much they spend

The RFM chart shows the distribution of your customers across these dimensions. Clicking into any RFM bucket opens the full list of customers in that group, so you can act on the insight directly — for example, exporting that group to a segment and targeting them with a campaign.

### Customer Churn

The churn chart shows how many customers have stopped purchasing within different inactivity windows. Drill into any churn bucket to see the specific customers at risk, making it easy to identify win-back opportunities.

### Repeat Customer Trend

Track the trend of repeat customers over time — customers who have purchased more than once. Drill into any data point to see the list of customers contributing to that period's repeat rate.

### New Customer Trend

Monitor new customer acquisition over time. Drill into any period to see the list of customers who first registered or made their first purchase during that window.

### Top Products

See which products are driving the most revenue or order volume across your customer base. Useful for understanding what to promote and what to stock.

### Top Customers

Identify your highest-value customers ranked by:
- **Revenue** — total spend over a selected period
- **Order count** — number of transactions over a selected period

### Win-Back Rate

The win-back rate shows the percentage of previously churned customers who have returned and made a purchase. This metric reflects how effective your re-engagement campaigns and journeys are at recovering lost customers.

### Segment Analytics

For any saved segment, you can view its analytics breakdown directly in the CRM — including customer count, revenue contribution, average order value, and trend over time.

## Standard Segment Counts

Qubriux maintains a set of standard system segments (e.g. New Customers, At Risk, Champions, Loyal Customers) based on RFM scoring. The CRM displays the current count and time series trend for each standard segment, giving you a quick overview of the health of your customer base without needing to create manual segments.
