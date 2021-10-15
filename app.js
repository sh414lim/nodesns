const express =require('express');
const cookieParser=require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

//거의 항상 최상단 프로세스 파일 설정파일 이 줄 이후
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); //패스포트 설정
app.set('port',process.env.PORT || 8001);
//넌적스 설정방법
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
    watch:true,
});
//sequelize 싱크
sequelize.sync({force:false}) //force true -> 테이블이 지워졋다 다시생김
.then(()=>{
    console.log('데이터베이스 연결성공');
})
.catch((err)=>{
    console.log(err);
})

app.use(morgan('dev'));
//정적파일
app.use(express.static(path.join(__dirname,'public')));
app.use('/img',express.static(path.join(__dirname,'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));

//express 세션
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use (passport.initialize());
app.use(passport.session());

app.use('/',pageRouter); //pageRouter 연결
app.use('/auth',authRouter) //authRouter
app.use('/post',postRouter) //authRouter

//모든 라우터 뒤에 나오는 404 미들웨어
app.use((req,res,next)=>{
    const error =new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status=404;
    next(error) //바로 에러 미들웨어로 넘어간다
}); 

//에러 미들웨어
app.use((err,req,res,next)=>{
    //res.locals - > 템플릿 엔진 변수
    res.locals.message=err.message;
    res.locals.error=process.env.NODE_ENV !== 'production' ? err : {};//에러스택 개발시에만 배포시 x
    res.status(err.status || 500); //일반 서버 에러
    res.render('error')//에러.html (넌적스)
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'빈 포트에서 대기중')
}); //포트 대기

