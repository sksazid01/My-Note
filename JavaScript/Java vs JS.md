## 🧭 Section 1: Console Output
```js
// console.log("Hello world!");
```

### ✳️ JavaScript
- `console.log()` prints output to the console.
- It appends a newline automatically.

### ☕ Java
```java
System.out.println("Hello world!");
```
Similar effect, but:
- `System.out.print()` and `println()` belong to the standard output stream.
- `println()` automatically adds a newline, `print()` does not.

---

## 🧩 Section 2: Variables and Type Coercion
```js
var myName = "myName";
myName2 = 22;
console.log(myName + " " + myName2);

var myName3 = myName + myName2;
console.log(myName3); //Now everything becomes a string.
```

### ✳️ JavaScript
- `var` declares a variable (function-scoped).
- `myName2` is assigned without `var/let/const` ⇒ becomes *global* (bad practice).
- `+` concatenates a string and number → **type coercion** converts number to string.

Output:
```
myName 22
myName22
```

### ☕ Java
```java
String myName = "myName";
int myName2 = 22;
System.out.println(myName + " " + myName2);
String myName3 = myName + myName2;
System.out.println(myName3); // same result
```
- In Java, `+` **also concatenates** when one operand is a `String`.
- But **Java is statically typed**, so the variable types must be declared explicitly.

---

## ⚙️ Section 3: String Indexing
```js
console.log("this is 0th index :"+ myName3[0] +"\nand this is last index :"+ myName3[myName3.length-1]);
```

### ✳️ JavaScript
- You can **access** string characters via index (`string[index]`).
- But strings are **immutable**.

### ☕ Java
```java
System.out.println("0th index: " + myName3.charAt(0)
  + "\nLast index: " + myName3.charAt(myName3.length() - 1));
```
- Use `.charAt(index)` instead of `[]`.
- Strings are also **immutable**.

---

## 🚫 Section 4: String Immutability
```js
var s = "Sazid";
s[0] = "r";
console.log(s); // no change
```

### ✳️ JavaScript
- Strings are immutable; `s[0] = ...` does **nothing**.

### ☕ Java
Same rule:
```java
String s = "Sazid";
s.charAt(0); // you can read, not write
```
To "modify" in Java, use:
```java
StringBuilder sb = new StringBuilder("Sazid");
sb.setCharAt(0, 'r');
```

---

## 🔢 Section 5: Function Example
```js
function OddOrEven(x){
    if(x%2==0) console.log("Even");
    else console.log("Odd");
    return 0;
}
console.log(OddOrEven(4));
```

### ✳️ JavaScript
- Defines a function that prints even/odd and returns `0`.
- Return type = **number**, but JS doesn’t require you to specify it.

### ☕ Java
```java
int OddOrEven(int x) {
    if (x % 2 == 0)
        System.out.println("Even");
    else
        System.out.println("Odd");
    return 0;
}
```
- Must declare **return type** (`int`).
- Static typing and strict syntax rules apply.

---

## 🧮 Section 6: Arrays and Methods
Examples:
```js
var arr = [1, 2];
var arr2 = arr.shift(); // removes first element and returns it
arr.unshift("Sazid");   // adds element to front
```

### ✳️ JavaScript
- Arrays are **dynamic** and **heterogeneous** (any type of element).
- `.shift()`, `.unshift()`, `.push()`, `.pop()` are convenient methods.

### ☕ Java
```java
int[] arr = {1, 2};
```
- Java arrays are **fixed size** and **typed** (`int[]`, `String[]` etc.).
- For dynamic behavior, use `ArrayList<Integer>`.

---

## 🌍 Section 7: Global vs Local Scope
```js
var global = 10, local = 10;
function pr() {
    global = 9;
    var local = 9;
    console.log("This is print function " + global);
}
pr();
console.log(global + " " + local);
```

### ✳️ JavaScript
- `global` variable is changed globally.
- Inside `pr()`, `var local` is **function-scoped**, doesn’t affect outer `local`.

### ☕ Java
```java
int global = 10;
int local = 10;

void pr() {
    int local = 9; // shadows outer 'local'
    global = 9;
    System.out.println("This is print function " + global);
}
```
- Same shadowing behavior — local variable hides the outer one.
- But Java doesn’t have *truly global variables* (everything inside a class).

---

## 🧠 Section 8: Loose vs Strict Equality
```js
var a = 12, b = "12", aa = 12.0;
console.log("a==b is :" + a==b);
console.log("a===b is "+ a===b);
```

