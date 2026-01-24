# Backtracking

## Generate All Permutations
**Given an array of integers. Generate all possible permutation of the given array.**

```cpp
class Solution {
public:
    vector<vector<int>> perms;
    
    void backtrack(vector<int>& nums, vector<int> &perm, int rem){
        if( rem == 0 ){
            perms.push_back(perm);
            return;
        }
        for(int i=0;i<nums.size();i++){
            if( nums[i] == 69 ) continue;
            perm.push_back(nums[i]);
            nums[i] = 69;
            backtrack(nums,perm,rem-1);
            nums[i] = perm.back();
            perm.pop_back();
        }
    }
    
    vector<vector<int>> permute(vector<int>& nums){
        vector<int> perm;
        backtrack(nums,perm,nums.size());
        return perms;
    }
};
```

## Generate All Subsets
**Given an array of integers. Generate all possible subset of the given array.**

```cpp
class Solution {
public:
    vector<vector<int>> subs;
    vector<int> sub;
    
    void backtrack(vector<int>& nums, int index){
        if( index == nums.size() ){
            subs.push_back(sub);
            return;
        }
        // take the current value
        sub.push_back(nums[index]);
        backtrack(nums,index+1);
        sub.pop_back();
        // don't take the current value
        backtrack(nums,index+1);
    }
    
    vector<vector<int>> subsets(vector<int>& nums){
        backtrack(nums,0);
        return subs;
    }
};
```

**Write a function which finds all the subset of a given set.**

```cpp
vector<vector<int>> ans;
void allsubset(vector<int>&nums,int i,vector<int>&subset){
    if(i>=nums.size()){
        ans.push_back(subset);
        return;
    }
    subset.push_back(nums[i]);
    allsubset(nums,i+1,subset);
    subset.pop_back();
    allsubset(nums,i+1,subset);
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<int>subset;
    allsubset(nums,0,subset);
    return ans;
}
```
