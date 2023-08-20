const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const URL = require('../models/UrlModel');

app.post("/",nd,async(req,res)=>{
    try{
    const {Url,Name} =req.body;
    if(!Url||!Name)
        return res.status(404).json({msg:"need data"});
    
        const codeExists = await URL.findOne({Name:Name});

        if(codeExists)
        {
            res.status(400).json({msg:"الكود مستخدم بالفعل"});
        return;
        }

       
    const power = await URL.create({
        Url:Url,
        Name:Name
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
        const codes = await URL.find().skip((num-1)*10).limit(10);
        res.status(200).json(codes);
    }
    catch(e)
    {
        console.log(e);
    }
})
app.get("/:id",async(req,res)=>{
    try{
        let num = req.query.num;
        const codes = await URL.findOne({Name:req.params.id});
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
        const codeExists = await URL.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await URL.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",nd,async(req,res)=>{
    try{
    const {_id,Name,Url} =req.body;
    if(!Name || !Url||!_id)
        return res.status(404).json({msg:"need data"});

    const code = await URL.findByIdAndUpdate(_id,{Name:Name,Url:Url},{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

module.exports = app;