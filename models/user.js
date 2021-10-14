const Sequelize = require('sequelize');

//sequlize로 부터 모델 extends class 가 모델 - > mysql 테이블과 매칭
module.exports=class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email:{
                type:Sequelize.STRING(40),
                allowNull:true,
                unique:true,
            },
            nick:{
                type:Sequelize.STRING(15),
                allowNull:false,
            },
            password:{
                type:Sequelize.STRING(100),
            allowNull:true,
            },
            provider:{//로그인 제공자
                type:Sequelize.STRING(10),
                allowNull:false,
                defaultValue:'local',
            },
            snsId:{
                type:Sequelize.STRING(30),
                allowNull:true
            },
        },{
            //각각 생성 수정 삭제 일 등록
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'User',
            tableName:'users',
            paranoid:true,
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
          foreignKey: 'followingId',
          as: 'Followers',
          through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
          foreignKey: 'followerId',
          as: 'Followings',
          through: 'Follow',
        })
    }

};