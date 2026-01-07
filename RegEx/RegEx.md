# What is RegEx?

**RegEx** = Regular Expression

It is a **pattern** used to:
• Search text  
• Match text  
• Replace text  
• Validate text (emails, phone numbers, etc.)

---

# flags

| Part | Symbol | Meaning |
|------|--------|---------|
| 1 | `/` | Start of regex |
| 2 | `[...]` | Character set (match any one inside) |
| 3 | `a-z` | Any lowercase letter |
| 4 | `0-9` | Any digit |
| 5 | `^` | NOT (negation, inside brackets) |
| 6 | `/` | End of regex |
| 7 | `g` | Global flag (match all words) |


# 8 Methods

| # | Method | Called On | Returns | Use Case |
|---|--------|-----------|---------|----------|
| 1 | `match()` | String | Array or null | Find matches |
| 2 | `matchAll()` | String | Iterator | Find all matches with details |
| 3 | `replace()` | String | New string | Replace first/all matches |
| 4 | `replaceAll()` | String | New string | Replace all matches |
| 5 | `search()` | String | Index or -1 | Find position of match |
| 6 | `split()` | String | Array | Split by pattern |
| 7 | `test()` | RegExp | true/false | Check if pattern exists |
| 8 | `exec()` | RegExp | Array or null | Get detailed match info |

---


# When to use which method?

| Task | Best Method |
|------|-------------|
| Check if pattern exists (yes/no) | `test()` |
| Find first match | `match()` without `g` |
| Find all matches | `match()` with `g` |
| Find all matches with details | `matchAll()` |
| Replace text | `replace()` or `replaceAll()` |
| Find position of match | `search()` |
| Split string by pattern | `split()` |
| Loop through matches with details | `exec()` with `g` |

---

# Summary Table with Examples

| Pattern | Meaning | Example | Input | Output |
|---------|---------|---------|-------|--------|
| `.` | Any character | `/c.t/g` | "cat cot" | ["cat", "cot"] |
| `\d` | Any digit | `/\d/g` | "a1b2" | ["1", "2"] |
| `\D` | Non-digit | `/\D/g` | "a1b2" | ["a", "b"] |
| `\w` | Word char | `/\w/g` | "hi!" | ["h", "i"] |
| `\W` | Non-word char | `/\W/g` | "hi!" | ["!"] |
| `\s` | Whitespace | `/\s/g` | "a b" | [" "] |
| `\S` | Non-whitespace | `/\S/g` | "a b" | ["a", "b"] |
| `+` | One or more | `/o+/g` | "goool" | ["ooo"] |
| `*` | Zero or more | `/bo*/g` | "b bo boo" | ["b", "bo", "boo"] |
| `?` | Zero or one | `/colou?r/g` | "color colour" | ["color", "colour"] |
| `{n}` | Exactly n | `/a{3}/g` | "aa aaa" | ["aaa"] |
| `{n,m}` | n to m times | `/a{2,3}/g` | "a aa aaa" | ["aa", "aaa"] |
| `^` | must be Start the string with that | `/^hi/` | "hibye there" | ["hi"] |
| `[^hi]` | Any single character **not** `h` or `i` | `/[^hi]/` | "hibye ?" | ["b","y","e"," ","?"] |
| `$` | End of string | `/bye$/` | "good bye" | ["bye"] |

---


# Basic Syntax in JavaScript

```
/pattern/flags
```

• `/` → starts the pattern  
• `pattern` → what you want to match  
• `/` → ends the pattern  
• `flags` → options like global, case-insensitive, etc.

Example:
```
/hello/g
```
This searches for "hello" globally in a string.

---

# Your Regex Explained

```
/[^a-z0-9]/g
```

Let's break it into **5 parts**:

---

## Part 1: The Slashes `/.../ `

```
/[^a-z0-9]/g
^         ^
|         |
start    end
```

The slashes define where the regex pattern starts and ends.

Everything between them is the **pattern**.

---

## Part 2: Square Brackets `[...]`

Square brackets create a **character set** or **character class**.

```
[abc]
```
Meaning: Match **a** OR **b** OR **c**.

Example:
```
"apple".match(/[abc]/g)
→ ["a"]
```

---

## Part 3: Ranges inside brackets `a-z` and `0-9`

Instead of writing all letters:
```
[abcdefghijklmnopqrstuvwxyz]
```

You can use a **range**:
```
[a-z]
```

Same for numbers:
```
[0-9]
```

Combined:
```
[a-z0-9]
```
Meaning: Match **any lowercase letter** OR **any digit**.

Examples matched:
• a, b, c, ..., z  
• 0, 1, 2, ..., 9

---

