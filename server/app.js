//vue_app_server 服务器
//   app.js 
//   public/img/banner1.png ...
const express = require("express");
const fs=require("fs");
//移动将临时文件 移动 upload
//fs.renameSync(临时文件,新文件);
const multer=require("multer");
//创建上传文件对象
var upload=multer({dest:"upload/"});
const session = require("express-session");
var app = express();
app.use(express.static("public"));
app.listen(3000);
const pool = require("./pool");

//express mysql 参数 request;response
//跨域访问配置
//1:加载模块cors
const cors = require("cors");
//2:配置cors
app.use(cors({
  origin:["http://127.0.0.1:3001",
         "http://localhost:3001"],//允许列表
  credentials:true   //是否验证
}))
//配置session
app.use(session({
  secret:"128随机字符串",//安全令牌
  resave:false,//每次请求是否重新创建session
  saveUninitialized:true, //初始化值
  cookie:{      //将session id保存cookie
    maxAge:1000*60*60*24  //时间1天
  }
}));


//功能一:首页轮播
app.get("/getImages",(req,res)=>{
  var rows = [
    {id:1,img_url:"http://127.0.0.1:3000/img/bg1.jpg"},
    {id:2,img_url:"http://127.0.0.1:3000/img/bg3.jpg"},
    {id:3,img_url:"http://127.0.0.1:3000/img/bg4.jpg"},
  ];
  res.send(rows);
})

//功能二:新闻分页显示
app.get("/getNews",(req,res)=>{
  //1:参数       pno 页码;pageSize 页大小
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  //1.2:默认值
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 7;
  }
  //2:验证正则表达式
  var reg = /^[0-9]{1,}$/;
  if(!reg.test(pno)){
     res.send({code:-1,msg:"页码格式不正确"});
     return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  //3:创建sql
  //  查询总页数
  var sql = "SELECT count(id) as c FROM xz_news";
  var progress = 0; //sql执行进度
  obj = {code:1};
  pool.query(sql,(err,result)=>{
       if(err)throw err;
       //console.log(result[0].c);
       var pageCount = Math.ceil(result[0].c/pageSize);
       obj.pageCount = pageCount;
       progress += 50;
       if(progress == 100){
        res.send(obj);
       }
  });
  //  查询当前页内容
var sql=" SELECT id,ctime,title,img_url,point";
    sql +=" FROM xz_news";
    sql +=" LIMIT ?,?"
var offset = parseInt((pno-1)*pageSize);
pageSize = parseInt(pageSize);
  pool.query(sql,[offset,pageSize],(err,result)=>{
    if(err)throw err;
    //console.log(result);
    obj.data = result;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  }); 
})

//功能三:依据新闻编号查询新闻详细信息
app.get("/getNewsInfo",(req,res)=>{
  //1:参数   id   53
  var id = req.query.id;
  //2:sql    SELECT id,title,ctime,content FROM 
  //         xz_news WHERE id = ?
  var sql=" SELECT id,title,ctime,content";
      sql+=" FROM xz_news WHERE id = ?";
  //3:json   {code:1,data:obj}
  pool.query(sql,[id],(err,result)=>{
      if(err)throw err;
      res.send({code:1,data:result[0]});
  })
})

//功能四:发表评论
app.get("/addComment",(req,res)=>{
  //1:参数 nid content
  var nid = req.query.nid;
  var content = req.query.content;
  //console.log("1:"+nid+"|"+content);
  //2:sql  INSERT INTO
  var sql = "INSERT INTO xz_comment(id,content,ctime,nid)VALUES(null,?,now(),?)";
  pool.query(sql,[content,nid],(err,result)=>{
      if(err)throw err;  
      //console.log(2);
      //console.log(result);
      //影响行数
      if(result.affectedRows > 0){
       res.send({code:1,msg:"评论发送成功"});      
      }else{
        res.send({code:-1,msg:"评论发送失败"});    
      }
  }) 
  //3:json {code:1,msg:""}
})



