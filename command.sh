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















