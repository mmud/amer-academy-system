const mongoose = require('mongoose');
const QuestionSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Question: {
        type: String
    },
    Qimg: {
        type: String,
        required:true
    },
    Aimg: {
        type: String,
        required:true
    }
    ,
    Answer1: {
        type: String,
        required:true
    },
    Answer2: {
        type: String,
        required:true
    },
    Answer3: {
        type: String,
        required:true
    },
    Answer4: {
        type: String,
        required:true
    },
    CorrectAnswer: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Question',QuestionSchema);