const mongoose = require('mongoose');
const CodeSchema = mongoose.Schema({
    Token: {
        type: String,
        required:true
    },
    Money: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Code',CodeSchema);