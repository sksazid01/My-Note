# Arrays & Hashing

## Stock Profit Problem
**Q. Given an array of numbers indicating stock price of n consecutive days. If you buy stock at one day and sell at any later day what is the maximum profit that you can get?**

```cpp
int maxProfit(vector<int>& prices) {
    int buy = prices[0];
    int profit = 0;
    for(int i=1;i<prices.size();i++){
        profit = max(profit, prices[i] - buy);
        buy = min(buy, prices[i]);
    }
    return profit;
}
```

## Move Zeroes
**Q. Given an array of n integers. You need to take all zeroes in an array to the end without changing the relative order of the remaining element. eg: [2,0,0,3,1,0,5] => [2,3,1,5,0,0,0]**

```cpp
void moveZeroes(vector<int>& nums) {
   int n = nums.size(), snowBallSize = 0;
   for(int i=0; i<n; i++){
       if(!nums[i])snowBallSize++;
       else if(snowBallSize){
           swap(nums[i], nums[i-snowBallSize]);
       }
   }
}
```

## Group Anagrams
**Q. Given an array of strings strs, group the anagrams together**

**E.g. ["cat","tab","act","bat","taco"] => [{"cat","act"},{"tab","bat"},{"taco"}]**

```cpp
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    map<vector<int>, vector<string>> ans;
    
    for(auto &st: strs){
        vector<int>mp(26, 0);
        for(auto &it: st){
            mp[it-'a']++;
        }
        ans[mp].push_back(st);
    }
    vector<vector<string>>res;
    for(auto &[v1, v2]: ans)res.push_back(v2);
    
    return res;
}
```

## Kth Largest Element
**Q. Given an array of n integers. Find the kth largest element in the array.**

```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int,vector<int>,greater<int>>pq;
    
    for(int i = 0;i<k;i++){
        pq.push(nums[i]);
    }
    
    for(int i = k;i<nums.size();i++){
        int element = nums[i];
        
        if(element > pq.top()){
            pq.pop();
            pq.push(element);
        }
    }
    
    return pq.top();
}
```

## Find Common Elements
**Q. Given two array of integers. Find the common elements between them.**

## Majority Element
**Given an integer array of size n, find all elements that appear more than ⌊n/3⌋ times.**

```cpp
class Solution {
public:
    vector<int> majorityElement(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        vector<int> majors;
        int count = 1;
        
        for(int i = 1; i < nums.size(); i++){
            if( nums[i] != nums[i-1] ){
                if( count > nums.size()/3 ) majors.push_back(nums[i-1]);
                count = 0;
            }
            count++;
        }
        
        if( count > nums.size()/3 ) majors.push_back(nums.back());
        return majors;
    }
};
```

## Character Frequency
**Given a string, find the character with the highest frequency and print both the character and its count.**
- Input: aaabccd
- Output: a 3

## Unique Characters Count
**Given a string of lowercase characters. Find the count of characters which only occured once in the string.**

```cpp
int solve(string s) {
    sort(s.begin(),s.end());
    int unik = 0;
    int cnt = 1;
    for(int i=1;i<s.size();i++){
        if( s[i] != s[i-1] ){
            unik += (cnt == 1);
            cnt = 0;
        }
        cnt++;
    }
    unik += (cnt == 1);
    return unik;
}
```

## Sort by Frequency
**Sort array elements by their frequency and in case of tie, keep the order they arrive in the original array.**

**Given an integer array. Sort the array in nondecreasing order using frequency count of elements in the array.**

## Subarray with Divisible Sum
**Given an array of positive integers and a integer p. Find the length of the minimum subarray upon deleting which the sum of remaining element will be divisible by p;**

Follow up 1: find the number of subarray (need not be minimum) deleting which will result the sum to be divisible by p

Follow up 2: For each index find the number of times it is included in any subarray upon deleting which the remaining sum will be divisible by p

## Max Subarray Sum with Delete
**Given an array of n integers. Find max subarray sum with at most one delete.**

