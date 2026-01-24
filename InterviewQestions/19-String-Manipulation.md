# String Manipulation & Pattern Matching

## String Reversal
**Given a string of characters. Reverse the string without using any library function.**

```cpp
void solve(string &s){
    int n = s.size();
    for(int i=0;i<n/2;i++){
        char temp = s[i];
        s[i] = s[n-i-1];
        s[n-i-1] = temp;
    }
}
```

## Check Palindrome
**Given a string of characters. Check if the given string is a palindrome.**

```cpp
bool solve(string s){
    int n = s.size();
    for(int i=0;i<n/2;i++){
        if(s[i] != s[n-i-1]) return false;
    }
    return true;
}
```

## String Matching
**Given two input strings, you have to find whether the second string is present in the first string. Please explain all the approaches for solving this problem.**

## HTML Tag Character Count
**You are given an HTML string. Your task is to determine the number of characters encompassed by each HTML tag in the string. For each tag, count the number of characters that are enclosed between the opening () and closing () tags.**

A tag is composed of one or more lowercase English letters (a-z). For example: <div> ... </div>, <span>..</span>. It can be followed by digits (0-9) i.e <h1>..</h1>.

The content between the tags can consist of:
1. English characters (a-z, A-Z).
2. Digits (0-9).
3. Punctuation marks: period (.), comma (,), and spaces(' ').

Note: When a character is encompassed by a same tag multiple times, count only once for that tag. A tag can have 0 characters. In that case don't print that tag. Spaces(' ') between the tags are not counted.

```cpp
string consume(string &s,int st){
    string tag;
    while(s[st]!='>') tag+=s[st++];
    return tag;
}

void solve(string s) {
    // the total character inside a tag
    map<string,int> totalCharCount;
    // to find the nesting level of a tag
    // eg. <p><p></p></p>, here p is nested two times
    map<string,int> nestedTagLevel;
    
    vector<string> tags;
    vector<int> charCount;
    
    // signifies root level tag
    // helps to simplify code logic
    tags.push_back("");
    charCount.push_back(0);
    
    for(int i=0;i<s.size();i++){
        if( s[i] == '<' and s[i+1]!='/'  ){
            // starting tag
            string tag = consume(s,i+1);
            // advance pointer by the consumer
            // character count
            i+=tag.size()+1;
            tags.push_back(tag);
            charCount.push_back(0);
            nestedTagLevel[tag]++;
        }else if( s[i] == '<' and s[i+1] == '/' ){
            // ending tag
            string tag = consume(s,i+2);
             // advance pointer by the consumer
            // character count
            i+=tag.size()+2;
            int cnt = charCount.back();
            nestedTagLevel[tag]--;
            
            // increment count only if it has no parent
            // tag of same type
            if( nestedTagLevel[tag] == 0 ){
                totalCharCount[tags.back()] += cnt;
            }
            charCount.pop_back();
            tags.pop_back();
            // propagate the character count to its
            // parents too
            charCount.back()+=cnt;
            
        }else{
            if(s[i] != ' ') charCount.back()++;
        }
    }
    
    for(auto [tag,cnt]:totalCharCount){
        if(cnt) {
            cout<<tag<<": "<<cnt<<endl;
        }
    }
}
```

## Line Wrapping
**Given a large input string without \n present. Output the string of sentences where we will input the max letter count in a line. output the modified string, so if line breaks occur in the middle of a word, place it after a newline.**

Input:
```
reve systems is a software company
11
```

Output:
```
reve
systems is
a software
company
```

## Mirror Substring
**Given a string of lowercase letters, you have to find the longest mirror substring from it. The string radar or racecar is not mirror but bid or dib is. For simplicity lets say b=d,i=i,o=o,w=w,v=v,x=x,p=q in the mirrored substring.**

## Convert to Palindrome
**Convert a given string into a palindrome with the least number of changes.**

## Find Digits from String
**Find digits from a string( Leading zeroes doesn't get counted)**

## YES/NO Case Insensitive
**Given multiple test cases, each containing a 3-letter string (uppercase/lowercase letters), you have to check whether the string equals "YES", case-insensitively. Output "YES" if it matches, else "NO".**

## Good String Problem
**Problem Statement: You'll be given two strings A and B, with lengths 1 <= length <= 10^6. The strings will contain only 1's and 0's. To make A a good string, you can insert B into A at any place, as many times as you want (or don't insert if you don't want). You have to print YES or NO depending on whether making A as a good string is possible.**

The Definition of GOOD: A good string will never consecutively have two 1's or two 0's.

Input/Output: The input will consist of two strings in two lines, strings A and B.
The output must be only one word, "YES" or "NO".

Sample Input/Output:
| Input | Output |
|-------|--------|
| 101 010 | YES |
| 111 010 | YES |
| 1110011 01010 | NO |
| 1001001000 10 | NO |

## Circular String Fragments
**Given:**
- A circular string of length N×K representing N fragments of length K
- A list of G candidate fragments (all distinct)

**Determine if the circular string can be split into a sequence of N valid fragments (from the candidate list) in some rotation. If possible, output any such valid sequence.**

## Shortest Unique Phone Substring
**Given a list of unique 9-digit phone numbers. For each phone number, find the shortest digit substring that uniquely identifies it (i.e., no other number contains it as a substring).**

## Text Justification
**Given an array of strings `words` and a width `maxWidth`, format the text such that each line has exactly `maxWidth` characters and is fully (left and right) justified**

https://leetcode.com/problems/text-justification/description/

## IP Address Validation
**Given a string queryIP, return "IPv4" if IP is a valid IPv4 address, "IPv6" if IP is a valid IPv6 address or "Neither" if IP is not a correct IP of any type.**

https://leetcode.com/problems/validate-ip-address/description/

## Split Message by Limit
**You are given a string, message, and a positive integer, limit. Split the string into lines such that each line has a maximum of limit characters.**
