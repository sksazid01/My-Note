sudo /opt/lampp/lampp start


./Cursor-1.2.2-x86_64.AppImage --no-sandbox

MongoDB:
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl restart mongod

sudo systemctl enable mongod (auto run during startup)

Basic operation:
mongosh     ----->   Mongo Shell
show dbs
use mydb
show collections                                               // show tables name
db.collectionName.insertOne({ name: "John", age: 25 })
db.collectionName.find()                                       //  show table content ---> db.journal_entries.find()
db.collectionName.find({ age: { $gt: 20 } })
db.collectionName.findOne({ name: "Alice" })
db.collectionName.drop()                                       // Drop collection
db.dropDatabase()                                              // Drop database


MySQL:
sudo systemctl status mysql
sudo mysql


SHOW DATABASES;
CREATE DATABASE mydb;


Print Directory structure:
find .   \( -type d -o -type f \)   ! -path "*/.*"   ! -path "*/target/*"   ! -path "*/node_modules/*"   ! -path "*/dist/*"   ! -path "*/build/*"   | sort   | sed 's|[^/]*/|│   |g;s|│   \([^│]\)|├── \1|'


For Zip:
zip -r Pre_Defense.zip Template

Stop process of a port:
fuser -k 4200/tcp
Explanation:
Part	Meaning
fuser	File User — finds processes using a file/socket
-k	Kill — sends kill signal to found process
4200	Port number to target
/tcp	Protocol — TCP type connection

Another:
sudo kill -9 $(sudo lsof -t -i :4200)

Explanation:
lsof	List Open Files — lists all open files/sockets
-t	Terse mode — output only the PID (no extra info)
-i	Look for internet/network connections
-15     SIGTERM		Graceful shutdown
-9	SIGKILL		Force kill

Install VS code Insiders:
sudo snap install code-insiders --classic

Always vs-code run 'nvm use 10.24.1' command for every new terminal startup:
1. Ctrl + Shift + P
2 Preferences: Open User Settings JSON
3 add those json inside the {} and save:
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



