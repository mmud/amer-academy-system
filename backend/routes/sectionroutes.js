const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Section = require('../models/SectionModel');


app.post("/",nd,async(req,res)=>{
    try{
    const {Name,Price,Blocks,Isfree,Year} =req.body;
    if(!Name || !Price || !Blocks ||!String(Year))
        return res.status(404).json({msg:"need data"});


    const power = await Section.create({
        Name:Name,
        Price:Price,
        Blocks:Blocks,
        Isfree:Isfree,
        Year:Year
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
        let type = req.query.type;
        let s = req.query.s;
        if(s==""){
        const users = await Section.find().skip((num-1)*10).limit(10).populate("Blocks","_id Name");
        res.status(200).json(users);
        }
        else{
            const users = await Section.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10).populate("Blocks","_id Name");
            res.status(200).json(users);
        }
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/mysctions",protect,async(req,res)=>{
    try{
        let user = await User.findById(req.user._id).select('-password').populate({ path: 'Sections',populate:{path:"Blocks",select:"Name Type"}});
        
        res.status(200).json(user.Sections)
    }
    catch(e)
    {
        console.log(e);
    }
})


// app.get("/exams",async(req,res)=>{
//     try{
//         let num = req.query.num;
//         let type = req.query.type;
//         let s = req.query.s;
//         let year = req.query.year;
//         let term = req.query.term;

//         const users = await Exam.find({Year:{$regex:Number(year)?year:""},Term:{$regex:Number(term)?term:""},Private:false,Name: {$regex:  s?s:""}}).skip((1-1)*10).limit(10);

//         res.status(200).json(users);
//         }
//     catch(e)
//     {
//         console.log(e);
//     }
// })

// app.get("/exams/:id",async(req,res)=>{
//     try{
//         const users = await Exam.findOne({_id:req.params.id,Private:false}).populate({ path: 'Questions', select: '-Aimg -CorrectAnswer' });
//         res.status(200).json(users);
//     }
//     catch(e)
//     {
//         console.log(e);
//     }
// })

app.post("/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Section.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Section.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",nd,async(req,res)=>{
    try{
        const {_id,Name,Price,Blocks,Isfree,Year} =req.body;
        if(!_id||!Name || !Price || !Blocks ||!String(Year))
                return res.status(404).json({msg:"need data"});

    const code = await Section.findByIdAndUpdate(_id,{
        Name:Name,
        Price:Price,
        Blocks:Blocks,
        Isfree:Isfree,
        Year:Year
    },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;