# Bit Manipulation

## Bit Flips Between Strings
**Given two binary string A,B. Find the minimum number of bit flips to change string A to string B.**

## Character Count in String
**int solve(string s, char c) {**
```cpp
int cnt = 0;
for(auto cc:s) cnt += (cc==c);
return cnt;
```
