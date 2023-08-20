const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Teacher = require('../models/TeacherModel');
const { findById } = require('../models/UserModel');

app.post("/",nd,async(req,res)=>{
    try{
    const {Name,Img} =req.body;
    if(!Name || !Img)
        return res.status(404).json({msg:"need data"});
    
        const codeExists = await Teacher.findOne({Name:Name});

        if(codeExists)
        {
            res.status(400).json({msg:"المدرس موجود بالفعل"});
        return;
        }

        

    const power = await Teacher.create({
        Name:Name,
        Img:Img
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
        const Teachers = await Teacher.find().skip((num-1)*10).limit(10);
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
        const codeExists = await Teacher.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"المدرس غير موجود"});
        return;
        }

        await Teacher.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",nd,async(req,res)=>{
    try{
    const {_id,Name,Img} =req.body;
    if(!Name || !Img)
        return res.status(404).json({msg:"need data"});

        const code = await Teacher.findByIdAndUpdate(_id,{Name:Name,Img:Img},{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

module.exports = app;