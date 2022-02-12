const express = require('express');
const pool=require('../pool.js');//引入上一级目录的连接池
let router=express.Router();
//挂载路由
//1.商品列表 post /product/list
router.get('/list',(req,res)=>{
	//5.1获取请求中以查询字符串传递的数据
	let obj=req.query;
	//5.2验证是否为空如果页码为空，设置默认为1
	if(!obj.pno){
		obj.pno=1;
	}
	//如果每页的数量为空，设置默认为5
	if(!obj.count){
	obj.count=5;	
	}
	//5.3将每页的数据量转为数值型
	let count = parseInt(obj.count);
	//console.log(obj);
	//5.4计算开始查询的值
	let start = (obj.pno-1)*obj.count;
	//5.5执行sql语句
	pool.query('select * from product limit ?,?',[start,count],(err,result)=>{
		if(err) {
			//throw err;
			//如果执行sql命令错误，响应服务器端错误
			res.send({
				code:500,
				msg:'serve error'
			});
			//不能再往后执行了，跳出当前的函数
			return;
		}
		//获取到sql命令的结果
		res.send({
			code:200,
			msg:'用户列表',
			data:result
		});
	})
});
//导出路由器对象，交给服务器使用
module.exports=router;