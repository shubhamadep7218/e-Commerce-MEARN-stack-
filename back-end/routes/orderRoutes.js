const express = require('express');
const { createOrder, getSingleOrder, getMyOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const { isAunthenticated, authorizeRoles  } = require("../middlewares/auth");

router.post('/order/new', isAunthenticated, createOrder);
router.get('/order/:id', isAunthenticated, getSingleOrder);
router.get('/orders/me', isAunthenticated,getMyOrders );
router.get('/admin/orders', isAunthenticated,authorizeRoles("admin"), getAllOrders );
router.put('/admin/order/:id', isAunthenticated,authorizeRoles("admin"), updateOrder );
router.delete('/admin/order/:id', isAunthenticated,authorizeRoles("admin"), deleteOrder );

module.exports = router