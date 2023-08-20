const express = require('express');
const app = express.Router();
const {protect,nd}= require("../authMiddleware");
const User = require('../models/UserModel');
const Block = require('../models/BlockModel');
const Upload = require('../models/UploadModel');
const { findById } = require('../models/UserModel');
const path = require ('path');
const multer = require ('multer');
const fs = require('fs');


//upload settings

// storage engine for multer
const storageEngine = multer.diskStorage ({
    destination: './media',
    filename: function (req, file, callback) {
      callback (
        null,
        file.fieldname + '-' + Date.now () + path.extname (file.originalname)
      );
    },
  });
  
    // file filter for multer
    const fileFilter = (req, file, callback) => {
      let pattern = /jpg|png|mp4/; // reqex
  
      if (pattern.test (path.extname (file.originalname))) {
        callback (null, true);
      } else {
        callback ('Error: not a valid file');
      }
    };
  
  // initialize multer
  const upload = multer ({
    storage: storageEngine,
    fileFilter: fileFilter,
  });
  



//blockroutes

app.post("/",nd,async(req,res)=>{
    try{
    const {Name,Type} =req.body;
    if(!Name || !Type)
        return res.status(404).json({msg:"need data"});
        

    const power = await Block.create({
        Name:Name,
        Type:Type,
        Content:req.body.Content || "",
        Link:req.body.Link || "",
        Doc:req.body.Doc || "",
        ExamId:req.body.ExamId || ""
    });

    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/video",nd, upload.single ('uploadedFile'),async(req,res)=>{
    try{
    const {Name,Type} =req.body;
    if(!Name || !Type)
        return res.status(404).json({msg:"need data"});
        
        const upload=Upload.create({
            Name:req.body.fileTitle,
            url:req.file.filename
        })


    const power = await Block.create({
        Name:Name,
        Type:Type,
        Video:req.file.filename || "",
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
            const Blocks = await Block.find().skip((num-1)*10).limit(10);
            res.status(200).json(Blocks);
        }
        else if(type=="Name"){
            const Blocks = await Block.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(Blocks);
        }
        else if(type=="Type"){
            const Blocks = await Block.find({Question: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(Blocks);
        }
        else{
            const Blocks = await Block.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(Blocks);
        }

        
        
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Block.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"البلوك غير موجود"});
        return;
        }

        await Block.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/editvideo",nd,async(req,res)=>{
    try{
        const {_id,Name,Type} =req.body;
        if(!Name )
        return res.status(404).json({msg:"need data"});

        const code = await Block.findByIdAndUpdate(_id,{
            Name:Name
        },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


app.post("/edit",nd,async(req,res)=>{
    try{
        const {_id,Name,Type} =req.body;
        if(!Name || !Type)
        return res.status(404).json({msg:"need data"});

        const code = await Block.findByIdAndUpdate(_id,{
            Name:Name,
            Type:Type,
            Video:req.body.Video || "",
            Content:req.body.Content || "",
            Link:req.body.Link || "",
            Doc:req.body.Doc || "",
            ExamJSON:req.body.ExamJSON || ""
        },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

  // upload routing
  app.post ('/upload',nd, upload.single ('uploadedFile'), (req, res) => {
    const upload=Upload.create({
        Name:req.body.fileTitle,
        url:req.file.filename
    })
    res.json (upload).status (200);
  });

  app.get("/upload",nd,async(req,res)=>{
    try{
        let num = req.query.num;
        const uploads = await Upload.find().skip((num-1)*10).limit(10);
        res.status(200).json(uploads);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/upload/delete",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Upload.findOne({_id:_id});

        if(!codeExists)
        {

            res.status(400).json({msg:"الفيديو غير موجود"});
        return;
        }

        if( fs.existsSync(__dirname+'/../media/'+codeExists.url))
        {
                console.log(__dirname+'/../media/'+codeExists.url)
                await fs.rmSync(__dirname+'/../media/'+codeExists.url,{force:true});
                await Upload.findOneAndDelete({_id:_id});
        }
        else {
            return res.status(404).json({msg:"الملف غير موجود"});

        }

        return res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/upload/edit",nd,async(req,res)=>{
    try{
        const {_id,Name} =req.body;
        if(!Name )
        return res.status(404).json({msg:"need data"});

        const code = await Upload.findByIdAndUpdate(_id,{
            Name:Name,
        },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;