const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Exam = require('../models/ExamModel');
const Questionm = require('../models/QuestionModel');
const ExamDone = require('../models/ExamDoneModel');

app.post("/",nd,async(req,res)=>{
    try{
    const {Name,Questions,Private,Year,Term} =req.body;
    if(!Name || !Questions || !Year ||!Term)
        return res.status(404).json({msg:"need data"});

    const power = await Exam.create({
        Name:Name,
        Questions:Questions,
        Private:Private,
        Year:Year,
        Term:Term
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
        const users = await Exam.find().skip((num-1)*10).limit(10).populate("Questions","_id Name");
        res.status(200).json(users);
        }
        else{
            const users = await Exam.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10).populate("Questions","_id Name");
            res.status(200).json(users);
        }
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/exams",async(req,res)=>{
    try{
        let num = req.query.num;
        let type = req.query.type;
        let s = req.query.s;
        let year = req.query.year;
        let term = req.query.term;

        const users = await Exam.find({Year:{$regex:Number(year)?year:""},Term:{$regex:Number(term)?term:""},Private:false,Name: {$regex:  s?s:""}}).skip((1-1)*10).limit(10);

        res.status(200).json(users);
        }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/exams/:id",async(req,res)=>{
    try{
        const users = await Exam.findOne({_id:req.params.id,Private:false}).populate({ path: 'Questions', select: '-Aimg -CorrectAnswer' });
        res.status(200).json(users);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/examsloged/:id",protect,async(req,res)=>{
    try{
        const exam = await Exam.findOne({_id:req.params.id,Private:false}).populate({ path: 'Questions', select: '-Aimg -CorrectAnswer' });
        
        let have=false;
            req.user.Solvedexames.map((s)=>{
                if(String(exam._id)==String(s))
                return have=true;
            });

            if(have)
                return res.status(404).json({msg:"لا يمكن دخول الأمتحان اكثر من مرة"});


        res.status(200).json(exam);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/solveexam",async(req,res)=>{
    try{
        const {_id,Questions,Name,Phone} =req.body;
        if(!_id || !Questions||!Name||!Phone)
            return res.status(404).json({msg:"need data"});

        const score =await Promise.all(  Questions.map(async(q)=>{
            const theq = await Questionm.findOne({_id:q._id,CorrectAnswer:q.Answer})
                 if(theq)
                 {
                     return true;
                 }
                 else
                 return false
        }))

        const exam = await Exam.findOne({_id:_id,Private:false}).populate({ path: 'Questions', select: '-Qimg -Answer1 -Answer2 -Answer3 -Answer4' });
        
        await ExamDone.create({
            Name:Name,
            Phone:Phone,
            Result:score.filter(x => x==true).length,
            Total:score.length,
            Exam:_id
        });
        console.log(ExamDone)
        res.status(200).json({score:score.filter(x => x==true).length,examAnswers:exam});
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/solveexamloged",protect,async(req,res)=>{
    try{
        const {_id,Questions} =req.body;
        if(!_id || !Questions)
            return res.status(404).json({msg:"need data"});

        const score =await Promise.all(  Questions.map(async(q)=>{
            const theq = await Questionm.findOne({_id:q._id,CorrectAnswer:q.Answer})
                 if(theq)
                 {
                     return true;
                 }
                 else
                 return false
        }))

        const exam = await Exam.findOne({_id:_id,Private:false}).populate({ path: 'Questions', select: '-Qimg -Answer1 -Answer2 -Answer3 -Answer4' });
        
        await User.findByIdAndUpdate(req.user._id,{
            Solvedexames:[...req.user.Solvedexames,exam._id]
          })

        await ExamDone.create({
            Name:req.user.UserName,
            Phone:req.user.Phone,
            Result:score.filter(x => x==true).length,
            Total:score.length,
            Exam:_id
        });
        console.log(ExamDone)
        res.status(200).json({score:score.filter(x => x==true).length,examAnswers:exam});
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/solveexam",nd,async(req,res)=>{
    try{
        const exames = await Exam.find().select("Name _id");
        //const count = await ExamDone.find({Exam:id}).countDocument();    

        const score =await Promise.all(  exames.map(async(q)=>{
            const theq = await ExamDone.find({Exam:q._id}).count();
                 if(theq)
                 {
                     return {Count:theq,Name:q.Name};
                 }
                 else
                 return false
        }))


        res.status(200).json(score);
       
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Exam.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Exam.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",nd,async(req,res)=>{
    try{
        const {_id,Name,Questions,Private,Year,Term} =req.body;
        if(!_id||!Name || !Questions  || !Year ||!Term)
            return res.status(404).json({msg:"need data"});

    const code = await Exam.findByIdAndUpdate(_id,{
        Name:Name,
        Questions:Questions,
        Private:Private,
        Year:Year,
        Term:Term
    },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;