### ✳️ JavaScript
- `==` → compares *values* with type coercion.
- `===` → compares *values + types* (strict).
- Common bug: `"string" + a == b` evaluates left to right, so parentheses are important.

Correct version:
```js
console.log("a==b is :" + (a==b));   // true
console.log("a===b is :"+ (a===b));  // false
console.log("a==aa is :"+ (a==aa));  // true
console.log("a===aa is :"+ (a===aa)); // true
```

### ☕ Java
```java
int a = 12;
String b = "12";
double aa = 12.0;
// No implicit comparison between String and int
```
You must explicitly convert types:
- `String.valueOf(a).equals(b)`
- `a == aa` → true (numeric comparison)

---

## 🧱 Section 9: Objects (JSON)
```js
var class2 = {
    "Cat's name": "Mehedi bal",
    "age": 80
};
console.log(class2["Cat's name"]);
class2.etc = "Nothing";
```

### ✳️ JavaScript
- Objects are **dictionaries** (key-value pairs).
- Keys can have spaces (must be in quotes).
- Access: `obj["key with space"]`  
- Dynamically add new properties.

### ☕ Java
```java
class Cat {
    String name;
    int age;
    String etc;
}
```
- You define a **class** with fixed properties.
- No dynamic property creation at runtime.

---

## ⚠️ Section 10: var / let / const
```js
var a = 20;
var a = 220; // allowed
let b = 100; // would throw error if redeclared
```

### ✳️ JavaScript
- `var`: function-scoped, re-declaration allowed.
- `let` and `const`: block-scoped, no redeclaration.

### ☕ Java
```java
int a = 20;
// int a = 220; // ❌ error: variable a already defined
```
- Java behaves more like `let`.

---

## 🧩 Section 11: Const and Arrays
```js
const arr = [1,2,3];
arr[0] = 0; // ✅ allowed
arr[3] = 9; // ✅ allowed
// arr = [3,2,1]; ❌ reassigning variable not allowed
```

### ✳️ JavaScript
- `const` prevents reassignment, **not mutation**.
- You can change array contents, not rebind the variable.

### ☕ Java
```java
final int[] arr = {1,2,3};
arr[0] = 0; // ✅ allowed
arr = new int[]{3,2,1}; // ❌ not allowed
```
Exactly the same rule.

---

## 🎯 Section 12: Arrow Functions and Default Parameters
```js
const increment = (function () {
    return function increment(number, value = 1) {
        return number + value;
    };
})();
console.log(increment(5,2));
console.log(increment(5));
```

### ✳️ JavaScript
- Inner function uses **default parameter** `value=1`.
- Arrow functions (`()=>`) are syntactic sugar: concise and lexically scoped.

### ☕ Java
Java doesn’t have arrow functions *exactly* like JS, but has **lambdas**:
```java
BiFunction<Integer, Integer, Integer> increment = (number, value) -> number + value;
```
No default parameters — you must overload a method instead.

---

## 🧩 Section 13: Destructuring
```js
var voxel={x:1,y:2,z:3};
const {x:a, y:b, z:c} = voxel;
console.log(a+b+c);
```

### ✳️ JavaScript
Destructuring lets you extract object properties directly into variables.

### ☕ Java
```java
class Voxel { int x, y, z; }
Voxel v = new Voxel();
int a = v.x;
int b = v.y;
int c = v.z;
```
Manual extraction — Java doesn’t have destructuring (at least not in classic syntax).

---

## 🧠 Section 14: Template Literals
```js
var a=3;
console.log(`The value of a is ${a}.`);
```

### ✳️ JavaScript
- Template literals allow inline variable interpolation using backticks `` ` ``.

### ☕ Java
```java
int a = 3;
System.out.printf("The value of a is %d.", a);
```
- Use `String.format()` or `System.out.printf()` for the same result.

---

✅ **Summary Table**

| Concept | JavaScript | Java |
|----------|-------------|------|
| Typing | Dynamic | Static |
| String mutability | Immutable | Immutable |
| Arrays | Dynamic / mixed | Fixed-size / typed |
| Functions | First-class, anonymous OK | Must be declared in a class |
| Scope | `var` (function), `let` (block) | Block-based |
| Objects | Dynamic | Class-defined |
| Equality | `==` vs `===` | Strongly typed, no coercion |
| Template Strings | `` `Hello ${name}` `` | `String.format()` |

---
