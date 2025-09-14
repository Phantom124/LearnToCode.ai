# Setup Instructions

Follow the steps below to set up and run the project.

---

## 📦 Requirements
``` c
Node.js v18+
MySQL or MariaDB server
npm (Node Package Manager)
(Optional) MySQL Workbench for database management

---

## ⚙️ Installation
``` bash
# Clone the repository
git clone https://github.com/Phantom124/LearnToCode.ai.git
cd LearnToCode.ai

# Install dependencies
npm install
```
##🗄️ Database Setup
```c
# Start your MySQL/MariaDB server

# Log in to MySQL and create the database
mysql -u root -p
# In the MySQL prompt, run:
CREATE DATABASE learntocode;
EXIT;
```

##📝 Environment Variables
```c
Create a .env file in the project root with the following content:

API_KEY=your_gemini_api_key
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=learntocode
PORT=3000
```

## ▶️ Running the Project
``` bash
# Start the backend server
node src/backend/server.js
```