## Part 4: The Caret `^` inside brackets

This is **very important**.

When `^` is **inside square brackets**, it means **NOT**.

```
[^a-z0-9]
```

Meaning:  
Match any character that is **NOT**:
• a lowercase letter (a-z)  
• a digit (0-9)

So it matches:
• Spaces → " "  
• Commas → ","  
• Colons → ":"  
• Exclamation marks → "!"  
• Question marks → "?"  
• Symbols → @ # $ % ^ & * ( ) etc.  
• Uppercase letters → Already converted by `.toLowerCase()`

---

## Part 5: The `g` Flag

```
/[^a-z0-9]/g
            ^
            |
           flag
```

`g` = **global**

Meaning: Apply the pattern to the **entire string**, not just the first match.

Without `g`:
```
"a!b!c".replace(/!/, "")
→ "ab!c"   // only first ! removed
```

With `g`:
```
"a!b!c".replace(/!/g, "")
→ "abc"    // all ! removed
```

---


# How `.replace()` uses this regex

```
s.replace(/[^a-z0-9]/g, "")
```

Step-by-step:

1. Find every character that is NOT a-z or 0-9  
2. Replace it with "" (empty string)  
3. Repeat for the whole string (because of `g`)

Result: Only letters and numbers remain.

---

# Live Example

Input:
```
"A man, a plan, a canal: Panama"
```

Step 1: `.toLowerCase()`
```
"a man, a plan, a canal: panama"
```

Step 2: `.replace(/[^a-z0-9]/g, "")`

Characters removed:
• " " (spaces)  
• "," (commas)  
• ":" (colon)

Result:
```
"amanaplanacanalpanama"
```


# Common Regex Flags

| Flag | Meaning |
|------|---------|
| `g` | Global (match all) |
| `i` | Case-insensitive |
| `m` | Multiline |

Example with `i` flag:
```
"Hello".match(/hello/i)
→ ["Hello"]   // matched despite different case
```

---


# Summary

Your regex:
```
/[^a-z0-9]/g
```

**Plain English meaning:**  
"Find every character that is NOT a lowercase letter or digit, and do it for the entire string."

When used with `.replace()`:
```
s.replace(/[^a-z0-9]/g, "")
```

**Plain English meaning:**  
"Remove all characters that are not letters or numbers."

---


Here are **all the regex methods** in JavaScript:

---

# Two Ways to Use Regex in JavaScript

1. **String methods** that accept regex  
2. **RegExp methods** that work on strings

---

# 1. String Methods (6 methods)

These are methods called on a **string**, and you pass a **regex** as argument.

---

### 1.1 `match()` → Find matches

Returns an **array of matches** or `null`.

```javascript
let str = "I have 2 cats and 3 dogs"
let result = str.match(/\d+/g)
console.log(result)
// Output: ["2", "3"]
```

Without `g` flag → returns first match with details:
```javascript
let result = str.match(/\d+/)
console.log(result)
// Output: ["2", index: 7, input: "I have 2 cats and 3 dogs", groups: undefined]
```

---

### 1.2 `matchAll()` → Find all matches with details

Returns an **iterator** of all matches with full details.

Must use `g` flag.

```javascript
let str = "cat bat rat"
let matches = str.matchAll(/[cbr]at/g)

for (let match of matches) {
  console.log(match)
}
// Output:
// ["cat", index: 0, input: "cat bat rat", groups: undefined]
// ["bat", index: 4, input: "cat bat rat", groups: undefined]
// ["rat", index: 8, input: "cat bat rat", groups: undefined]
```

---

### 1.3 `replace()` → Replace first or all matches

Replaces matched text with new text.

```javascript
let str = "I like cats"
let result = str.replace(/cats/, "dogs")
console.log(result)
// Output: "I like dogs"
```

With `g` flag → replace all:
```javascript
let str = "cat cat cat"
let result = str.replace(/cat/g, "dog")
console.log(result)
// Output: "dog dog dog"
```

---

### 1.4 `replaceAll()` → Replace all matches

Same as `replace()` with `g` flag, but cleaner syntax.

```javascript
let str = "cat cat cat"
let result = str.replaceAll(/cat/g, "dog")
console.log(result)
// Output: "dog dog dog"
```

Note: Must use `g` flag with regex in `replaceAll()`.

---

### 1.5 `search()` → Find index of first match

Returns the **index** of the first match, or `-1` if not found.

```javascript
let str = "Hello World"
let index = str.search(/World/)
console.log(index)
// Output: 6
```

Not found example:
```javascript
let index = str.search(/xyz/)
console.log(index)
// Output: -1
```

---

### 1.6 `split()` → Split string by pattern

