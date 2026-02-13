#  Random Topic
## Relationship Between HTTP and REST

# 🔹 1. What is HTTP?

HTTP is a **protocol**.

It defines:
- Methods (GET, POST, PUT, DELETE…)
- Headers
- Status codes (200, 404, 500…)
- Request/Response format

So:
👉 GET/POST/PUT/DELETE belong to **HTTP protocol**
---

# 🔹 2. What is REST?
REST = **Representational State Transfer**
It is **not a protocol**.  
It is an **architectural style** (a set of rules or guidelines).

REST says:
- Use HTTP properly
- Use resources (like `/users/1`)
- Use HTTP methods meaningfully
- **Be stateless**
- Use standard status codes

---

# 🔹 3. Relationship Between HTTP and REST

Think of it like this:

- HTTP = Language
- REST = Writing style

You can write:
- A poem
- A novel
- A report

All in English.

Similarly:

You can build:
- REST API
- SOAP API
- GraphQL API

All using HTTP.

---

# 🔹 4. Example

### Not RESTful:
```
POST /getUser
POST /createUser
POST /deleteUser
```

This uses HTTP, but not REST principles.

---

### RESTful:
```
GET /users/1
POST /users
PUT /users/1
DELETE /users/1
```

# ✅ Final Answer

| Thing | Type |
|-------|------|
| HTTP | Protocol ✅ |
| GET/POST/PUT/DELETE | HTTP Methods ✅ |
| REST | Architectural Style ✅ |

