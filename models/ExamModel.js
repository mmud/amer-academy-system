const mongoose = require('mongoose');
const ExamSchema = mongoose.Schema({
    Questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    Name: {
        type: String,
        required:true
    },
    Private: {
        type: Boolean,
        required:true,
        default:false
    },
    Year: {
        type: String,
        required:true
    },
    Term:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Exam',ExamSchema);