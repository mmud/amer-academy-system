const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema({
    User:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Product:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    Details: {
        type: String,
        required:true
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('Order',OrderSchema);