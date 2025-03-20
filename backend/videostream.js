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
    // or whatever
});

app.use('/media', express.static(__dirname + '/media'));
