const mongoose = require('mongoose');
const UrlSchema = mongoose.Schema({
    Url: {
        type: String,
        required:true
    },
    Name: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Url',UrlSchema);