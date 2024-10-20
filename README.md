Group Expense Tracker
=====================

Table of Contents
-----------------

*   [Project Overview](#project-overview)
    
*   [Features](#features)
    
*   [Technologies Used](#technologies-used)
    
*   [Installation](#installation)
    
*   [Usage](#usage)
    
*   [API Endpoints](#api-endpoints)
    
*   [Postman Collection](#postman-collection)
    
*   [Database Structure](#database-structure)
    
*   [Contributors](#contributors)
    
*   [License](#license)
    

Project Overview
----------------

The **Group Expense Tracker** is a web application designed to help users manage and track expenses within groups. Users can create groups, add expenses, and split costs among participants, making it easier to keep track of shared expenses. This project aims to streamline the process of managing group finances, providing a clear overview of who owes what.

Features
--------

*   **User Authentication**: Users can register and log in to their accounts.
    
*   **Group Management**: Create and manage groups for tracking expenses.
    
*   **Expense Tracking**: Add expenses with descriptions, amounts, and split them among group members.
    
*   **Contribution Tracking**: View each participant's contribution to the expenses.
    
*   **Balance Sheet Download**: Generate and download a balance sheet for each group, showing individual contributions and total expenses.
    
*   **Responsive Design**: Mobile-friendly interface for easy access on any device.
    

Technologies Used
-----------------

*   **Frontend**: HTML, CSS, JavaScript, React.js
    
*   **Backend**: Node.js, Express.js
    
*   **Database**: MongoDB (using Mongoose for object modeling)
    
*   **Authentication**: JWT (JSON Web Tokens) for secure user authentication
    
*   **CSV Generation**: json2csv package for exporting data in CSV format
    
*   **Deployment**: MongoDB Atlas for cloud database hosting
    

Installation
------------

1.  bashCopy codegit clone https://github.com/roy7077/Daily-Expenses-Sharing-Application.git
    
2.  bashCopy codecd group-expense-tracker
    
3.  bashCopy code npm install
    
4.  plaintextCopy codeDB\_URL="your\_mongodb\_connection\_string"
    
5.  bashCopy npm start
    

Usage
-----

*   Open your browser and go to http://localhost:8080 to access the application.
    
*   Register for a new account or log in to an existing account.
    
*   Create a new group and start adding expenses.
    
*   Use the download functionality to generate a balance sheet for the group.
    

API Endpoints
-------------

### Auth

*   **Signup**
    
    *   POST /api/auth/signup
        
*   **Login**
    
    *   POST /api/auth/login
        

### User

*   **Get User by ID**
    
    *   GET /api/users/:id
        
*   **Get All Users**
    
    *   GET /api/users
        

### Groups

*   **Create New Group**
    
    *   POST /api/groups
        
*   **Add New Member to Group**
    
    *   POST /api/groups/:id/members
        
*   **Get All Groups**
    
    *   GET /api/groups
        
*   **Get Group by ID**
    
    *   GET /api/groups/:id
        

### Expenses

*   **Add New Expense**
    
    *   POST /api/expenses
        
*   **Get Individual User's Expenses**
    
    *   GET /api/expenses/user/:id
        
*   **Get Group Expenses**
    
    *   GET /api/groups/:id/expenses
        
*   **Download Balance Sheet**
    
    *   GET /api/groups/:id/balance-sheet
        

Postman Collection
------------------

You can explore and test the API endpoints using the Postman collection provided here: [Postman Collection](https://www.postman.com/roy707/workspace/shop-cart/collection/32632569-9340bb09-5e02-46e5-b9ff-8028ffe53760?action=share&creator=32632569).

Database Structure
------------------

Below is the structure of the MongoDB database used in this project:
<img width="755" alt="Screenshot 2024-10-21 at 4 05 56 AM" src="https://github.com/user-attachments/assets/ab1bdd04-a6e4-4413-a907-c2af44c614e0">


Contributors
------------

*   [Your Name](https://github.com/roy7077)
    
*   [Other Contributors](https://github.com/other_contributors)
    

License
-------

This project is licensed under the MIT License. See the LICENSE file for more details.
