---
sidebar_position: 1
title: Gift Codes
---

# Gift Codes

A gift code is a digital voucher with a fixed monetary value that one customer sends to another. The sender issues a code with a personal message and a chosen amount; the receiver gets the code and redeems it to add the value directly to their wallet balance - which they can then spend on their next purchase.

Gift codes are a powerful tool for driving both acquisition and loyalty. A customer who receives a gift code from someone they know is already warm to your brand before they've ever placed an order. And the act of gifting creates a connection between two customers that's far more compelling than any mass promotion.

---

## How Gift Codes Work

The lifecycle of a gift code is straightforward:

1. **A gift code is issued** - a sender's details, receiver's mobile number, amount, and optional personal message are recorded. The system generates a unique code and sets an expiry date.
2. **The receiver receives the code** - typically via the customer-facing app or a notification.
3. **The receiver redeems the code** - the monetary value is instantly credited to their wallet balance.
4. **The code is marked as redeemed** - it can never be used again.

If the receiver never redeems it, the code eventually expires. A merchant can also cancel a code manually before redemption.

---

## What Makes a Gift Code

Each gift code captures the following information when it is issued:

---

### Amount

The monetary value of the gift code. This is the exact amount that will be credited to the receiver's wallet when they redeem it. The amount is set at the time of issuing and cannot be changed afterward.

**Example:**

> *A customer purchases a $50 gift code to send to a friend for their birthday. When the friend redeems it, $50 is added to their wallet balance, ready to spend.*

---

### Template

The visual design of the gift code as it appears in the app. Templates control how the gift code looks when displayed to the receiver - the card design, colours, and imagery. You can have different templates for different occasions (birthday, holiday, general gifting).

---

### Sender Details

The mobile number and customer ID of the person issuing the gift code. This links the gift code to the sending customer's account and creates a record of what they've sent.

---

### Personal Message

An optional message from the sender to the receiver - displayed on the gift code when the receiver opens it. A personal message makes the gift feel human and intentional rather than transactional.

**Example:**

> *"Happy Birthday Sarah! Treat yourself to something special. - Jake"*

---

### Receiver Details

The mobile number of the person the gift code is being sent to. The receiver is identified by their mobile number. If the receiver already has an account, the code is linked to their customer profile automatically.

---

### Expiry

Gift codes have an expiry date - by default, one year from the date of issue. After the expiry date, the code can no longer be redeemed. Customers are typically reminded as the expiry approaches.

---

### Country

The country context for the gift code, used to apply the correct currency and wallet ledger. This is set at issue time based on the sender's market.

---

## Gift Code Statuses

| Status | What it means |
|--------|---------------|
| **Issued** | The gift code has been created and is active - the receiver can redeem it |
| **Redeemed** | The receiver has used the code; the value has been credited to their wallet |
| **Expired** | The expiry date has passed; the code can no longer be redeemed |
| **Cancelled** | The code was manually cancelled before redemption - it cannot be used |

---

## What Happens When a Gift Code Is Redeemed

When a receiver redeems their gift code, the following happens automatically:

1. The system verifies the code is valid - it must be in **Issued** status (not already redeemed, expired, or cancelled)
2. The redemption is recorded with a timestamp
3. The code's value is credited directly into the receiver's wallet balance
4. The code is permanently marked as **Redeemed** - it cannot be redeemed again

The receiver sees their wallet balance update in real time.

---

## Managing Existing Gift Codes

Once a gift code has been issued, you can make two types of changes from the Qubriux dashboard:

**Update**
Modify the sender's message, the receiver's mobile number, or internal comments. Useful when a gift was sent to the wrong number or the sender wants to update their message.

**Cancel**
Permanently cancel the gift code. A cancelled code can never be redeemed. Use this if a gift code was issued in error, if a refund is being processed, or if you need to void a code before it is used.

---

## Putting It All Together - Real Scenarios

### Gifting Between Customers

A restaurant chain enables gift codes in their loyalty app. Customers who want to treat a friend can purchase a gift code for any amount and send it directly via the app. The receiver gets a notification, opens the gift code with the personal message, taps redeem, and sees the value appear in their wallet.

The restaurant benefits from:
- **New customer acquisition** - receivers who don't have an account create one to redeem their gift
- **Increased spend** - gift code recipients almost always spend more than the code's value on their first visit
- **Word of mouth** - gifting creates a story the receiver is likely to share

---

### Corporate and Occasion Gifting

A retailer partners with corporate clients to issue bulk gift codes for employee rewards programmes. Each code is issued with the company's branding template and a message from the employer. Employees receive the code, redeem it, and spend the value on any purchase.

Because each code is tracked individually, the retailer can see exactly how many were redeemed, when, and what was purchased - giving both the retailer and the corporate client a clear view of programme ROI.

---

### Fixing a Misdirected Gift

A customer accidentally sends a gift code to the wrong mobile number. The merchant's support team looks up the gift code in the Qubriux dashboard, updates the receiver number to the correct mobile, and adds a note in the comments. The correct recipient now receives the code. No new code needs to be issued and the sender's experience is preserved.

---

### Voiding a Fraudulent Code

A customer service agent identifies a gift code that was issued as part of a suspected fraudulent transaction. Before the receiver redeems it, the agent cancels the code from the dashboard with a cancellation comment. The code is immediately void - even if the receiver attempts to redeem it, the system rejects it with an error.
