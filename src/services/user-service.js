const jwt=require('jsonwebtoken');

const  UserRepository  =require('../repository/user-repository');

const {JWT_KEY}=require('../config/serverConfig');

const bcrypt=require('bcrypt');
const AppErrors=require('../utils/error-handler');

class UserService{

constructor(){
    this.userRepository= new UserRepository();
}


async create(data){
    try {
        const user= await this.userRepository.create(data);
        return user;
    } catch (error) {
        if(error.name=='SequelizeValidationError'){
               throw error; 
        }
        console.log("something went wrong in the service layer");
        throw error; 
    }
}


async signIn(email,plainPassword){
    try {
          //step 1  fetch the user using email

          const user=await this.userRepository.getByEmail(email);
          //step 2 compare incoming password with the encrypted password
          const passwordMatch=this.checkPassword(plainPassword,user.password);

          if(!passwordMatch){
            console.log("password does not match");
            throw {error:'incorrect password'};
          }
          //step 3 if password match then create the token and send it to user
          const newJWT=this.createToken({email:user.email,id:user.id});
          return newJWT;
        
    } 
    catch (error) {
        if(error.name=='AttributeNotFound'){
            throw error;
        }
        console.log("something went wrong in signIn process");
       throw error;
    }
}


createToken(user){
    try {
       const result =jwt.sign(user,JWT_KEY,{expiresIn:'1d'}); //the jwt is created by user info like username and userId
       return result;                                          //so we can get the username and userId back from token also if we get token
    } 
    catch (error) {
        console.log("something went wrong in token creation");
        throw {error};
    }
}

verifyToken(token){
    try {
       const response =jwt.verify(token,JWT_KEY);  //this will verify the token
       return response; 
    } 
    catch (error) {
        console.log("something went wrong in token validation");
        throw {error};
    }
}

checkPassword(userInputPlainPassword,encryptedPassword){
    try {
        return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
    } 
    catch (error) {
        console.log("something went wrong in password comparison");
        throw {error};
    }
}

async isAuthenticated(token){
    try {
        const response=this.verifyToken(token);
        if(!response){
             throw {error:'invalid token'}
        }
        const user= await this.userRepository.getById(response.id);  //we get userId from token
        if(!user){
            throw {error:'no user with the corresponding token exists'}
        }
        return user.id;
    } 
    catch (error) {
        console.log("something went wrong in auth process");
        throw {error};
    }
}

isAdmin(userId){
    try {
        return this.userRepository.isAdmin(userId);
    } 
    catch (error) {
        console.log("something went wrong in service layer");
        throw {error};
    }
}


}

module.exports=UserService;