 const express =require('express');
 const bcrypt=require('bcrypt');
 const User=require('../models/user');
const passport = require('passport');
const {isLoggedIn,isNotLoggedIn} = require('./middlewares')
 const router= express.Router();

 //회원가입 라우터
 router.post('/join',isNotLoggedIn, async(req,res,next)=>{
     const {email,nick,password}=req.body;
     try{
         const exUser =await User.findOne({where:{email}});
         if(exUser){
             return res.redirect('/join?error=exist'); //이미 가입한 이메일
         }
         const hash=await bcrypt.hash(password,12); //비밀번호 해쉬화
         await User.create({
             email,
             nick,
             password:hash,
         });
         return res.redirect('/');
     }catch(err){
        console.error(error);
        return next(error)
     }
 });

 // 로그인 라우터

 router.post('/login',isNotLoggedIn,(req,res,next)=>{
        //미들웨어 
    passport.authenticate('local',(authError,user,info)=>{
         if(authError){ //서버 에러
             console.error(authError);
             return next(authError);
         }
         if(!user){//로그인 실패 에러메시지 전달
             return res.redirect(`/?loginError=${info.message}`);
         }
         return req.login(user,(loginError)=>{
             if(loginError){
                 console.error(loginError);
                 return next(loginError);
             }
             //세션 쿠키를 브라우저로 보내준다
             return res.redirect('/');
         });
         //미들웨어 확장
     })(req,res,next); // 미들웨어 내의 미들에어에는 (req,res,next를 붙인다)
 });
  //localStoragy 를 찾는다 

  router.get('/logout',isLoggedIn,(req,res)=>{
      req,logout();
      req.session.destroy();
      res.redirect('/');
  });

  router.get('/kakao', passport.authenticate('kakao'));

  router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
  }), (req, res) => {
    res.redirect('/');
  });
  module.exports = router;