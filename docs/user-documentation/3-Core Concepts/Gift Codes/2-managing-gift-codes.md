---
sidebar_position: 2
title: Managing Gift Codes
---

# Managing Gift Codes

This guide covers how to view, search, update, and cancel gift codes from the Qubriux dashboard.

Gift codes are issued through your customer-facing app or integration. The dashboard is where you manage existing codes — looking up what a customer has sent or received, making corrections, and cancelling codes when needed.

---

## Viewing Gift Codes for a Customer

Navigate to **Gift Codes** in the main menu, or access gift codes from within a customer's profile page.

To look up the gift codes associated with a specific customer, enter either:
- The customer's **mobile number**
- The customer's **customer ID**

Then choose which role you want to view:

| Role | What it shows |
|------|---------------|
| **Sent** | Gift codes this customer has issued to others |
| **Received** | Gift codes this customer has received from others |
| **Both** | All gift codes associated with this customer in either role |

Results are paginated. Use the page controls to navigate through a customer with a high volume of gift code activity.

---

## Reading a Gift Code Record

Each gift code record shows:

- **Gift Code ID** — the unique identifier for the code
- **Amount** — the monetary value of the code
- **Template** — the visual template used for this code
- **Status** — Issued, Redeemed, Expired, or Cancelled
- **Sender** — the sender's name, mobile number, and customer ID
- **Sender's message** — the personal message attached to the gift
- **Receiver** — the receiver's mobile number and customer ID (if they have an account)
- **Issue date** — when the code was created
- **Expiry date** — when the code will expire if not redeemed
- **Redeem date** — when the code was redeemed (only shown if status is Redeemed)
- **Comments** — any internal notes attached to the code
- **Cancellation comments** — the reason for cancellation (only shown if status is Cancelled)

---

## Updating a Gift Code

You can update a gift code that is currently in **Issued** status — meaning it has not yet been redeemed, expired, or cancelled.

From the gift code detail view, click **Edit** and choose **Update**.

**What you can change:**

**Sender's message**
Update the personal message from the sender to the receiver. Use this if a customer made a typo, wants to add more context, or sent the wrong message.

**Receiver's mobile number**
Change the mobile number the gift code is directed to. Use this if the sender entered the wrong number. When you update the receiver number, the customer ID association is cleared — it will re-link automatically when the new receiver redeems the code.

**Comments**
Add or update internal comments on the gift code. These are not visible to customers — they are for your team's records only.

Click **Save** to apply the changes. The gift code remains in Issued status and the receiver can still redeem it as normal.

---

## Cancelling a Gift Code

Cancelling a gift code permanently voids it. A cancelled code cannot be redeemed — even if the receiver tries to use it, the system will reject it.

From the gift code detail view, click **Edit** and choose **Cancel**.

You will be prompted to add a cancellation comment explaining the reason. This is stored with the record and is visible to anyone who looks up the code in the dashboard.

Click **Confirm Cancel** to complete the cancellation. The gift code status immediately changes to **Cancelled**.

**When to cancel a gift code:**
- The gift code was issued in error (wrong amount, wrong customer)
- The underlying transaction has been refunded
- Suspected fraudulent issuance
- A customer has requested cancellation before the receiver redeems it

**Important:** Cancellation is permanent. There is no way to reinstate a cancelled code. If the sender still wants to give a gift, a new gift code must be issued.

---

## Gift Code Status Reference

| Status | Can be updated? | Can be cancelled? | Can be redeemed? |
|--------|----------------|-------------------|------------------|
| **Issued** | Yes | Yes | Yes |
| **Redeemed** | No | No | No |
| **Expired** | No | No | No |
| **Cancelled** | No | — | No |
