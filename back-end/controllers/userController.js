const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendmail");
const crypto = require("crypto");

// user registraion
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample image",
      url: "this is sample url",
    },
  });

  sendToken(user, 201, res);
});

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email && password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Please enter your email && password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter your email && password", 401));
  }

  sendToken(user, 200, res);
});

//logout user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `
        Your reset password token is :- \n\n ${resetPasswordUrl}
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: "eCommerce password recovery",
      message,
    });

    res
      .status(200)
      .json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//resting password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details
exports.userDetails = catchAsyncError(async (req, res, next) => {
  const user1 = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user1,
  });
});

//update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldPpassword, confirmPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const isPasswordMatched = await user.comparePassword(oldPpassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter valid password", 401));
  }
  if (oldPpassword !== confirmPassword) {
    return next(new ErrorHandler("password is not matching", 401));
  }

  user.password = newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { email, name } = req.body;
  const newUser = { email, name };

  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

//get all user -- admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => { 
    const users = await User.find();
    res.status(200).json({
      success: true,
      users
    });
});

//get user details -- admin
exports.getSignleUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id:${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user role -- admin
exports.updateRole = catchAsyncError(async (req, res, next) => {
    console.log("helo");
    const { email, name, role} = req.body;
    const newUser = { email, name, role };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      message:"Role updated successfully"
    });
});


//delete user -- admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
   
    const user = await User.findById(req.params.id);
    if(!user){
        return next( new ErrorHandler(`user with id : ${req.params.id} does not exist`))
    }
    user.remove();
    res.status(200).json({
      success: true,
      message:"user deleted successfully"
    });
});
