const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
var bouncer = require ("express-bouncer")(500, 900000);

app.post("/",nd,async(req,res)=>{
    try{
    const {Token,Money} =req.body;
    if(!Token || !Money)
        return res.status(404).json({msg:"need data"});
    
        const codeExists = await Code.findOne({Token:Token});

        if(codeExists)
        {
            res.status(400).json({msg:"الكود مستخدم بالفعل"});
        return;
        }

        if(Money<=0)
        return res.status(400).json({msg:"يرجي كتابة مبلغ صحيح"});

    const power = await Code.create({
        Token:Token,
        Money:Money
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
        const codes = await Code.find().skip((num-1)*10).limit(10);
        res.status(200).json(codes);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Code.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Code.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",nd,async(req,res)=>{
    try{
    const {_id,Token,Money} =req.body;
    if(!Token || !Money)
        return res.status(404).json({msg:"need data"});

        if(Money<=0)
        return res.status(400).json({msg:"يرجي كتابة مبلغ صحيح"});

        const code = await Code.findByIdAndUpdate(_id,{Token:Token,Money:Money},{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/add",bouncer.block,protect,async(req,res)=>{
    try{
    const {Token} =req.body;
    if(!Token)
        return res.status(404).json({msg:"الرجاء ادخال البيانات"});

    const code = await Code.findOne({Token:Token});
    if(!code)
        return res.status(404).json({msg:"الكود غير موجود"});

    const user = await User.findByIdAndUpdate(req.user._id,{Money:Number(req.user.Money)+Number(code.Money)});

    await Code.findByIdAndDelete(code._id);

    res.status(200).json({Money:Number(code.Money)});
    }
    catch(e)
    {
        console.log(e);
    }
})

module.exports = app;