# Math & Geometry

## Large Number Addition
**Q. Given two very large number in string format. Find the sum of the two number**

```cpp
string addStrings(const string& a, const string& b) {
   int i = a.size() - 1;
   int j = b.size() - 1;
   int carry = 0;
   string res;
   
   while (i >= 0 || j >= 0 || carry) {
       int sum = carry;
       
       if (i >= 0) sum += a[i--] - '0';
       if (j >= 0) sum += b[j--] - '0';
       
       res.push_back(char('0' + (sum % 10)));
       carry = sum / 10;
   }
   
   reverse(res.begin(), res.end());
   
   // (Optional) remove leading zeros, keep at least one digit
   int p = 0;
   while (p + 1 < res.size() && res[p] == '0') p++;
   return res.substr(p);
}
```

## Large Number Subtraction
**Given two large numbers as strings, num1 and num2 with num1 larger than num2, return their difference in string format, using no direct string to int conversion or libraries.**

```cpp
string subtractStrings(string num1, string num2) {
   // Assumption: num1 >= num2, both are non-negative integer strings
   
   int i = (int)num1.size() - 1;
   int j = (int)num2.size() - 1;
   int borrow = 0;
   string res;
   
   while (i >= 0) {
       int d1 = (num1[i] - '0') - borrow;
       int d2 = (j >= 0) ? (num2[j] - '0') : 0;
       
       if (d1 < d2) {
           d1 += 10;
           borrow = 1;
       } else {
           borrow = 0;
       }
       
       int diff = d1 - d2;
       res.push_back(char('0' + diff));
       
       i--;
       j--;
   }
   
   // Remove leading zeros (currently res is reversed)
   while (res.size() > 1 && res.back() == '0') res.pop_back();
   
   reverse(res.begin(), res.end());
   return res;
}
```

## Right Triangle Checker
**Q. Given an array of sides of triangles, return an array of strings. The strings would be either "yes" or "no", corresponding to whether the same indexed triangle is a right triangle or not.**

Input: [[3,4,5], [5,9,12], [6,8,10]] Output: ["yes","no","yes"]

## Divisibility by 7
**A very large number (length between 50 to 100 digits) in string format is given. You need to check if the number is divisible by 7. Solve this for t test cases.**

```cpp
#include <bits/stdc++.h>
using namespace std;

bool divisibleBy7(const string &num) {
    int rem = 0;
    for (char c : num) {
        rem = (rem * 10 + (c - '0')) % 7;
    }
    return rem == 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int t; cin >> t;
    while (t--) {
        string num; cin >> num;
        cout << (divisibleBy7(num) ? "YES" : "NO") << "\n";
    }
}
```

## Prime Divisors
**For a given number, find and print all of its distinct prime divisors. Solve this for t test cases.**

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<long long> primeDivisors(long long n) {
    vector<long long> primes;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            primes.push_back(i);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) primes.push_back(n);
    return primes;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int t; cin >> t;
    while (t--) {
        long long n; cin >> n;
        vector<long long> primes = primeDivisors(n);
        for (long long p : primes) cout << p << " ";
        cout << "\n";
    }
}
```

## Find All Divisors
**Given an integer N, find all the divisors of N.**

## Find All Primes up to N
**Given n,Find all primes less than equal n.**

## Prime Range
**Given a range [l,r]. Find all primes between this range.**

## Circle Intersection Area
**Given coordinates x,y and radius r of two circle. Find the area of intersection between them. Print area in double with 6 digit precision.**

```cpp
// src: https://www.geeksforgeeks.org/area-of-intersection-of-two-circles/

#include <bits/stdc++.h>
using namespace std;
#define ld long double

