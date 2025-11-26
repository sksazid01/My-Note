Nice — here are **shop-up–style system-design exam questions with model answers** you can use for practice or interview prep. Each question includes a clear, interview-ready answer: high-level architecture, key components, APIs, data model snippets, scaling & failure considerations.

# Question 1 — Order Management System (end-to-end)

**Q:** Design an end-to-end order management system where retailers place orders, distributors fulfill them, and delivery agents deliver.

**A (short):**
**High-level components**

* Frontend (Retailer app, Distributor app, Admin)
* API Gateway → Authentication (JWT)
* Order Service (Golang/Node) — core business logic
* Inventory Service — stock checks & reservations
* Payment Service — integrates bKash/Nagad/COD
* Fulfillment Service — assigns distributor & rider
* Notification Service — SMS/Push/Email
* Event bus (Kafka) for async flows
* DB: Postgres for transactional data, Redis for caches & locks
* Object store (S3) for receipts, logs

**Order lifecycle (states)**
`CREATED → PAYMENT_PENDING → PAID → RESERVATION_CONFIRMED → PACKED → OUT_FOR_DELIVERY → DELIVERED → CANCELLED/RETURNED`

**APIs (examples)**

```http
POST /orders
Body: { retailer_id, items:[{sku,qty}], shipping_address, payment_method }
Response: { order_id, status, amount, payment_url? }

GET /orders/{id}
POST /orders/{id}/cancel
POST /orders/{id}/confirm-delivery
```

**Key flows**

* Place order → Order Service validates → calls Inventory Service to reserve stock (idempotent) → create payment session → on payment callback, publish `order.paid` to Kafka → Fulfillment Service assigns distributor & rider → notifications.

**DB schema (simplified)**

```sql
orders(id PK, retailer_id, total_amount, status, created_at)
order_items(id PK, order_id FK, sku, qty, price)
payments(id PK, order_id FK, provider, status, txn_id)
```

**Consistency & reliability**

* Two-phase flow but avoid distributed transactions: use **sagas** via events (Kafka). Each local service has compensating actions (release reservation on payment failure).
* Idempotent APIs (use client-supplied `idempotency_key`).

**Scaling**

* Partition orders by tenant/region; autoscale services in k8s; use read replicas for Postgres.

---

# Question 2 — Real-time Inventory (prevent oversell, slow internet, district warehouses)

**Q:** Design a real-time inventory system that prevents overselling, works with slow internet and supports district-level warehouses.

**A (short):**
**Architecture**

* Inventory as separate service with per-sku availability across warehouses.
* Use **Redis** for hot stock counts and **Postgres** for authoritative records.
* Use **local offline mode** in the retailer app with sync/merge logic (for very poor connectivity).

**Techniques to prevent oversell**

1. **Optimistic reservation**: `UPDATE stock SET available = available - X WHERE sku = ? AND available >= X` (atomic).
2. **Redis with Lua scripts** for atomic decrement & rollback.
3. **Distributed lock** per SKU (avoid heavy locking; use short TTLs).

**Slow internet handling**

* Client creates **local cart reservation token** valid for a short TTL; server attempts to reserve in background when connectivity returns.
* Allow **manual confirmation** flows with human-in-the-loop for long delays.

**Multi-warehouse**

* Maintain `stock(warehouse_id, sku, available, reserved)` and `fulfillment_rules` to choose warehouse by proximity, cost, or SLA.
* Route orders to district warehouse by default; consider cross-warehouse fulfillment if local stock insufficient.

**Data model**

```sql
warehouse_stock(warehouse_id, sku, available, reserved, updated_at)
```

**Edge cases**

* Use event-driven reconciliation job to compare Redis counters vs Postgres daily and fix drift.

---

# Question 3 — Flash Sales (100k+ orders in minutes)

**Q:** How to handle flash sales: prevent crashes, avoid duplicate orders, handle payment spikes?

**A (short):**
**Traffic control**

* Put a **rate-limiting/gating layer** at API Gateway (quota per IP / per user).
* Use **pre-sale tokenization**: users request a purchase token during sale window; tokens are limited to stock quantity.
* Use **queuing**: accept requests into a durable queue (Kafka/RabbitMQ) and process at controlled rate.

**Prevent duplicates**

* Require `idempotency_key` for order creation and deduplicate server-side.

**Payments**

* Offload payment processing asynchronously. Reserve product first, return success then process payment. If payment fails, push to retry + compensating cancel.
* Use **circuit breakers** and backoff for payment provider spikes.

**Scaling**

* Autoscale stateless services; use read replicas, CDN; cache product pages heavily in CDN.

---

# Question 4 — Payment System Design (bKash/Nagad/COD)

**Q:** Design a secure, fault-tolerant payment integration handling failures, duplicate callbacks, refunds.

**A (short):**
**Key patterns**

* Every payment request includes a generated `payment_reference` and `idempotency_key`.
* Use a **Payment Service** that records `payments` with status transitions: `INITIATED → PENDING → SUCCESS → FAILED → REFUNDED`.

**Handling duplicate callbacks**

* Make callback handler **idempotent**: lookup by `payment_reference` or `tx_id`; ignore duplicates if already processed.

