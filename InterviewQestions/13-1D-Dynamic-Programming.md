# 1-D Dynamic Programming

## Fibonacci Number
**def fn(n):**
```python
if n == 0:
    return 0
return n + fn(n-1)
```

**Given the above function, rename the function according to what the function tries to achive.**

**2nd Iteration: Write the same function but in a iterative manner. Does the both implementations have same Time Complexity and Space Complxity?**

**Answer:** Write down the stack trace of the recursive function and try to speak aloud while doing so. After getting what the function returns, rename the function accordingly. For the second iterations, a simple loop will be the answer. However, think deeply about the fundamental difference between the two implementations. One of the implementation uses a Data structure, one doesn't. So their space complexity won't be same.

## Fibonacci Time Complexity
**What is the time complexity of the following code?**

```cpp
int fun(int n) {
    if(n <= 1) return n;
    int x = fun(n - 1);
    int y = fun(n - 2);
    return x + y;
}
```

## Sum of Even Fibonacci
**Given an positive integer n. Find the sum of even fibonacchi number upto nth term.**

```cpp
long long solve(int n){
    if(n == 1 or n == 2) return 0;
    long long sum = 0, first = 1, second = 1;
    for(int fib=2;fib<n;fib++){
        long long temp = first;
        first = second;
        second = temp + second;
        if(second % 2 == 0) sum += second;
    }
    return sum;
}
```

## Fibonacci Number (LeetCode)
**Given n, calculate the nth Fibonacci number F(n).**

https://leetcode.com/problems/fibonacci-number/description/

## Knapsack Problem
**A dynamic programming problem.(Similar to 0/1 knapsack)**

## Range Query Average
**Given a array of numbers. You have to perform a number of queries. Each queries ask for the average of numbers from a range.**

## Digital Root
**Given an integer num, repeatedly add all its digits until the result has only one digit, and return it. (It is called the digital root of the number)**

```cpp
class Solution {
public:
    int addDigits(int num) {
        if( num < 10 ) return num;
        int root = 0;
        while(num){
            root += num%10;
            num /= 10;
        }
        return addDigits(root);
    }
};
```

## Palindrome Number
**Given an integer x, return true if x is a palindrome, and false otherwise.**

https://leetcode.com/problems/palindrome-number/description/

## Longest Repeating Prefix
**Given a lowercase string s, find the length L of the longest prefix p such that the entire string is exactly p repeated k times for some integer k ≥ 2. If no such prefix exists, return -1.**

For string: "ababab", L = 2; for "aaaaaa", L = 3; for "abcd", L = -1.

**[Complexity: O(n^2)]**
n = |s|.
For L from n/2 down to 1:
    If (n mod L ≠ 0) skip L.
    Check if s[0..L-1] is repeated n/L times.
    If yes, return L.
return -1

**Use KMP algorithm to build the LPS array. Use the last value of the LPS array to find the answer. [Complexity: O(n)]**

```cpp
int n = s.length();
computeLsa(s);
int d = n - lsa[n - 1];
if (n % d != 0 || d == n) return -1;
else {
    int ans = floor(n / (2 * d)) * d;
    if(n % ans != 0) return -1;
    else return ans;
}
```
