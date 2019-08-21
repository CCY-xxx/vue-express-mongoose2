/**
 * Created by Administrator on 2017/8/18 0018.
 */
var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

var DB=require('../../modules/db.js');  /*引入DB数据库*/

var multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var  fs=require('fs');

router.get('/',function(req,res){
    DB.find('goods',{},function(err,data){

        res.render('admin/product/index',{
            list:data
        });
        // res.send(data)
    })

})
//处理登录的业务逻辑
router.get('/add',function(req,res){
     res.render('admin/product/add');

})
//doAdd
router.post('/doAdd',function(req,res){
    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();
    // form.uploadDir='F:\\新建文件夹 (2)\\v18dyy\\static\\upload' 
    form.uploadDir='/新建文件夹 (2)/新建文件夹/网上购物/static/upload'   //上传图片保存的地址     目录必须存在

    form.parse(req, function(err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息
        //
        //console.log(fields);  /*获取表单的数据*/
        //
        //console.log(files);  /*图片上传成功返回的信息*/
        var productName=fields.productName[0];
        var salePrice=parseInt(fields.salePrice[0]);
        var productId=fields.productId[0];
        var productUrl=fields.productUrl[0];
        var productImg=files.productImage[0].path;
        console.log(fields);
        console.log(files);

var productImage1=productImg.split('\\')[5]
        var productImage2=productImg.split('\\')[6]
     var  productImage=`${productImage1}\\${productImage2}`
        console.log(productImage);
        DB.insert('goods',{
            productName,
            salePrice,
            productId,
            productImage,
            productUrl

        },function(err,data){
            if(!err){
                res.redirect('/admin/product'); /*上传成功跳转到首页*/
            }

        })
    });

})


router.get('/edit',function(req,res){

    //获取get传值 id

    var id=req.query.id;

    console.log(id);

    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)

    DB.find('goods',{"_id":new DB.ObjectID(id)},function(err,data){

        //console.log(data);

        res.render('admin/product/edit',{
            list:data[0]
        });
    });

})
router.post('/doEdit',function(req,res){

    var form = new multiparty.Form();

    form.uploadDir='/新建文件夹 (2)/新建文件夹/网上购物/static/upload'  // 上传图片保存的地址

    form.parse(req, function(err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息

        //console.log(fields);
        console.log(files);
        var productName=fields.productName[0];
        var salePrice=parseInt(fields.salePrice[0]);
        var productId=fields.productId[0];
        // var description=fields.description[0];
        // var productImage=files.productImage[0].path;
        console.log(fields);
        // console.log(files);
        // console.log(productImage);
        var _id=fields._id[0];   /*修改的条件*/
        // var title=fields.title[0];
        // var price=fields.price[0];
        // var fee=fields.fee[0];
        var productUrl=fields.productUrl[0];

        var originalFilename=files.productImage[0].originalFilename;
        var productImage=files.productImage[0].path;
        var productImage1=productImage.split('\\')[5]
        var productImage2=productImage.split('\\')[6]
       productImage=`${productImage1}\\${productImage2}`
        if(originalFilename){  /*修改了图片*/
            var setData={
                productName,
                salePrice,
                productId,
                productImage,
                productUrl
            };
        }else{ /*没有修改图片*/
            var setData={
                productName,
                salePrice,
                productId,
                productUrl
            };
            //删除生成的临时文件
            fs.unlink(productImage);

        }

        DB.update('goods',{"_id":new DB.ObjectID(_id)},setData,function(err,data){

            if(!err){
               console.log('kjkljlk')
               res.redirect('/admin/product');
            }
        })



    });
 
})

router.get('/delete',function(req,res){
    //获取id

    var id=req.query.id;

    DB.deleteOne('goods',{"_id":new DB.ObjectID(id)},function(err){

        if(!err){

            res.redirect('/admin/product');
        }

    })

})
router.get('/load',function(req,res){
    //获取id

    var id=req.query.id;

    DB.find('goods',{"_id":new DB.ObjectID(id)},function(err,data){

        if(!err){
                // console.log(data)
                res.download(data[0].productImage);
        }


    })

})
module.exports = router;   /*暴露这个 router模块*/
