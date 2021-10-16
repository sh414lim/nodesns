const express = require('express');
const { Post, User } = require('../models');
const router = express.Router();

router.use((req,res,next)=>{
    res.locals.user=req.user;
    next();
});

router.get('/profile', (req,res)=>{
res.render('profile',{title:'내 정보 - NodeBird'});
})

router.get('/join',(req,res)=>{
    res.render('join',{title:'회원가입 - NodeNBird'})
});

router.get('/',async(req,res,next)=>{
    try{
    const posts= await Post.findAll({
        include:{
            model:User,
            attributes:['id','nick'],
        },
        oreder:[['createdAt','DESC']],
    });
    res.render('main',{
        title:'NodeBird',
        twits:posts,
    });
 
}catch(err){
console.error(err);
next(err);
}
})


module.exports = router;