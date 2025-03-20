const mongoose = require('mongoose');
const TeacherSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Img: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Teacher',TeacherSchema);