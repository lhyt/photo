//路由只是方法的罗列，具体业务实现由model实现

var file = require("../modules/files.js")
var formidable = require("formidable")
var path = require("path")
var fs = require("fs")
var sd = require("silly-datetime")

exports.showIndex = function(req,res,next){//显示首页
    //读取所有的文件夹
    //allAlbums.length
    var allFolders = file.getAllAlbums(function(allFolders){
        res.render("index",{
        allAlbums:allFolders//渲染到index  
    })
    });


    /**因为异步不能这样
     *     var allFolders = file.getAllAlbums();
    res.render("index",{
        allAlbums:allFolders
    })//渲染到index
     */
}

exports.showPhoto = function(req,res,next){
    //获取点击的那个相册
    var photoName = req.params.photoName
    file.getAllImagesByPhotoName(photoName,function(err,imagesArr){
        if(err){
            next();//交给下面的中间件处理
            return;
        }
        res.render("photo",{
            "photoName":photoName,
            "images":imagesArr
        })
    })
}

exports.showUp = function(req,res){
    var allFolders = file.getAllAlbums(function(allFolders){
        res.render("up",{
        allAlbums:allFolders//渲染到up
    })
    });
}

exports.doPost = function(req,res){
    var form = new formidable.IncomingForm()//创建请求

    form.uploadDir = path.normalize(__dirname + "/../tempup/")
    //在parse前设置上传路径意味着可能没接收到请求
    form.parse(req,function(err,fields,files,next){//不能在里面设置上传路径
        if(err){//到parse的时候已经接受到请求了
            next()
            return
        }
        var size = files.uploadfile.size/1024
        if(size > 2000){
            res.send("图片太大")//已经上传了
            fs.unlink(files.uploadfile.path)//删除大图
            return
        }
        var newdate = sd.format(new Date(),"YYYYMMDDHHmmss");
        var ran = parseInt(Math.random()*89999 + 10000);
        var extname = path.extname(files.uploadfile.name);//获取文件后缀
        var folder = fields.folderName;//拿到指定的文件夹名称
        //   ../表示切换到上一级目录
        var oldpath = files.uploadfile.path;
        var newpath = path.normalize(__dirname + "/../uploads/" + folder + "/" + (newdate+ran+extname));
        console.log("当前路径：" + __dirname);
        console.log("旧的路径：" + oldpath);
        console.log("新的路径：" + newpath);
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("改名失败了");//res.redirect("/")
                return;
            }
            res.send("成功");
        });  
    })
}