---
sidebar_position: 5
title: How wallet works?
---


## Ledgers
- The wallet is composed of multiple **ledgers**, each representing a specific type of value such as cashback, loyalty points, promotional credits, or tier-based rewards.  
- Each ledger has its own configuration, including expiry duration, deduction priority, and topic grouping.  
- This structure allows brands to manage different reward types independently while presenting a unified wallet experience to customers.

---

## Credits (Adding Money/Points)
- When a customer earns value—like cashback, points, or promotional credits—the wallet creates a **credit transaction** for that amount.  
- Each credit receives an expiry date (if configured), ensuring precise control over how long the value remains valid.  
- The amount is added to the appropriate ledger balance and recorded in the transaction history so customers can track how and when they earned the value.

---

## Debits (Spending Money/Points)
- When customers spend from the wallet, the system applies **smart deduction logic** to determine which ledger to use.  
- The wallet always deducts from the **highest priority ledger first**, and within that ledger it consumes credits that are **closest to expiry**.  
- If one ledger does not hold enough value, the system automatically moves to the next one, allowing multi-ledger deductions to happen smoothly without exposing complexity to the customer.

---

## Expiry
- Credits may expire based on the rules defined for each ledger, supporting loyalty programs, limited-time bonuses, and promotional validity periods.  
- Expiry is tracked at the **individual transaction level**, enabling each credit entry to have its own expiry date.  
- When a credit expires, the system automatically removes the value from the available balance, moves it into the expired bucket, and logs the event for full transparency.

---

## Transaction History
- The wallet maintains a complete log of all credit, debit, expiry, refund, and adjustment events.  
- Each entry includes useful details such as amount, date, description, ledger used, and expiry information for credit transactions.  
- This transparency helps customers understand their wallet activity clearly and reduces confusion or support queries.

---

## Real-time Updates
- All wallet actions—credits, debits, and expiries—reflect instantly across the app and backend systems.  
- Customers always see the latest balance, enabling real-time loyalty experiences like instant rewards, on-the-spot discounts, and immediate credit reflection.

