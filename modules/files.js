var fs  = require("fs");

exports.getAllAlbums = function(callback){//读取所有的文件夹
    //读取文件是异步
    fs.readdir("./uploads",function(err,files){
        if(err){
            throw err
            return
        }
        var allAlbums = [];//用来接收文件夹
        (function iterator(i){//异步for循环没用
            if(i ==files.length){
                callback(allAlbums)//回调函数
                return;//结束循环
            }
                fs.stat("./uploads/"+ files[i],function(err,stats){
            if(err){
                throw err//找不到文件
                }
            if(stats.isDirectory()){
                allAlbums.push(files[i])
            }
            iterator(i+1)
            })
        })(0)
    
    })
    
}

exports.getAllImagesByPhotoName = function(photoName,callback){//读取所有的图片
    fs.readdir("./uploads/"+photoName,function(err,files){
        if(err){
            callback("没找到文件",null)
            return
        }

        var allImages = [];
        (function iterator(i){//异步for循环没用
            if(i ==files.length){
                callback(null,allImages)//回调函数
                return;//结束循环
            }
            //uploads/当前点击的相册文件夹/相册文件
                fs.stat("./uploads/"+ photoName+"/"+files[i],function(err,stats){
            if(err){
                callback("找不到文件"+files[i],null)
                return
                }
                /**
                 * 如果需要整个全部显示，判断是不是文件夹或者图片，如果满足其中一个就push
                 */
            if(stats.isFile()){
                allImages.push(files[i])
            }
            iterator(i+1)
            })
        })(0)
    })
}