Splits a string into an **array** based on a regex pattern.

```javascript
let str = "apple,banana;orange|grape"
let result = str.split(/[,;|]/)
console.log(result)
// Output: ["apple", "banana", "orange", "grape"]
```

Explanation:  
Split by `,` OR `;` OR `|`.

---

# 2. RegExp Methods (2 methods)

These are methods called on a **regex object**, and you pass a **string** as argument.

---

### 2.1 `test()` → Check if pattern exists

Returns `true` or `false`.

```javascript
let regex = /\d+/
let result = regex.test("I have 5 apples")
console.log(result)
// Output: true
```

Not found:
```javascript
let result = regex.test("No numbers here")
console.log(result)
// Output: false
```

**Best for:** Simple yes/no checks (validation).

---

### 2.2 `exec()` → Get detailed match info

Returns an **array** with match details, or `null`.

```javascript
let regex = /\d+/
let result = regex.exec("I have 25 apples")
console.log(result)
// Output: ["25", index: 7, input: "I have 25 apples", groups: undefined]
```

With `g` flag → call multiple times to get each match:
```javascript
let regex = /\d+/g
let str = "I have 2 cats and 3 dogs"

let match
while ((match = regex.exec(str)) !== null) {
  console.log(match[0], "at index", match.index)
}
// Output:
// "2" at index 7
// "3" at index 18
```



# Practical Examples

### Example 1: Validate Email (test)
```javascript
let email = "test@example.com"
let isValid = /^[\w.-]+@[\w.-]+\.\w+$/.test(email)
console.log(isValid)
// Output: true
```

---

### Example 2: Extract Numbers (match)
```javascript
let str = "Price: $25, Discount: $5"
let numbers = str.match(/\d+/g)
console.log(numbers)
// Output: ["25", "5"]
```

---

### Example 3: Remove Extra Spaces (replace)
```javascript
let str = "hello    world"
let result = str.replace(/\s+/g, " ")
console.log(result)
// Output: "hello world"
```

---

### Example 4: Split by Multiple Delimiters (split)
```javascript
let str = "a,b;c|d"
let result = str.split(/[,;|]/)
console.log(result)
// Output: ["a", "b", "c", "d"]
```

---

### Example 5: Find Word Position (search)
```javascript
let str = "JavaScript is awesome"
let index = str.search(/awesome/)
console.log(index)
// Output: 14
```

---


# 1. `.` → Any Single Character

The dot matches **any single character** (except newline).

Example:
```javascript
let str = "cat cot cut"
let result = str.match(/c.t/g)
console.log(result)
// Output: ["cat", "cot", "cut"]
```

Explanation:
• `c.t` means: "c" + any character + "t"  
• "cat" → c + a + t ✓  
• "cot" → c + o + t ✓  
• "cut" → c + u + t ✓

---

# 2. `\d` → Any Digit (0-9)

Matches any **single digit**.

Same as `[0-9]`.

Example:
```javascript
let str = "I have 3 cats and 12 dogs"
let result = str.match(/\d/g)
console.log(result)
// Output: ["3", "1", "2"]
```

To match **full numbers** (one or more digits):
```javascript
let result = str.match(/\d+/g)
console.log(result)
// Output: ["3", "12"]
```

---

# 3. `\D` → Any Non-Digit

Matches anything that is **NOT a digit**.

Example:
```javascript
let str = "Phone: 123-456"
let result = str.match(/\D/g)
console.log(result)
// Output: ["P", "h", "o", "n", "e", ":", " ", "-"]
```

Explanation:  
All letters, spaces, colons, and hyphens are matched.  
Only digits (1, 2, 3, 4, 5, 6) are NOT matched.

---

# 4. `\w` → Any Word Character

Matches **letters**, **digits**, and **underscores**.

Same as `[a-zA-Z0-9_]`.

Example:
```javascript
let str = "hello_world123!"
let result = str.match(/\w/g)
console.log(result)
// Output: ["h", "e", "l", "l", "o", "_", "w", "o", "r", "l", "d", "1", "2", "3"]
```

Explanation:  
The `!` is NOT matched because it's not a word character.

---

# 5. `\W` → Any Non-Word Character

Matches anything that is **NOT a letter, digit, or underscore**.

Example:
```javascript
let str = "hello@world.com"
let result = str.match(/\W/g)
console.log(result)
// Output: ["@", "."]
```

Explanation:  
Only `@` and `.` are matched (not letters).

---

# 6. `\s` → Any Whitespace

Matches **spaces**, **tabs**, **newlines**.

Example:
```javascript
let str = "hello world\thow\nare you"
let result = str.match(/\s/g)
console.log(result)
// Output: [" ", "\t", "\n", " "]
```

