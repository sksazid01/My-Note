[Regular Expression or regex - Bangla ( বাংলা ) Tutorial](https://www.youtube.com/watch?v=5ckmCW8png0)

The video is a Bangla tutorial by "Learn with Sumit" that covers Regular Expressions from basic syntax to practical JavaScript implementation, using visual examples on Regexr.com.

Since the video primarily uses the interactive tool **Regexr.com** to demonstrate patterns rather than a single source file, the "code" below represents the regex patterns and JavaScript examples demonstrated in the tutorial.

-----

# Regular Expression (Regex) Tutorial Code

## 1\. Basic Patterns & Flags

The tutorial starts with simple matching and the use of flags.

```javascript
// 1. Literal Match
// Pattern: /hello/
// Matches "hello" in text (case-sensitive)

// 2. Case Insensitive Flag (i)
// Pattern: /hello/i
// Matches: "Hello", "HELLO", "hello"

// 3. Global Flag (g)
// Pattern: /hello/g
// Matches all occurrences of "hello" in the text, not just the first one.

// 4. Combined Flags
// Pattern: /hello/ig
// Matches all occurrences, case-insensitive.
```

## 2\. Character Classes (Meta Characters)

Shortcuts to match specific types of characters.

```javascript
/*
  \w  - Matches any word character (a-z, A-Z, 0-9, and _)
  \W  - Matches any NON-word character (symbols, spaces, punctuation)
  \d  - Matches any digit (0-9)
  \D  - Matches any NON-digit
  \s  - Matches any whitespace (space, tab, newline)
  \S  - Matches any NON-whitespace
  .   - (Dot) Matches ANY character except a newline
*/

// Example: Match a phone number format like 01711-888999
// Pattern: /\d\d\d\d\d-\d\d\d\d\d\d/
```

## 3\. Quantifiers

Used to specify how many times a character should occur.

```javascript
/*
  +   - Matches 1 or more times
  * - Matches 0 or more times
  ?   - Matches 0 or 1 time (optional)
  {n} - Matches exactly n times
  {n,m} - Matches between n and m times
  {n,} - Matches n or more times
*/

// Example: Simplify the phone number match
// Pattern: /\d{5}-\d{6}/
// Matches: "01711-888999"

// Example: Optional 'u' in colour
// Pattern: /colou?r/
// Matches: "color" and "colour"
```

## 4\. Character Sets & Ranges

Using square brackets `[]` to define specific allowed characters.

```javascript
/*
  [abc]   - Matches either a, b, or c
  [^abc]  - Matches anything EXCEPT a, b, or c (Negation)
  [a-z]   - Matches any lowercase letter
  [A-Z]   - Matches any uppercase letter
  [0-9]   - Matches any digit
  [a-zA-Z]- Matches any letter (case insensitive range)
*/

// Example: Match explicit vowels
// Pattern: /[aeiou]/

// Example: Match literal special characters (requires escape \)
// Pattern: /\./ 
// Matches: "." (dot) matches the actual dot character
```

## 5\. Anchors & Boundaries

Restricting where matches can happen.

```javascript
/*
  ^   - Carret: Matches the START of the string (or line with m flag)
  $   - Dollar: Matches the END of the string
  \b  - Word Boundary: Matches the position where a word starts or ends
  \B  - Non-word Boundary
*/

// Example: Match "hello" only if it's the very first word
// Pattern: /^hello/i
```

## 6\. Groups & Capturing

Grouping parts of a pattern together.

```javascript
/*
  (abc) - Capturing group: Matches "abc" and remembers it
  (?:abc) - Non-capturing group: Matches but doesn't remember
  x|y   - OR operator: Matches x OR y
*/

// Example: Match "file.mp3" or "file.jpg"
// Pattern: /file\.(mp3|jpg|png)/
```

## 7\. JavaScript Implementation

How to use these patterns in actual JavaScript code, as shown in the latter part of the tutorial.

### Method 1: `regex.exec()`

Returns an array of details if found, or null.

```javascript
const regex = /hello/i;
const text = "Hello world, hello universe";

const result = regex.exec(text);
console.log(result);
// Output: ['Hello', index: 0, input: 'Hello world, hello universe', groups: undefined]
```

### Method 2: `regex.test()`

Returns `true` or `false` (Boolean). Best for validation.

```javascript
const regex = /hello/i;
const result = regex.test("Hello world");
console.log(result); // Output: true
```

### Method 3: `string.match()`

Returns an array of matches.

```javascript
const text = "Hello world, hello universe";
const result = text.match(/hello/ig); 
console.log(result); // Output: ['Hello', 'hello']
```

### Method 4: `string.replace()`

Replaces matches with a new string.

```javascript
const text = "I have a cat and a CAT.";
// Replace 'cat' (case insensitive) with 'dog'
const newText = text.replace(/cat/ig, "dog");
console.log(newText); // Output: "I have a dog and a dog."
```

### Method 5: `string.search()`

Returns the index of the match, or -1 if not found.

```javascript
const text = "Please find matches";
const index = text.search(/find/);
console.log(index); // Output: 7
```


