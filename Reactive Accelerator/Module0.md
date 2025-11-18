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



