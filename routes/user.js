//创建路由器
const express = require('express');
const pool=require('../pool.js');//引入上一级目录的连接池
let router=express.Router();
//挂载路由
//1.用户注册 post  /register
router.post('/register',(req,res)=>{
	//1.1获取post请求的数据
	let obj=req.body;//因为在app.js中已经配置了body-parser中间件，所以可以直接使用req.body了
	console.log(obj);
	//1.2验证数据是否为空，如果为空，要做出响应
	if(!obj.uname||!obj.upwd){
		res.send({code:401,mgs:'用户名或者密码不能为空'});
		return;//跳出函数，不能继续往下执行
	}
	//1.3插入数据：执行sql语句
	pool.query('insert into user set ?',[obj],(err,result)=>{
		if(err){throw err};
		console.log(result);
		//判断，如果数据插入成果，则响应出来
		if(result.affectedRows>0){
			res.send({
				code:200,
				msg:'注册成功'
			});
		}
	});
	});
//2.用户登录 post /login
router.post('/login',(req,res)=>{
	//2.1获取post请求的数据
	let obj=req.body;
	//console.log(obj);
	//2.2验收数据是否为空
	if(!obj.uname||!obj.upwd){
		res.send({code:401,mgs:'用账号或者密码不能为空'});
		return;//跳出函数，不能继续往下执行
	}
	//res.send('登录成功');
	//2.3执行sql语句，
	pool.query('select * from user where uname = ?and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
		if(err) throw err;
		if(result.length==0){
			res.send({
				code:301,
				msg:'账号密码不正确'
			});
		}
		else if(result.length>0){
			res.send({
				code:200,
				msg:'登录成功',
				data:result
			});
		}
		
	});
	});	
//3.检索用户 get   /detail
router.get('/detail',(req,res)=>{
	//3.1获取数据
	let obj=req.query;
	//console.log(obj);
	//3.2验证数据是否为空
	if(!obj.id){
		res.send({
			code:401,
			msg:'编号为空'
		});
		return;
	}
	//3.3执行sql语句
	pool.query('select * from user where id = ?',[obj.id],(err,result)=>{
		if(err) throw err;
		if(result.length==0){
			res.send({
				code:301,
				msg:'编号不存在'
			});
		}
		else if(result.length>0){
			res.send({
				code:200,
				msg:'检索成功',
				data:result[0]
			});
		}	
	});
	});	
//4.修改用户资料post /update
router.post('/update',(req,res)=>{
	//4.1获取post请求的数据
	let obj=req.body;
	console.log(obj);
	//4.2验收数据是否为空
	let i =400;
	for(let key in obj){
		i++;
		console.log(key);//获取属性名
		console.log(obj[key]);//获取属性值
		if(!obj[key]){
			res.send({
				code:i,
				msg:key+'required'
			});
			return;
		}
		
	}
	//4.3执行sql语句
	pool.query('update user set ? where id = ?',[obj,obj.id],(err,result)=>{
		if(err) throw err;
		console.log(result);
		//判断是否修改成功
		if(result.affectedRows>0){
		res.send({
			code:200,
			msg:'修改成功'
		});	
		}
		else{
			res.send({
				code:301,
				msg:'修改失败'
			});	
		}
		
		
	});
});
//5.显示用户列表 post /user/list
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
	pool.query('select * from user limit ?,?',[start,count],(err,result)=>{
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
//6.删除用户 get /user/delete
router.get('/delete',(req,res)=>{
	//6.1获取数据
	let obj=req.query;
	console.log(obj);
	//6.2判断数据是否为空
	if(!obj.id){
		res.send({
			code:401,
			msg:'请输入编号'
		});
		return;
	}
	//6.3执行sql语句
	pool.query('delete from user where id = ?',[obj.id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
		res.send({
			code:200,
			msg:'删除成功'
		});	
		}
		else{
			res.send({
				code:301,
				msg:'删除失败'
			});	
		}
	});
	
});
//导出路由器对象，交给服务器使用
module.exports=router;