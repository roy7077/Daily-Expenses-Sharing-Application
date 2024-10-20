const express=require('express');
const router = express.Router();
const { authz } = require('../Middlewares/authz');
const { 
    addExpense, 
    getUserGroupMoneyStatus, 
    getGroupExpenses, 
    downloadGroupBalanceSheet } = require('../Controllers/Expenses');


// console.log("hello auth.js")
router.post('/addexpenses',authz,addExpense); // For creating a new group
router.get('/userexpenses',authz,getUserGroupMoneyStatus);
router.get('/groupexpenses/:id',getGroupExpenses);
router.get('/downloadbalancesheet/:id',downloadGroupBalanceSheet)
module.exports=router;