//功能五:依据新闻编号(id),查询指定新闻编号评论列表
app.get("/getComments",(req,res)=>{
  //1:参数       pno 页码;pageSize 页大小
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  var nid = parseInt(req.query.nid);
  //1.2:默认值
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 7;
  }
  //2:验证正则表达式
  var reg = /^[0-9]{1,}$/;
  if(!reg.test(pno)){
     res.send({code:-1,msg:"页码格式不正确"});
     return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  //3:创建sql
  //  查询总页数
  var sql = "SELECT count(id) as c FROM xz_comment";
  sql +=" WHERE nid = ?"
  var progress = 0; //sql执行进度
  obj = {code:1};
  pool.query(sql,[nid],(err,result)=>{
       if(err)throw err;
       //console.log(result[0].c);
       var pageCount = Math.ceil(result[0].c/pageSize);
       obj.pageCount = pageCount;
       progress += 50;
       if(progress == 100){
        res.send(obj);
       }
  });
  //  查询当前页内容
var sql=" SELECT id,ctime,content";
    sql +=" FROM xz_comment";
    sql +=" WHERE nid = ?"
    sql +=" ORDER BY id DESC";//按编号降序排列
    sql +=" LIMIT ?,?"
var offset = parseInt((pno-1)*pageSize);
pageSize = parseInt(pageSize);
  pool.query(sql,[nid,offset,pageSize],(err,result)=>{
    if(err)throw err;
    //console.log(result);
    obj.data = result;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  }); 
}); 

// 功能6：商品列表
app.get("/getGoodsList",(req,res)=>{
  //1:参数       pno 页码;pageSize 页大小
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  //1.2:默认值
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 4;
  }
  //2:验证正则表达式
  var reg = /^[0-9]{1,}$/;
  if(!reg.test(pno)){
     res.send({code:-1,msg:"页码格式不正确"});
     return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  //3:创建sql
  //  查询总页数
  var sql = "SELECT count(id) as c FROM xz_product";
  var progress = 0; //sql执行进度
  obj = {code:1};
  pool.query(sql,(err,result)=>{
       if(err)throw err;
       //console.log(result[0].c);
       var pageCount = Math.ceil(result[0].c/pageSize);
       obj.pageCount = pageCount;
       progress += 50;
       if(progress == 100){
        res.send(obj);
       }
  });
  //  查询当前页内容
var sql=" SELECT id,name,img_url,price,bank";
    sql +=" FROM xz_product";
    sql +=" LIMIT ?,?"
var offset = parseInt((pno-1)*pageSize);
pageSize = parseInt(pageSize);
  pool.query(sql,[offset,pageSize],(err,result)=>{
    if(err)throw err;
    //console.log(result);
    obj.data = result;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  }); 
});

//功能7：将商品信息添加至购物车
app.get("/addCart",(req,res)=>{
  //参数uid,pid,price,count
  var uid=parseInt(req.query.uid);
  var pid=parseInt(req.query.pid);
  var price=parseFloat(req.query.price);
  var count=parseInt(req.query.count);
  //sql
  var sql=" INSERT INTO `xz_cart`(`id`, ";
      sql+=" `uid`, `pid`, `price`,";
      sql+=" `count`) VALUES (null,?,?,?,?)";
  // var sql=" INSERT INTO xz_cart(id, uid, pid, price, count) VALUES (null,?,?,?,?)";
  pool.query(sql,[uid,pid,price,count],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows>0){
      res.send({code:1,msg:"添加成功"});
    }else{
      res.send({code:-1,msg:"添加失败"});
    }
  });
  //json
});

//功能8：查询商品详细信息
app.get("/getProduct",(req,res)=>{
  //参数 商品id
  var pid=parseInt(req.query.id);
  //sql 
  // var sql =" SELECT `id`, `name`, `img_url`";
  //  sql+=" , `price`, `bank` FROM `xz_product`"; sql+=" WHERE id=?";
  var sql="SELECT `id`, `name`, `img_url`, `price`, `bank` FROM `xz_product` WHERE id=?";
  pool.query(sql,[pid],(err,result)=>{
    if(err) throw err;
    res.send({code:1,data:result[0]});
  });
  //json
});

//功能9:用户注册
app.get("/register",(req,res)=>{
  //参数name pwd 验证
  var name=req.query.name;
  var pwd=req.query.pwd;
  var reg=/^[a-z0-9_]{8,12}$/;
  if(!reg.test(name)){
    res.send({code:-1,msg:"用户名格式不正确"});
    return;
  }
  //sql INSERT INTO xz_login VALUES(null,?,md5(?))
  var sql="INSERT INTO xz_login VALUES(null,?,md5(?))";
  pool.query(sql,[name,pwd],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows>0){
      res.send({code:1,msg:"注册成功"});
    }else{
      res.send({code:-1,msg:"注册失败"});
    }
  });
  //json
});
//功能10：用户名是否存在
app.get("/existsName",(req,res)=>{
  var name=req.query.name;
  var sql="SELECT count(id) as c FROM xz_login WHERE name=?";
  pool.query(sql,[name],(err,result)=>{
    if(err) throw err;
    if(result[0].c>0){
      res.send({code:-1,msg:"用户名已存在"});
    }else{
      res.send({code:1,msg:"欢迎使用"});
    }
  });
});

