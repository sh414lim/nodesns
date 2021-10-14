            
const Sequlize=require('sequelize');

//sequlize로 부터 모델 extends class 가 모델 - > mysql 테이블과 매칭
module.exports=class Hashtag extends Sequlize.Model{
    static init(sequelize){
        return super.init({
            title:{
                type:Sequlize.STRING(15),
                allowNull:true,
                unique:true,
            },
            
           
        },{
            //각각 생성 수정 삭제 일 등록
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Post',
            tableName:'posts',
            paranoid:true,
            charset:'utfmb4',
            collate:'utfmb4_general_ci',
        });
    }
    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
      }

}