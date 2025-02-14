const express = require('express');
const https = require("https");
require('dotenv').config();
const mongoose = require('mongoose');
const {protect}= require("./authMiddleware")
const cors = require("cors");
const fs = require('fs');
const Section = require('./models/SectionModel');
const User = require('./models/UserModel');
var hpp = require('hpp');
const { default: helmet } = require('helmet');
var toobusy = require('toobusy-js')

//server
const app=express();
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb',extended:false}));

const key = fs.readFileSync('./privkey.pem',"utf-8")
const cert = fs.readFileSync('./cert.pem',"utf-8")
const listener =()=>console.log('server is running');
https.createServer({key,cert},app).listen(process.env.PORT,listener)

app.use(cors({
    origin: ['http://192.168.1.3:3500','http://192.168.1.3:3000','http://localhost:3000','http://localhost:3500',"http://178.62.76.207:3500"]
}));

//mongodb
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}
connectDB();

//routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/code", require("./routes/coderoutes"));
app.use("/api/teacher", require("./routes/teacherroutes"));
app.use("/api/question", require("./routes/questionroutes"));
app.use("/api/exam", require("./routes/examroutes"));
app.use("/api/url", require("./routes/urlroutes"));
app.use("/api/block", require("./routes/blockroutes"));
app.use("/api/section", require("./routes/sectionroutes"));
app.use("/api/course", require("./routes/courseroutes"));
app.use("/api/product", require("./routes/productsroutes"));
app.use("/api/order", require("./routes/orderroutes"));



app.use((req, res, next) => {
  if (req.hostname === 'www.amer-academy.com') {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  next();
});



//dos protect
app.use(function(req, res, next) {
    if (toobusy()) {
      res.send(503, "I'm busy right now, sorry.");
    } else {
      next();
    }
  });

//Parameter Pollution protect
app.use(hpp()); 

//security headers


//videos
app.get('/video/:name', async function(req, res) {
    try{
    let section = await Section.findOne({"Sections.Video":req.params.name,"_id":req.query.sectionid}).populate("Blocks");

    //VideoToken
    const user = await User.findOne({VideoToken:req.query.token});
    if(!user)
    return res.status(404).json({msg:"Error"});

    let have=false;
    if(!section.Isfree)
        user.Sections.map((s)=>{
            if(String(section._id)==String(s))
            return have=true;
        });

   

    if(!section.Isfree && have==false)
        return res.status(404).json({msg:"Error"});

    const path = __dirname + `/media/${req.params.name}`
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        }
        res.setHeader("Content-Type","video/mp4");
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        await User.findByIdAndUpdate(user._id,{
            VideoToken:"null"
        })
    }
}catch{(e)=>console.log(e)}
});

app.all(`/media/*`, (req,res, next)=> {
    console.log(req.body)
    res.status(403).send({
        message: 'Access Forbidden'
    });
});

app.use('/media', express.static(__dirname + '/media'));
app.use('/imgs', express.static(__dirname + '/imgs'));


//frontend
app.use(express.static(__dirname + '/build'));
app.get("*",(req,res)=>{
    res.sendFile(`${__dirname}/build/index.html`)
})
