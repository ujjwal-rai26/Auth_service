const { User,Role}=require('../models/index');
const ClientError = require('../utils/client-error');
const ValidationError=require('../utils/validation-error');

const {StatusCodes}=require('http-status-codes');

class UserRepository {

    async create(data){   //it means sign up ,creating a new user
        try {
            const user= await User.create(data);
            return user;
        }
    
        catch(error){

        if(error.name=='SequelizeValidationError'){
          throw new ValidationError(error);
         }

            console.log("something went wrong in the repository layer");
            throw error;
        }
    
     }
    
        async destroy(userId){
            try {
              await User.destroy({
                 where:{
                    id: userId
                 }
              });
              return true;
            }
        
            catch(error){
                console.log("something wet wrong in the repository layer");
                throw {error};
            }
        }

        async getById(userId){
            try {
                const user =await User.findByPk(userId,{
                    attributes:['email','id']  //it means that it will return only email and id ,not all the attributes as we only want this
                });
                return user;
            } 
            catch (error) {
                console.log("something wet wrong in the repository layer");
                throw {error};
            }
        }


        async getByEmail(userEmail){
            try {
                const user=await User.findOne({
                    where:{
                        email:userEmail
                    }
                })

                if(!user){
                     throw new ClientError(
                        'AttributeNotFound',
                        'invalid email sent in the request',
                        'please check the email,as their is no record of the email',
                        StatusCodes.NOT_FOUND
                     );
                }

                return user;
            } 
            catch (error) {
                console.log("something wet wrong in the repository layer");
                throw {error};
            }
        }


        async isAdmin(userId){
            try {
              const user=await User.findByPk(userId);
              const adminRole=await Role.findOne({
                where:{
                    name:'ADMIN'
                }
              })
              return user.hasRole(adminRole);
                
            } 
            catch (error) {
                console.log("something wet wrong in the repository layer");
                throw {error};
            }
        }
    
}

module.exports=UserRepository;