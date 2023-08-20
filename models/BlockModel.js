const mongoose = require('mongoose');
const BlockSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Type: {
        type: String,
        required:true
    },
    Video: {
        type: String
    },
    Content: {
        type: String
    },
    Link: {
        type: String
    },
    ExamId: {
        type: String
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('Block',BlockSchema);