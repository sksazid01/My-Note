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




# GPT
Perfect — this is a great move toward thinking like a **software architect** 👏  

Let’s outline the **basic system design** for an **E-commerce Order Management System (OMS)** — the kind of platform used by Amazon, Flipkart, or Shopify at a smaller scale.

---

## 🧠 **Goal**  
Design a scalable system to handle:
- Product browsing  
- User management  
- Shopping cart  
- Orders & payments  
- Inventory tracking  
- Notifications  

---

## 🧩 **1. High-Level Architecture**
Think of the system as several **microservices** or **modules**, each with a distinct responsibility.

```
Clients (Web, Mobile)
        |
   API Gateway / Load Balancer
        |
------------------------------------------
| Auth Service   | Product Service  | Cart Service |
| Order Service  | Payment Service  | Notification |
------------------------------------------
        |
    Database Layer(s)
        |
  External Services (Payment Gateway, Email/SMS, etc.)
```

---

## ⚙️ **2. Core Components (with responsibilities)**

### 🧍 User / Auth Service
- Handles sign-up, login, and authentication (JWT, OAuth, etc.)
- Stores user profiles, addresses.

### 📦 Product Service
- Stores product details (id, name, price, stock, category).
- Supports browsing, search, filters.

### 🛒 Cart Service
- Temporary storage for selected items.
- Allows add/update/remove before order placement.

### 🧾 Order Service
- Manages order creation, status updates (Created → Paid → Shipped → Delivered).
- Links user, products, and payment info.
- Coordinates workflows with other services (inventory, payments).

### 💰 Payment Service
- Integrates with external gateways (Stripe, Razorpay, etc.).
- Confirms success/failure of payments.

### 📉 Inventory Service
- Tracks stock updates after orders.
- Decreases quantity after purchase, increases on returns/cancellations.

### 📢 Notification Service
- Sends emails/SMS for order confirmation, status updates.
- Can use message queues for async delivery.

---

## 🗄️ **3. Data Flow Example (Order Flow)**

1️⃣ User browses products → fetched from **Product Service**  
2️⃣ Adds items to cart → handled by **Cart Service**  
3️⃣ Proceeds to checkout → **Order Service** creates a new order in `PENDING` state  
4️⃣ **Payment Service** processes the payment  
5️⃣ On success:
   - **Inventory Service** updates stock  
   - **Order Service** changes order status to `CONFIRMED`  
   - **Notification Service** sends confirmation email/SMS  

---

## 🧱 **4. Database Design (Simplified)**

### 👤 `Users` Table  
| id | name | email | password_hash | address_id |

### 📦 `Products`  
| id | name | price | stock | category_id |

### 🛍️ `Cart`  
| user_id | product_id | quantity |

### 🧾 `Orders`  
| id | user_id | total_amount | status | created_at |

### 🧾 `OrderItems`  
| order_id | product_id | quantity | price |

### 💰 `Payments`  
| id | order_id | status | amount | transaction_id |

---

## 🚀 **5. Technology Stack (Example)**

| Layer | Suggested Tech |
|-------|----------------|
| Frontend | React / Vue / Flutter |
| API Gateway | Nginx / Kong |
| Backend (Microservices) | Node.js, Go, Java (Spring), Python (FastAPI) |
| Database | MySQL or PostgreSQL |
| Cache | Redis |
| Message Queue | RabbitMQ, Kafka |
| Object Storage | AWS S3 |
| Authentication | JWT / OAuth 2.0 |
| Monitoring | Prometheus + Grafana |
| Deployment | Docker + Kubernetes |

---

## ⚡ **6. Scalability & Reliability Enhancements**
- **Caching:** Product details, frequently accessed orders in Redis.  
- **Database sharding/replication:** Handle large volumes of product/order data.  
- **Message Queue:** For async updates (inventory, emails).  
- **Rate limiting:** Prevent abuse (e.g., cart updates, search).  
- **CDN:** For static assets like product images.  
- **Microservices:** Decouple different business domains.  

---

## 📊 **7. Example System Diagram (Conceptual)**

```
[User / Mobile / Web]
        |
     [API Gateway]
        |
--------------------------------------
| User Service | Product Service     |
| Cart Service | Order + Payment     |
--------------------------------------
        |
     [Database Cluster]
        |
     [Message Queue] -> [Notification / Inventory]
```

