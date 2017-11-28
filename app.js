/**
 * app.js：入口文件
controller：控制台
views:资源文件（jade、ejs）
modles：处理业务逻辑
uploads：上传目录的文件夹
public：公共资源，img、css
node_modules：模块依赖文件夹
 */
var express = require("express")

var app = express()

var router = require("./controller/route.js")

app.set("view engine","ejs")

//配置静态资源
app.use(express.static("./public"))
app.use(express.static("./uploads"))



app.get("/",router.showIndex)

app.get("/:photoName",router.showPhoto)//显示相册，在url上面显示文件夹名字

app.get("/up",router.showUp)//上传按钮

app.post("/up",router.doPost)

app.use(function(req,res){
    res.render("err")
})

app.listen(3000)