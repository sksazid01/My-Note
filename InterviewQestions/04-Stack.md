# Stack

## Delete Middle Element of Stack
**Write a code to delete the middle element of a stack without using any additional data structure while preserving the original order. Input: [1, 2, 3, 4, 5]. Output: [1, 2, 4, 5]**

## Remove K Digits
**Given string num representing a non-negative integer num, and an integer k, return the smallest possible integer after removing k digits from num.**

https://leetcode.com/problems/remove-k-digits/description/

```cpp
class Solution {
public:
    string removeKdigits(string num, int k) {
        string newNum = "";
        // remove digits that are greater than the next digit
        for(int i=0;i<num.size();i++){
            while( k and newNum.size() and newNum.back() > num[i] ){
                k--;
                newNum.pop_back();
            }
            newNum += num[i];
        }
        // remove leading zeros
        reverse(newNum.begin(),newNum.end());
        while( newNum.size() and newNum.back() == '0' ) newNum.pop_back();
        reverse(newNum.begin(),newNum.end());
        // remove remaining k digits if any
        while(k and newNum.size()) {
            newNum.pop_back();
            k--;
        }
        // if newNum is empty, return 0
        if( newNum.size() == 0 ) newNum = "0";
        return newNum;
    }
};
```

## Largest Rectangle in Histogram
**Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.**

https://leetcode.com/problems/largest-rectangle-in-histogram/description/

## Valid Parentheses
**Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.**

## Decode String
**Given an encoded string, return its decoded string.**

**The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times.**

https://leetcode.com/problems/decode-string/description/
