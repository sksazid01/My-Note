https://docs.google.com/spreadsheets/d/1WRLUxhFWqxYX0IMI7Hf4csVabYQsQtQtTM40dPjYWVs/edit?usp=sharing

# Git multiple remote (can push to multiple repos

<img width="1826" height="419" alt="image" src="https://github.com/user-attachments/assets/a0877193-e6e6-4460-8cae-9e55f4a2b68b" />
<img width="1205" height="513" alt="image" src="https://github.com/user-attachments/assets/1b6c1859-58c7-4ae2-8ec7-1f4244f7e600" />
<img width="1205" height="513" alt="image" src="https://github.com/user-attachments/assets/038d5d23-ef28-430b-92ab-8a3a99ef1078" />

# 0.10 Git/GitHub Refresher
## Git configuration
```bash
git config --global user.name "sksazid01"
git config --global user.email "sksazid@gmail.com"
git config --global credential.helper store
```
### It automatically saves the token in `~/.git-credentials`
### `https://sksazid01:YOUR_GITHUB_TOKEN@github.com` is not secure

## Check config list
```
sk-sazid@sk-sazid-HP-Pavilion-Laptop-15-eg1xxx:~$ git config --list
user.name=sksazid01
user.email=sksazid@gmail.com
credential.helper=store
```
### show hidden folder
> ls -a  #for all

### history
> git log # commit history
> git log --oneline # remove verbosity
> git status

## Head indicates which version is being viewed. 
<img width="1407" height="228" alt="image" src="https://github.com/user-attachments/assets/d5e62c8d-3817-4a2b-b559-4d972910b532" />

## Go back into a specific commit:(change head point)
> git reset --hard commit_it
<img width="1643" height="115" alt="image" src="https://github.com/user-attachments/assets/3fae0bde-bc43-4963-b67f-b77cd3e4bed9" />

## show details log (IT shows also the reverted commit ID)
> git reflog
<img width="1911" height="208" alt="image" src="https://github.com/user-attachments/assets/47519bfd-5af1-4439-ae9a-2e5979037d0d" />

## Branch
```bash
#!/bin/bash
# --------------------------------------------
# GIT WORKFLOW: Creating, merging, and deleting a feature branch
# --------------------------------------------

# Step 1: Create a new branch called "dev/add-heading-text"
git branch dev/add-heading-text

# Step 2: List all branches to confirm the new branch was created
git branch --list

# Step 3: Switch to the new branch to start working on it
git switch dev/add-heading-text

# Step 4: Confirm you're now on the new branch
git branch --list

# Step 9: Switch back to the main branch to prepare for merging
git switch main

# Step 10: Merge the feature branch into the main branch
git merge dev/add-heading-text

# Step 12: View Git history and reflog (records of all changes and branch switches)
git reflog

# Step 13: Delete the feature branch after merging (cleanup)
git branch -d dev/add-heading-text

# You can rename it to "feature/add-heading-text" using this command
git branch -m feature/add-heading-text

# After renaming, you can check that the branch name changed:
git branch
```
## Merge
> git merge feature/add-heading-text # it will merge with the current branch

### If there is a conflict, then you should manually change it.
<img width="872" height="418" alt="image" src="https://github.com/user-attachments/assets/bccab2f2-96ca-41b9-9330-d73f8e2e78fa" />

to

<img width="872" height="418" alt="image" src="https://github.com/user-attachments/assets/ecefb879-9e6c-4c5c-9b44-e9122c3e2987" />

- > git commit

<img width="1342" height="801" alt="image" src="https://github.com/user-attachments/assets/3c509a62-9921-44c1-94b5-8f338ed507a6" />
then git will automatically provide a commit message.

# Stash
- git stash
> move branch without committing changes



