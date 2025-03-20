const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const { findById } = require('../models/UserModel');
const fs = require('fs');

app.post("/",nd,async(req,res)=>{
    try{
    const {Name,Img,Price} =req.body;
    if(!Name || !Img||!Price)
        return res.status(404).json({msg:"need data"});

    let time =Date.now ();
    var base64Data = Img.replace("data:image/*;base64,", "");

    require("fs").writeFile(__dirname+`/../imgs/${time}.png`, base64Data, 'base64', function(err) {
      console.log(err);
    });    
    const power = await Product.create({
        Name:Name,
        Img:`/imgs/${time}.png`,
        Price:Price
    });

    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/",nd,async(req,res)=>{
    try{
        let num = req.query.num;
        const Teachers = await Product.find().skip((num-1)*10).limit(10);
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
        const codeExists = await Product.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"المنتج غير موجود"});
        return;
        }

        await Product.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$','i'); // fragment locator


console.log(pattern.test("/imgs/1691171726904.png"))
app.post("/edit",nd,async(req,res)=>{
    try{
    const {_id,Name,Img,Price} =req.body;
    if(!Name || !Img||!Price)
        return res.status(404).json({msg:"need data"});

        let time =Date.now ();


        if(Img.includes("data:image/*;base64,"))
        {
            var base64Data = Img.replace("data:image/*;base64,", "");
        
            require("fs").writeFile(__dirname+`/../imgs/${time}.png`, base64Data, 'base64', function(err) {
            console.log(err);
            });   
            //`/imgs/${time}.png`
        }

        const code = await Product.findByIdAndUpdate(_id,{Name:Name,Img:Img.includes("data:image/*;base64,")?`/imgs/${time}.png`:Img,Price:Price},{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/products",protect,async(req,res)=>{
    try{
        const users = await Product.find();

        res.status(200).json(users);
        }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/buy/:id",protect,async(req,res)=>{
    try{
        const {Details}=req.body
        if(!Details)
            return res.status(400).json({msg:"الرجاء ادخال البيانات"});
        let product = await Product.findOne({_id:req.params.id});
        
        if(req.user.Points<product.Price)
            return res.status(400).json({msg:"ليس لديك النقاط الكافي"});

        const user=await User.findByIdAndUpdate(req.user._id,{
            Points:req.user.Points-product.Price
        },{ new: true })

        await Order.create({
            User:req.user._id,
            Product:product._id,
            Details:Details
        })

        return res.status(200).json(user);
    }
    catch(e)
    {
        console.log(e);
    }
})
module.exports = app;