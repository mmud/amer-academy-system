const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const { findById } = require('../models/UserModel');

app.get("/",nd,async(req,res)=>{
    try{
        let num = req.query.num;
        const Teachers = await Order.find().skip((num-1)*10).limit(10).sort({ createdAt: 1 }).populate("User","UserName").populate("Product","Name");
        res.status(200).json(Teachers);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Order.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"المنتج غير موجود"});
        return;
        }

        await Order.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

module.exports = app;