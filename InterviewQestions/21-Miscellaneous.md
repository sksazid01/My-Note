# Miscellaneous Problems

## OOP Problem
**Q. Solve the problem using Object Oriented Programming**

```cpp
int main(){
    int square1width = 50;
    int square2width = 80;
    int rectangle1width = 30, rectangle1height = 40;
    int rectangle2width = 20, rectangle2height = 40;
    
    int square1area = square1width* square1width;
    int square2area = square2width* square2width;
    int rectangle1area = rectangle1height*rectangle1width;
    int rectangle2area = rectangle2width* rectangle2height;
}
```

## Array Pointer Question
**What will the output of this code in C Programming Language and why?**

```c
int arr[3] = {1, 2, 3};

if(&arr[0] == &arr){
    printf("They are the same!");
}else {
    printf("Not same");
}
```

**The name of the array is a pointer to the first item of the Array. So it will print "They are the same!"**

**Given an array, what will be the base address if we print the array name only (e.g., printf(ara))?**

**It will print the address of the first item of the array. In C, you can't pass array to functions by "Pass by value". So when you pass an array to an function (for example: printf(arr)), the compiler will actually pass the pointer to the first element. You can easily test this hypothesis by doing something like this:**

```c
int arr[1] = {100};

if(arr == &arr){
    printf("Yay!\n");
}

if(arr == &arr[0]){
    printf("Damn!");
}
```

**The above code should print:**
```
Yay!
Damn!
```

## Array Element Access
```python
arr = [1, 2, 3, 4]
print(arr[2])
```

## Three Switches Problem
**There are 3 switches S1, S2, and S3 outside a server room. Inside the room, there are 3 cooling fans, and each fan is connected to exactly one switch. However, the switches are not labeled, so you don't know which switch controls which fan. You are allowed to enter the server room only once. How can you figure out which switch controls which fan?**

## Maze Pathfinding
**Your task is to write a function in the C programming language to find an optimal route cost to a target location inside a maze and return the highest 4 bits (MSB + 3 bits) of the optimal route cost value. Your function should take as input two integer numbers for the starting index on the maze array. An optimal route is defined as a complete path from the start point to the target location that requires the least effort/cost. Diagonal movement in the maze is not allowed.**

Maze Details:
- The starting block location will be provided as a function parameter (Blue block in the example).
- Blocks with a value of -1 are impassable (Grey blocks in the example).
- The Goal block and only the Goal block will always have a cost of 0 (Green blocks in the example).
- The maze will not have any circular routes that do not go through the Goal block first.
- The maze is stored in a 2D array. The 2D maze array will be defined globally.
- The maze size will be a pair of positive integer numbers, you can assume that the size parameters, length, and height of the maze will fit in a C integer (int) type.
- The cost values, excluding the impassable blocks, will always be a positive integer that will fit in a C integer (int) type.
- The maze length and height are not guaranteed to be equal but will be global fixed defined constants for each problem

## Array Merging Problem
**There is an array of numbers n. You have to merge any two neighboring elements to make the length of the array n-1 in such way that, the minimum of the maximum of each consecutive pair gets removed. If the array is { 2, 5, 3, 7, 9 }, the result can be { 7, 3, 7, 9 } or { 2, 8, 7, 9 }**

## Game of Life
**Implement Game of Life**

In the game of life, you have a 2D matrix of small squares that can be either alive or dead. The matrix goes through iterations, and on every iteration the squares can die or be revived. This is based on the previous iteration and the below rules:
- A living square with 1 or less neighbors in the previous iteration will die, as if from loneliness
- A living square with 2 or 3 neighbors in the previous iteration will survive, as if from contentment
- A living square with 4 or more neighbors in the previous iteration will die, as if from overpopulation
- A dead square with exactly 3 neighbors in the previous iteration will be revived, as if by unfulfilled desires

Implement a square matrix of size 20 and set up the initial five (given) living squares. Then run 10 iterations on it, then print the final matrix. 0,0 should be the top left of the matrix, where the first is the row and the second is the column.

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<vector<bool>> matrix(msz, vector<bool>(msz, false));

vector<int> dx = {-1, -1, -1, 0, 0, 1, 1, 1};
vector<int> dy = {-1, 0, 1, -1, 1, -1, 0, 1};

signed main() {
    matrix[0][0] = true;
    matrix[1][1] = true;
    matrix[1][2] = true;
    matrix[2][0] = true;
    matrix[2][1] = true;
    
    for (int gen = 1; gen <= max_iters; gen++) {
        vector<vector<bool>> next_gen_mat(msz, vector<bool>(msz, false));
        
        for (int i=0; i<msz; i++) {
            for (int j=0; j<msz; j++) {
                int alive_neighbors = 0;
                
                for (int k=0; k<8; k++)  {
                    int ni = i + dx[k], nj = j + dy[k];
                    if (ni >= 0 and ni < msz and nj >=0 and nj < msz) {
                        if (matrix[ni][nj]) alive_neighbors++;
                    }
                }
                
                if (matrix[i][j]) {
                    if (alive_neighbors <= 1) next_gen_mat[i][j] = false;
                    else if (alive_neighbors <= 3) next_gen_mat[i][j] = true;
                    else next_gen_mat[i][j] = false;
                } else {
                    if (alive_neighbors == 3) next_gen_mat[i][j] = true;
                }
            }
        }
        
        matrix = next_gen_mat;
        
        cout << "Gen : " << gen << endl;
        for (int i=0; i<msz; i++) {
            for (int j=0; j<msz; j++) {
                if (matrix[i][j]) cout << "██";
                else cout << "  ";
            }
            cout << endl;
        }
        cout << endl;
    }
}
```

## Student Assignment Conflicts
**Each student is assigned to an assignment at a particular location at a specific time. Are there any inconsistencies in the assignments ? Find at least one of them by looking into the input. Then write a code to print all inconsistencies in the assignments.**

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Assignment {
    string Area, Time;
    vector<int> StudentIds;
};

vector<Assignment> getInput() {
    vector<Assignment> res = {
        {"Garden", "A", {2, 9, 1}},
        {"Pond", "M", {2, 8, 5}},
        {"FoodCourt", "A", {4, 8, 7}},
        {"Playground", "M", {1, 7, 2}},
        {"PicnicArea", "M", {7, 3, 9}},
        {"Zoo", "A", {6, 3, 2}},
    };
    return res;
}

int main() {
    vector<Assignment> inputs = getInput();
    
    map< pair<int, string>, vector<string> > mapping;
    for (Assignment a : inputs) {
        for (auto studentId : a.StudentIds)
            mapping[{studentId, a.Time}].push_back(a.Area);
    }
    
    for (auto k: mapping) {
        if (k.second.size() > 1) {
            cout << "Student " << k.first.first << " has conflicts at time " << k.first.second << " at : " << endl;
            
            for (string area : k.second) {
                cout << area << " ";
            }
            cout << endl;
        }
    }
}
```

## Company Employee Table
| Company | Position | Employee |
|---------|----------|----------|
| ABC | blah | 20 |
| ABC | blah | 15 |
| ABC | blah | 5 |
| XYZ | blah | 10 |
| XYZ | blah | 12 |
| XYZ | blah | 5 |
| MNO | blah | 20 |
| MNO | blah | 5 |

## Score Calculation
**Given:**
- Number of questions
- For each question: initial score, per-minute penalty, minimum score
- For each question: submission time and number of submissions (positive if solved, non-positive if unsolved)

**Calculate the total score based on a formula involving penalties and number of attempts. If a question is unsolved, its score is 0.**
