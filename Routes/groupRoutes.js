const express=require('express');
const router = express.Router();
const { createNewGroup, addMemberToGroup, getGroupById, getAllGroups } = require('../Controllers/group');

// console.log("hello auth.js")
router.post('/groups', createNewGroup); // For creating a new group
router.post('/groups/newmember',addMemberToGroup); // For adding a new member to a specific group
router.get('/groups/:id', getGroupById);
router.get('/groups', getAllGroups)

module.exports=router;