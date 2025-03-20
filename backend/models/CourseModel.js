const mongoose = require('mongoose');
const CourseSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Sections:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    Term:  {
        type: String,
        required:true
    },
    Year: {
        type: String,
        required:true
    },
    Img: {
        type: String,
        required:true
    },
    Private: {
        type: Boolean,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Course',CourseSchema);