const express = require('express');
const {  
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    userDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSignleUserDetails,
    updateRole,
    deleteUser

} = require('../controllers/userController');
const {isAunthenticated, authorizeRoles} = require('../middlewares/auth')
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me',isAunthenticated, userDetails);
router.put('/password/update',isAunthenticated, updatePassword);
router.put('/me/update',isAunthenticated, updateProfile);
router.get('/admin/users',isAunthenticated, authorizeRoles("admin"), getAllUsers);
router.get('/admin/users/:id',isAunthenticated, authorizeRoles("admin"), getSignleUserDetails);
router.put('/admin/users/:id',isAunthenticated, authorizeRoles("admin"), updateRole);
router.delete('/admin/users/:id',isAunthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router