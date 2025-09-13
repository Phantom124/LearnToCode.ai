# Usage Guide

## ▶️ Running the Application
``` bash
# Start the backend server
node src/backend/server.js
```

## 🖥️ How to Use

1.Ensure your MySQL server is running and the database is created.

2.Start the backend server using the command above.

3.Use Postman or a similar tool to interact with the API endpoints:

    -Signup: POST to http://localhost:3000/users/signup
    -Login: POST to http://localhost:3000/users/login
    -Get Profile: POST to http://localhost:3000/users/get_profile
    -Update Profile: POST to http://localhost:3000/users/update_profile
    
4.Provide the required JSON body for each endpoint as shown in the API documentation or earlier examples.

5.Check responses in Postman or your frontend application.

## 🎥 Demo

Check out the Demos: 
- [Demo Video](../demo/demo.mp4)
- [Demo Presentation](../demo/demo.pptx)

## 📌 Notes
``` c
Make sure your .env file is correctly configured in the project root.
The server will automatically create the users table if it does not exist.
If you encounter database connection errors, verify your MySQL credentials and that the database exists.
For real-time features, ensure your frontend uses Socket.IO to connect to the backend.
```
