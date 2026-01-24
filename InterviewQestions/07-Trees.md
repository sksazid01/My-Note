# Trees

## Identical Binary Trees
**Q. Given two binary tree. Check if they are identical [not isomorphism]**

```cpp
bool isSameTree(TreeNode* p, TreeNode* q) {
    if(!p and !q)return true;
    if((!p and q) or (p and !q) or (p->val != q -> val)) return false;
    bool fl = true;
    fl &= isSameTree(p->left, q->left);
    fl &= isSameTree(p->right, q->right);
    
    return fl;
}
```

## Tree XOR Queries
**You are given a tree with n nodes and e edges. Each node has a value. Then you are given Q queries. In each query, you are given a node number, and you need to return the XOR of all nodes in the subtree rooted at that node (including the node itself).**

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 100005;
vector<int> adj[MAXN];
int subXor[MAXN];

void dfs(int u, int p) {
    subXor[u] = u;
    for (int v : adj[u]) {
        if (v == p) continue;
        dfs(v, u);
        subXor[u] ^= subXor[v];
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int n, e;
    cin >> n >> e;
    
    while(e--) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    
    dfs(1, -1);
    
    int Q; cin >> Q;
    while (Q--) {
        int node; cin >> node;
        cout << subXor[node] << "\n";
    }
}
```

## Inorder Traversal
**Given the root of a binary tree, return the inorder traversal of its nodes values.**

## Invert Binary Tree
**Given the root of a binary tree, invert/mirror the tree, and return its root.**

```cpp
class Solution {
public:
    void invert(TreeNode* root){
        if(!root or (root ->left == nullptr and root -> right == nullptr))return;
        swap(root ->left, root ->right);
        invert(root->left);
        invert(root ->right);
    }
    TreeNode* invertTree(TreeNode* root) {
        invert(root);
        return root;
    }
};
```

## Binary Tree SQL Query
**For a binary tree, you are given a table of two columns N and P, where N represents the id of a node in the tree and P represents the parent of that node in the tree. Write a SQL query to find which the leaf, root and inner nodes and output a table fo the following format**

| N | NodeType |
|---|----------|
| 5 | root |
| 2 | inner |
| 3 | leaf |
| 4 | leaf |
| 8 | inner |
| 6 | leaf |

## Longest Path in Grid
**There is a food track consisting of cells marked with 0, 1, or other numbers. Here, 0 signifies the cell is not traceable, 1 signifies it is traceable, and any other number represents the destination. Starting from the top-left point, determine the longest path to reach the destination. If no path exists, print -1.**

| 1 | 1 | 1 |
|---|---|---|
| 1 | 0 | 1 |
| 1 | 9 | 1 |

## Island Perimeter
**You are given row x col grid representing a map where grid[i][j] = 1 represents land and grid[i][j] = 0 represents water.**

**Grid cells are connected horizontally/vertically (not diagonally). The grid is completely surrounded by water, and there is exactly one island (i.e., one or more connected land cells).**

**The island doesn't have "lakes", meaning the water inside isn't connected to the water around the island. One cell is a square with side length 1. The grid is rectangular, width and height don't exceed 100. Determine the perimeter of the island.**

https://leetcode.com/problems/island-perimeter/description/
