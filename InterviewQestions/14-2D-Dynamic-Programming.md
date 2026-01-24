# 2-D Dynamic Programming

## Bucket Weight Distribution
**You are given an array of weights of length 200 and 3 buckets. The sum of total weights of the array will not exceed 100. You need to distribute the weights among the buckets such that the maximum value of the difference between the sum of weights in any two bucket is minimum.**

```cpp
bool dp[205][505][505];
// until index i, weights on 1st bucket is j and 2nd bucket is k,
// and 3rd bucket is cumsum[i]-j-k;

void solve() {
    int n;
    cin>>n;
    int weights[n+1];
    int csum = 0;
    for(int i=1;i<=n;i++)
        cin>>weights[i];
    
    // we can put 0 weight in 1st,2nd and 3rd bucket with 0 weights
    dp[0][0][0] = true;
    
    for(int i=1;i<=n;i++){
        for(int j=0;j<=min(csum,500);j++){
            for(int k=0;k<=min(csum,500);k++){
                if( !dp[i-1][j][k] ) continue;
                // put it in 1st bucket
                dp[i][j][k] = true;
                // put it in the second bucket
                if( j+weights[i]<=500 ) dp[i][j+weights[i]][k] = true;
                // put it in the third bucket
                if( k+weights[i]<=500 ) dp[i][j][k+weights[i]] = true;
            }
        }
        csum+=weights[i];
    }
    
    int mx = -1;
    for(int i=0;i<=min(csum,500);i++){
        for(int j=0;j<=min(csum,500);j++){
            if( dp[n][i][j] == false ) continue;
            int k = csum-i-j;
            int val = max( {abs(i-j),abs(j-k),abs(k-i)} );
            mx = mx == -1? val: min(mx,val);
        }
    }
    cout<<mx<<endl;
}
```

## Spiral Matrix Element
**You have been provided a spiral matrix of size NXN along with a coordinate (x, y) as follows. Find the element at the position (x, y) of the matrix. N = 4, x = 2, y =1**

| 1 | 2 | 3 | 4 |
|---|---|---|---|
| 12 | 13 | 14 | 5 |
| 11 | 16 | 15 | 6 |
| 10 | 9 | 8 | 7 |

The element at position (2, 1) is 12 [indexed at (1, 0)]

## Rotate Matrix 90 Degrees
**You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).**

```cpp
void rotate(vector<vector<int>> &matrix) {
    reverse(matrix.begin(), matrix.end());
    for (int i = 0; i < matrix.size(); i++) {
        for (int j = i + 1; j < matrix.size(); j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
}
```

## String Transformation Pattern
**Given a string s of length n. Pick an integer k (1 ≤ k ≤ n) and perform a transformation: reverse each substring of length k sliding through the string, and find the lexicographically smallest resulting string. Output that string and the smallest such k.**

https://codeforces.com/problemset/problem/1316/B

## RegEx Matching
**Given a regex expression and a string. Check if the regex expression matches with the string.**

**Given a string s containing lowercase lattin letters and another string p containing lowercase lattin letters and * and ?. * means any substring possibly empty. ? means any character but single.**

**Print yes or no if both strings matches. [RegEx Matching]**

```cpp
int dp[25][25];

bool Down(string &p,string &s, int i,int j){
    if( p[j] == '*' and p[j-1] == s[i] and dp[i-1][j] == 1 ) return true;
    if( p[j] == '*' and p[j-1] == '.' and dp[i-1][j] == 1 ) return true;
    return false;
}

bool Corner(string &p,string &s, int i,int j){
    if( p[j] == '.' and dp[i-1][j-1] == 1 ) return true;
    if( p[j] == s[i] and dp[i-1][j-1] == 1 ) return true;
    return false;
}

bool Right(string &p,string &s, int i,int j){
    if( p[j] == '*' and dp[i-1][j-2] == 1 ) {
        dp[i-1][j] = 1;
    }
    if( p[j] == '*' and dp[i][j-2] == 1 ) {
        return true;
    }
    return false;
}

bool isMatch(string s, string p) {
    for(int i=0;i<25;i++) for(int j=0;j<25;j++) dp[i][j] = 0;
    dp[0][0] = 1;
    s = "#"+s;
    p = "#"+p;
    int n = s.size(); int m = p.size();
    
    dp[0][0] = 1;
    for(int i=1;i<n;i++){
        for(int j=1;j<m;j++){
            Right(p,s,i,j);
            if( Down(p,s,i,j) or Corner(p,s,i,j) or Right(p,s,i,j)  ) dp[i][j] = 1;
        }
    }
    
    return dp[n-1][m-1];
}
```

## Substring Divisibility Query
**You have a string of N decimal digits. Now you are given M queries, each of whom is of following two types.**
- Type 1: 1 X Y: Replace A[X] by Y.
- Type 2: 2 C D: Print the number of sub-strings divisible by 3 of the string denoted by A[C],A[C+1] ... A[D].

Formally, you have to print the number of pairs (i,j) such that the string A[i],A[i+1]...A[j], (C ≤ i ≤ j ≤ D), when considered as a decimal number, is divisible by 3

https://www.codechef.com/problems/QSET

## Chessboard Recoloring
**You are given a chess board of size (2n)*(2n), some of the color of the board is flipped and the board is broken down in 4 square piece each with size n*n. You can join the 4 pieces in any order without rotating or flipping. As the some of the colors were flipped, so to get a valid chessboard there must need to be some recoloring. Output the minimum number of recoloring such that the 4 pieces can be joined to get a valid chessboard.**

https://codeforces.com/problemset/problem/961/C