## Subarray with Range Condition
**Given an array of n integers. Find the number of subarrays where the maximum element is between x and y**

## Array to Indices
**Given an array having 0 to n-1 unsorted. Return a new array having their indices**

## Maximum Product Pair
**Input given is an int array, which may or may not contain positive, negative or zero values. Write a program to find out the two numbers which gives the highest product.**

## Valid Anagram
**Given two strings s and t, return true if t is an anagram of s, and false otherwise.**

https://leetcode.com/problems/valid-anagram/description/

## Two Sum
**Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.**

## Repeating Elements
**Print all repeating elements in an array.**

## Second Maximum
**Given an array of integers, find the second max of the array**

**Given an array of integers nums. Find the second maximum element in an array using only one loop.**

## Array Average Excluding Min/Max
**Given an array nums. Find the average of the array excluding the maximum and minimum values.**

## Array Index Difference
**Given an array of integers, calculate the absolute difference between the sum of odd-indexed and even-indexed elements.**

## Array Operations
**Given an array of integers nums. In each move pick two numbers from start and end of the array, store the smaller in output, then remove it. Repeat until empty. What will be the output array?**

## Make Array Palindrome
**Given an array of positive integers. We need to make the given array a 'Palindrome'. The only allowed operation is"merging" (of two adjacent elements). Merging two adjacent elements means replacing them with their sum. The task is to find the array of maximum length with the minimum number of merge operations required to make the given array a 'Palindrome'.**

https://www.geeksforgeeks.org/find-minimum-number-of-merge-operations-to-make-an-array-palindrome/

## Range Query Count
**Given an array of integers nums and queries in the form l, r. For each query, count the number of elements which are in range [l,r] in the array.**

## Threshold Negative Numbers
**Given an array of thresholds. For each threshold print the first negative number.**

## Array Sorting with Criteria
**Given an array of integers and a sorting criteria[asc/desc], sort the array based on the sorting criteria in either ascending or descending order**

## Make Non-Decreasing Array
**A non-decreasing array is given. A new group is formed whenever the difference between two consecutive numbers is greater than 1 (the later number starts a new group). You are allowed to remove any elements from the array to maximize the number of groups. Return the maximum number of groups you can form. Solve this for t test cases.**

https://codeforces.com/problemset/problem/2114/C

## Remove Subsegment for Non-Increasing
**You are given an array of integers. You want to make the array non increasing. To do that you can cut out a subsegment of the array to discard and concat the remaining segment(s). What is the minimum length of the cut segment to make the remaining parts nondecreasing.**

Example: [9,7,4,3,6,6,2] : we can remove the subsegment containing [4,3] to make the array [9,7,6,6,2] or remove the segment [6,6] to make the array [9,7,4,3,2]. Both of them are non increasing.

## Rotate Array
**Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.**

https://leetcode.com/problems/rotate-array/description/

## Merge Sorted Arrays
**Given two sorted arrays A and B, combine all the elements of A and B into a new sorted array C.**

**You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums1 and nums2 into a single array sorted in non-decreasing order.**

https://leetcode.com/problems/merge-sorted-array/description/

## Colored Balls in Boxes
**Given an array of n colored balls. And some boxes. Each box has some capacity and each box must contain balls of same color. What is the maximum number of balls that the boxes can carry? Constraint: max capacity of box - min capacity of box <= 1**

## Array Function
**Write a function that takes an array and a number as an argument. if the number is greater than 0, you must pop the number of elements from the array. if the number is not provided then pop once.**

## Sort Array (0,1,2)
**Given an array containing 0,1,2 sort it.**

Input: [2,0,1,1,0,2] Output: [0,0,1,1,2,2]

## Subarray Anagram
**Given two strings s1, s2, return whether a substring of s1 is an anagram of s2**

Input: s1 = "hello", s2 = "lol" Output: True
Input: s1 = "hello", s2 = "loa" Output: False
