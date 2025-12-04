## 🕒 **What is `setTimeout()`?**

`setTimeout()` lets you **run code once** after a specified delay (in milliseconds).  

### ✅ **Syntax**
```js
setTimeout(callbackFunction, delayInMilliseconds, arg1, arg2, ...);
```

- **callbackFunction** → the function to execute  
- **delayInMilliseconds** → how long to wait before running it (1000 ms = 1 second)  
- Optional additional arguments → passed to the callback  

---

## ⚙️ **Basic Example**
```js
console.log("Start");

setTimeout(() => {
  console.log("Hello after 2 seconds");
}, 2000);

console.log("End");
```

### 🧩 **Output**
```
Start
End
Hello after 2 seconds
```

Note that “Hello after 2 seconds” prints *after* 2 seconds — **asynchronously** — even though it appears earlier in the code.  

---

## 🧠 **Why? (The Event Loop!)**
`setTimeout()` doesn’t pause your code.  
Instead, it schedules your callback to run **after** the current code and the delay — the rest of the script keeps running.  
The function goes into the **event queue**, and the JS runtime picks it up when ready.

---

## ⏹️ **Canceling a Timeout**
You can stop a scheduled timeout using `clearTimeout()`.

```js
const timer = setTimeout(() => {
  console.log("This will not run");
}, 3000);

clearTimeout(timer); // cancels the above
```

---

## 🔁 **Multiple Timeouts**
You can schedule multiple actions independently:
```js
setTimeout(() => console.log("1 second passed"), 1000);
setTimeout(() => console.log("3 seconds passed"), 3000);
setTimeout(() => console.log("5 seconds passed"), 5000);

// Output:
// 1 second passed
// 3 seconds passed
// 5 seconds passed
```

---

## 🔄 **Difference Between setTimeout and setInterval**
| Feature | `setTimeout()` | `setInterval()` |
|----------|----------------|-----------------|
| Runs | Once after delay | Repeatedly at interval |
| Cancel with | `clearTimeout()` | `clearInterval()` |

### Example:
```js
// Repeats every second:
const intervalID = setInterval(() => {
  console.log("Tick");
}, 1000);

// Stop after 5 seconds:
setTimeout(() => {
  clearInterval(intervalID);
  console.log("Stopped");
}, 5000);
```

---

## 🧾 **Summary**

| Task | Method |
|------|--------|
| Run function once after delay | `setTimeout(fn, delay)` |
| Run function repeatedly | `setInterval(fn, interval)` |
| Cancel scheduled timeout | `clearTimeout(id)` |
| Cancel interval | `clearInterval(id)` |

---
