It will cover:
1. 🧩 Variable declaration  
2. 🔁 Loops  
3. 🗺️ Maps & Objects  
4. 📦 Imports & Modules  
5. 🧠 Functions  
6. 🧱 Arrays (slice/vector equivalent)  
7. 🧩 Pairs (via objects or arrays)  
8. ❌ Deleting & inserting (maps and arrays)

Each part includes short examples **with comments showing output**.

---

## 🧩 1. **Variables**
In JavaScript, you use `let`, `const`, or `var`.

```js
let x = 10;         // changeable
const y = 20;       // constant (cannot be reassigned)
var name = "JS";    // function-scoped (older style)
console.log(x, y, name);
// Output: 10 20 'JS'
```

---

## 🔁 2. **Loops**

### Standard `for` loop
```js
for (let i = 0; i < 3; i++) {
  console.log("Loop iteration:", i);
}
// Output:
// Loop iteration: 0
// Loop iteration: 1
// Loop iteration: 2
```

### `while` loop
```js
let count = 0;
while (count < 3) {
  console.log("Count:", count);
  count++;
}
// Output: Count: 0, Count: 1, Count: 2
```

### `for...of` (loop over arrays)
```js
const nums = [10, 20, 30];
for (const n of nums) {
  console.log(n);
}
// Output: 10, 20, 30
```

### `for...in` (loop over object/map keys)
```js
const person = {name: "Alice", age: 25};
for (const key in person) {
  console.log(key, person[key]);
}
// Output:
// name Alice
// age 25
```

---

## 🗺️ 3. **Maps and Objects**

### Using a JS Object (like Go’s map)
```js
const ages = {Alice: 25, Bob: 30};

console.log(ages.Alice);   // Output: 25
ages.Charlie = 35;         // add
delete ages.Bob;           // delete
console.log(ages);
// Output: { Alice: 25, Charlie: 35 }
```

### Using a `Map` (true key-value structure)
```js
const mp = new Map();
mp.set("Alice", 25);
mp.set("Bob", 30);

console.log(mp.get("Alice"));  // Output: 25
mp.delete("Bob");              // delete
console.log(mp.has("Bob"));    // Output: false
```

Looping over `Map`:
```js
for (const [key, value] of mp) {
  console.log(key, value);
}
// Output: Alice 25
```

---

## 📦 4. **Imports and Modules**
In modern JS (ES6+), modules use `import` and `export`.

### Export from another file (mathUtil.js)
```js
export function add(a, b) {
  return a + b;
}
```

### Import and use (main.js)
```js
import { add } from "./mathUtil.js";
console.log(add(3, 4)); 
// Output: 7
```

---

## 🧠 5. **Functions**

### Basic function
```js
function add(a, b) {
  return a + b;
}
console.log(add(3, 4));
// Output: 7
```

### Arrow function
```js
const multiply = (a, b) => a * b;
console.log(multiply(3, 4)); 
// Output: 12
```

### Multiple returns (use array/object)
```js
function divide(a, b) {
  return { quotient: Math.floor(a / b), remainder: a % b };
}

const { quotient, remainder } = divide(10, 3);
console.log(quotient, remainder);
// Output: 3 1
```

---

## 🧱 6. **Arrays (Vector/Slice Equivalent)**

### Declare empty & append
```js
let nums = [];
nums.push(10);
nums.push(20, 30);
console.log(nums);
// Output: [10, 20, 30]
```

### Insert in middle
```js
nums.splice(1, 0, 15); // index 1, delete 0, insert 15
console.log(nums);
// Output: [10, 15, 20, 30]
```

### Delete by index
```js
nums.splice(2, 1); // index 2, delete 1 element
console.log(nums);
// Output: [10, 15, 30]
```

---

## 🧩 7. **Pair Equivalent**

You can represent pairs as:
- **Objects:**
  ```js
  let pair = {key: "Alice", value: 25};
  console.log(pair.key, pair.value);
  // Output: Alice 25
  ```

- **Arrays:**
  ```js
  let pair = ["Alice", 25];
  console.log(pair[0], pair[1]);
  // Output: Alice 25
  ```

Or even store a “vector of pairs”:
```js
let pairs = [
  ["Alice", 25],
  ["Bob", 30],
];
for (const [name, age] of pairs) {
  console.log(name, age);
}
// Output:
// Alice 25
// Bob 30
```

---

## ❌ 8. **Deleting or Inserting (Summary)**

| Structure | Insert | Delete | Note |
|------------|---------|--------|------|
| **Array** | `push()`, `unshift()`, `splice()` | `splice()` | Ordered |
| **Object** | `obj[key] = value` | `delete obj[key]` | Key-value, unordered |
| **Map** | `map.set(k,v)` | `map.delete(k)` | Key-value, keeps insertion order |

---

## 🧾 Final Example — All Together
```js
// Variables
let x = 10, name = "Alice";
console.log(x, name);
// Output: 10 'Alice'

// Arrays
let nums = [10, 20, 30];
nums.splice(1, 0, 15); // insert in middle
nums.splice(2, 1);     // delete one element
console.log(nums);
// Output: [10, 15, 30]

// Maps
const mp = new Map([["A", 1], ["B", 2]]);
mp.set("C", 3);
mp.delete("B");
for (const [k, v] of mp) console.log(k, v);
// Output:
// A 1
// C 3

// Functions
const add = (a, b) => a + b;
console.log(add(3, 4));
// Output: 7
```

---
