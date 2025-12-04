**ACID principles (in databases):**  
• **A – Atomicity:** Each transaction is all‑or‑nothing.  
• **C – Consistency:** Data must always follow rules/constraints.  
• **I – Isolation:** Transactions don’t interfere with each other.  
• **D – Durability:** Once saved, data stays saved even after failures.


# ACID Properties in Detail with Real-Life Examples

---

## 1. Atomicity (All or Nothing)

**Definition:**  
A transaction is treated as a single unit. Either all operations complete successfully, or none of them are applied.

**Real-Life Example: Bank Money Transfer**

Suppose you transfer ₹5000 from Account A to Account B.

Steps involved:
1. Deduct ₹5000 from Account A
2. Add ₹5000 to Account B

**Without Atomicity:**  
If step 1 succeeds but step 2 fails (due to system crash), ₹5000 is lost forever!

**With Atomicity:**  
If step 2 fails, the database **rolls back** step 1. Money stays in Account A. No loss occurs.

```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 5000 WHERE id = 'A';
  UPDATE accounts SET balance = balance + 5000 WHERE id = 'B';
COMMIT;
-- If any error occurs, ROLLBACK happens automatically
```

---

## 2. Consistency (Valid State to Valid State)

**Definition:**  
A transaction must leave the database in a valid state. All rules, constraints, and relationships must be satisfied.

**Real-Life Example: ATM Withdrawal**

Rule: Account balance cannot go below ₹0.

You have ₹3000 in your account and try to withdraw ₹5000.

**Without Consistency:**  
The system allows withdrawal. Your balance becomes -₹2000. Invalid state!

**With Consistency:**  
The database checks the constraint. Transaction is rejected. Balance stays ₹3000. Valid state maintained.

```sql
-- Constraint
ALTER TABLE accounts ADD CONSTRAINT min_balance CHECK (balance >= 0);

-- This will fail if balance < 5000
UPDATE accounts SET balance = balance - 5000 WHERE id = 'A';
```

---

## 3. Isolation (No Interference)

**Definition:**  
Multiple transactions running at the same time do not affect each other. Each transaction works as if it's the only one.

**Real-Life Example: Movie Ticket Booking**

Two people (Ram and Shyam) try to book the **same seat** at the **same time**.

**Without Isolation:**  
Both see the seat as available → Both book it → Same seat sold twice! Conflict!

**With Isolation:**  
The database locks the seat for Ram first. Shyam has to wait. Once Ram's transaction is done, Shyam sees the seat is taken. No double booking.

```sql
Transaction 1 (Ram):
  SELECT seat FROM seats WHERE seat_id = 10;  -- Available
  UPDATE seats SET status = 'booked' WHERE seat_id = 10;
  COMMIT;

Transaction 2 (Shyam):
  -- Waits until Transaction 1 completes
  SELECT seat FROM seats WHERE seat_id = 10;  -- Now shows 'booked'
```

---

## 4. Durability (Permanent Changes)

**Definition:**  
Once a transaction is committed, the changes are permanent. Even if the system crashes, the data remains safe.

**Real-Life Example: Online Shopping Payment**

You pay ₹2000 for a product. Payment is successful and you receive confirmation.

**Without Durability:**  
Server crashes immediately after. When it restarts, payment record is lost. You paid but no record exists!

**With Durability:**  
The database writes transaction to disk/log before confirming. Even after crash, when the system restarts, your payment record is recovered. Data is safe.

```sql
BEGIN TRANSACTION;
  INSERT INTO payments (user_id, amount, status) VALUES (1, 2000, 'success');
COMMIT;
-- Data is now written to permanent storage
```

---

## Quick Summary Table

| Property | Meaning | Example |
|----------|---------|---------|
| **Atomicity** | All or nothing | Bank transfer: both debit & credit happen or neither |
| **Consistency** | Data follows rules | ATM won't allow negative balance |
| **Isolation** | No interference | Only one person can book a seat at a time |
| **Durability** | Permanent after commit | Payment record survives system crash |

---
