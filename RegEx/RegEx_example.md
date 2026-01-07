
```javascript
let email = "test@example.com"
let isValid = /^[\w.-]+@[\w.-]+\.\w+$/.test(email)
console.log(isValid)
// Output: true
```

---
# Full Pattern Breakdown

```
/^[\w.-]+@[\w.-]+\.\w+$/
  │  │    │  │    │ │  │
  │  │    │  │    │ │  └─ End of string
  │  │    │  │    │ └─── Domain extension (com, org, etc.)
  │  │    │  │    └───── Literal dot (.)
  │  │    │  └────────── Domain name
  │  │    └───────────── Literal @ symbol
  │  └────────────────── Username (before @)
  └───────────────────── Start of string
```

---

# The Regex Pattern

```
/^[\w.-]+@[\w.-]+\.\w+$/
```

Let's break it into **7 parts**:

---

## Part 1: `^` → Start of String

```
^
```

This means the pattern must start from the **very beginning** of the string.

Without `^`:
```javascript
let result = /hello/.test("say hello")
// true (found "hello" somewhere)
```

With `^`:
```javascript
let result = /^hello/.test("say hello")
// false (string doesn't START with "hello")
```

For email: We want the **entire string** to be a valid email, not just a part of it.

---

## Part 2: `[\w.-]+` → Username Part (Before @)

```
[\w.-]+
```

This matches the **username** part of the email (before the `@` symbol).

Let's break it down:

### `[...]` → Character Set
Matches **any one character** inside the brackets.

### `\w` → Word Character
Same as `[a-zA-Z0-9_]`

Matches:
• Lowercase letters: a-z  
• Uppercase letters: A-Z  
• Digits: 0-9  
• Underscore: _

### `.` → Literal Dot
**Inside square brackets**, the dot is **literal** (not "any character").

So `.` here matches an actual period/dot.

### `-` → Literal Hyphen
Matches an actual hyphen/dash.

### `+` → One or More
The `+` means match **one or more** of the characters in `[\w.-]`.

### Combined: `[\w.-]+`
Matches **one or more** of:
• Letters (a-z, A-Z)  
• Digits (0-9)  
• Underscores (_)  
• Dots (.)  
• Hyphens (-)

### Examples Matched:
| Username | Valid? |
|----------|--------|
| `test` | ✓ |
| `test123` | ✓ |
| `test.name` | ✓ |
| `test-name` | ✓ |
| `test_name` | ✓ |
| `test.name-123` | ✓ |
| (empty) | ✗ (needs at least 1 char) |

---

## Part 3: `@` → Literal @ Symbol

```
@
```

This matches the **literal @ symbol**.

Every email must have exactly one `@`.

---

## Part 4: `[\w.-]+` → Domain Name Part

```
[\w.-]+
```

Same as Part 2.

This matches the **domain name** (after `@`, before the last dot).

### Examples:
| Domain | Valid? |
|--------|--------|
| `example` | ✓ |
| `my-site` | ✓ |
| `mail.server` | ✓ |
| `company123` | ✓ |

---

## Part 5: `\.` → Literal Dot (Escaped)

```
\.
```

**Outside square brackets**, `.` means "any character".

So we use `\.` (backslash + dot) to match a **literal dot**.

This separates the domain name from the extension.

Example:
• `example.com` → the `.` before `com`

---

## Part 6: `\w+` → Domain Extension

```
\w+
```

This matches the **domain extension** (like `com`, `org`, `net`, `io`).

### `\w` → Word Character
Matches letters, digits, underscore.

### `+` → One or More
At least one character required.

### Examples:
| Extension | Valid? |
|-----------|--------|
| `com` | ✓ |
| `org` | ✓ |
| `net` | ✓ |
| `io` | ✓ |
| `co` | ✓ |
| `education` | ✓ |
| (empty) | ✗ |

---

## Part 7: `$` → End of String

```
$
```

This means the pattern must end at the **very end** of the string.

Combined with `^`, this ensures the **entire string** matches the pattern.

Without `$`:
```javascript
let result = /^test/.test("testing")
// true (starts with "test")
```

With `$`:
```javascript
let result = /^test$/.test("testing")
// false (string doesn't END after "test")
```

---

# Visual Example

Email: `john.doe@my-company.com`

| Part | Pattern | Matches |
|------|---------|---------|
| Start | `^` | (beginning) |
| Username | `[\w.-]+` | `john.doe` |
| @ symbol | `@` | `@` |
| Domain | `[\w.-]+` | `my-company` |
| Dot | `\.` | `.` |
| Extension | `\w+` | `com` |
| End | `$` | (end) |

Result: ✓ Valid!

---

# Test Cases

```javascript
let regex = /^[\w.-]+@[\w.-]+\.\w+$/

// Valid emails
console.log(regex.test("test@example.com"))        // true
console.log(regex.test("john.doe@gmail.com"))      // true
console.log(regex.test("user123@my-site.org"))     // true
console.log(regex.test("info@company.co"))         // true
console.log(regex.test("a@b.c"))                   // true

// Invalid emails
console.log(regex.test("test"))                    // false (no @)
console.log(regex.test("test@"))                   // false (no domain)
console.log(regex.test("@example.com"))            // false (no username)
console.log(regex.test("test@example"))            // false (no extension)
console.log(regex.test("test @example.com"))       // false (space in username)
console.log(regex.test("test@exam ple.com"))       // false (space in domain)
```

---

# Limitations of This Regex

This is a **simple** email validation. Real emails can have:

| Feature | This Regex | Real Emails |
|---------|------------|-------------|
| Multiple dots in extension | ✗ | ✓ (like `.co.uk`) |
| Plus sign in username | ✗ | ✓ (like `user+tag@gmail.com`) |
