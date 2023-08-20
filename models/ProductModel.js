const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Price: {
        type: String,
        required:true
    },
    Img: {
        type: String,
        required:true
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('Product',ProductSchema);