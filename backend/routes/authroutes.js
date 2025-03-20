const express = require('express');
const app = express.Router();
const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {protect,nd}= require("../authMiddleware");
const sendEmail = require("../sendEmail");
var bouncer = require ("express-bouncer")(500, 900000);


//defualt admin
// const defualtadmin=async()=>{
//     const userExists = await User.findOne({Email:process.env.ADMIN_EMAIL});

//         if(userExists)
//             return;
//         else
//         {
//             const salt = await bcrypt.genSalt(10);
//             const hashedpassword = await bcrypt.hash(process.env.ADMIN_PASSWORD.replace(/ /g,''),salt);

//             await User.create({
//                 UserName:"admin",
//                 Email:process.env.ADMIN_EMAIL,
//                 Password:hashedpassword,
//                 Role:"nd",
//                 Phone:"01203094821",
//                 Year:1 
//             })
//         }
// }
// defualtadmin();

//register new user
app.post('/register',bouncer.block,async(req,res)=>{
    try{
        //data check
        const {UserName,Email,Password1,Password2,Phone,Year} = req.body;

        if(!UserName || !Email || !Password1 || !Password2 || !Phone || !Year)
        {
            res.status(400).json({msg:"الرجاء ادخال البيانات"});
            return;
        }
        
        if(UserName.toLowerCase().length<6)
        {
            res.status(400).json({msg:"الأسم يجب ان يكون اكثر من 6 حروف"});
            return;
        }

        if(!Email.toLowerCase().replace(/ /g,'')
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )){
            res.status(400).json({msg:"الرجاء كتابة بريد الكتروني صحيح"});
            return;
        }

        if(!Phone.toLowerCase().replace(/ /g,'')
        .match(
            /^01[0125][0-9]{8}$/
        )){
            res.status(400).json({msg:"الرجاء كتابة رقم هاتف صحيح"});
            return;
        }


        if(!Password1.replace(/ /g,'').match(/^[a-zA-Z\d]{6,}$/) )
            {
            res.status(400).json({msg:"كلمة المرور يجب ان تكون اكثر من 6 حرف"});
            return;
            }


        if(Password1.replace(/ /g,'') != Password2.replace(/ /g,''))
        {    
        res.status(400).json({msg:"كلمة المرور غير مطابقة"});
        return
        }

        const userExists = await User.findOne({Email:Email.toLowerCase().replace(/ /g,'')});

        if(userExists)
        {
            res.status(400).json({msg:"البريد الاكتروني مستخدم بالفعل"});
        return;
        }

        const userPhone = await User.findOne({Phone:Phone.replace(/ /g,'')});

        if(userPhone)
        {
            res.status(400).json({msg:"رقم الهاتف مستخدم بالفعل"});
        return;
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(Password1.replace(/ /g,''),salt);

        //token verify email
       // var emailverifyToken = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
        console.log(Number(Year) !==2)
       if(Number(Year) !==1 && Number(Year) !==2 && Number(Year) !==3)
       {
        res.status(400).json({msg:"الرجاء ادخال السنة الدراسية"});
        return;
       }

        //create user
        const user = await User.create({
            UserName:UserName.toLowerCase().replace(/ /g,''),
            Email:Email.replace(/ /g,''),
            Password:hashedpassword,
            Role:"user",
            Phone:Phone.replace(/ /g,''),
            Year:Year 
        })
        if(user)
        {
            res.status(201).json({meg:"done"});
            
            //send verify email
            // await sendEmail({
            //     to:Email.replace(/ /g,''),
            //     subject:"Verify Email",
            //     text:`
            //     <h1>You need to verify your email</h1>
            //     <p>Please go to this link to verify your email</p>
            //     <a href=${process.env.FRONTURL}/users/${user._id}/verify/${emailverifyToken} clicktracking=off>${process.env.FRONTURL}/users/${user._id}/verify/${emailverifyToken}</a>
            //     `
            // });
        }
        else
            res.status(500).json({msg:"الرجاء ادخال بيانات صحيحة"})
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

//login
app.post('/login',bouncer.block,async(req,res)=>{
    try{
        //data check
        const {Email,Password} = req.body;

        if(!Email || !Password)
        res.status(400).json({msg:"الرجاء ادخال البيانات"});
        
        const user = await User.findOne({Email:Email});

        if(user &&(await bcrypt.compare(Password,user.Password)))
        {
            if(user.verified == false)
            {
                res.status(400).json({msg:"الرجاء تفعيل حسابك"});
                return;
            }
            res.status(201).json({
                id:user.id,
                name:user.UserName,
                email:user.Email,
                token:generateToken(user._id,user.Role)
            });
        }
        else
            res.status(400).json({msg:"كلمة المرور او البريد الاكتروني"});
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

    }
})

//email verify
app.post('/verify',async(req,res)=>{
    try{
        const {id,token}=req.body;
        if(!id||!token)
        {
            res.status(404).send({message:"not found"});
            return;
        }
        const user = await User.findOne({_id:id});
        if(!user)
        {
            res.status(404).send({message:"not found"});
            return;
        }
        await User.findByIdAndUpdate({_id:user._id},{verified:true})
        
        res.status(200).send({message:"done"});
    }catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

    }
})



app.get('/isloggedin',protect,(req,res)=>{
    res.status(200).send("logedin");
});

//get user data
app.get('/getme',protect,async(req,res)=>{
    try{
        const {UserName,Email,Role,Points,Money,Phone,Year}=await User.findById(req.user.id);
        res.status(200).json({
            UserName:UserName,
            Phone:Phone,
            money:Money,
            Year:Year,
            Points:Points
        })
    }catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

    }
});

//get user money
app.get('/getmymoney',protect,async(req,res)=>{
    try{
        const {Money}=await User.findById(req.user.id);
        res.status(200).json({
            money:Money
        })
    }catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});

    }
});

