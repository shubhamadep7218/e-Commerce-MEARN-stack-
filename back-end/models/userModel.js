const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:[4,"name should have more than 4 characters"],
        maxlength:[30,"name should have less than 30 characters"],
        required:[true, "Please Enter your name"]
    },
    email:{
        type:String,
        required:[true, "Please Enter your email"],
        unique:true,
        validate:[validator.isEmail, "please enter valid email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter your email"],
        minlength:[8,"Password should have greater than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken: String,
    resetPasswordExpire:Date,

})

//password encryption
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JWT token 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};


userSchema.methods.comparePassword = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password);
};

//Genrate Password reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generating Token 
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hashing and adding reset token to user schema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 *  1000;
    return resetToken;
}

module.exports = mongoose.model('User',userSchema);