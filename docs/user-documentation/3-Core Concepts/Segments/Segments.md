---
sidebar_position: 1
title: Segments
---

# Segments

Segments are groups of customers defined by rules based on their behaviour, purchase history, loyalty status, or profile attributes. Once a segment is built in Qubriux, you can target it with campaigns, journeys, offers, or export it to social media platforms as a Custom Audience.

## How Segmentation Works

Qubriux evaluates your segment rules against your customer database and returns a matching list of customers. You can preview the size of a segment before saving it, so you always know how many customers will be reached before committing.

Segments are dynamic - they are re-evaluated when used in campaigns and journeys, so they always reflect the current state of your customer data.

## Creating a Segment

1. Navigate to **Segments**.
2. Click **Create Segment**.
3. Enter a unique **segment name**.
4. Use the rule builder to define your segment parameters (see [Segment Parameters](#segment-parameters) below).
5. Click **Preview** to see how many customers match your rules before saving.
6. Click **Save** to create the segment.

:::note
Certain segment names are reserved by the platform and cannot be used. If you enter a reserved name, the platform will prompt you to choose a different one.
:::

:::warning
Segment names must be unique within your account. Attempting to save a segment with a duplicate name will return an error.
:::

## Editing a Segment

1. Open the segment you want to edit from the **Segments** list.
2. Modify the filter rules as needed.
3. Click **Preview** to verify the new customer count.
4. Click **Save** to apply your changes.

## Deleting a Segment

1. Select the segment from the list.
2. Click **Delete**.

:::warning
You cannot delete a segment that is currently in use in an active Journey, Campaign, Offer, or Challenge. Remove it from all active items first, then delete it.
:::

## Segment Parameters

Qubriux provides a rich set of parameters to build segment rules, organised into the following categories. Multiple parameters can be combined using AND/OR logic to create precise segments.

### Customer

Profile-level attributes captured at registration or on the customer record.

- **First Name** — customer's first name
- **Last Name** — customer's last name
- **Email** — customer's email address
- **Age** — customer's age
- **Customer Joining Date** — the date the customer record was created

### Demographics

Geographic attributes associated with the customer's profile.

- **Country Code** — the country linked to the customer's account

### Registration

Attributes related to loyalty programme enrolment.

- **Customer has Signed Up for Loyalty** — whether the customer has enrolled in your loyalty programme

### Order

Order frequency and volume metrics calculated over time.

- **Order Count** — number of orders placed, filterable by source (App, Web, POS), store, platform (iOS, Android), and date range
- **Life Time Order Count** — cumulative order count across the customer's lifetime
- **Last 30 Days Order Count** — number of orders in the last 30 days
- **Average Daily Order Count** — average number of orders per day
- **Average Weekly Order Count** — average number of orders per week
- **Average Monthly Order Count** — average number of orders per month

### Spending Metrics

Revenue and spend metrics derived from order history.

- **Order Value** — value of orders placed, filterable by source, store, platform, and date range
- **Life Time Value** — total spend across the customer's lifetime
- **Thirty Day Value** — total spend in the last 30 days
- **Average Spend Per Purchase** — average transaction value
- **Average Weekly Spend** — average spend per week
- **Average Monthly Spend** — average spend per month

### Transactions

Recency indicators based on transaction history.

- **Date of Last Transaction** — the date the customer last made a purchase
- **Number of Days Since Last Transaction** — how many days have elapsed since the last order

### Items Purchased

Purchase frequency over specific time windows.

- **Number of Purchases (Last Month)** — purchases made in the last calendar month
- **Number of Purchases (Last 6 Months)** — purchases made in the last 180 days
- **Number of Purchases (Last Year)** — purchases made in the last 12 months
- **Number of Purchases (This Year)** — purchases made in the current calendar year

### Product

Product-level purchase behaviour.

- **Product Purchase** — whether a customer has purchased a specific product

### Loyalty

Attributes drawn from the customer's loyalty account.

- **Available Loyalty Points** — current unspent points balance
- **Redeemed Reward Points** — points redeemed within a given time window
- **Total Redeemed Reward Points** — cumulative points redeemed across the customer's lifetime

### Clan Users

Membership in a clan or group programme.

- **Clan Users** — whether the customer is a member of a clan

### Customer 360

Behavioural insights derived from visit patterns, covering preferred times of day and favourite items by day part and day type. These parameters are available across multiple time windows — lifetime, last 30, 90, and 180 days.

**Favourite Day Part** — the time of day the customer most frequently visits (Morning, Afternoon, Evening, or Night), available for:
- Overall (lifetime, last 30 / 90 / 180 days)
- Weekdays only (lifetime, last 30 / 90 / 180 days)
- Weekends only (lifetime, last 90 / 180 days)

**Last Transaction Day of Week** — the day of the week on which the customer last transacted.

**Favourite Item by Day Part** — the product the customer most frequently orders at a specific time of day and day type. Available for every combination of:
- Time of day: Morning, Afternoon, Evening, Night
- Day type: Weekday, Weekend
- Time window: Lifetime, last 30, 90, and 180 days

:::tip
Use the **Preview** button after each rule change to see the impact on your customer count in real time before saving.
:::

## Customer Tags

Customer tags are labels you can assign to individual customers for ad-hoc grouping outside of rule-based filters. Tags are available as a filter option in the segment builder, allowing you to target customers who have been manually tagged for a specific purpose.

## Previewing a Segment

Before saving, you can run a live query against your customer data to see how many customers match your current rules:

1. Build your rules in the segment editor.
2. Click **Preview**.
3. Qubriux runs the query and returns a sample of matching customers along with the total count.

This lets you refine your rules until you reach the right audience size before creating the segment.

## Checking Customer Counts

Once a segment is saved, you can check its current customer count at any time:

1. Open the segment from the **Segments** list.
2. The segment detail view shows the current **customer count** and a **trend graph** showing how the count has changed over time.

You can also view counts across multiple segments side-by-side, which is useful when comparing audience sizes for targeting decisions.

## Segments and Tiers

When building campaigns that target both segments and loyalty tiers, Qubriux lets you combine segment membership with tier filters. For example, you can target customers who are in the "High Value" segment **and** belong to the "Gold" tier, giving you precise control over who receives your campaign.

## Using Segments

Once a segment is created, it can be used in:

- **[Journeys](../Journeys/1-Journeys.md)** - as the target audience for a journey strategy
- **[Offers](../Offers/1-offers.md)** - to restrict offer eligibility to specific customer groups
- **[Challenges](../Challenges/1-challenges.md)** - to target challenge participation
- **Social Media Exports** - to create Custom Audiences on Meta, Snapchat, or TikTok (see [Meta](../Social%20Media/Meta.md), [Snapchat](../Social%20Media/Snapchat.md), [TikTok](../Social%20Media/tiktok.md))
- **Campaign Audience Split** - to route different customer groups down separate journey paths

## Viewing All Segments

The **Segments** list page shows all segments created for your account. From here you can:

- Search by segment name
- View the customer count for each segment
- Filter by status or usage
- Create, edit, or delete segments
