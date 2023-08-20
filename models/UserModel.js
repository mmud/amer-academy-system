const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    UserName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Phone:{
        type:String,
        required:true,
        unique:true
    }
    ,
    Password: {
        type: String,
        required:true
    },
    Role:{
        type:String,
        default:"member"
    },
    Year:{
        type:Number,
        default:0
    },
    Money:{
        type:Number,
        default:0
    },
    Points:{
        type:Number,
        default:0
    },
    verified:{
        type:Boolean,
        default:false
    },
    Sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    Solvedexames: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    }],
    VideoToken: {
        type: String
    },
    emailverifyToken:String,
    emailverifyTokenresendExpire:Date,
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    resetPasswordnextdate:Date
},
{
    timestamps:true
});

module.exports = mongoose.model('User',UserSchema);