Explanation:
• " " → space  
• "\t" → tab  
• "\n" → newline

---

# 7. `\S` → Any Non-Whitespace

Matches anything that is **NOT a whitespace**.

Example:
```javascript
let str = "a b c"
let result = str.match(/\S/g)
console.log(result)
// Output: ["a", "b", "c"]
```

Explanation:  
Spaces are NOT matched. Only letters are matched.

---

# 8. `+` → One or More

Matches **one or more** of the previous character/pattern.

Example:
```javascript
let str = "goooooal"
let result = str.match(/o+/g)
console.log(result)
// Output: ["ooooo"]
```

Explanation:  
`o+` matches one or more "o" characters together.

Another example:
```javascript
let str = "I have 100 apples and 5 oranges"
let result = str.match(/\d+/g)
console.log(result)
// Output: ["100", "5"]
```

---

# 9. `*` → Zero or More

Matches **zero or more** of the previous character/pattern.

Example:
```javascript
let str = "ca caat caaaaaat"
let result = str.match(/ca*/g)
console.log(result)
// Output: ["ca", "caa", "caaaaaaa"]
```

Wait, let's try a better example:
```javascript
let str = "c ca caa caaa"
let result = str.match(/ca*/g)
console.log(result)
// Output: ["c", "ca", "caa", "caaa"]
```

Explanation:
• "c" → c + zero a's ✓  
• "ca" → c + one a ✓  
• "caa" → c + two a's ✓  
• "caaa" → c + three a's ✓

---

# 10. `?` → Zero or One

Matches **zero or one** of the previous character (makes it optional).

Example:
```javascript
let str = "color colour"
let result = str.match(/colou?r/g)
console.log(result)
// Output: ["color", "colour"]
```

Explanation:
• `colou?r` means: "u" is optional  
• "color" → no u ✓  
• "colour" → one u ✓

---

# 11. `{n}` → Exactly n Times

Matches **exactly n occurrences** of the previous character.

Example:
```javascript
let str = "aaa aaaa aaaaa"
let result = str.match(/a{4}/g)
console.log(result)
// Output: ["aaaa", "aaaa"]
```

Explanation:
• First "aaa" → only 3 a's ✗  
• "aaaa" → exactly 4 a's ✓  
• "aaaaa" → has 4 a's inside ✓ (matches first 4)

---

# 12. `{n,m}` → Between n and m Times

Matches **between n and m occurrences**.

Example:
```javascript
let str = "a aa aaa aaaa aaaaa"
let result = str.match(/a{2,4}/g)
console.log(result)
// Output: ["aa", "aaa", "aaaa", "aaaa"]
```

Explanation:
• "a" → only 1 ✗  
• "aa" → 2 a's ✓  
• "aaa" → 3 a's ✓  
• "aaaa" → 4 a's ✓  
• "aaaaa" → first 4 matched ✓

---

# 13. `^` → Start of String (Outside Brackets)

Matches the **beginning** of a string.

Example:
```javascript
let str = "hello world"
let result = str.match(/^hello/)
console.log(result)
// Output: ["hello"]
```

Another example:
```javascript
let str = "world hello"
let result = str.match(/^hello/)
console.log(result)
// Output: null (because "hello" is not at the start)
```

---

# 14. `$` → End of String

Matches the **end** of a string.

Example:
```javascript
let str = "hello world"
let result = str.match(/world$/)
console.log(result)
// Output: ["world"]
```

Another example:
```javascript
let str = "world hello"
let result = str.match(/world$/)
console.log(result)
// Output: null (because "world" is not at the end)
```

---



# Practical Examples

### Example 1: Validate Phone Number (10 digits)
```javascript
let phone = "9876543210"
let isValid = /^\d{10}$/.test(phone)
console.log(isValid)
// Output: true
```

Explanation:
• `^` → start  
• `\d{10}` → exactly 10 digits  
• `$` → end

---

### Example 2: Find All Words
```javascript
let str = "Hello World 123"
let words = str.match(/\w+/g)
console.log(words)
// Output: ["Hello", "World", "123"]
```

---

### Example 3: Remove All Spaces
```javascript
let str = "h e l l o"
let result = str.replace(/\s/g, "")
console.log(result)
// Output: "hello"
```

---

### Example 4: Check if String Starts with "Hello"
```javascript
let str = "Hello World"
let startsWithHello = /^Hello/.test(str)
console.log(startsWithHello)
// Output: true
```

---

### Example 5: Check if String Ends with a Number
```javascript
let str = "Order123"
let endsWithNumber = /\d$/.test(str)
console.log(endsWithNumber)
// Output: true
```

---
