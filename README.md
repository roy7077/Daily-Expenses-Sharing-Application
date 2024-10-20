Daily Expenses Sharing Application
==================================

A MERN stack application designed for tracking shared expenses among users in various groups. This application allows users to easily manage their expenses, view individual contributions, and download balance sheets.

Base URL
--------

The deployed backend can be accessed at:[**https://daily-expenses-sharing-application.onrender.com/**](https://daily-expenses-sharing-application.onrender.com/)

Table of Contents
-----------------

*   [Features](#features)
    
*   [API Endpoints](#api-endpoints)
    
*   [Postman Collection](#postman-collection)
    
*   [Installation](#installation)
    
*   [Usage](#usage)
    
*   [Technologies Used](#technologies-used)
    
*   [Contributing](#contributing)
    
*   [License](#license)
    

Features
--------

*   User authentication (Signup and Login)
*   Manage user profiles
*   Create and manage groups
*   Add and manage expenses
*   Download balance sheets for groups
*   View individual contributions and expenses
    

API Endpoints
-------------

### Authentication

*   **POST** /auth/signup - Create a new user
*   **POST** /auth/login - User login
    

### User

*   **GET** /user/:id - Get user by ID
*   **GET** /user - Get all users
    

### Groups

*   **POST** /groups - Create a new group
*   **POST** /groups/:id/add-member - Add a new member to a group
*   **GET** /groups - Get all groups
*   **GET** /groups/:id - Get a group by ID
    

### Expenses

*   **POST** /expenses - Add new expense
*   **GET** /expenses/:id - Get individual user's expenses
*   **GET** /expenses/group/:id - Get all expenses for a group
*   **GET** /expenses/download/:id - Download balance sheet for a group
    

Postman Collection
------------------

You can explore the API endpoints using the Postman collection:[**Postman Collection**](https://www.postman.com/roy707/workspace/shop-cart/collection/32632569-9340bb09-5e02-46e5-b9ff-8028ffe53760?action=share&creator=32632569)

Data Base
------------------
<img width="755" alt="Screenshot 2024-10-21 at 4 05 56 AM" src="https://github.com/user-attachments/assets/a9157b95-6717-4ca6-a43d-33ce0201984a">


Installation
------------

1.  git clone https://github.com/roy7077/Daily-Expenses-Sharing-Application.git
2.  cd server
3.  npm install
4.  Set up environment variables:Create a .env file and add your MongoDB connection string and other required variables.
5.  npm start
    

Usage
-----

*   Access the API using the base URL mentioned above.
*   Use the provided Postman collection to test the endpoints.
    

Technologies Used
-----------------
 
*   **Backend:** Node.js, Express.js, MongoDB
*   **Deployment:** Render.com
    

Contributing
------------

Contributions are welcome! Feel free to submit a pull request or open an issue.

License
-------

This project is licensed under the MIT License.
