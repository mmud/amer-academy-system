const mongoose = require('mongoose');
const SectionSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Price: {
        type: String,
        required:true
    },
    Blocks:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Block"
    }],
    Isfree:  {
        type: Boolean,
        default: false
    },
    Year: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Section',SectionSchema);