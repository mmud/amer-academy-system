const mongoose = require('mongoose');
const ExamDoneSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Phone: {
        type: String,
        required:true
    },
    Result: {
        type: String,
        required:true
    },
    Total: {
        type: String,
        required:true
    },
    Exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('ExamDone',ExamDoneSchema);