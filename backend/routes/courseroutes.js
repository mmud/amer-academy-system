const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Course = require('../models/CourseModel');
const Section = require('../models/SectionModel');
const { default: mongoose } = require('mongoose');


app.post("/",nd,async(req,res)=>{
    try{
    const {Name,Sections,Term,Year,Img,Private} =req.body;
    
    if(!Name || !Sections ||!String(Year)||!String(Term)||!Img)
        return res.status(404).json({msg:"need data"});

        let time =Date.now ();
        var base64Data = Img.replace("data:image/*;base64,", "");
    
        require("fs").writeFile(__dirname+`/../imgs/${time}.png`, base64Data, 'base64', function(err) {
          console.log(err);
        });   

    const power = await Course.create({
        Name:Name,
        Sections:Sections,
        Term:Term,
        Year:Year,
        Img:`/imgs/${time}.png`,
        Private:Private
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
        const users = await Course.find().skip((num-1)*10).limit(10).populate("Sections","_id Name");
        res.status(200).json(users);
        }
        else{
            const users = await Course.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10).populate("Sections","_id Name");
            res.status(200).json(users);
        }
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/courses",protect,async(req,res)=>{
    try{
        let num = req.query.num;
        let type = req.query.type;
        let s = req.query.s;
        let year = req.query.year;
        let term = req.query.term;
        let users;

        if(year==0)
            year=null

        if(year)
            users = await Course.find({Year:{$regex:year?year:""},Term:{$regex:Number(term)?term:""},Private:false,Name: {$regex:  s?s:""}}).skip((1-1)*10).limit(10);
        else if(year==0||year==undefined||year==null)
            users = await Course.find({Year:["1","2","3"],Term:{$regex:Number(term)?term:""},Private:false,Name: {$regex:  s?s:""}}).skip((1-1)*10).limit(10);
        
        res.status(200).json(users);
        }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/courses/:id",protect,async(req,res)=>{
    try{
        let course = await Course.findOne({_id:req.params.id,Private:false}).populate({ path: 'Sections',populate:{path:"Blocks",select:"Name Type"}});
       
        const Sections =await Promise.all(  course.Sections.map(async(c)=>{

            let theq=false;
            await req.user.Sections.map((s)=>{
                if(String(c._doc._id)==String(s))
                    theq=true;
            });
                 if(theq)
                 {
                     return {...(c._doc),Have:true};
                 }
                 else
                 return {...(c._doc),Have:false};
        }))
        
        course={...course._doc,Sections:Sections};
        res.status(200).json(course);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/buysection/:id",protect,async(req,res)=>{
    try{
        let section = await Section.findOne({_id:req.params.id});
        
        if(req.user.Money<section.Price)
            return res.status(400).json({msg:"ليس لديك المال الكافي"});

        req.user.Sections.map((s)=>{
            if(String(section._id)==String(s))
            return res.status(400).json({msg:"الحصة معاك بالفعل"});
        });

        const user=await User.findByIdAndUpdate(req.user._id,{
            Money:req.user.Money-section.Price,Sections:[...(req.user.Sections),section._id]
        },{ new: true })

        return res.status(200).json({Money:section.Price});
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/section/:id",protect,async(req,res)=>{
    try{
        let section = await Section.findOne({_id:req.params.id}).populate("Blocks");
        var VideoToken = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);

        await User.findByIdAndUpdate(req.user._id,{
            VideoToken
        })

        let have=false;
        if(!section.Isfree)
            req.user.Sections.map((s)=>{
                if(String(section._id)==String(s))
                return have=true;
            });

        if(have || section.Isfree)
            return res.status(200).json({...section._doc,VideoToken});
        else
            return res.status(400).json({msg:"الحصة ليست لديك"});
    }
    catch(e)
    {
        console.log(e);
    }
})



app.post("/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Course.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Course.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",nd,async(req,res)=>{
    try{
        const {_id,Name,Sections,Term,Year,Img,Private} =req.body;
        if(!Name || !Sections ||!String(Year)||!String(Term)||!Img)
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

    const code = await Course.findByIdAndUpdate(_id,{
        Name:Name,
        Sections:Sections,
        Term:Term,
        Year:Year,
        Img:Img.includes("data:image/*;base64,")?`/imgs/${time}.png`:Img,
        Private:Private
    },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;