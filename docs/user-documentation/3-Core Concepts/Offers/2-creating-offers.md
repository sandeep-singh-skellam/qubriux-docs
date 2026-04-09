---
sidebar_position: 2
title: Creating an Offer
---

# Creating an Offer

This guide walks you through setting up an offer in Qubriux from start to finish - from choosing your reward to getting it in front of your customers.

---

## Step 1 - Open the Offers Section

Navigate to **Offers** in the main menu. Your Offers library shows all existing offers with their current status. Click **Create Offer** to begin.

---

## Step 2 - Choose Your Reward Type

The first thing you configure is what the customer actually receives. Select one of the seven reward types:

| Reward Type | What the customer gets |
|-------------|------------------------|
| Percentage Off | A percentage discount on their order |
| Fixed Amount Off | A flat monetary discount (e.g. $10 off) |
| Buy X Get Y | A free or discounted product when they buy a qualifying set |
| Free Shipping | Shipping cost waived, optionally with a minimum order |
| Loyalty Points | Points credited to their wallet |
| Cashback | Cash credited to their wallet balance |
| Burn Loyalty Points | Use accumulated points as currency at checkout |

Your selection here shapes the rest of the form - fields that don't apply to your chosen reward type won't appear.

---

## Step 3 - Configure the Reward Value

Fill in the specific details of the reward based on the type you selected:

**For Percentage Off and Fixed Amount Off:**
- The discount value (percentage or fixed amount)
- Whether the discount applies to the full order, a specific product, or a product category

**For Buy X Get Y:**
- Which products the customer must buy (the "Buy X" side) and how many
- Which product they receive as the reward (the "Get Y" side) - either free or at a reduced price

**For Free Shipping:**
- Optionally, a minimum order amount or minimum item quantity before the offer applies

**For Loyalty Points:**
- The number of points to award - either a fixed number or a percentage of the customer's spend

**For Cashback:**
- The cashback amount - either a fixed figure or a percentage of the order value

**For Burn Loyalty Points:**
- This reward type does not require a specific value - it enables customers to apply their existing points balance at checkout

---

## Step 4 - Set Validity and Limits

Control how long the offer lasts and how many times it can be used:

**Validity**
The number of days the customer has to use the offer after receiving it. For example, setting 7 days means the discount code expires one week from the date it is sent.
- Short validity (2–3 days) creates urgency and is good for flash promotions
- Longer validity (14–30 days) reduces pressure and works better for re-engagement or birthday offers

**Usage limit**
The maximum number of times the offer can be redeemed in total across all customers. Leave this blank for unlimited redemptions.

**Once per customer**
Turn this on if each customer should only be able to use this offer once, even if they receive it through multiple campaigns.

**Excluded products or categories**
Any items the discount should not apply to. Use this to protect already-discounted or high-margin products from being further discounted.

---

## Step 5 - Choose Your Audience

Define who receives this offer. You can include and exclude customers at the same time:

**Include by:**
- All customers
- All leads (contacts who have not yet made a purchase)
- [Segments](../Segments/Segments.md) (groups based on behaviour or attributes)
- Tiers (customers in a specific loyalty tier)
- Customer lists (a manually selected group)
- Employee lists

**Exclude by:**
Any of the above can also be used as exclusions. For example, include all customers but exclude your Gold tier if they're receiving a separate, more generous offer.

---

## Step 6 - Select Communication Channel

Choose how the offer reaches your customers. You can select multiple channels so customers receive it across more than one touchpoint:

- **[Email](../Channels/Email.md)** - best for rich content and offers that require more context
- **[SMS](../Channels/SMS.md)** - best for short, urgent promotions with high open rates
- **[WhatsApp](../Channels/Whatsapp.md)** - best for markets where WhatsApp is the primary messaging channel
- **[Push notification](../Channels/PushNotification.md)** - best for app users and time-sensitive alerts

---

## Step 7 - Save the Offer

Click **Save** to store the offer as a **Draft**. A draft offer can still be edited - nothing has been sent yet and no customers have been affected.

Review the full configuration before proceeding. Once an offer is launched, the core reward details cannot be changed.

---

## Step 8 - Launch the Offer

When you're ready to send, click **Launch**. You'll choose between two dispatch options:

**Instant**
The offer is sent to your audience immediately. Use this for time-sensitive campaigns, flash sales, or reactive promotions you need to get out right now.

**Scheduled**
Pick a specific date and time for the offer to go out. Use this when you're planning ahead - for example, a Friday evening SMS you want delivered at 6pm before the weekend.

Once launched, the offer status moves to **Active** and customers can begin redeeming.

---

## Editing an Offer

You can edit an offer while it is still in **Draft** status. Once an offer is **Active** or **Scheduled**, most fields are locked - this protects customers who have already received the offer from having the terms change under them.

To make substantial changes to a live offer, deactivate it and create a new one.

---

## Deleting an Offer

You can delete a draft offer at any time. Active or ended offers cannot be deleted if they are currently in use inside a Journey or Challenge. You will be shown which active programmes are using the offer before deletion is blocked.

---

## Offer Status Reference

| Status | What it means |
|--------|---------------|
| **Draft** | Created but not yet sent - still editable |
| **Scheduled** | Queued to send at a future date and time |
| **Active** | Sent and currently redeemable by customers |
| **Ended** | The validity period has passed; no further redemptions are possible |