**Failure & retries**

* Persist webhook events; process asynchronously; retry with exponential backoff for transient errors.
* For partial failures (DB write after callback), background reconciler checks provider transaction list daily.

**Refunds**

* Start refund flow in Payment Service; create refund record and call provider; track async status. Use saga for refunds (update order status once refund confirmed).

**Security**

* Validate HMAC signature on callbacks, use TLS, store minimal sensitive data, PCI compliance if storing card data (not typical for mobile wallets).

---

# Question 5 — Data Consistency When Service Fails (after payment before confirmation)

**Q:** One service fails after payment but before order confirmation. How keep data consistent?

**A (short):**
**Use Sagas + Event Sourcing**

* Payment success → publish `order.payment.succeeded` event.
* Downstream services subscribe and perform steps (reserve inventory, notify fulfillment).
* If a subscriber fails, publish compensation event (e.g., `order.payment.rollback`) or retry.

**Reconciliation**

* Reconciliation job compares `payments` vs `orders` (e.g., payments that are `SUCCESS` but orders not `PAID`) and takes corrective action (retry fulfillment or issue refund).

**Idempotency**

* Ensure handlers are idempotent so retries safe.

---

# Question 6 — Analytics Pipeline (GMV, top products, distributor performance)

**Q:** Design an analytics pipeline for dashboards.

**A (short):**
**Architecture**

* Capture events (order.created, order.paid, order.shipped) to Kafka.
* Stream processing (Flink/ksqlDB) to do real-time aggregates (per-hour GMV).
* Store OLAP results in ClickHouse / Druid for fast queries.
* BI layer (Metabase/Redash) + custom dashboards.

**Batch**

* Periodic jobs (Airflow) for heavy aggregations, daily rollups, machine learning features.

**Data model**

* Raw events in a data lake (Parquet on S3), aggregated tables for dashboards.

**Alerting**

* Alerts for sudden drops/rises in GMV or failed pipelines.

---

# Question 7 — Microservices vs Monolith (early stage vs scale)

**Q:** Which architecture for ShopUp: monolith or microservices? Why?

**A (short):**

* **Early stage:** Start with a **modular monolith** — lower operational cost, faster feature development, simpler debugging. Keep clear module boundaries.
* **At scale:** Evolve to **microservices** by splitting around bounded contexts (Orders, Inventory, Payments, Fulfillment). Migrate gradually with APIs/event bus.
* **Why:** Monolith reduces overhead; microservices aid independent deployment, scaling, and team autonomy once traffic and team size justify it.

---

# Question 8 — Delivery Tracking System (real-time)

**Q:** Design a real-time rider tracking system.

**A (short):**
**Components**

* Rider mobile app sends GPS pings (batch or adaptive frequency based on speed).
* Ingress: load-balanced WebSocket/Gateway or lightweight HTTP ingestion to Tracking Service.
* Tracking Service stores recent location in **Redis** (geo-indexed), and persists to time-series store for history.
* WebSocket or Firebase for pushing updates to retailer or customer apps.

**APIs**

```http
POST /rider/{id}/location  { lat, lon, speed, ts }
GET /order/{id}/rider-location
Subscribe via websocket /orders/{id}/track
```

**Scaling & cost**

* Throttle client updates (e.g., 1-5s) and use delta compression.
* Use proximity queries with Redis Geo or Elasticsearch geo-capabilities.

**Offline handling**

* Cache last known location; show ETA based on routing service (OSRM/GraphHopper).

---

# Question 9 — Fraud Detection (fake orders/cancels)

**Q:** How to detect retailers placing fake orders and cancelling?

**A (short):**
**Signals**

* High cancellation rate per retailer
* Multiple orders with same payment method or IP
* Orders with mismatched shipping vs retailer location
* Unusual order patterns (time, large quantities then cancel)

**System**

* Rule-based engine for immediate scoring (thresholds trigger holds).
* ML model (e.g., gradient boosted trees) trained on historical fraud labels for scoring probability.
* Feedback loop: manual reviews feed labels back to model.

**Action**

* Soft-hold suspicious orders and require KYC/phone confirmation.
* Limit payment methods for high-risk accounts.
* Rate-limit or block repeat offenders.

---

# Question 10 — Product Search & Recommendation

**Q:** Design search (“Rice 25kg”, “Coca Cola crate”) and simple recommendations.

**A (short):**
**Search**

* Use **Elasticsearch** for full-text, synonyms, and faceted search.
* Use analyzers for local languages and tokenization; maintain SKU metadata and ranking signals (stock, price, popularity).
* Autocomplete using completion suggester or prefix n-grams.

**Recommendation**

* Start with simple heuristics: “customers who bought X also bought Y” (co-occurrence) computed in batch.
* Real-time: collaborative filtering or item-based nearest neighbors from purchase history in offline job; cache top-N per product.
* Promote sponsored/recommended products in UI, with A/B testing.

---

If you want, I can:

* convert any answer into a one-page diagram + sample sequence diagram,
* generate interview scoring rubric for candidate answers,
* or give a longer, step-by-step design for **one** of the above (e.g., full Order Service with saga implementation and sample code).

Which one should I expand into a deeper whiteboard-style answer?