// Function to return area of intersection
long long int intersectionArea(long double X1, long double Y1,
                    long double R1, long double X2,
                    long double Y2, long double R2){
	long double Pi = 3.14;
	long double d, alpha, beta, a1, a2;
	long long int ans;
	
	// Calculate the euclidean distance between the two points
	d = sqrt((X2 - X1) * (X2 - X1) + (Y2 - Y1) * (Y2 - Y1));
	
	if (d > R1 + R2)
		ans = 0;
	else if (d <= (R1 - R2) && R1 >= R2)
		ans = floor(Pi * R2 * R2);
	else if (d <= (R2 - R1) && R2 >= R1)
		ans = floor(Pi * R1 * R1);
	else {
		alpha = acos((R1 * R1 + d * d - R2 * R2) / (2 * R1 * d))* 2;
		beta = acos((R2 * R2 + d * d - R1 * R1) / (2 * R2 * d))* 2;
		a1 = 0.5 * beta * R2 * R2 - 0.5 * R2 * R2 * sin(beta);
		a2 = 0.5 * alpha * R1 * R1 - 0.5 * R1 * R1 * sin(alpha);
		ans = floor(a1 + a2);
	}
	
	return ans;
}
```

## Decimal to Hexadecimal
**Write a function which converts decimal number to hexadecimal**

```cpp
string decimalToHexa(int decimal){
    string hexa = "";
    while(decimal > 0){
        int remainder = decimal % 16;
        if(remainder < 10){
            hexa = to_string(remainder) + hexa;
        }else{
            hexa = char(remainder + 55) + hexa;
        }
        decimal /= 16;
    }
    return hexa;
}
```

## Decimal to Binary
**Convert a decimal number to binary and show the output in string.**

```cpp
#include <bits/stdc++.h>
using namespace std;

string decimalToBinary(int n) {
    string binary = "";
    while (n > 0) {
        binary += to_string(n % 2);
        n /= 2;
    }
    reverse(binary.begin(), binary.end());
    return binary;
}
```

## Roman to Arabic
**Given a number in roman format. Convert it to arabic numeral.**

```cpp
map<char,int>RtoA;
void preprocess(){
    // Map of romans to Arabic
    RtoA['I'] = 1;      RtoA['V'] = 5;
    RtoA['X'] = 10;     RtoA['L'] = 50;
    RtoA['C'] = 100;    RtoA['D'] = 500;
    RtoA['M'] = 1000;
}

// Roman numerals to Arabic
int RomanToArabic(string R){
    int value = 0;
    int n = R.size();
    for(int i=0;i<n;i++){
        if( R[i+1] && RtoA[ R[i] ] < RtoA[ R[i+1] ] ){
            value+= RtoA[ R[i+1] ] - RtoA[ R[i] ];
            i++;
        } else{
            value+=RtoA[ R[i] ];
        }
    }
    return value;
}
```

## Manhattan Distance
**Given Grid size n×m and manhattan distances from a hidden cell (a, b) to (1, 1) and (1, m). Find the coordinates (a, b) of the hidden cell using the given distances**

https://codeforces.com/problemset/problem/1934/C

## Rectangle Area Difference
**Given dimensions of two rectangles, one inside another, where the outer rectangle is (A×B) and inner rectangle is (C×D), with C ≤ A and D ≤ B. Compute the area between the two rectangles modulo 1,000,000,007.**

```cpp
#include<bits/stdc++.h>
using namespace std;

const int mod = 1e9 + 7;

long long multiplication(long long a, long long b,long long m){
    a %= m;
	b %= m;
	return (a * b) % m;
}

void solve(){
    long long a, b, c, d; cin >> a >> b >> c >> d;
    
    long long x = multiplication(a, b, mod);
    long long y = multiplication(c, d, mod);
    
    long long result = (x - y + mod) % mod;
    cout << result << "\n";
}