//功能11：用户登录
app.get("/login",(req,res)=>{
  //获取登录，正则，sql,如果匹配成功将用户id保存session对象
  var name=req.query.name;
  var pwd=req.query.pwd;
  // var reg=/^[a-z0-9_]{8,12}$/i;
  // var reg1=/^[a-z0-9]{8,12}$/i;
  // if(!reg.test(name)){
  //   res.send("用户名格式不正确");
  //   return;
  // }
  // if(!reg1.test(pwd)){
  //   res.send("密码格式不正确");
  //   return;
  // }
  var sql="SELECT count(id) as c,id FROM xz_login WHERE name=? AND pwd=md5(?)";
  pool.query(sql,[name,pwd],(err,result)=>{
    if(err) throw err;
    var c=result[0].c;
    if(c==1){
      req.session.uid=result[0].id;
      res.send({code:1,msg:"登录成功"});
    }else{
      res.send({code:-1,msg:"用户名或密码有误"})
    }
  });
  //返回结果
})

//功能12：查询购物车中数据
app.get("/getCartList",(req,res)=>{
  //参数,sql,返回值
  var uid=req.session.uid;
  var sql="SELECT p.name,c.count,c.price,c.id FROM xz_product p,xz_cart c WHERE p.id=c.pid AND c.uid=?";
  pool.query(sql,[uid],(err,result)=>{
    if(err) throw err;
    res.send({code:1,data:result});
  });
});

//功能13：同步更新购物车中商品数量
app.get("/updateCart",(req,res)=>{
  //1:参数 id count
  var id = parseInt(req.query.id);
  var count = parseInt(req.query.count);
  //2:sql UPDATE
  var sql = " UPDATE xz_cart SET count = ?";
     sql += " WHERE id = ?";
  pool.query(sql,[count,id],(err,result)=>{
    if(err)throw err;   //17:30 sub add
    if(result.affectedRows > 0){
      res.send({code:1,msg:"更新成功"});
    }else{
      res.send({code:-1,msg:"更新失败"});
    }
  })
  //3:json {code:1,msg:""}
})

//退出
app.get("/logout",(req,res)=>{
  req.session.uid=null;
  res.send({code:1,msg:"退出成功"});
});

//功能14：小程序 九宫格
app.get("/getNavImages",(req,res)=>{
	var list=[
		{id:1,img_url:"http://127.0.0.1:3000/img/icons/1.png",title:"航班动态"},
      { id: 2, img_url: "http://127.0.0.1:3000/img/icons/2.png", title: "登离船流程" },
      { id: 3, img_url: "http://127.0.0.1:3000/img/icons/3.png", title: "VIP服务" },
      { id: 4, img_url: "http://127.0.0.1:3000/img/icons/4.png", title: "交通服务" },
      { id: 5, img_url: "http://127.0.0.1:3000/img/icons/5.png", title: "保险服务" },
      { id: 6, img_url: "http://127.0.0.1:3000/img/icons/6.png", title: "停车导览" },
      { id: 7, img_url: "http://127.0.0.1:3000/img/icons/7.png", title: "港口指南" },
      { id: 8, img_url: "http://127.0.0.1:3000/img/icons/8.png", title: "领队服务" },
      { id: 9, img_url: "http://127.0.0.1:3000/img/icons/9.png", title: "船票查询" },	
      { id: 10, img_url: "http://127.0.0.1:3000/img/icons/10.png", title: "跨境商品" },	
	];
	res.send(list);
});

