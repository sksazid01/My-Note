# [125](https://leetcode.com/problems/valid-palindrome/)
## Find out if the character belongs to the capital or small letter range.

* wrong:   if ((s[i] <= 'z' and s[i] >= 'A'))
* correct:  if ((s[i] <= 'Z' and s[i] >= 'A') or (s[i] <= 'z' and s[i] >= 'a'))
<img width="750" height="800" alt="Screenshot from 2025-10-24 22-50-13" src="https://github.com/user-attachments/assets/01ad62fd-1e60-42db-b3bc-2fc4c36cd538" />

## check, A character is  Alphanumeric or not.  ( Alphanumeric characters include letters and numbers.)
* function: **isalnum(char)** returns true if the character is Alphanumeric.

---

# [167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
* must be typecast here if we want to use it inside vector<int> ()
* **(int)(it-numbers.begin())+1**: because, add +1 because the problem statement uses 1-indexed positions.
* <img width="416" height="80" alt="image" src="https://github.com/user-attachments/assets/9a2b4b67-fa06-46ea-ab4b-06548a02b3d8" />


# [228](https://leetcode.com/problems/summary-ranges/?envType=study-plan-v2&envId=top-interview-150)
- num[i+1]-num[i] == 1 may overflow.
<img width="1699" height="879" alt="image" src="https://github.com/user-attachments/assets/d6edaa80-1ce4-45fd-825e-6e6c79f50ace" />