int32_t main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    int t = 1;
    cin >> t;
    for(int i = 1; i <= t; i++){
        solve();
    }
    
    return 0;
}
```

## Probability with Secret Digit
**Given a book with N pages (numbered 1 to N) and a secret digit (0–9), and you randomly pick a page. Compute the probability that the page number you picked contains the secret digit, expressed as an irreducible fraction P/Q.**

https://www.codechef.com/problems/ANUBGC

## Bitwise OR Triples
**You are given a positive integer N. Find the number of triples (X,Y,Z) such that:**
- 0 < X,Y,Z < N,
- X + Y + Z = N,
- X ∣∣ Y ∣∣ Z = N, where ∣∣ represents the bitwise OR operation.

Since the number of triples can be huge, print them modulo 10^9+7.

https://www.codechef.com/problems/AWESUM_OR

## Pigment Grid Assignment
**Given grid dimensions n × m. Determine if it is possible to assign pigment values to rows and columns such that every cell in the grid (combining row and column pigment modulo nm) has a unique value. If possible, output the row and column pigments.**

## Number Pattern - Recursion
**Using no loops, print this pattern for a given number n:**

n, n-5, n-10,....0,....,n-10,n-5,n. Example: 7, 2, -3, 2, 7

## Center Align Triangle
**How do you center-align a right-angled triangle of numbers up to a given base limit?**

## Convert String to Integer
**Given a string of characters [0-9]. Convert it to integer.**

```cpp
long long stringToInteger(string &s) {
    int n = s.size();
    long long res = 0;
    for(int i=0;i<n;i++){
        res = (res*10) + (s[i] - '0');
    }
    return res;
}
```

## Add Character Arrays
**Given two numbers represented as arrays of characters in decimal format, add them and return the result in the same format. For example, Input: ['1', '2', '3'] and ['4', '5', '6'] Output: Output: ['5', '7', '9']**

```cpp
vector<char> sum(vector<char> &A, vector<char> &B){
    reverse(A.begin(),A.end());
    reverse(B.begin(),B.end());
    vector<char> sum;
    int c = 0;
    int i=0,j=0;
    while(true){
        int a=0,b=0;
        if( i<A.size() ) a = A[i++]-'0';
        if( j<B.size() ) b = B[j++]-'0';
        
        int s = (a+b+c)%10;
        c = (a+b+c)/10;
        sum.push_back(s+'0');
        if( i>=A.size() and j>=B.size() and c == 0 ) break;
    }
    reverse(sum.begin(),sum.end());
    return sum;
}
```

## Array and Number Operations
**Given an array and a number, construct a number from the array digits, subtract the given number, and return the result.**

## Artifact Sequence Position
**Given multiple test cases, each with two numbers: total artifacts n and a position k. Artifacts are arranged in a special sequence: first all odd-numbered ones, then multiples of odd numbers (2×odd, 3×odd, etc.) in order, skipping duplicates. Find which artifact appears at position k.**

## Parity to Binary String
**Given a sequence of integers, convert each number to binary using parity (even → 1, odd → 0), concatenate to form a binary string, and print it with leading zeros removed.**

```cpp
#include <bits/stdc++.h>
using namespace std;

void solve() {
    int n; cin >> n;    // size of the array
    
    // read input array
    vector<int> arr(n);
    for (auto &x : arr) cin >> x;
    
    // convert even -> 1, odd -> 0
    for (int i = 0; i < n; i++) {
        arr[i] = (arr[i] % 2 == 0) ? 1 : 0;
    }
    
    // find position of the last leading zero (if any)
    int initial_zero = -1;
    for (int i = 0; i < n; i++) {
        if (arr[i] == 0) {
            initial_zero = i;
        } else {
            break;
        }
    }
    
    // Build answer string from remaining elements
    string ans;
    for (int i = initial_zero + 1; i < n; i++) {
        ans += char(arr[i] + '0');
    }
    
    cout << ans << "\n";
}

int32_t main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    
    int t; 
    cin >> t;  // number of test cases
    
    for (int i = 1; i <= t; i++) {
        cout << "Case " << i << ": ";
        solve();
    }
    
    return 0;
}
```
