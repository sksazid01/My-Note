# Two Pointers

## Reorder Even and Odd
**Q. Given an array of n integers. Reorder the elements such that all odd numbers occur after even numbers.**

```cpp
void reorderEvenOdd(vector<int>& arr) {
   if(arr.isEmpty())return;
   int left = 0;
   int right = arr.size() - 1;
   while (left < right) {
       // Increment left index while we see even numbers
       while (left < right && arr[left] % 2 == 0) {
           left++;
       }
       // Decrement right index while we see odd numbers
       while (left < right && arr[right] % 2 != 0) {
           right--;
       }
       if (left < right) {
           swap(arr[left], arr[right]);
           left++;
           right--;
       }
   }
}
```

`left` moves forward until it finds an odd number (something that shouldn't be on the left).
`right` moves backward until it finds an even number (something that shouldn't be on the right).
Then it swaps those two, and continues.

Alternative approach:
```cpp
partition(numbers.begin(), numbers.end(), [](int n) {
    return n % 2 == 0;
});
```

## Find Pairs in Doubly Linked List
**Q. Find pairs with given target sum in a doubly linked list.**

Input: 
1 <> 2 <> 4 <> 5 <> 6 <> 8 <> 9
target = 7

Output: 
(1,6), (2,5)

## Boats to Save People
**You are given an array people and an integer limit, where people[i] is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of limit. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most limit.**

**Return the minimum number of boats to carry every given person.**

## Remove Nth Node from End
**Given the head of a linked list, remove the nth node from the end of the list and return its head.**

```cpp
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* slow=head;
        ListNode* fast = head;
        
        for(int i=0; i<n; i++){
            fast = fast ->next;
        }
        
        if(fast == nullptr) return head ->next;
        while(fast->next !=nullptr){
            slow = slow ->next;
            fast = fast ->next;
        }
        
        slow->next = slow ->next->next;
        
        return head;
    }
};
```
