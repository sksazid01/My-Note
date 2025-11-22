**CORS (Cross-Origin Resource Sharing)**  
CORS is a security feature implemented by web browsers to prevent malicious websites from making unauthorized requests to servers hosted on different domains.  

---

### 🔹 Full Meaning:
**CORS** stands for **Cross-Origin Resource Sharing**.  
It defines how a browser and a server can interact when they’re on *different origins* (different domain, port, or protocol).

For example:  
- Frontend: `https://stage.t-go.com`  
- Backend API: `https://api.t-go.com`  
→ Since both have different subdomains, the browser treats this as a **cross-origin request**.

---

### 🔹 What is a CORS Policy?
A **CORS policy** is a set of rules a server specifies in HTTP response headers (like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.) that tell the browser whether it’s allowed to share resources with a specific origin.

Example of allowing one origin:  
```http
Access-Control-Allow-Origin: https://stage.t-go.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

### 🔹 What is a CORS Error?
A **CORS error** occurs when:  
1. The browser sends a request to a domain different from the one that served the web page, **and**  
2. The target server does **not explicitly allow** that origin in its CORS headers.  

Common browser error message:  
> “Access to fetch at ‘https://api.example.com’ from origin ‘https://app.example.com’ has been blocked by CORS policy.”

---

### 🔹 Why It Exists:
CORS protects users by enforcing the **Same-Origin Policy**, which prevents potentially malicious websites from reading sensitive data from other domains without permission.

---

### 🔹 Summary:
| Term | Meaning |
|------|----------|
| **CORS** | Cross-Origin Resource Sharing |
| **Purpose** | Securely controls data sharing between different origins |
| **Policy** | Server headers defining allowed origins/methods/headers |
| **CORS Error** | Occurs when a request violates the server's CORS policy |

In short, CORS ensures *browser-level web security* by controlling how resources are shared across domains.
