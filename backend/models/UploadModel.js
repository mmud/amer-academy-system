const mongoose = require('mongoose');
const UploadSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    url: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Upload',UploadSchema);