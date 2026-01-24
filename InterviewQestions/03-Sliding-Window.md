# Sliding Window

## Substring with Pattern
**You are given a string S of length N and an integer K. Your task is to find the total number of subsequences in S that match the pattern P = "orbitaxian", where the difference in position between every consecutive character in the subsequence is no more than K.**

More formally, let the subsequence of P be represented by an array pos, where (1 ≤ pos[i] ≤ N) and S[pos[i]] = P[i]. Then for each i > 1, the condition pos[i] − pos[i-1] ≤ K must hold.

The result should be returned modulo 10^9+7

```cpp
#define M 1000000007
map<char,queue<pii> > pos;
map<char,int> cntStack;
int k;

void calc(char prev, char cur,int ind){
    while(pos[prev].size() and ind-pos[prev].front().first>k) {
        cntStack[prev]-=pos[prev].front().second;
        cntStack[prev] %= M;
        cntStack[prev] += M;
        cntStack[prev] %= M;
        pos[prev].pop();
    }
    if( pos[prev].size() ) {
        pos[cur].push({ind,cntStack[prev]});
        cntStack[cur]+=cntStack[prev];
        cntStack[cur] %= M;
    }
}

void solve() {
    string orbitax = "orbitaxIAn";
    pos.clear();
    cntStack.clear();
    int n;
    cin>>n>>k;
    string s;
    cin>>s;
    for(int i=0;i<s.size();i++){
        char cur = s[i];
        char prev;
        if( s[i] == 'o' ){
            pos[cur].push({i,1});
            cntStack[cur]++;
        }else if( s[i] == 'r' ){
            calc('o','r',i);
        }else if( s[i] == 'b' ){
            calc('r','b',i);
        }else if( s[i] == 'i' ){
            calc('b','i',i);
            calc('x','I',i);
        }else if( s[i] == 't' ){
            calc('i','t',i);
        }else if( s[i] == 'a' ){
            calc('t','a',i);
            calc('I','A',i);
        }else if( s[i] == 'x' ){
            calc('a','x',i);
        }else if( s[i] == 'n' ){
            calc('A','n',i);
        }
    }
    cout<<cntStack['n']<<endl;
}
```
