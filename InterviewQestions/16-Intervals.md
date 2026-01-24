# Intervals

## Merge Ranges
**Given a list of ranges. Find the max length covered by at least one of the range.**

input: [[1,3],[2,5],[6,7]]
output: 5
explanation: range [1,5],[6,7] are covered by at least one range

```cpp
int solve(vector<pair<int,int>> ranges) {
    sort(ranges.begin(),ranges.end());
    int covered = 0;
    int st = ranges[0].first;
    int en = ranges[0].second;
    for(int i=1;i<ranges.size();i++){
        if( ranges[i].first > en ) {
            covered += en - st;
            st = ranges[i].first;
            en = ranges[i].second;
        }
        en = max(en,ranges[i].second);
    }
    covered += en - st;
    return covered;
}
```
