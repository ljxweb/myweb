//这里是服务器哦！！！
//创建web服务器，托管静态资源到public目录，请求user_register.html
const express = require('express');
const userRouter= require('./routes/user.js');
const productRouter= require('./routes/product.js');
const bodyParser=require('body-parser');
let app = express();
app.listen(9889);

//托管静态资源到public
app.use(express.static('public'));
//使用body-parser中间件，将post请求数据解析成对象
app.use(bodyParser.urlencoded({
	extended:false//不适用扩展的qs模块，而使用querystring模块
}))
//把路由器挂载到服务器下，添加前缀  /user
  //请求变成：/user/register
app.use('/user',userRouter);
app.use('/product',productRouter);