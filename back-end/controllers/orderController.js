const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

exports.createOrder = catchAsyncError( async(req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
  })

  res.status(200).json({
      success:true,
      order
  })

});

// get single order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).
    populate(
        "user",
        "name email"
    );

    if(!order){
        return next( new ErrorHandler("order does not exist with this id", 404))
    }

    res.status(200).json({
        success:true,
        order
    })
})

// get all orders of user
exports.getMyOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})

// get all orders of user -- Admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();
    if(!orders){
        return next( new ErrorHandler("orders does not exist ", 404))
    }
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
})

// update order status -- admin
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next( new ErrorHandler("orders does not exist ", 404))
    }
    if(order.orderStatus === "Delivered"){
        return next( new ErrorHandler("Already delivered this order ", 404))
    }
    
    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity);
    })  

    order.orderStatus = req.body.status;
    if( req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
    })
})

exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next( new ErrorHandler("orders does not exist ", 404))
    }
    await order.remove();
    res.status(200).json({
        success:true,
    })
})

async function updateStock(id, qty){
    const product = await Product.findById(id);
    if(!product){
        return next( new ErrorHandler("product does not exist ", 404))
    }
    product.stock -= qty;
    await product.save({validateBeforeSave:false}) 
}


