## 🚀 Lampp Start

```bash
sudo /opt/lampp/lampp start
```

---

## 🖥️ Run Cursor AppImage

```bash
./Cursor-1.2.2-x86_64.AppImage --no-sandbox
```

---

## 🍃 MongoDB Commands

### Service Control

```bash
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl restart mongod
```

### Enable Auto Start

```bash
sudo systemctl enable mongod
```

### Basic MongoDB Operations (mongosh)

```bash
mongosh     # Mongo Shell

show dbs
use mydb
show collections   # show tables

db.collectionName.insertOne({ name: "John", age: 25 })

db.collectionName.find()   # show collection data
db.journal_entries.find()

db.collectionName.find({ age: { $gt: 20 } })
db.collectionName.findOne({ name: "Alice" })

db.collectionName.drop()   # drop collection
db.dropDatabase()          # drop database
```

---

## 🐬 MySQL Commands

```bash
sudo systemctl status mysql
sudo mysql
```

```sql
SHOW DATABASES;
CREATE DATABASE mydb;
```

---

## 📁 Print Directory Structure

```bash
find . \( -type d -o -type f \) \
! -path "*/.*" \
! -path "*/target/*" \
! -path "*/node_modules/*" \
! -path "*/dist/*" \
! -path "*/build/*" \
| sort \
| sed 's|[^/]*/|│   |g;s|│   \([^│]\)|├── \1|'
```

---

## 📦 Zip Folder

```bash
zip -r Pre_Defense.zip Template
```

---

## 🔥 Stop Process on a Port

### Method 1: fuser

```bash
fuser -k 4200/tcp
```

**Explanation:**

* `fuser` → finds processes using port/file
* `-k` → kill process
* `4200` → port number
* `/tcp` → protocol

---

### Method 2: lsof + kill

```bash
sudo kill -9 $(sudo lsof -t -i :4200)
```

**Explanation:**

* `lsof` → lists open files/sockets
* `-t` → returns only PID
* `-i` → network connections
* `-9` → force kill (SIGKILL)
* `-15` → graceful stop (SIGTERM)

---

## 💻 Install VS Code Insiders

```bash
sudo snap install code-insiders --classic
```

---

## ⚙️ Auto Use Node Version (nvm)

To always run:

```bash
nvm use 10.24.1
```

### Steps:

1. Press `Ctrl + Shift + P`
2. Open: **Preferences: Open User Settings JSON**
3. Add inside `{}`:

```json
"terminal.integrated.profiles.linux": {
  "Angular 6 Node 10": {
    "path": "bash",
    "args": [
      "-c",
      "source ~/.nvm/nvm.sh && nvm use 10.24.1 && exec bash"
    ]
  }
},
"terminal.integrated.defaultProfile.linux": "Angular 6 Node 10"
```

## To prevent VS Code from auto updating using (sudo apt update && sudo apt upgrade):
* I can hold the code package using below command
```
sudo apt-mark hold code
```
* To verify:
  ```
  apt-mark showhold
  ```
* You should see:
```
code
```

## Mouse wheel “jumping/blinking,” and AirPods audio glitches are common symptoms
* This is usually caused by Bluetooth interference, power-saving issues, or a buggy Bluetooth stack in Ubuntu.

Disable Bluetooth power saving (VERY common fix)

Open terminal:

```bash
sudo nano /etc/bluetooth/main.conf
```

Find this line:

```ini
#ControllerMode = dual
```

Add below it:

```ini
FastConnectable = true
```
```bash
sudo nano /etc/modprobe.d/disable-btusb-autosuspend.conf
```
Add:
```ini
options btusb enable_autosuspend=0
```

Then save:

* `Ctrl + O`
* Enter
* `Ctrl + X`

Restart Bluetooth:

```bash
sudo systemctl restart bluetooth
```
## Disable Wi-Fi power saving
```bash
sudo nano /etc/NetworkManager/conf.d/wifi-powersave.conf
```
Paste:
```ini
[connection]
wifi.powersave = 2
```

