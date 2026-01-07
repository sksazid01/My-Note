# Regular Expression (Regex) Tutorial
**Based on "Learn with Sumit" Bangla Tutorial**
[Regular Expression or regex - Bangla ( বাংলা ) Tutorial](https://www.youtube.com/watch?v=5ckmCW8png0)

## Overview

This comprehensive guide covers Regular Expressions from fundamental concepts to practical JavaScript implementation. The tutorial leverages **RegExr.com** as an interactive learning tool to demonstrate pattern matching in real-time.

---

## Table of Contents

1. [Flags and Basic Matching](#1-flags-and-basic-matching)
2. [Character Classes (Metacharacters)](#2-character-classes-metacharacters)
3. [Quantifiers](#3-quantifiers)
4. [Character Sets and Ranges](#4-character-sets-and-ranges)
5. [Anchors and Boundaries](#5-anchors-and-boundaries)
6. [Groups and Alternation](#6-groups-and-alternation)
7. [JavaScript Implementation](#7-javascript-implementation)
8. [Best Practices](#8-best-practices)

---

## 1. Flags and Basic Matching

Flags modify how the regex engine interprets patterns.

### Common Flags

| Flag | Name | Description |
|------|------|-------------|
| `i` | Case-insensitive | Matches regardless of letter case |
| `g` | Global | Finds all matches, not just the first |
| `m` | Multiline | `^` and `$` match line boundaries |
| `s` | DotAll | `.` matches newline characters |

### Examples

```javascript
// Literal match (case-sensitive)
/hello/
// Matches: "hello" only

// Case-insensitive
/hello/i
// Matches: "hello", "Hello", "HELLO"

// Global search
/hello/g
// Matches: All occurrences of "hello"

// Combined flags
/hello/ig
// Matches: All occurrences, case-insensitive
```

---

## 2. Character Classes (Metacharacters)

Metacharacters are shortcuts for common character types.

### Reference Table

| Metacharacter | Matches | Example |
|---------------|---------|---------|
| `\w` | Word characters (a-z, A-Z, 0-9, _) | `/\w+/` → "hello123" |
| `\W` | Non-word characters | `/\W/` → "@", "!" |
| `\d` | Digits (0-9) | `/\d+/` → "12345" |
| `\D` | Non-digits | `/\D/` → "a", "!" |
| `\s` | Whitespace (space, tab, newline) | `/\s/` → " ", "\t" |
| `\S` | Non-whitespace | `/\S/` → "a", "1" |
| `.` | Any character (except newline) | `/./` → "a", "1", "@" |

### Practical Example

```javascript
// Match phone number format: 01711-888999
/\d\d\d\d\d-\d\d\d\d\d\d/

// Or using quantifiers (see next section):
/\d{5}-\d{6}/
```

---

## 3. Quantifiers

Quantifiers specify how many times a pattern should match.

### Quantifier Reference

| Quantifier | Meaning | Example |
|------------|---------|---------|
| `+` | One or more | `/\d+/` → "123" |
| `*` | Zero or more | `/\d*/` → "", "123" |
| `?` | Zero or one (optional) | `/colou?r/` → "color", "colour" |
| `{n}` | Exactly n times | `/\d{3}/` → "123" |
| `{n,m}` | Between n and m times | `/\d{3,5}/` → "123", "12345" |
| `{n,}` | n or more times | `/\d{3,}/` → "123", "123456" |

### Examples

```javascript
// Phone number (simplified)
/\d{5}-\d{6}/
// Matches: "01711-888999"

// Optional character
/colou?r/
// Matches: "color" AND "colour"

// One or more digits
/\d+/
// Matches: "5", "123", "9876543210"

// HTML tag
/<\w+>/
// Matches: "<div>", "<span>", "<p>"
```

---

## 4. Character Sets and Ranges

Square brackets `[]` define custom character sets.

### Syntax

| Pattern | Meaning | Example |
|---------|---------|---------|
| `[abc]` | Matches a, b, OR c | `/[abc]/` → "a" |
| `[^abc]` | Matches anything EXCEPT a, b, c | `/[^abc]/` → "d", "1" |
| `[a-z]` | Any lowercase letter | `/[a-z]/` → "a" to "z" |
| `[A-Z]` | Any uppercase letter | `/[A-Z]/` → "A" to "Z" |
| `[0-9]` | Any digit | `/[0-9]/` → same as `\d` |
| `[a-zA-Z]` | Any letter | `/[a-zA-Z]/` → all letters |
| `[a-zA-Z0-9]` | Alphanumeric | `/[a-zA-Z0-9]/` → letters + digits |

### Examples

```javascript
// Match vowels only
/[aeiou]/
// Matches: "a", "e", "i", "o", "u"

// Match anything except vowels
/[^aeiou]/
// Matches: "b", "c", "d", "1", "@"

// Hexadecimal digits
/[0-9A-Fa-f]/
// Matches: "0" to "9", "A" to "F" (case-insensitive)

// Escape special characters inside sets
/[.+*?]/
// Matches: literal ".", "+", "*", "?"

// Match a literal dot outside a set
/\./
// Matches: "." (the actual dot character)
```

---

## 5. Anchors and Boundaries

Anchors don't match characters—they match positions.

### Anchor Reference

| Anchor | Meaning | Example |
|--------|---------|---------|
| `^` | Start of string/line | `/^hello/` → "hello world" ✓ |
| `$` | End of string/line | `/world$/` → "hello world" ✓ |
| `\b` | Word boundary | `/\bcat\b/` → "cat" but not "category" |
| `\B` | Non-word boundary | `/\Bcat\B/` → "scat" in "scatter" |

### Examples

```javascript
// Match only if "hello" is at the start
/^hello/i
// Matches: "Hello world" ✓
// Not: "Say hello" ✗

// Match only if "world" is at the end
/world$/
// Matches: "Hello world" ✓
// Not: "world peace" ✗

// Strict full-string match for phone number
/^\d{5}-\d{6}$/
// Matches: "01711-888999" ✓
// Not: "Call 01711-888999 now" ✗

// Word boundaries
/\bcat\b/
// Matches: "cat" in "the cat sat" ✓
// Not: "cat" in "category" ✗
```

---

## 6. Groups and Alternation

Groups allow you to organize patterns and create alternatives.

### Syntax

| Pattern | Description | Example |
|---------|-------------|---------|
| `(abc)` | Capturing group | `/(hello)/` → captures "hello" |
| `(?:abc)` | Non-capturing group | `/(?:hello)/` → matches but doesn't capture |
| `x\|y` | Alternation (OR) | `/cat\|dog/` → "cat" OR "dog" |

### Examples

```javascript
// Match file extensions
/file\.(mp3|jpg|png)/
// Matches: "file.mp3", "file.jpg", "file.png"

// Match color/colour with grouping
/col(?:ou)?r/
// Matches: "color", "colour"

// Capture groups for extraction
/(\d{5})-(\d{6})/
// Matches: "01711-888999"
// Group 1: "01711"
// Group 2: "888999"

// Multiple alternatives
/(cat|dog|bird)/
// Matches: "cat", "dog", OR "bird"

// Complex alternation
/^(https?|ftp):\/\//
// Matches: "http://", "https://", OR "ftp://"
```

---

## 7. JavaScript Implementation

### Method 1: `regex.exec()`

Returns match details as an array, or `null` if no match.

```javascript
const regex = /hello/i;
const text = "Hello world, hello universe";

const result = regex.exec(text);
console.log(result);
/*
Output:
[
  'Hello',
  index: 0,
  input: 'Hello world, hello universe',
  groups: undefined
]
*/
```

**Best for:** Extracting detailed match information with position.

---

### Method 2: `regex.test()`

Returns `true` or `false` for simple validation.

```javascript
const regex = /hello/i;

console.log(regex.test("Hello world")); // true
console.log(regex.test("Goodbye"));     // false
```

**Best for:** Quick validation checks.

---

### Method 3: `string.match()`

Returns array of matches. Behavior varies with `/g` flag.

```javascript
const text = "Hello world, hello universe";

// Without 'g' flag (returns match details like exec)
console.log(text.match(/hello/i));
// ['Hello', index: 0, input: '...', groups: undefined]

// With 'g' flag (returns all matches)
console.log(text.match(/hello/ig));
// ['Hello', 'hello']
```

**Best for:** Extracting multiple matches.

---

### Method 4: `string.replace()`

Replaces matched patterns with new strings.

```javascript
const text = "I have a cat and a CAT.";

// Simple replacement
const result = text.replace(/cat/ig, "dog");
console.log(result);
// "I have a dog and a dog."

// Using capture groups
const phone = "Call me at 01711-888999";
const formatted = phone.replace(/(\d{5})-(\d{6})/, "($1) $2");
console.log(formatted);
// "Call me at (01711) 888999"
```

**Best for:** Text transformation and substitution.

---

### Method 5: `string.search()`

Returns index of first match, or `-1` if not found.

```javascript
const text = "Please find matches";

console.log(text.search(/find/)); // 7
console.log(text.search(/lost/)); // -1
```

**Best for:** Finding position of a pattern.

---

### Method 6: `string.split()`

Splits string using regex as delimiter.

```javascript
const text = "apple,banana;orange:grape";

// Split on multiple delimiters
const fruits = text.split(/[,;:]/);
console.log(fruits);
// ['apple', 'banana', 'orange', 'grape']
```

**Best for:** Parsing structured text.

---

## 8. Best Practices

### ✅ Do's

```javascript
// ✓ Use anchors for strict validation
/^\d{3}-\d{4}$/  // Exact format only

// ✓ Escape special characters
/\./  // Match literal dot
/\?/  // Match literal question mark

// ✓ Use non-capturing groups when you don't need to extract
/(?:http|https):\/\//

// ✓ Test patterns thoroughly
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### ❌ Don'ts

```javascript
// ✗ Don't forget the 'g' flag for multiple replacements
text.replace(/cat/, "dog");  // Only replaces first occurrence

// ✗ Don't use regex for HTML/XML parsing
// Use proper parsers instead

// ✗ Don't make patterns too complex
// Break them down or add comments
```

### Performance Tips

- Use specific patterns over generic ones: `/\d+/` instead of `/.+/`
- Place fixed strings first: `/hello\d+/` faster than `/\d+hello/`
- Avoid excessive backtracking with nested quantifiers
- Use non-capturing groups `(?:)` when you don't need the capture

---

## Quick Reference Card

```javascript
// Character Classes
\w  Word character       \W  Non-word
\d  Digit                \D  Non-digit
\s  Whitespace           \S  Non-whitespace
.   Any character

// Quantifiers
+   1 or more           {n}    Exactly n
*   0 or more           {n,m}  Between n and m
?   0 or 1 (optional)   {n,}   n or more

// Anchors
^   Start of string     \b  Word boundary
$   End of string       \B  Non-word boundary

// Groups
(x)    Capturing         [xyz]   Character set
(?:x)  Non-capturing     [^xyz]  Negated set
x|y    Alternation

// Flags
i   Case-insensitive    m   Multiline
g   Global              s   DotAll
```

---

## Common Use Cases

### Email Validation (Simple)

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test("user@example.com")); // true
```

### Phone Number Extraction

```javascript
const phone = "Contact: 01711-888999 or 01812-345678";
const numbers = phone.match(/\d{5}-\d{6}/g);
console.log(numbers); // ['01711-888999', '01812-345678']
```

### URL Validation

```javascript
const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/.*)?$/;
console.log(urlRegex.test("https://example.com")); // true
```

### Password Strength (at least 8 chars, 1 number, 1 uppercase)

```javascript
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
console.log(passwordRegex.test("Password123")); // true
```

---

## Additional Resources

- **Practice:** [RegExr.com](https://regexr.com/) - Interactive regex tester
- **Learn:** [Regex101.com](https://regex101.com/) - With detailed explanations
- **Test:** [RegexPal.com](https://www.regexpal.com/) - Quick testing tool

---

*This guide is based on the Bangla tutorial by "Learn with Sumit". For the complete video tutorial, visit the original source.*