//功能16：小程序美食分页显示
app.get("/getShopList",(req,res)=>{
   //1:参数       pno 页码;pageSize 页大小
   var pno = req.query.pno;
   var pageSize = req.query.pageSize;
   //1.2:默认值
   if(!pno){
     pno = 1;
   }
   if(!pageSize){
     pageSize = 7;
   }
   //2:验证正则表达式
   var reg = /^[0-9]{1,}$/;
   if(!reg.test(pno)){
      res.send({code:-1,msg:"页码格式不正确"});
      return;
   }
   if(!reg.test(pageSize)){
     res.send({code:-2,msg:"页大小格式不正确"});
     return;
   }
   //3:创建sql
   //  查询总页数
   var sql = "SELECT count(id) as c FROM xz_shoplist";
   var progress = 0; //sql执行进度
   obj = {code:1};
   pool.query(sql,(err,result)=>{
        if(err)throw err;
        //console.log(result[0].c);
        var pageCount = Math.ceil(result[0].c/pageSize);
        obj.pageCount = pageCount;
        progress += 50;
        if(progress == 100){
         res.send(obj);
        }
   });
   //  查询当前页内容
 var sql=" SELECT id,img_url,dname,daddr,dphone,dtime,dpoint";
     sql +=" FROM xz_shoplist";
     sql +=" LIMIT ?,?"
 var offset = parseInt((pno-1)*pageSize);
 pageSize = parseInt(pageSize);
   pool.query(sql,[offset,pageSize],(err,result)=>{
     if(err)throw err;
     //console.log(result);
     obj.data = result;
     progress+=50;
     if(progress==100){
       res.send(obj);
     }
   }); 
})

//功能17：添加商品
app.get("/savep",(req,res)=>{
	//1.获取参数
	var pname=req.query.pname;
	var price=req.query.price;
	//2.创建sql语句
	var sql="INSERT INTO xz_product VALUES(null,?,'http://127.0.0.1:3000/img/banner1.png',?,1)";
	pool.query(sql,[pname,price],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:1,msg:"商品添加成功"})
		}else{
			res.send({code:-1,msg:"商品添加失败"})	
		}
	});
	//3.判断添加是否成功并且返回值
});

//功能19：分页显示小程序列表
app.get("/getMessage",(req,res)=>{
    //1:参数       pno 页码;pageSize 页大小
    var pno = req.query.pno;
    var pageSize = req.query.pageSize;
    //1.2:默认值
    if(!pno){
      pno = 1;
    }
    if(!pageSize){
      pageSize = 2;
    }
    //2:验证正则表达式
    var reg = /^[0-9]{1,}$/;
    if(!reg.test(pno)){
       res.send({code:-1,msg:"页码格式不正确"});
       return;
    }
    if(!reg.test(pageSize)){
      res.send({code:-2,msg:"页大小格式不正确"});
      return;
    }
    //3:创建sql
    //  查询总页数
    var sql = "SELECT count(id) as c FROM xz_message";
    var progress = 0; //sql执行进度
    obj = {code:1};
    pool.query(sql,(err,result)=>{
         if(err)throw err;
         //console.log(result[0].c);
         var pageCount = Math.ceil(result[0].c/pageSize);
         obj.pageCount = pageCount;
         progress += 50;
         if(progress == 100){
          res.send(obj);
         }
    });
    //  查询当前页内容
  var sql=" SELECT id,img_url,title,ctime,desc2,content";
      sql +=" FROM xz_message";
      sql +=" LIMIT ?,?"
  var offset = parseInt((pno-1)*pageSize);
  pageSize = parseInt(pageSize);
    pool.query(sql,[offset,pageSize],(err,result)=>{
      if(err)throw err;
      //console.log(result);
      obj.data = result;
      progress+=50;
      if(progress==100){
        res.send(obj);
      }
    }); 
 });

//功能20：小程序学子商城上传图片
app.post("/upload",upload.single("mypic"),(req,res)=>{
	//1.获取上传文件大小超过2MB提示错误
	var size=req.file.size/1024/1024;
	if(size>2){
		res.send({code:-1,msg:"上传文件过大不能超过2MB"});
		return;
	}
	//2.获取上传文件类型不是图片 提示错误
	var type=req.file.mimetype;
	var i2=type.indexOf("image");
	if(i2==-1){
		res.send({code:-2,msg:"上传文件类型不是图片"});
	}
	//3.创建新文件 ./upload/时间戳+随机数+后戳
	var src=req.file.originalname;
	var fnow=new Date().getTime();
	var frand=Math.floor(Math.random()*9999);
	//截取字符串
	var i3=src.lastIndexOf(".");
	var suff=src.substring(i3,src.length);
	var des="./upload/"+fnow+frand+suff;
	//4.将临时文件移动
	fs.renameSync(req.file.path,des);
	//5.上传成功
	res.send({code:1,msg:"图片上传成功"});
});