---

## 🧾 **Summary**
| Module | Responsibility |
|----------|----------------|
| Auth | Register/Login users |
| Product | Catalog management |
| Cart | Temporary item store |
| Order | Creates and processes orders |
| Payment | Integrates with payment gateways |
| Inventory | Tracks stock and updates availability |
| Notification | Sends order updates/emails |

---




# follow-ups
Awesome 🙌  

Let’s now make your understanding concrete with a **step‑by‑step order flow** — showing *how data moves across the system* when a user places an order.  

---

## 🧭 **E‑Commerce Order Flow (Step by Step)**

Let’s trace the **lifecycle of an order** inside your system.

---

### 🧍 **1️⃣ User Browses Products**
**Actors:** User → Product Service  
**Flow:**
1. User opens the app or website.
2. Frontend calls `GET /api/products`.
3. **Product Service** fetches details from `Product` database (or cache).
4. Returns product list in JSON to the client.

**Example Response:**
```json
[
  { "id": 1, "name": "Laptop", "price": 1000 },
  { "id": 2, "name": "Mouse", "price": 20 }
]
```

---

### 🛒 **2️⃣ User Adds Items to Cart**
**Actors:** User → Cart Service  
**Flow:**
1. User clicks **“Add to Cart”** for Product ID = 1.  
2. Frontend calls `POST /api/cart` with:
   ```json
   { "userId": 123, "productId": 1, "quantity": 1 }
   ```
3. **Cart Service** stores this in `Cart` table or Redis.

---

### 🧾 **3️⃣ User Places Order**
**Actors:** Cart → Order → Payment → Inventory → Notification  
**Flow:**
1. Frontend calls `POST /api/orders` with item & address details.  
2. **Order Service**:
   - Validates user & cart.  
   - Creates new order in `orders` table → status=`PENDING_PAYMENT`.  

   Example in DB:
   | order_id | user_id | status | total |
   |-----------|----------|---------|-------|
   | 101       | 123      | PENDING_PAYMENT | 1000 |

3. **Order Service** triggers **Payment Service**:  
   - Payment gateway (Stripe, Razorpay, etc.) link returned to frontend.  
   - User confirms payment → gateway calls back with success.

4. **Payment Service** updates order to `PAID`.  
   - Creates an entry in `payments` table.

5. **Order Service** then notifies:
   - **Inventory Service** → subtract stock.  
   - **Notification Service** → send “order confirmed” email.

---

### 🚚 **4️⃣ Shipping & Delivery**
**Actors:** Order → Logistics Service  
1. **Order Service** updates status to `SHIPPED`.  
2. Third‑party shipping partner updates via callback → `DELIVERED`.  

---

### 📣 **5️⃣ Notification & Tracking**
- **Notification Service** sends async emails/SMS:  
  - “Order Confirmed”  
  - “Order Shipped”  
  - “Order Delivered”  

- **Frontend** periodically checks `GET /api/orders/:id` for live updates.

---

## 🧭 **📊 End-to-End Sequence (Simplified)**

```
User → Product Service → Cart Service → Order Service
         ↓                     ↓
     Product DB             Cart DB
                               ↓
                    Payment Service → Payment Gateway
                               ↓
                        Inventory Service
                               ↓
                      Notification Service
```

---

## ⚙️ **Technologies at Each Layer (Example)**

| Layer | Example Tech |
|--------|---------------|
| API Gateway | Nginx/Kong |
| Product/Cart/Order Service | Node.js (Express) or Go (Fiber) |
| Databases | PostgreSQL (orders), MongoDB (products) |
| Cache | Redis |
| Queue | RabbitMQ / Kafka (for async updates) |
| Payment Gateway | Stripe / Razorpay |
| Notifications | SendGrid / Twilio / AWS SES |

---

## 🚀 Scaling Ideas
- **Separate read/write databases** for high load.  
- **Use Redis cache** for product listings.  
- **Kafka queues** for order events (`ORDER_CREATED`, `ORDER_PAID`, etc.).  
- **Microservices** can scale independently.  
- **REST or GraphQL APIs** for front-end consumption.  

---

Would you like me to show a **diagram (ASCII or conceptual visual)** next — showing arrows between services (user → API → microservices → DBs)?