//update user
app.post('/updateuser',protect,async(req,res)=>{
    try{
        //data check
        const {UserName,Phone,Year} = req.body;

        if(!UserName || !Phone )
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        if(UserName.toLowerCase().length<6)
        {
            res.status(400).json({msg:"الأسم يجب ان يكون اكثر من 6 حروف"});
            return;
        }
        
        if(!Phone.toLowerCase().replace(/ /g,'')
        .match(
            /^01[0125][0-9]{8}$/
        )){
            res.status(400).json({msg:"الرجاء كتابة رقم هاتف صحيح"});
            return;
        }

       await User.findByIdAndUpdate(req.user._id,{
        UserName,Phone,Year
       },{ new: true })

       res.status(200).json({msg:"done"});
    }
    catch(error)
    {
        console.log(error);
        //res.status(500).json({msg:error.message});
    }
})

app.get("/",nd,async(req,res)=>{
    try{
        let num = req.query.num;
        let type = req.query.type;
        let s = req.query.s;
        if(s==""){
        const users = await User.find().skip((num-1)*10).limit(10);
        res.status(200).json(users);
        }
        else if(type=="Email"){
            const users = await User.find({Email: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(users);
        }
        else if(type=="Phone"){
            const users = await User.find({Phone: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(users);
        }
        else{
            const users = await User.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(users);
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
        const codeExists = await User.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await User.findOneAndDelete({_id:_id});

         res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/verifyacc",nd,async(req,res)=>{
    try{
    const {_id} =req.body;
        const user = await User.findOne({_id:_id});

        if(!user)
        {
            res.status(400).json({msg:"الطالب غير موجود"});
        return;
        }

        await User.findByIdAndUpdate({_id:user._id},{verified:true})

         res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/editacc",nd,async(req,res)=>{
    try{
        const {_id,Name,Phone,Year,Points,Money,Email,Password} = req.body;

        if(!Name || !Phone || !Year ||!String(Money) ||!String(Points)||!Email ||!_id)
        {
            res.status(400).json({msg:"need data"});
            return;
        }
        
        if(Name.toLowerCase().length<6)
        {
            res.status(400).json({msg:"الأسم يجب ان يكون اكثر من 6 حروف"});
            return;
        }
        
        if(!Phone.toLowerCase().replace(/ /g,'')
        .match(
            /^01[0125][0-9]{8}$/
        )){
            res.status(400).json({msg:"الرجاء كتابة رقم هاتف صحيح"});
            return;
        }

        if(!Email.toLowerCase().replace(/ /g,'')
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )){
            res.status(400).json({msg:"الرجاء كتابة بريد الكتروني صحيح"});
            return;
        }

        if(!Phone.toLowerCase().replace(/ /g,'')
        .match(
            /^01[0125][0-9]{8}$/
        )){
            res.status(400).json({msg:"الرجاء كتابة رقم هاتف صحيح"});
            return;
        }

        if(Password){
            if(!Password.replace(/ /g,'').match(/^[a-zA-Z\d]{6,}$/) )
            {
            res.status(400).json({msg:"كلمة المرور يجب ان تكون اكثر من 6 حرف"});
            return;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(Password.replace(/ /g,''),salt);
    
            await User.findByIdAndUpdate(_id,{
                UserName:Name,Phone,Year,Points,Money,Email,Password:hashedpassword
               })
        }
        else
        { 

               await User.findByIdAndUpdate(_id,{
                         UserName:Name,Phone,Year,Money,Email,Points
                       })
        }




    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


//jwt
const generateToken=(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
}

module.exports = app;